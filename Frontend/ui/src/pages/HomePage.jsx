// src/pages/HomePage.jsx
import React, { useState } from 'react';
import InputCard from '../components/InputCard';
import AddButton from '../components/AddButton';
import VisualizeButton from '../components/VisualizeButton';
import ScatterPlot from '../charts/ScatterPlot';
import axios from 'axios';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

const HomePage = () => {
    // Initialize with two input cards
    const [inputs, setInputs] = useState([
        { id: 1, text: '' },
        { id: 2, text: '' }
    ]);
    const [coordinates, setCoordinates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
        if (inputs.length > 2) { // Ensure at least two input cards remain
            setInputs(inputs.filter(input => input.id !== id));
        }
    };

    const handleVisualize = async () => {
        // Extract and clean the texts from inputs
        const texts = inputs.map(input => input.text).filter(text => text.trim() !== '');

        // Ensure there are at least two valid texts
        if (texts.length < 2) {
            setError('Please enter text in at least two input cards.');
            return;
        }

        setError(null); // Reset error state
        setLoading(true); // Set loading state

        try {
            // Perform POST request to the server
            const response = await axios.post(
                '/api/embeddings/embed-coordinates',
                {
                    texts,  // Send texts array
                    model: 'light', // Include the model type
                },
                {
                    headers: { // Set necessary headers
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Set coordinates from response
            if (response.data && response.data.coordinates) {
                setCoordinates(response.data.coordinates);
            } else {
                setError('Invalid response from the server.');
            }
        } catch (err) {
            // Handle errors
            setError('Failed to fetch coordinates. Please try again.');
            console.error('Error fetching coordinates:', err);
        } finally {
            // Reset loading state
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Component */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-y-auto">

                {/* Header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-white shadow sm:pt-20">
                    <h1 className="text-2xl font-bold text-gray-700 font-mono pt-5">Text Visualizer</h1>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <AddButton onAdd={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600" />
                        <VisualizeButton onVisualize={handleVisualize} className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600" />
                    </div>
                </header>

                {/* Content Sections */}
                <div className="flex flex-col p-4 space-y-4">
                    {/* Top Section: Input Cards */}
                    <div className="max-h-[50vh] overflow-y-auto bg-white shadow rounded-lg p-4">
                        <div
                            className={`grid gap-4 ${inputs.length === 1
                                    ? 'grid-cols-1'
                                    : 'grid-cols-1 sm:grid-cols-2'
                                }`}
                        >
                            {inputs.map(input => (
                                <InputCard
                                    key={input.id}
                                    id={input.id}
                                    text={input.text}
                                    handleTextChange={handleTextChange}
                                    handleRemove={inputs.length > 2 ? handleRemove : null}
                                    className="border border-gray-300 rounded-md p-4"
                                />
                            ))}

                            {/* Display message when only two input cards are present */}
                            {inputs.length === 2 && (
                                <p className="text-gray-500 text-sm col-span-full font-mono">
                                    At least two inputs are required...
                                </p>
                            )}

                            {/* Display error messages */}
                            {error && (
                                <div className="col-span-full">
                                    <p className="text-red-500 text-sm">{error}</p>
                                    {/* Display the 'Add Another Input' button only if texts are less than 2 */}
                                    {inputs.map(input => input.text.trim()).filter(text => text !== '').length < 2 && (
                                        <button
                                            onClick={handleAdd}
                                            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                                        >
                                            Add Another Input
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Display loading state */}
                            {loading && (
                                <div className="text-center mt-4 col-span-full">
                                    <p className="text-gray-600 animate-pulse">Visualizing...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Section: Scatter Plot */}
                    {/* Bottom Section: Scatter Plot */}
<div className="max-h-[80vh] overflow-y-auto bg-white shadow rounded-lg p-4">
    {coordinates.length > 0 ? (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Scatter Plot</h2>
            {/* Updated div to center ScatterPlot with responsive sizing */}
            <div className="flex-1 border border-gray-200 rounded-lg shadow-lg p-2 flex items-center justify-center">
                <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                    <ScatterPlot data={coordinates} />
                </div>
            </div>
        </div>
    ) : !loading ? (
        <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 font-mono">No plot to display. Please visualize your texts.</p>
        </div>
    ) : null}
</div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
