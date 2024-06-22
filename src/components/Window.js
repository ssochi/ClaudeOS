import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';

const Window = ({ id, title, children, onClose, onMinimize, onFocus, zIndex, isActive }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const windowRef = useRef(null);
  const resizeRef = useRef(null);
  const dragControls = useDragControls();

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setPosition({ x: 0, y: 25 }); // Account for MenuBar
      setWindowSize({ width: window.innerWidth, height: window.innerHeight - 25 });
    } else {
      setPosition({ x: 100, y: 100 });
      setWindowSize({ width: 600, height: 400 });
    }
  };

  const handleDragEnd = (event, info) => {
    if (isMaximized) return; // Don't adjust position if maximized

    const newX = position.x + info.offset.x;
    const newY = position.y + info.offset.y;
    
    // Screen edge snapping
    const snapThreshold = 20;
    let snappedX = newX;
    let snappedY = newY;

    if (newX < snapThreshold) snappedX = 0;
    if (newY < snapThreshold + 25) snappedY = 25; // Account for MenuBar
    if (newX + windowSize.width > window.innerWidth - snapThreshold) snappedX = window.innerWidth - windowSize.width;
    if (newY + windowSize.height > window.innerHeight - snapThreshold) snappedY = window.innerHeight - windowSize.height;

    setPosition({ x: snappedX, y: snappedY });
  };

  const handleResize = (e) => {
    if (!resizeRef.current) return;

    const newWidth = e.clientX - position.x;
    const newHeight = e.clientY - position.y;

    setWindowSize({
      width: Math.max(300, newWidth), // Minimum width
      height: Math.max(200, newHeight) // Minimum height
    });
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (resizeRef.current) {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleMouseUp);
        resizeRef.current = null;
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position]);

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = true;
    document.addEventListener('mousemove', handleResize);
  };

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      dragConstraints={isMaximized ? { top: 25, left: 0, right: 0, bottom: 0 } : false}
      initial={false}
      animate={{
        width: isMaximized ? window.innerWidth : windowSize.width,
        height: isMaximized ? window.innerHeight - 25 : windowSize.height,
        x: position.x,
        y: position.y,
      }}
      style={{ zIndex: zIndex }}
      className="absolute bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-200"
      onPointerDown={() => onFocus(id)}
    >
      <motion.div
        className="h-7 px-3 flex items-center justify-between bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300"
        onPointerDown={(e) => {
          if (!isMaximized) {
            dragControls.start(e);
          }
        }}
      >
        <div className="flex space-x-2 items-center">
          <motion.button 
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
            whileHover={{ scale: 1.1 }}
            onClick={() => onClose(id)}
          ></motion.button>
          <motion.button 
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600" 
            whileHover={{ scale: 1.1 }}
            onClick={() => onMinimize(id)}
          ></motion.button>
          <motion.button 
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" 
            whileHover={{ scale: 1.1 }}
            onClick={handleMaximize}
          ></motion.button>
        </div>
        <span className="absolute left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">
          {title}
        </span>
      </motion.div>
      <div className="p-4 overflow-auto bg-white bg-opacity-60 backdrop-blur-sm" style={{ height: 'calc(100% - 1.75rem)' }}>
        {children}
      </div>
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={startResize}
        />
      )}
    </motion.div>
  );
};

export default Window;