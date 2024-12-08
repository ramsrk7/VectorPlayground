// src/components/AddButton.jsx
import React from 'react';

const AddButton = ({ onAdd }) => (
  <button
    onClick={onAdd}
    className="bg-red-300 text-grey-500 px-4 py-2 rounded hover:bg-red-600 font-mono"
  >
    Add Input
  </button>
);

export default AddButton;
