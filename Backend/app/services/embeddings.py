import numpy as np
import matplotlib.pyplot as plt
from app.core.config import settings
import nest_asyncio
from llama_index.embeddings.cohere import CohereEmbedding
from app.core.logging_config import setup_logging
from sklearn.decomposition import PCA
from mpl_toolkits.mplot3d import Axes3D
from scipy.spatial.distance import cosine
import io
import base64

logger = setup_logging()

nest_asyncio.apply()

class TextEmbeddingHandler:
    def __init__(self):
        logger.info("Initializing TextEmbeddingHandler")
        print("Initializing TextEmbeddingHandler")
        self.CO_API_KEY = settings.COHERE_API_KEY
        self.embed_v3 = CohereEmbedding(api_key=self.CO_API_KEY, model_name="embed-english-v3.0")
        self.embed_v3_light = CohereEmbedding(api_key=self.CO_API_KEY, model_name="embed-english-light-v3.0")
        self.embed_v2 = CohereEmbedding(api_key=self.CO_API_KEY, model_name="embed-english-v2.0")

    def get_embedding(self, text: str, model: str = "light") -> list:
        logger.debug(f"Generating embedding for text: {text[:50]}... (model: {model})")
        print(f"Generating embedding for text: {text[:50]}... (model: {model})")
        try:
            if model == "v3":
                embedding = self.embed_v3.get_text_embedding(text)
            elif model == "light":
                embedding = self.embed_v3_light.get_text_embedding(text)
            elif model == "v2":
                embedding = self.embed_v2.get_text_embedding(text)
            else:
                raise ValueError("Invalid model specified. Choose from 'v3', 'light', or 'v2'.")
            logger.info("Embedding generated successfully")
            print("Embedding generated successfully")
            return embedding
        except Exception as e:
            logger.error(f"Error while generating embedding: {e}")
            print(f"Error while generating embedding: {e}")
            raise

    def calculate_cosine_similarity(self, embedding1: list, embedding2: list) -> float:
        logger.debug("Calculating cosine similarity")
        print("Calculating cosine similarity")
        try:
            similarity = self.embed_v3.similarity(embedding1, embedding2, mode="cosine")
            logger.info(f"Cosine similarity calculated: {similarity}")
            print(f"Cosine similarity calculated: {similarity}")
            return similarity
        except Exception as e:
            logger.error(f"Error while calculating cosine similarity: {e}")
            print(f"Error while calculating cosine similarity: {e}")
            raise

    def calculate_euclidean_distance(self, embedding1: list, embedding2: list) -> float:
        """
        Calculate the Euclidean distance between two embeddings.
        :param embedding1: The first embedding vector.
        :param embedding2: The second embedding vector.
        :return: The Euclidean distance.
        """
        logger.debug("Calculating Euclidean distance")
        print("Calculating Euclidean distance")
        try:
            distance = np.linalg.norm(np.array(embedding1) - np.array(embedding2))
            logger.info(f"Euclidean distance calculated: {distance}")
            print(f"Euclidean distance calculated: {distance}")
            return distance
        except Exception as e:
            logger.error(f"Error while calculating Euclidean distance: {e}")
            print(f"Error while calculating Euclidean distance: {e}")
            raise

    def plot_embedding_comparison(self, embedding1: list, embedding2: list, type: str = "display"):
        """
        Plot a visual comparison of two embeddings as 2D vectors.
        :param embedding1: The first embedding vector.
        :param embedding2: The second embedding vector.
        :param type: The type of output. "display" to show the plot, "base64" to return base64 string.
        :return: Base64 string of the plot if type is "base64". None otherwise.
        """
        try:
            vector_a = np.array(embedding1[:2])  # Use first two dimensions for plotting
            vector_b = np.array(embedding2[:2])

            distance = np.linalg.norm(vector_a - vector_b)

            plt.figure(figsize=(8, 8))
            origin = np.array([0, 0])  # Origin point

            # Plot vector A
            plt.quiver(*origin, *vector_a, angles='xy', scale_units='xy', scale=1, color='blue', label='Vector A')
            # Plot vector B
            plt.quiver(*origin, *vector_b, angles='xy', scale_units='xy', scale=1, color='red', label='Vector B')

            # Draw a line connecting the tips of the vectors
            plt.plot([vector_a[0], vector_b[0]], [vector_a[1], vector_b[1]], linestyle='--', color='gray', label='Distance')

            # Annotate the plot with the distance
            midpoint = (vector_a + vector_b) / 2
            plt.text(midpoint[0], midpoint[1], f'Distance: {distance:.2f}', fontsize=12, color='green')

            # Dynamically set plot limits to zoom in when vectors are smaller
            max_x = max(abs(vector_a[0]), abs(vector_b[0]))
            max_y = max(abs(vector_a[1]), abs(vector_b[1]))

            # Add some padding, but keep it proportional to the vector magnitude
            padding = max(max_x, max_y) * 0.1  # 10% padding

            # Set dynamic limits
            plt.xlim(-max_x - padding, max_x + padding)
            plt.ylim(-max_y - padding, max_y + padding)

            # Add grid, legend, and labels
            plt.grid()
            plt.legend()
            plt.axhline(0, color='black', linewidth=0.5)
            plt.axvline(0, color='black', linewidth=0.5)
            plt.xlabel('X-axis')
            plt.ylabel('Y-axis')
            plt.title('Embedding Comparison')

            if type == "base64":
                # Save the plot to a BytesIO buffer
                buffer = io.BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight')
                buffer.seek(0)
                # Encode the image in base64
                img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
                buffer.close()
                plt.close()
                return img_base64
            else:
                plt.show()
                return None
        except Exception as e:
            logger.error(f"Error while plotting embeddings: {e}")
            print(f"Error while plotting embeddings: {e}")
            raise

    def scatter_plot_embeddings(self, embeddings: list, labels: list = None, response_type: str = "coordinates"):
        """
        Visualizes embeddings in 2D using PCA and returns coordinates or the plot as a base64 string.
        
        :param embeddings: A list of embeddings, each of shape (n_features,).
        :param labels: Optional list of labels corresponding to the embeddings. Used for coloring the plot.
        :param response_type: "coordinates" to return coordinates, "base64" to return the plot as a base64 string.
        :return: Either the 2D coordinates of the embeddings or a base64 string of the plot.
        """
        try:
            # Ensure embeddings are a numpy array
            embeddings = np.array(embeddings)

            # Apply PCA to reduce dimensions to 2 if necessary
            if embeddings.shape[1] > 2:
                pca = PCA(n_components=2)
                reduced_embeddings = pca.fit_transform(embeddings)
            else:
                reduced_embeddings = embeddings  # Already 2D

            if response_type == "coordinates":
                # Return coordinates as a list of dictionaries
                return [{"x": coord[0], "y": coord[1]} for coord in reduced_embeddings]

            elif response_type == "base64":
                # Plot the embeddings
                plt.figure(figsize=(8, 8))
                if labels is not None:
                    labels = np.array(labels)
                    unique_labels = np.unique(labels)
                    for label in unique_labels:
                        indices = np.where(labels == label)
                        plt.scatter(
                            reduced_embeddings[indices, 0],
                            reduced_embeddings[indices, 1],
                            label=f"Label {label}",
                            s=100
                        )
                else:
                    plt.scatter(
                        reduced_embeddings[:, 0],
                        reduced_embeddings[:, 1],
                        s=100,
                        color='blue'
                    )

                plt.title('2D Visualization of Embeddings')
                plt.xlabel('Dimension 1')
                plt.ylabel('Dimension 2')
                if labels is not None:
                    plt.legend()
                plt.grid(True)

                # Convert the plot to a base64 string
                buffer = io.BytesIO()
                plt.savefig(buffer, format="png", bbox_inches="tight")
                buffer.seek(0)
                base64_image = base64.b64encode(buffer.read()).decode("utf-8")
                buffer.close()
                plt.close()
                return base64_image

            else:
                raise ValueError("Invalid response_type. Use 'coordinates' or 'base64'.")

        except Exception as e:
            print(f"Error in scatter_plot_embeddings: {e}")
            raise
    
    def plot_embeddings_as_lines(self, embeddings: list, labels: list = None):
        """
        Plot embeddings as lines to visualize their values across dimensions.
        :param embeddings: A list of embedding vectors.
        :param labels: Optional list of labels for the embeddings.
        """
        try:
            plt.figure(figsize=(12, 6))

            for i, embedding in enumerate(embeddings):
                label = labels[i] if labels else f'Embedding {i+1}'
                plt.plot(range(len(embedding)), embedding, label=label)

            plt.title("Embeddings as Lines Across Dimensions")
            plt.xlabel("Dimension")
            plt.ylabel("Value")
            plt.grid()
            plt.legend()
            plt.show()
        except Exception as e:
            logger.error(f"Error while plotting embeddings: {e}")
            print(f"Error while plotting embeddings: {e}")
            raise


    def plot_embedding_comparison_2d(self, embedding1: list, embedding2: list):
        """
        Plot a visual comparison of two embeddings as 2D vectors using PCA for dimensionality reduction.
        :param embedding1: The first embedding vector.
        :param embedding2: The second embedding vector.
        """
        try:
            # Combine embeddings into a matrix
            embeddings = np.vstack([embedding1, embedding2])

            # Reduce to 2D using PCA
            pca = PCA(n_components=2)
            embeddings_2d = pca.fit_transform(embeddings)

            # Split the reduced embeddings
            vector_a = embeddings_2d[0]
            vector_b = embeddings_2d[1]

            # Calculate cosine similarity and distance
            cosine_sim = self.calculate_cosine_similarity(vector_a, vector_b)
            cosine_dist = 1 - cosine_sim

            # Set up the plot
            fig, ax = plt.subplots(figsize=(8, 8))

            # Plot the vectors
            origin = np.array([0, 0])
            ax.quiver(*origin, *vector_a, color='blue', scale=1, label='Vector A (PCA)', linewidth=2)
            ax.quiver(*origin, *vector_b, color='red', scale=1, label='Vector B (PCA)', linewidth=2)

            # Annotate with cosine similarity and distance
            midpoint = (vector_a + vector_b) / 2
            ax.text(
                midpoint[0], midpoint[1],
                f'Cosine Sim: {cosine_sim:.2f}\nCosine Dist: {cosine_dist:.2f}',
                fontsize=10, color='green', ha='center'
            )

            # Set axis limits dynamically
            max_limit = max(
                np.abs(np.concatenate((vector_a, vector_b)))
            ) * 1.2  # 20% padding
            ax.set_xlim([-max_limit, max_limit])
            ax.set_ylim([-max_limit, max_limit])

            # Add grid, labels, legend, and title
            ax.grid()
            ax.legend()
            ax.set_xlabel('PCA1')
            ax.set_ylabel('PCA2')
            ax.set_title('2D Embedding Comparison (Reduced with PCA)')

            # Display the plot
            plt.show()

        except ValueError as ve:
            logger.error(f"ValueError: {ve}")
            print(f"ValueError: {ve}")
        except Exception as e:
            logger.error(f"An unexpected error occurred while plotting embeddings: {e}")
            print(f"An unexpected error occurred while plotting embeddings: {e}")
            raise



