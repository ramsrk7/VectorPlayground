// src/components/InputCard.jsx
import React from 'react';

const InputCard = ({ id, text, handleTextChange, handleRemove }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 mb-4 flex items-center">
      <input
        type="text"
        value={text}
        onChange={(e) => handleTextChange(id, e.target.value)}
        placeholder="Enter text"
        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
      />
      {handleRemove && (
        <button
          onClick={() => handleRemove(id)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default InputCard;
