// src/components/AddButton.jsx
import React from 'react';

const AddButton = ({ onAdd }) => (
  <button
    onClick={onAdd}
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  >
    Add Input
  </button>
);

export default AddButton;
