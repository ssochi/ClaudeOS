import React, { useState, useEffect } from 'react';
import Dock from './Dock';
import MenuBar from './MenuBar';
import Window from './Window';
import WallpaperSetter from './WallpaperSetter';
import Notepad from './Notepad';

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

  const openWallpaperSetter = () => {
    const wallpaperSetterId = Date.now();
    openWindow('Wallpaper Settings', 
      <WallpaperSetter 
        wallpapers={wallpapers} 
        currentWallpaper={currentWallpaper} 
        setWallpaper={setCurrentWallpaper} 
        closeWindow={() => closeWindow(wallpaperSetterId)} 
      />
    );
  };

  const openNotepad = () => {
    openWindow('Notepad', <Notepad onClose={() => closeWindow(windows[windows.length - 1].id)} />);
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
          onFocus={() => focusWindow(window.id)}
          zIndex={window.zIndex}
          isActive={window.id === activeWindowId}
        >
          {window.content}
        </Window>
      ))}
      <Dock 
        openWindow={openWindow} 
        openWallpaperSetter={openWallpaperSetter}
        openNotepad={openNotepad}
        openWindows={windows}
      />
    </div>
  );
};

export default Desktop;