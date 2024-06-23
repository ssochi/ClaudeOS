import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import fileSystemInstance from './fileSystemSingleton';
import { 
  FolderIcon, 
  DocumentIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  PlusIcon,
  FolderPlusIcon,
  ArrowPathIcon,
  TrashIcon
} from '@heroicons/react/24/solid';

// ConfirmDialog component
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-4 rounded shadow-lg">
      <p className="mb-4 text-white">{message}</p>
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-red-600 text-white rounded mr-2" onClick={onConfirm}>Confirm</button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

// FileTreeItem component
const FileTreeItem = ({ item, depth, onSelect, selectedFile, fileSystem, updateFileTree, onDeleteConfirm }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    if (item.isDirectory) {
      toggleExpand();
    } else {
      onSelect(item);
    }
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
    return <DocumentIcon className="w-4 h-4 text-blue-500" />;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteConfirm(item);
  };

  return (
    <div>
      <div 
        className={`flex items-center py-0.5 px-2 cursor-pointer hover:bg-gray-700 ${selectedFile === item.name ? 'bg-blue-800' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={handleClick}
      >
        {item.isDirectory && (
          <span onClick={toggleExpand} className="mr-1">
            {getIcon()}
          </span>
        )}
        {getFileIcon()}
        <span className="ml-1 text-sm">{item.name}</span>
        <button onClick={handleDelete} className="ml-auto text-gray-400 hover:text-white">
          <TrashIcon className="h-4 w-4" />
        </button>
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
              fileSystem={fileSystem}
              updateFileTree={updateFileTree}
              onDeleteConfirm={onDeleteConfirm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// FileExplorer component
const FileExplorer = ({ fileSystem, onFileSelect, forceUpdate, onDeleteConfirm }) => {
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

  const handleNewFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      fileSystem.touch(fileName);
      updateFileTree();
    }
  };

  const handleNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      fileSystem.mkdir(folderName);
      updateFileTree();
    }
  };

  return (
    <div className="text-white bg-gray-800 h-full overflow-auto">
      <div className="font-bold text-sm py-2 px-4 uppercase flex items-center justify-between">
        Explorer
        <div className="flex space-x-2">
          <button onClick={handleNewFile} className="text-gray-400 hover:text-white">
            <PlusIcon className="h-4 w-4" />
          </button>
          <button onClick={handleNewFolder} className="text-gray-400 hover:text-white">
            <FolderPlusIcon className="h-4 w-4" />
          </button>
          <button onClick={updateFileTree} className="text-gray-400 hover:text-white">
            <ArrowPathIcon className="h-4 w-4" />
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
            fileSystem={fileSystem}
            updateFileTree={updateFileTree}
            onDeleteConfirm={onDeleteConfirm}
          />
        ))}
      </div>
    </div>
  );
};

// Main VSCodeApp component
const VSCodeApp = ({ onClose }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [fileSystem] = useState(() => fileSystemInstance);
  const [currentFile, setCurrentFile] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [forceUpdate, setForceUpdate] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] = useState({ message: '', onConfirm: null });

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: '',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true }
      });
    }
  
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  const handleFileSelect = useCallback((file) => {
    console.log(file);
    if (!file.isDirectory) {
      const content = fileSystem.cat(file.name);
      setCurrentFile(file);
  
      if (editorRef.current) {
        let model = editorRef.current.getModel();
        
        if (!model) {
          model = monaco.editor.createModel(content || '', 'plaintext');
        } else {
          model.setValue(content || '');
        }
        
        if (model) {
          editorRef.current.setModel(model);
  
          const fileExtension = file.name.split('.').pop();
          const languageMap = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'html': 'html',
            'css': 'css'
          };
          const newLang = languageMap[fileExtension] || 'plaintext';
          monaco.editor.setModelLanguage(model, newLang);
          setLanguage(newLang);
        } else {
          console.error("Failed to create or set model.");
        }
      } else {
        console.error("Editor is not initialized.");
      }
    }
  }, [fileSystem]);

  const handleSave = useCallback(() => {
    if (currentFile && editorRef.current) {
      const content = editorRef.current.getValue();
      fileSystem.updateFile(currentFile.name, content);
      setForceUpdate(prev => prev + 1);
    }
  }, [currentFile, fileSystem]);

  const handleDeleteConfirm = useCallback((item) => {
    setConfirmDialogProps({
      message: `Are you sure you want to delete ${item.name}?`,
      onConfirm: () => {
        fileSystem.rm(item.name);
        if (currentFile && currentFile.name === item.name) {
          setCurrentFile(null);
          if (editorRef.current) {
            editorRef.current.setValue('');
          }
        }
        setForceUpdate(prev => prev + 1);
        setShowConfirmDialog(false);
      }
    });
    setShowConfirmDialog(true);
  }, [currentFile, fileSystem]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Menu bar */}
      <div className="flex items-center bg-gray-800 p-2 text-sm">
        <button className="px-2 hover:bg-gray-700">File</button>
        <button className="px-2 hover:bg-gray-700">Edit</button>
        <button className="px-2 hover:bg-gray-700">View</button>
        <button className="px-2 hover:bg-gray-700">Help</button>
        <button className="px-2 hover:bg-gray-700" onClick={handleSave}>Save</button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (file explorer) */}
        <div className="w-64 bg-gray-800 overflow-y-auto">
          <FileExplorer 
            fileSystem={fileSystem} 
            onFileSelect={handleFileSelect} 
            forceUpdate={forceUpdate}
            onDeleteConfirm={handleDeleteConfirm}
          />
        </div>

        {/* Editor */}
        <div ref={containerRef} className="flex-grow" />
      </div>

      {/* Status bar */}
      <div className="flex justify-between items-center bg-blue-600 text-white text-xs p-1">
        <div>{currentFile ? currentFile.name : 'No file open'}</div>
        <div>{language}</div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <ConfirmDialog
          message={confirmDialogProps.message}
          onConfirm={confirmDialogProps.onConfirm}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default VSCodeApp;