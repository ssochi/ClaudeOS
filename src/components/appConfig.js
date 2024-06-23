// appConfig.js
import React from 'react';
import WallpaperSetter from './WallpaperSetter';
import Notepad from './Notepad';
import Calendar from './Calendar';

const appConfig = [
  {
    name: 'Finder',
    icon: '📁',
    component: ({ onClose }) => <div>This is the Finder window content.</div>,
    defaultSize: { width: 600, height: 400 }
  },
  {
    name: 'Safari',
    icon: '🌐',
    component: ({ onClose }) => <div>This is the Safari window content.</div>,
    defaultSize: { width: 800, height: 600 }
  },
  {
    name: 'Messages',
    icon: '💬',
    component: ({ onClose }) => <div>This is the Messages window content.</div>,
    defaultSize: { width: 400, height: 500 }
  },
  {
    name: 'Mail',
    icon: '✉️',
    component: ({ onClose }) => <div>This is the Mail window content.</div>,
    defaultSize: { width: 700, height: 500 }
  },
  {
    name: 'Notepad',
    icon: '📝',
    component: Notepad,
    defaultSize: { width: 500, height: 600 }
  },
  {
    name: 'Settings',
    icon: '⚙️',
    component: WallpaperSetter,
    defaultSize: { width: 800, height: 600 }
  },
  {
    name: 'Calendar',
    icon: '📅',
    component: Calendar,
    defaultSize: { width: 500, height: 500 }
  },
];

export default appConfig;