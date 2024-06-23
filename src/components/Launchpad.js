// Launchpad.js
import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import appConfig from './appConfig';

const LaunchpadIcon = ({ icon, name, onClick }) => (
  <motion.div 
    className="flex flex-col items-center justify-center cursor-pointer m-4"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    <div className="w-16 h-16 flex items-center justify-center text-4xl bg-white bg-opacity-80 rounded-2xl mb-2">
      {icon}
    </div>
    <span className="text-white text-sm">{name}</span>
  </motion.div>
);

const Launchpad = ({ onClose, openWindow }) => {
  console.log('Launchpad rendered with props:', { onClose, openWindow });

  useEffect(() => {
    console.log('Launchpad useEffect, openWindow:', openWindow);
  }, [openWindow]);

  const handleOpenWindow = useCallback((appName) => {
    console.log('handleOpenWindow called with:', appName);
    if (typeof openWindow === 'function') {
      console.log('Calling openWindow with:', appName);
      openWindow(appName);
      onClose();
    } else {
      console.error('openWindow is not a function', openWindow);
    }
  }, [openWindow, onClose]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md p-8 overflow-auto z-50" onClick={onClose}>
      <motion.div 
        className="grid grid-cols-6 gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {appConfig.map((app, index) => (
          <LaunchpadIcon 
            key={index}
            icon={app.icon}
            name={app.name}
            onClick={() => handleOpenWindow(app.name)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Launchpad;