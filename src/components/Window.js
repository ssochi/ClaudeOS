import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Window = ({ id, title, children, onClose, onMinimize, onFocus, zIndex, isActive, isMinimized, initialSize = { width: 600, height: 400 } }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isInteractingWithContent, setIsInteractingWithContent] = useState(false);
  const windowRef = useRef(null);
  const titleBarRef = useRef(null);

  const handleMaximize = useCallback(() => {
    setIsMaximized(prev => {
      if (!prev) {
        setPosition({ x: 0, y: 0 });
        setSize({ width: window.innerWidth, height: window.innerHeight });
      } else {
        setPosition({ x: 100, y: 100 });
        setSize(initialSize);
      }
      return !prev;
    });
  }, [initialSize]);

  const handleDragStart = useCallback((event, info) => {
    if (!isMaximized && !isInteractingWithContent && event.target === titleBarRef.current) {
      setIsDragging(true);
      onFocus(id);
    }
  }, [isMaximized, isInteractingWithContent, onFocus, id]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResizeStart = useCallback((e) => {
    if (isMaximized) return;
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const newWidth = Math.max(300, startWidth + deltaX);
      const newHeight = Math.max(200, startHeight + deltaY);
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isMaximized, size]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (isMaximized) {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isMaximized]);

  useEffect(() => {
    const contentElement = windowRef.current?.querySelector('.window-content');
    if (contentElement) {
      const handleContentInteractionStart = () => setIsInteractingWithContent(true);
      const handleContentInteractionEnd = () => setIsInteractingWithContent(false);

      contentElement.addEventListener('mousedown', handleContentInteractionStart);
      document.addEventListener('mouseup', handleContentInteractionEnd);

      return () => {
        contentElement.removeEventListener('mousedown', handleContentInteractionStart);
        document.removeEventListener('mouseup', handleContentInteractionEnd);
      };
    }
  }, []);

  if (isMinimized) return null;

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized && !isResizing && !isInteractingWithContent}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragConstraints={{ left: 0, top: 0, right: window.innerWidth - size.width, bottom: window.innerHeight - size.height }}
      animate={position}
      style={{
        width: size.width,
        height: size.height,
        zIndex
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }}
      className="absolute bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-200"
      onClick={() => onFocus(id)}
    >
      <div 
        ref={titleBarRef}
        className="h-7 px-3 flex items-center justify-between bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300 cursor-move relative"
      >
        <div className="flex space-x-2 items-center">
          <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" onClick={() => onClose(id)}></button>
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600" onClick={() => onMinimize(id)}></button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" onClick={handleMaximize}></button>
        </div>
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-gray-700">{title}</span>
      </div>
      <div className="window-content overflow-auto" style={{ height: 'calc(100% - 1.75rem)' }}>
        {children}
      </div>
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
          style={{
            background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)',
          }}
        />
      )}
    </motion.div>
  );
};

export default Window;