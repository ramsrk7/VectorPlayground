// src/components/VisualizeButton.jsx
import React from 'react';

const VisualizeButton = ({ onVisualize }) => (
  <button
    onClick={onVisualize}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Visualize
  </button>
);

export default VisualizeButton;
