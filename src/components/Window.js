// Window.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useDragControls } from 'framer-motion';

const Window = ({ id, title, children, onClose, onMinimize, onFocus, zIndex, isActive, isMinimized, initialSize }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowSize, setWindowSize] = useState(initialSize || { width: 600, height: 400 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [currentOperation, setCurrentOperation] = useState(null);
  const [resizeStart, setResizeStart] = useState(null);
  const dragControls = useDragControls();

  useEffect(() => {
    // Update windowSize when initialSize prop changes
    setWindowSize(initialSize || { width: 600, height: 400 });
  }, [initialSize]);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setPosition({ x: 0, y: 25 });
      setWindowSize({ width: window.innerWidth, height: window.innerHeight - 25 });
    } else {
      setPosition({ x: 100, y: 100 });
      setWindowSize(initialSize || { width: 600, height: 400 });
    }
  };

  const handleDragStart = () => {
    if (!isMaximized && currentOperation === null) {
      setCurrentOperation('move');
    }
  };

  const handleDragEnd = (event, info) => {
    if (isMaximized || currentOperation !== 'move') return;

    const newX = position.x + info.offset.x;
    const newY = position.y + info.offset.y;
    
    const snapThreshold = 20;
    let snappedX = newX;
    let snappedY = newY;

    if (newX < snapThreshold) snappedX = 0;
    if (newY < snapThreshold + 25) snappedY = 25;
    if (newX + windowSize.width > window.innerWidth - snapThreshold) snappedX = window.innerWidth - windowSize.width;
    if (newY + windowSize.height > window.innerHeight - snapThreshold) snappedY = window.innerHeight - windowSize.height;

    setPosition({ x: snappedX, y: snappedY });
    setCurrentOperation(null);
  };

  const handleResize = useCallback((e) => {
    if (currentOperation !== 'resize' || !resizeStart) return;

    const { clientX, clientY } = e;
    const { startX, startY, startWidth, startHeight, direction } = resizeStart;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = position.x;
    let newY = position.y;

    if (direction.includes('right')) {
      newWidth = Math.max(300, startWidth + clientX - startX);
    }
    if (direction.includes('bottom')) {
      newHeight = Math.max(200, startHeight + clientY - startY);
    }
    if (direction.includes('left')) {
      const deltaX = startX - clientX;
      newWidth = Math.max(300, startWidth + deltaX);
      newX = position.x - deltaX;
    }
    if (direction.includes('top')) {
      const deltaY = startY - clientY;
      newHeight = Math.max(200, startHeight + deltaY);
      newY = position.y - deltaY;
    }

    setWindowSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  }, [currentOperation, resizeStart, position]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (currentOperation === 'resize') {
        setCurrentOperation(null);
        setResizeStart(null);
      }
    };

    if (currentOperation === 'resize') {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [currentOperation, handleResize]);

  const startResize = (direction) => (e) => {
    if (currentOperation === null) {
      e.preventDefault();
      e.stopPropagation();
      setCurrentOperation('resize');
      setResizeStart({
        startX: e.clientX,
        startY: e.clientY,
        startWidth: windowSize.width,
        startHeight: windowSize.height,
        direction
      });
    }
  };

  const resizeHandles = [
    { className: 'w-1 h-full cursor-w-resize', style: { left: 0, top: 0 }, direction: 'left' },
    { className: 'w-1 h-full cursor-e-resize', style: { right: 0, top: 0 }, direction: 'right' },
    { className: 'w-full h-1 cursor-n-resize', style: { left: 0, top: 0 }, direction: 'top' },
    { className: 'w-full h-1 cursor-s-resize', style: { left: 0, bottom: 0 }, direction: 'bottom' },
    { className: 'w-3 h-3 cursor-nw-resize', style: { left: 0, top: 0 }, direction: 'left-top' },
    { className: 'w-3 h-3 cursor-ne-resize', style: { right: 0, top: 0 }, direction: 'right-top' },
    { className: 'w-3 h-3 cursor-sw-resize', style: { left: 0, bottom: 0 }, direction: 'left-bottom' },
    { className: 'w-3 h-3 cursor-se-resize', style: { right: 0, bottom: 0 }, direction: 'right-bottom' },
  ];

  if (isMinimized) {
    return null;
  }

  return (
    <motion.div
      drag={!isMaximized && currentOperation !== 'resize'}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragConstraints={isMaximized ? { top: 25, left: 0, right: 0, bottom: 0 } : false}
      dragControls={dragControls}
      initial={false}
      animate={{
        width: isMaximized ? window.innerWidth : windowSize.width,
        height: isMaximized ? window.innerHeight - 25 : windowSize.height,
        x: position.x,
        y: position.y,
      }}
      style={{ zIndex }}
      className="absolute bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-200"
      onPointerDown={() => onFocus(id)}
    >
      <motion.div
        className="h-7 px-3 flex items-center justify-between bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300 cursor-move"
        onPointerDown={(e) => {
          if (!isMaximized && currentOperation === null) {
            e.stopPropagation();
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
      <div className="overflow-auto bg-white bg-opacity-60 backdrop-blur-sm" style={{ height: 'calc(100% - 1.75rem)' }}>
        {children}
      </div>
      {!isMaximized && resizeHandles.map((handle, index) => (
        <div
          key={index}
          className={`absolute ${handle.className}`}
          style={handle.style}
          onMouseDown={startResize(handle.direction)}
        />
      ))}
    </motion.div>
  );
};

export default Window;