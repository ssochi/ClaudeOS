import React, { createContext, useContext, useState, useEffect } from 'react';

const DesktopContext = createContext();

export const DesktopProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);
  const [wallpapers, setWallpapers] = useState([]);
  const [currentWallpaper, setCurrentWallpaper] = useState('');
  const [activeWindowId, setActiveWindowId] = useState(null);

  useEffect(() => {
    // Load wallpapers
    const importAll = (r) => r.keys().map(r);
    const imageContext = require.context('../assets', false, /\.(png|jpe?g|svg)$/);
    const images = importAll(imageContext);
    setWallpapers(images);
    setCurrentWallpaper(images[0]);
  }, []);

  const openWindow = (title, content) => {
    const newWindow = { 
      id: Date.now(), 
      title, 
      content,
      zIndex: windows.length + 1
    };
    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(window => window.id !== id));
    if (activeWindowId === id) {
      const remainingWindows = windows.filter(window => window.id !== id);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };

  const focusWindow = (id) => {
    setActiveWindowId(id);
    setWindows(windows.map(window => 
      window.id === id 
        ? {...window, zIndex: Math.max(...windows.map(w => w.zIndex)) + 1} 
        : window
    ));
  };

  return (
    <DesktopContext.Provider value={{
      windows,
      wallpapers,
      currentWallpaper,
      activeWindowId,
      openWindow,
      closeWindow,
      focusWindow,
      setCurrentWallpaper
    }}>
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => useContext(DesktopContext);