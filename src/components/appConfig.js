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
import Tetris from './Tetris';
import FileManagerApp from './FileManagerApp';
import MessageApp from './MessageApp';
import MapApp from './MapApp';
import VideoPlayer from './VideoPlayer';
import ReactPlayground from './ReactPlayground';
import AIAssistantApp from './AIAssistantApp/AIAssistantApp';
const appConfig = [
  {
    name: 'AI Assistant',
    icon: '🤖',
    component: AIAssistantApp,
    defaultSize: { width: 1200, height: 600 },
    showInDock: true,
  },
  {
    name: 'React Playground',
    icon: '⚛️',
    component: ReactPlayground,
    defaultSize: { width: 1000, height: 600 },
    showInDock: false,
  },
  {
    name: 'Video Player',
    icon: '🎞️',
    component: VideoPlayer,
    defaultSize: { width: 800, height: 600 }
  },
  {
    name: 'Map',
    icon: '🗺️',
    component: MapApp,
    defaultSize: { width: 800, height: 600 }
  },
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
    component: MessageApp,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
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
  },
  {
    name: 'Tetris',
    icon: '🧱', // Using a brick emoji as the icon
    component: Tetris,
    defaultSize: { width: 600, height: 800 }
  },
  {
    name: 'File Manager',
    icon: '📁', // 或者使用自定义图标
    component: FileManagerApp,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
];

export default appConfig;