// src/components/VisualizeButton.jsx
import React from 'react';

const VisualizeButton = ({ onVisualize }) => (
  <button
    onClick={onVisualize}
    className="bg-red-300 text-grey-500 px-4 py-2 rounded hover:bg-red-600 font-mono"
  >
    Visualize
  </button>
);

export default VisualizeButton;
