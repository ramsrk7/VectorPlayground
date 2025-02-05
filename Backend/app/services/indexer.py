import os
import sys
from getpass import getpass
import nest_asyncio
from app.core.config import settings
from dotenv import load_dotenv
from app.core.logging_config import setup_logging
nest_asyncio.apply()
from app.helpers.utils import setup_llm, setup_embed_model, setup_vector_store, get_documents_from_docstore, ingest, create_index, create_query_engine, create_query_pipeline
from app.helpers.text_cleaning_helpers import clean
from llama_index.core.settings import Settings
from llama_index.core import Document
import fitz
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.core.storage import StorageContext
from llama_index.core.constants import DEFAULT_CHUNK_SIZE
from llama_index.core.node_parser.text import SentenceSplitter
from llama_index.core import StorageContext

from llama_index.core.query_pipeline import InputComponent


logger = setup_logging()

#OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

class Indexer:
    def __init__(self):
        logger.info("Initializing TextEmbeddingHandler")
        self.OPENAI_API_KEY = settings.OPENAI_API_KEY
        self.CO_API_KEY = settings.COHERE_API_KEY
        self.QDRANT_API_KEY = settings.QDRANT_API_KEY
        self.QDRANT_URL = settings.QDRANT_URL

        pass

    def persist(self):

        COLLECTION_NAME = "SAMPLE"

        setup_llm(
            provider="cohere", 
            model="command-r-plus", 
            api_key=self.CO_API_KEY
            )

        logger.info("Setting up Embed Model")
        logger.info(self.OPENAI_API_KEY)
        setup_embed_model(
            provider="openai", 
        
            api_key=self.OPENAI_API_KEY
            )

        #vector_store = setup_vector_store(self.QDRANT_URL, self.QDRANT_API_KEY, COLLECTION_NAME)

        def get_document(file_path, pages):
            """
            Opens a PDF file and optionally selects specific pages to create a document object.

            This function utilizes the `fitz` library to open a PDF file located at `file_path`. 
            If a list of `pages` is provided, the function selects only these pages from the document.
            This is useful for focusing on certain parts of a PDF without loading the entire document into memory.

            Parameters:
                file_path (str): The path to the PDF file to be opened.
                pages (list of int, optional): A list of page numbers to select from the PDF. 
                    If `None`, the entire document is loaded.

            """
            document = fitz.open(file_path)
            if pages is not None:
                document.select(pages)  # Select specific pages if pages are provided
            return document


        def handle_chapter_headers_footers(strings, flag):
            """
            Modify a list of strings based on a specified flag and join them into a single string.

            This function first removes any empty strings from the input list. It then checks if the
            remaining list has more than three elements. If so, it modifies the list by removing the
            first element, last element, or both, based on the value of the flag. The final list is then
            joined into a single string with spaces separating the elements.

            Parameters:
                strings (list of str): The list of strings to modify.
                flag (str): A flag indicating the modification to perform on the list:
                    - 'remove_first': Remove the first element of the list.
                    - 'remove_last': Remove the last element of the list.
                    - 'remove_first_last': Remove both the first and last elements of the list.
                    - 'remove_first_two': Remove the first two elements of the list.
                    - Any other value leaves the list unchanged.

            Returns:
                str: A single string composed of the modified list elements, separated by spaces.
            """
            # Filter out empty strings
            filtered_strings = [s for s in strings if s]
            
            # Check if the filtered list has more than three elements
            if len(filtered_strings) > 3:
                if flag == 'remove_first':
                    filtered_strings = filtered_strings[1:]  # Slice off the first element
                elif flag == 'remove_last':
                    filtered_strings = filtered_strings[:-1]  # Slice off the last element
                elif flag == 'remove_first_last':
                    filtered_strings = filtered_strings[1:-1]  # Slice off the first and last elements
                elif flag == 'remove_first_two':
                    filtered_strings = filtered_strings[2:]  # Slice off the first two elements
            
            # Join all strings with a space and return the result
            return ' '.join(filtered_strings).strip()

        def extract_text(page, file_name, title, author, flag, opt="text"):
            """
            Extracts text from a specified page of a document and returns a dictionary containing
            the extracted text and associated metadata.

            The function first retrieves text from the given `page` object using the specified `opt` method.
            It then processes this text to remove chapter headers, footers, and applies various cleaning
            procedures according to the `flag` and other parameters set in the `clean` function.

            Parameters:
                page (fitz.Page): The page object from which to extract text.
                file_name (str): The name of the file from which the page is taken.
                title (str): The title of the document.
                author (str): The author of the document.
                flag (str): A flag used to customize how chapter headers and footers are handled.
                opt (str, optional): The method of text extraction to be used by `get_text`.
                    Defaults to "text", but can be changed to other methods supported by the library.

            Returns:
                dict: A dictionary with two keys:
                    - 'text': A string containing the cleaned and processed text from the page.
                    - 'metadata': A dictionary containing metadata about the text, including the
                                page number, file name, title, and author.
            """
            
            text = page.get_text(opt, sort=True)

            text = text.split("\n")

            text = handle_chapter_headers_footers(text, flag)

            text = clean(
                text,
                extra_whitespace=True,
                broken_paragraphs=True,
                bullets=True,
                ascii=True,
                lowercase=False,
                citations=True,
                merge_split_words=True,
            )

            return {
                "text": text,
                "metadata": {
                    "page_number": page.number,
                    "file_name": file_name,
                    "title": title,
                    "author": author
                }
            }

        def extract_texts_from_pdf(file_path, title, author, pages, flag):
            document = get_document(file_path, pages)
            file_name = os.path.basename(file_path)
            extracted_texts = [extract_text(page, file_path, title, author, flag) for page in document]
            return extracted_texts
        

        pdf_files = [
            {
                "file_path": "app/database/sample/01-bert.pdf", 
                "title": "BERT", 
                "author": "Unknown",
                "pages": list(range(0, 10)),
                "flag": "remove_last"
                },
            {
                "file_path": "app/database/sample/01-gpt-2.pdf", 
                "title": "GPT 2", 
                "author": "Balaji", 
                "pages": list(range(0, 10)),
                "flag": "remove_last"
                },
            {
                "file_path": "app/database/sample/02-gpt-3.pdf", 
                "title": "GPT 3", 
                "author": "Paul Graham", 
                "pages": list(range(0, 10)),
                "flag": "remove_first_last"
                },
        ]

        all_texts = []

        for pdf in pdf_files:
            print(f"Extracting texts from {pdf['title']} by {pdf['author']}...")
            texts = extract_texts_from_pdf(pdf["file_path"], pdf["title"], pdf["author"], pdf["pages"], pdf["flag"])
            print(f"Finished extracting texts from {pdf['title']}.")
            all_texts.extend(texts)

        llama_index_docs = [Document(text=doc["text"], metadata=doc["metadata"]) for doc in all_texts]

        logger.info(f"Sample Document: {llama_index_docs[0].__dict__}")

        # Create a SimpleDocumentStore and add the documents
        docstore = SimpleDocumentStore()
        docstore.add_documents(llama_index_docs)

        # Create a storage context
        storage_context = StorageContext.from_defaults(docstore=docstore)

        # Persist the document store to disk
        storage_context.persist("../database/persist/sample")

    def index(self, index_store="../database/persist/sample"):
        documents = get_documents_from_docstore(index_store)
        logger.info(f"Retrived Sample Document: {documents[0].__dict__}")

        logger.info(f"This is the chunk size: {DEFAULT_CHUNK_SIZE}")

        tranforms = [
            SentenceSplitter(chunk_size=DEFAULT_CHUNK_SIZE), 
            Settings.embed_model
            ]
        COLLECTION_NAME = "SAMPLE"

        setup_llm(
            provider="cohere", 
            model="command-r-plus", 
            api_key=self.CO_API_KEY
            )

        logger.info("Setting up Embed Model")
        setup_embed_model(
            provider="openai", 
        
            api_key=self.OPENAI_API_KEY
            )
        vector_store = setup_vector_store(self.QDRANT_URL, self.QDRANT_API_KEY, COLLECTION_NAME)

        nodes = ingest(
            documents=documents,
            transformations=tranforms,
            vector_store=vector_store,
        )

        storage_context = StorageContext.from_defaults(
        vector_store=vector_store
        )

        index = create_index(
            from_where="vector_store",
            embed_model=Settings.embed_model, 
            vector_store=vector_store, 
            # storage_context=storage_context
            )

        query_engine = create_query_engine(
            index=index, 
            mode="query",
            # llm=Settings.llm
            )
        
        input_component = InputComponent()

        chain = [input_component, query_engine]

        query_pipeline = create_query_pipeline(chain)

        response_1 = query_pipeline.run(input="tell me about tokens in the self-attention layers of the Transformer ")

        logger.info(f"Response: {response_1}")

        return response_1
  
        

if __name__ == "__main__":
    print("In Main Block")
    handler = Indexer()
    print("Initialized handler")
    handler.persist()
    handler.index()