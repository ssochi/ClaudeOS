// Desktop.js
import React, { useState, useEffect, useCallback } from 'react';
import Dock from './Dock';
import MenuBar from './MenuBar';
import Window from './Window';
import Launchpad from './Launchpad';
import appConfig from './appConfig';

const Desktop = () => {
  const [windows, setWindows] = useState([]);
  const [wallpapers, setWallpapers] = useState([]);
  const [currentWallpaper, setCurrentWallpaper] = useState('');
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);

  useEffect(() => {
    const importAll = (r) => r.keys().map(r);
    const imageContext = require.context('../assets', false, /\.(png|jpe?g|svg)$/);
    const images = importAll(imageContext);
    setWallpapers(images);
    setCurrentWallpaper(images[0]);
  }, []);

  const openWindow = useCallback((appName) => {
    console.log('Desktop openWindow called with:', appName);
    const app = appConfig.find(app => app.name === appName);
    if (!app) {
      console.error('App not found:', appName);
      return;
    }

    const newWindowId = Date.now();
    setWindows(prevWindows => {
      const maxZIndex = Math.max(...prevWindows.map(w => w.zIndex), 0);
      const newWindow = { 
        id: newWindowId, 
        title: app.name, 
        content: <app.component 
          onClose={() => closeWindow(newWindowId)}
          setWallpaper={app.name === 'Settings' ? setCurrentWallpaper : undefined}
          wallpapers={app.name === 'Settings' ? wallpapers : undefined}
          currentWallpaper={app.name === 'Settings' ? currentWallpaper : undefined}
        />,
        zIndex: maxZIndex + 1,
        size: app.defaultSize,
        isMinimized: false
      };
      return [...prevWindows, newWindow];
    });
    setActiveWindowId(newWindowId);
    setIsLaunchpadOpen(false);
  }, [wallpapers, currentWallpaper]);

  const closeWindow = (id) => {
    setWindows(prevWindows => prevWindows.filter(window => window.id !== id));
    if (activeWindowId === id) {
      const remainingWindows = windows.filter(window => window.id !== id);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };

  const focusWindow = (id) => {
    setActiveWindowId(id);
    setWindows(prevWindows => {
      const maxZIndex = Math.max(...prevWindows.map(w => w.zIndex));
      return prevWindows.map(window => 
        window.id === id 
          ? {...window, zIndex: maxZIndex + 1, isMinimized: false} 
          : window
      );
    });
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

  const openLaunchpad = useCallback(() => {
    console.log('Opening Launchpad');
    setIsLaunchpadOpen(true);
  }, []);

  const closeLaunchpad = useCallback(() => {
    console.log('Closing Launchpad');
    setIsLaunchpadOpen(false);
  }, []);

  console.log('Desktop render, isLaunchpadOpen:', isLaunchpadOpen);

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
      {isLaunchpadOpen && (
        <Launchpad 
          onClose={closeLaunchpad}
          openWindow={openWindow}
        />
      )}
      <Dock 
        openWindow={openWindow}
        openWindows={windows}
        restoreWindow={restoreWindow}
        focusWindow={focusWindow}
        openLaunchpad={openLaunchpad}
      />
    </div>
  );
};

export default Desktop;