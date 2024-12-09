// src/components/InputCard.jsx
import React from 'react';

const InputCard = ({ id, text, handleTextChange, handleRemove }) => (
  <div className="bg-red-50 shadow-sm rounded p-2 mb-2 flex items-center font-mono text-sm">
    <input
      type="text"
      value={text}
      onChange={(e) => handleTextChange(id, e.target.value)}
      placeholder="Enter text"
      className="flex-grow border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
    />
    {handleRemove && (
      <button
        onClick={() => handleRemove(id)}
        className="ml-1 text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    )}
  </div>
);

export default InputCard;
