import React, { useState, useEffect } from 'react';
import fileSystemInstance from './fileSystemSingleton';
import { 
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowUpIcon,
  PlusIcon,
  FolderPlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const FileManagerApp = ({ onClose }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [contents, setContents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [history, setHistory] = useState(['/']);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    loadContents(currentPath);
  }, [currentPath]);

  const loadContents = (path) => {
    try {
      const items = fileSystemInstance.ls(path);
      setContents(items);
    } catch (error) {
      console.error('Error loading contents:', error);
    }
  };

  const getItemIcon = (item) => {
    if (item.type === 'directory') return '📁';
    const fileTypeIcons = {
      'text': '📄',
      'image': '🖼️',
      'audio': '🎵',
      'video': '🎬',
      'pdf': '📕',
      'spreadsheet': '📊',
      'presentation': '📊',
      'archive': '🗜️',
      'code': '💻'
    };
    return fileTypeIcons[item.type] || '📄';
  };

  const handleItemClick = (item) => {
    if (item.type === 'directory') {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      navigateTo(newPath);
    } else {
      setSelectedItem(item);
    }
  };

  const navigateTo = (path) => {
    setCurrentPath(path);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), path]);
    setHistoryIndex(prev => prev + 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const handleParentDirectory = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    navigateTo(parentPath);
  };

  const handleNewFile = () => {
    const fileName = prompt('Enter new file name:');
    if (fileName) {
      fileSystemInstance.touch(`${currentPath}/${fileName}`);
      loadContents(currentPath);
    }
  };

  const handleNewFolder = () => {
    const folderName = prompt('Enter new folder name:');
    if (folderName) {
      fileSystemInstance.mkdir(`${currentPath}/${folderName}`);
      loadContents(currentPath);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedItem.name}?`);
      if (confirmDelete) {
        fileSystemInstance.rm(`${currentPath}/${selectedItem.name}`);
        setSelectedItem(null);
        loadContents(currentPath);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 text-gray-800">
      {/* Toolbar */}
      <div className="flex items-center bg-gray-200 p-2 border-b border-gray-300">
        <button onClick={handleBack} className="p-1 mr-1 rounded hover:bg-gray-300" disabled={historyIndex === 0}>
          <ArrowUturnLeftIcon className="w-5 h-5" />
        </button>
        <button onClick={handleForward} className="p-1 mr-1 rounded hover:bg-gray-300" disabled={historyIndex === history.length - 1}>
          <ArrowUturnRightIcon className="w-5 h-5" />
        </button>
        <button onClick={handleParentDirectory} className="p-1 mr-1 rounded hover:bg-gray-300" disabled={currentPath === '/'}>
          <ArrowUpIcon className="w-5 h-5" />
        </button>
        <span className="flex-grow px-2 py-1 bg-white rounded">{currentPath}</span>
        <button onClick={handleNewFile} className="p-1 ml-1 rounded hover:bg-gray-300">
          <PlusIcon className="w-5 h-5" />
        </button>
        <button onClick={handleNewFolder} className="p-1 ml-1 rounded hover:bg-gray-300">
          <FolderPlusIcon className="w-5 h-5" />
        </button>
        <button onClick={handleDelete} className="p-1 ml-1 rounded hover:bg-gray-300" disabled={!selectedItem}>
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {/* File list */}
      <div className="flex-grow overflow-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          {contents.map((item) => (
            <div
              key={item.name}
              className={`flex flex-col items-center p-2 rounded cursor-pointer ${
                selectedItem?.name === item.name ? 'bg-blue-200' : 'hover:bg-gray-200'
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className="w-16 h-16 flex items-center justify-center text-4xl">
                {getItemIcon(item)}
              </div>
              <span className="mt-2 text-sm text-center break-all">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-200 p-2 text-sm border-t border-gray-300">
        {selectedItem ? `${selectedItem.name} - ${selectedItem.size} bytes` : `${contents.length} items`}
      </div>
    </div>
  );
};

export default FileManagerApp;