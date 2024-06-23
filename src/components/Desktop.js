// Desktop.js
import React, { useState, useEffect } from 'react';
import Dock from './Dock';
import MenuBar from './MenuBar';
import Window from './Window';
import appConfig from './appConfig';

const Desktop = () => {
  const [windows, setWindows] = useState([]);
  const [wallpapers, setWallpapers] = useState([]);
  const [currentWallpaper, setCurrentWallpaper] = useState('');
  const [activeWindowId, setActiveWindowId] = useState(null);

  useEffect(() => {
    // Dynamically import all images from the assets folder
    const importAll = (r) => r.keys().map(r);
    const imageContext = require.context('../assets', false, /\.(png|jpe?g|svg)$/);
    const images = importAll(imageContext);
    setWallpapers(images);
    setCurrentWallpaper(images[0]); // Set the first image as default wallpaper
  }, []);

  const openWindow = (appName) => {
    const app = appConfig.find(app => app.name === appName);
    if (!app) return;

    const newWindowId = Date.now();
    const newWindow = { 
      id: newWindowId, 
      title: app.name, 
      content: <app.component 
        onClose={() => closeWindow(newWindowId)}
        setWallpaper={app.name === 'Settings' ? setCurrentWallpaper : undefined}
        wallpapers={app.name === 'Settings' ? wallpapers : undefined}
        currentWallpaper={app.name === 'Settings' ? currentWallpaper : undefined}
      />,
      zIndex: windows.length + 1,
      size: app.defaultSize, // Use the default size from appConfig
      isMinimized: false
    };
    setWindows(prevWindows => [...prevWindows, newWindow]);
    setActiveWindowId(newWindowId);
  };

  const closeWindow = (id) => {
    setWindows(prevWindows => prevWindows.filter(window => window.id !== id));
    if (activeWindowId === id) {
      const remainingWindows = windows.filter(window => window.id !== id);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };

  const focusWindow = (id) => {
    setActiveWindowId(id);
    setWindows(prevWindows => prevWindows.map(window => 
      window.id === id 
        ? {...window, zIndex: Math.max(...prevWindows.map(w => w.zIndex)) + 1, isMinimized: false} 
        : window
    ));
  };

  const minimizeWindow = (id) => {
    setWindows(prevWindows => prevWindows.map(window => 
      window.id === id ? {...window, isMinimized: true} : window
    ));
    if (activeWindowId === id) {
      const visibleWindows = windows.filter(window => !window.isMinimized && window.id !== id);
      setActiveWindowId(visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1].id : null);
    }
  };

  const restoreWindow = (id) => {
    setWindows(prevWindows => prevWindows.map(window => 
      window.id === id ? {...window, isMinimized: false} : window
    ));
    focusWindow(id);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
        style={{ backgroundImage: `url(${currentWallpaper})` }}
      ></div>
      <MenuBar />
      {windows.map(window => (
        <Window 
          key={window.id}
          id={window.id}
          title={window.title}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
          zIndex={window.zIndex}
          isActive={window.id === activeWindowId}
          isMinimized={window.isMinimized}
          initialSize={window.size}
        >
          {window.content}
        </Window>
      ))}
      <Dock 
        openWindow={openWindow}
        openWindows={windows}
        restoreWindow={restoreWindow}
        focusWindow={focusWindow}
      />
    </div>
  );
};

export default Desktop;
