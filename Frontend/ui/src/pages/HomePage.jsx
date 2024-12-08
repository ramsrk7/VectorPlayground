// src/pages/HomePage.jsx
import React, { useState } from 'react';
import InputCard from '../components/InputCard';
import AddButton from '../components/AddButton';
import VisualizeButton from '../components/VisualizeButton';
import ScatterPlot from '../charts/ScatterPlot';
import axios from 'axios';
import Sidebar from '../partials/Sidebar';


const HomePage = () => {
  const [inputs, setInputs] = useState([{ id: 1, text: '' }]);
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTextChange = (id, value) => {
    setInputs(prev =>
      prev.map(input => (input.id === id ? { ...input, text: value } : input))
    );
  };

  const handleAdd = () => {
    const newId = inputs.length ? Math.max(...inputs.map(i => i.id)) + 1 : 1;
    setInputs([...inputs, { id: newId, text: '' }]);
  };

  const handleRemove = (id) => {
    setInputs(inputs.filter(input => input.id !== id));
  };

  const handleVisualize = async () => {
    const texts = inputs.map(input => input.text).filter(text => text.trim() !== '');
    if (texts.length === 0) {
      setError('Please enter at least one text.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/embeddings/embed-coordinates', {
        texts,
        model: 'light',
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setCoordinates(response.data.coordinates);
    } catch (err) {
      setError('Failed to fetch coordinates. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="container mx-auto py-8 px-4">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Text Visualizer</h1>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <AddButton onAdd={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600" />
            <VisualizeButton onVisualize={handleVisualize} className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600" />
          </div>
        </header>

        <main className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            {inputs.map(input => (
              <InputCard
                key={input.id}
                id={input.id}
                text={input.text}
                handleTextChange={handleTextChange}
                handleRemove={inputs.length > 1 ? handleRemove : null}
                className="border border-gray-300 rounded-md p-4"
              />
            ))}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {loading && (
              <div className="text-center mt-4">
                <p className="text-gray-600 animate-pulse">Visualizing...</p>
              </div>
            )}

            {coordinates.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Scatter Plot</h2>
                <div className="border border-gray-200 rounded-lg shadow-lg p-4">
                  <ScatterPlot data={coordinates} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
