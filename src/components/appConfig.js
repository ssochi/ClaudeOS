// appConfig.js
import React from 'react';
import WallpaperSetter from './WallpaperSetter';
import Notepad from './Notepad';
import Calendar from './Calendar';
import Terminal from './Terminal';
import Calculator from './Calculator';
import MailApp from './MailApp';
import SafariApp from './SafariApp';

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
    component: SafariApp,
    defaultSize: { width: 1000, height: 700 }
  },
  {
    name: 'Messages',
    icon: '💬',
    component: ({ onClose }) => <div>This is the Messages window content.</div>,
    defaultSize: { width: 400, height: 500 }
  },
  {
    name: 'Mail',
    icon: '✉️', // You can use an appropriate emoji or a custom icon
    component: MailApp,
    defaultSize: { width: 800, height: 600 }
  },
  {
    name: 'Notepad',
    icon: '📝',
    component: Notepad,
    defaultSize: { width: 1000, height: 600 }
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
  {
    name: 'Terminal',
    icon: '🖥️',
    component: Terminal,
    defaultSize: { width: 600, height: 400 }
  },
  {
    name: 'Calculator',
    icon: '🔢', // You can choose a more appropriate emoji or use a custom icon
    component: Calculator,
    defaultSize: { width: 300, height: 540 }
  },

];

export default appConfig;