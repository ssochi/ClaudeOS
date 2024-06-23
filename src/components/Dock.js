// Dock.js
import React from 'react';
import { motion } from 'framer-motion';
import appConfig from './appConfig';

const DockIcon = ({ icon, name, onClick, isOpen, isMinimized }) => (
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
      <div className={`absolute -bottom-1 w-1 h-1 ${isMinimized ? 'bg-gray-400' : 'bg-white'} rounded-full`}></div>
    )}
  </motion.div>
);

const Dock = ({ openWindow, openWindows, restoreWindow, focusWindow, openLaunchpad }) => {
  const handleIconClick = (appName) => {
    console.log('Dock icon clicked:', appName);
    if (appName === 'Launchpad') {
      console.log('Opening Launchpad from Dock');
      openLaunchpad();
    } else {
      const openAppWindow = openWindows.find(window => window.title === appName);
      if (openAppWindow) {
        if (openAppWindow.isMinimized) {
          restoreWindow(openAppWindow.id);
        } else {
          focusWindow(openAppWindow.id);
        }
      } else {
        openWindow(appName);
      }
    }
  };

  const appsToShowInDock = appConfig.filter(app => 
    app.showInDock || openWindows.some(window => window.title === app.name)
  );

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center">
      <motion.div 
        className="bg-white bg-opacity-20 backdrop-blur-xl rounded-2xl px-4 py-2 flex space-x-4 items-end"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        {appsToShowInDock.map((app, index) => {
          const openAppWindow = openWindows.find(window => window.title === app.name);
          return (
            <DockIcon 
              key={index} 
              icon={app.icon} 
              name={app.name} 
              onClick={() => handleIconClick(app.name)}
              isOpen={!!openAppWindow}
              isMinimized={openAppWindow?.isMinimized}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default Dock;