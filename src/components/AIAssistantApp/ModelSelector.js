import React, { useState, useRef, useEffect } from 'react';

const ModelSelector = ({ models, selectedModel, setSelectedModel }) => {
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const modelMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target)) {
        setIsModelMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={modelMenuRef}>
      <button
        onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
        className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedModel}
      </button>
      {isModelMenuOpen && (
        <div className="absolute right-0 mt-2 py-2 w-56 bg-white rounded-md shadow-xl z-20 max-h-60 overflow-y-auto">
          {models.map(model => (
            <button
              key={model.id}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => {
                setSelectedModel(model.id);
                setIsModelMenuOpen(false);
              }}
            >
              {model.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;