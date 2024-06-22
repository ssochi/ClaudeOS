import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MenuItem = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <span className="px-2 py-1 hover:bg-white hover:bg-opacity-10 rounded cursor-default">
        {label}
      </span>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 mt-1 py-1 bg-gray-100 bg-opacity-95 backdrop-blur-md rounded-md shadow-lg min-w-[200px]"
          >
            {items.map((item, index) => (
              <div key={index} className="px-4 py-1 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-default whitespace-nowrap">
                {item}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { label: '', items: ['About This Mac', 'System Preferences...', 'App Store...', 'Recent Items', 'Force Quit...', 'Sleep', 'Restart...', 'Shut Down...'] },
    { label: 'File', items: ['New Window', 'Open', 'Open Recent', 'Close Window', 'Save', 'Save As...', 'Print...'] },
    { label: 'Edit', items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Select All', 'Find', 'Find and Replace...'] },
    { label: 'View', items: ['as Icons', 'as List', 'as Columns', 'as Gallery', 'Show Hidden Files', 'Show Path Bar', 'Show Status Bar'] },
    { label: 'Go', items: ['Back', 'Forward', 'Enclosing Folder', 'Home', 'Documents', 'Desktop', 'Downloads', 'Applications', 'Utilities'] },
    { label: 'Window', items: ['Minimize', 'Zoom', 'Cycle Through Windows', 'Show Previous Tab', 'Show Next Tab', 'Move Window to Left Side of Screen', 'Move Window to Right Side of Screen', 'Move Window to Other Display'] },
    { label: 'Help', items: ['macOS Help', 'See What\'s New in macOS', 'New to Mac? Tour the Basics', 'Get Support'] },
  ];

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-md text-black h-6 flex items-center justify-between px-2 text-sm border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {menuItems.map((item, index) => (
          <MenuItem key={index} label={index === 0 ? '🍎' : item.label} items={item.items} />
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <span>🔋 100%</span>
        <span>📶 Wi-Fi</span>
        <span>{currentTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default MenuBar;