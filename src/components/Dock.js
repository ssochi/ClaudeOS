import React from 'react';
import { motion } from 'framer-motion';

const DockIcon = ({ icon, name, onClick, isOpen }) => (
  <motion.div 
    className="flex flex-col items-center justify-center cursor-pointer relative"
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <motion.div 
      className="w-12 h-12 flex items-center justify-center text-3xl bg-white bg-opacity-80 rounded-xl mb-1"
      whileHover={{ y: -10 }}
    >
      {icon}
    </motion.div>
    {isOpen && (
      <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>
    )}
  </motion.div>
);

const Dock = ({ openWindow, openWallpaperSetter, openNotepad, openWindows = [] }) => {
  const apps = [
    { name: 'Finder', icon: '📁', onClick: () => openWindow('Finder', 'This is the Finder window content.') },
    { name: 'Safari', icon: '🌐', onClick: () => openWindow('Safari', 'This is the Safari window content.') },
    { name: 'Messages', icon: '💬', onClick: () => openWindow('Messages', 'This is the Messages window content.') },
    { name: 'Mail', icon: '✉️', onClick: () => openWindow('Mail', 'This is the Mail window content.') },
    { name: 'Notepad', icon: '📝', onClick: openNotepad },
    { name: 'Settings', icon: '⚙️', onClick: openWallpaperSetter },
  ];

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center">
      <motion.div 
        className="bg-white bg-opacity-20 backdrop-blur-xl rounded-2xl px-4 py-2 flex space-x-4 items-end"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        {apps.map((app, index) => (
          <DockIcon 
            key={index} 
            icon={app.icon} 
            name={app.name} 
            onClick={app.onClick}
            isOpen={openWindows.some(window => window.title === app.name)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Dock;