if __name__ == "__main__":
    print("In Main Block")
    handler = TextEmbeddingHandler()
    print("Initialized handler")

    # Example texts
    text1 = "A"
    text2 = "I am not Ramkumar"
    text3 = """I'm Ramkumar"""

    try:
        # Get embeddings
        logger.info("Getting embeddings for text1 and text2")
        print("Getting embeddings for text1 and text2")
        embedding1 = handler.get_embedding(text3)
        embedding2 = handler.get_embedding(text2)
        embedding3 = handler.get_embedding(text1)

        print("Embeddings: ", embedding2)
        coordinates = handler.scatter_plot_embeddings(embeddings=[embedding1,embedding2, embedding3])

        print("Coordinates", coordinates)
        # # Calculate Euclidean distance
        # distance = handler.calculate_euclidean_distance(embedding1, embedding2)
        # handler.plot_embedding_comparison_2d(embedding1=embedding1, embedding2=embedding2)
        # handler.scatter_plot_embeddings(embeddings=[embedding1,embedding2],labels=['A','B'])
        # handler.plot_embeddings_as_lines(embeddings=[embedding1,embedding2],labels=['A','B'])
        # # Plot comparison
        # handler.plot_embedding_comparison(embedding1, embedding2)

        # # Calculate cosine similarity between embeddings
        # similarity = handler.calculate_cosine_similarity(embedding1, embedding2)
        # logger.info(f"Cosine Similarity between embeddings of text1 and text2: {similarity}")
        # print(f"Cosine Similarity between embeddings of text1 and text2: {similarity}")

    except Exception as e:
        logger.error(f"Error in main execution: {e}")
        print(f"Error in main execution: {e}")
