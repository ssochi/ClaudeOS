import React, { useState, useEffect, useCallback } from 'react';
import { FolderIcon, FileIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/solid';

const FileTreeItem = ({ item, depth, onSelect, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const getIcon = () => {
    if (item.isDirectory) {
      return isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />;
    }
    return null;
  };

  const getFileIcon = () => {
    if (item.isDirectory) {
      return <FolderIcon className="w-4 h-4 text-yellow-500" />;
    }
    // You can add more file type icons here
    return <FileIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div>
      <div 
        className={`flex items-center py-0.5 px-2 cursor-pointer hover:bg-gray-700 ${selectedFile === item.name ? 'bg-blue-800' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => onSelect(item)}
      >
        {item.isDirectory && (
          <span onClick={toggleExpand} className="mr-1">
            {getIcon()}
          </span>
        )}
        {getFileIcon()}
        <span className="ml-1 text-sm">{item.name}</span>
      </div>
      {item.isDirectory && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem 
              key={child.name} 
              item={child} 
              depth={depth + 1} 
              onSelect={onSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer = ({ fileSystem, onFileSelect, forceUpdate }) => {
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const updateFileTree = useCallback(() => {
    const tree = fileSystem.ls('/');
    setFileTree(tree);
  }, [fileSystem]);

  useEffect(() => {
    updateFileTree();
  }, [updateFileTree, forceUpdate]);

  const handleSelect = (item) => {
    setSelectedFile(item.name);
    onFileSelect(item);
  };

  return (
    <div className="text-white bg-gray-800 h-full overflow-auto">
      <div className="font-bold text-sm py-2 px-4 uppercase flex items-center justify-between">
        Explorer
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div>
        {fileTree.map((item) => (
          <FileTreeItem 
            key={item.name} 
            item={item} 
            depth={0} 
            onSelect={handleSelect}
            selectedFile={selectedFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;