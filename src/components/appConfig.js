// appConfig.js
import React from 'react';
import WallpaperSetter from './WallpaperSetter';
import Notepad from './Notepad';
import CalendarApp from './CalendarApp';
import Terminal from './Terminal';
import Calculator from './Calculator';
import MailApp from './MailApp';
import SafariApp from './SafariApp';
import VSCodeApp from './VSCodeApp';
import Launchpad from './Launchpad';
import Game2048 from './Game2048';

const appConfig = [
  {
    name: 'Launchpad',
    icon: '🚀',
    component: Launchpad,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
  {
    name: 'Finder',
    icon: '📁',
    component: ({ onClose }) => <div>This is the Finder window content.</div>,
    defaultSize: { width: 600, height: 400 },
    showInDock: false,
  },
  {
    name: 'Safari',
    icon: '🌐',
    component: SafariApp,
    defaultSize: { width: 1000, height: 700 },
    showInDock: true,
  },
  {
    name: 'Messages',
    icon: '💬',
    component: ({ onClose }) => <div>This is the Messages window content.</div>,
    defaultSize: { width: 400, height: 500 },
    showInDock: false,
  },
  {
    name: 'Mail',
    icon: '✉️',
    component: MailApp,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
  {
    name: 'Notepad',
    icon: '📝',
    component: Notepad,
    defaultSize: { width: 1000, height: 600 },
    showInDock: true,
  },
  {
    name: 'Settings',
    icon: '⚙️',
    component: WallpaperSetter,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
  {
    name: 'Calendar',
    icon: '📅',
    component: CalendarApp,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
  {
    name: 'Terminal',
    icon: '🖥️',
    component: Terminal,
    defaultSize: { width: 600, height: 400 },
    showInDock: true,
  },
  {
    name: 'Calculator',
    icon: '🔢',
    component: Calculator,
    defaultSize: { width: 300, height: 540 },
    showInDock: false,
  },
  {
    name: 'VS Code',
    icon: 'VS',
    component: VSCodeApp,
    defaultSize: { width: 1024, height: 768 },
    showInDock: true,
  },
  {
    name: '2048',
    icon: '🎮',
    component: Game2048,
    defaultSize: { width: 400, height: 650 }
  }
];

export default appConfig;