// src/pages/NaiveRag.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

const NaiveRag = () => {
  // State for the question input and the answer response
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Function to call the API with the question and update the answer
  const handleQuery = async () => {
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setError(null);
    setAnswer('');
    setLoading(true);

    try {
      // Perform POST request to the API with the question in the request body
      const response = await axios.post(
        '/api/rag/query',
        { question },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Expect a response like { answer: "..." }
      if (response.data && response.data.answer) {
        setAnswer(response.data.answer);
      } else {
        setError('Invalid response from the server.');
      }
    } catch (err) {
      console.error('Error fetching answer:', err);
      setError('Failed to fetch answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <header className="flex flex-col md:flex-row justify-between items-start p-4 bg-white shadow sm:pt-20">
          <div>
            <h1 className="text-2xl font-bold text-gray-700 font-mono pt-5">
              Naive RAG
            </h1>
            <p className="mt-2 text-gray-600 font-mono">
              This is a naive RAG and is indexed on documents about BERT, GPT-2, and GPT-3.
            </p>
            <p className="mt-1 text-gray-500 text-sm font-mono">
              Disclaimer: Responses might take time due to low compute and loading documents and indexing them just before processing your query.
            </p>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex flex-col p-4 space-y-4">
          {/* Question Input Section */}
          <div className="bg-white shadow rounded-lg p-4">
            <textarea
              className="w-full border border-gray-300 rounded p-2 font-mono"
              placeholder="Enter your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 font-mono">{error}</p>
            )}
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 flex items-center justify-center"
              onClick={handleQuery}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>

          {/* Answer Display Section */}
          {answer && (
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 font-mono">
                Answer
              </h2>
              <p className="text-gray-800 whitespace-pre-wrap font-mono">
                {answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NaiveRag;
