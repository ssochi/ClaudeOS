import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MessageDisplay from './MessageDisplay';
import ModelSelector from './ModelSelector';
import FileDropZone from './FileDropZone';
import AIAssistantLogic from './AIAssistantLogic';

const AIAssistantApp = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [notification, setNotification] = useState(null);
  const [context, setContext] = useState(() => {
    const savedContext = localStorage.getItem('chatContext');
    return savedContext ? JSON.parse(savedContext) : '';
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatContext', JSON.stringify(context));
  }, [context]);

  useEffect(() => {
    if (notificationRef.current && notification) {
      const element = notificationRef.current;
      const elementWidth = element.offsetWidth;
      element.style.left = `calc(50% - ${elementWidth / 2}px)`;
    }
  }, [notification]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/models', {
        headers: { 'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}` }
      });
      const data = await response.json();
      const sortedModels = data.data.sort((a, b) => {
        if (a.id.toLowerCase().startsWith('claude') && !b.id.toLowerCase().startsWith('claude')) return -1;
        if (!a.id.toLowerCase().startsWith('claude') && b.id.toLowerCase().startsWith('claude')) return 1;
        return a.id.localeCompare(b.id);
      });
      setModels(sortedModels);
      setSelectedModel(sortedModels[0]?.id);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const showNotification = (message) => {
    setNotification({ message, id: Date.now() });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleCopyNotification = () => {
    showNotification('Code copied!');
  };

  const handleFileUpload = (files) => {
    const newFiles = files.map(file => ({
      name: file.name,
      content: file.content
    }));
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (fileName) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const clearContext = () => {
    setContext('');
    setUploadedFiles([]);
    localStorage.removeItem('chatContext');
    showNotification('Context cleared successfully!');
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 font-sans relative">
      <div className="bg-gray-200 p-4 flex justify-between items-center border-b border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800">AI Assistant</h2>
        <div className="flex items-center">
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
          <button
            onClick={clearContext}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Clear Context
          </button>
        </div>
      </div>
      <FileDropZone onFileUpload={handleFileUpload}>
        <div ref={chatContainerRef} className="flex-grow overflow-auto p-4">
          <MessageDisplay
            messages={messages}
            onCopy={handleCopyNotification}
          />
          <div ref={messagesEndRef} />
        </div>
      </FileDropZone>
      <AIAssistantLogic
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messages={messages}
        setMessages={setMessages}
        selectedModel={selectedModel}
        context={context}
        setContext={setContext}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        scrollToBottom={scrollToBottom}
        handleRemoveFile={handleRemoveFile}
      />
      <AnimatePresence>
        {notification && (
          <motion.div
            ref={notificationRef}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center justify-center"
            style={{
              maxWidth: '90vw',
              width: 'auto',
            }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistantApp;