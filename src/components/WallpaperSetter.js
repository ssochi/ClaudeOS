import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WallpaperSetter = ({ wallpapers, currentWallpaper, setWallpaper, closeWindow }) => {
  const [selectedWallpaper, setSelectedWallpaper] = useState(currentWallpaper);
  const [category, setCategory] = useState('All');

  // Simulated categories (you can replace these with actual categories if available)
  const categories = ['All', 'Nature', 'Abstract', 'Cityscape', 'Space'];

  // Filter wallpapers based on category (for demonstration, we're using a simple method)
  const filteredWallpapers = category === 'All' 
    ? wallpapers 
    : wallpapers.filter((_, index) => index % categories.length === categories.indexOf(category) - 1);

  const handleApply = () => {
    setWallpaper(selectedWallpaper);
    // closeWindow();
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Desktop & Screen Saver</h2>
        <button 
          onClick={closeWindow}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Main content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
          <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`block w-full text-left px-2 py-1 rounded ${
                category === cat ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Wallpaper grid */}
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredWallpapers.map((wallpaper, index) => (
                <motion.div
                  key={wallpaper}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`relative rounded-lg overflow-hidden cursor-pointer ${
                    selectedWallpaper === wallpaper ? 'ring-4 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedWallpaper(wallpaper)}
                >
                  <img src={wallpaper} alt={`Wallpaper ${index + 1}`} className="w-full h-40 object-cover" />
                  {selectedWallpaper === wallpaper && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4 flex justify-end">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default WallpaperSetter;