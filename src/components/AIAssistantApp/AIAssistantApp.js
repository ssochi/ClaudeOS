import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MessageDisplay from './MessageDisplay';
import ModelSelector from './ModelSelector';
import FileDropZone from './FileDropZone';

const AIAssistantApp = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [copyNotification, setCopyNotification] = useState(null);
  const [context, setContext] = useState(() => {
    const savedContext = localStorage.getItem('chatContext');
    return savedContext ? JSON.parse(savedContext) : '';
  });
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatContext', JSON.stringify(context));
  }, [context]);

  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && uploadedFiles.length === 0) return;
    if (!selectedModel) return;

    let userMessage = { role: 'user', content: input };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    let aiMessage = { role: 'assistant', content: '' };
    setMessages(prevMessages => [...prevMessages, aiMessage]);

    try {
      const response = await fetch('http://localhost:3001/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: `Context: ${context}` },
            ...messages,
            userMessage
          ]
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const content = line.slice(6);
            if (content === "[DONE]") {
              return; // End of the stream
            }
            try {
              const jsonData = JSON.parse(line.slice(5));
              if (jsonData.choices && jsonData.choices[0].delta.content) {
                aiMessage.content += jsonData.choices[0].delta.content;
                setMessages(prevMessages => [
                  ...prevMessages.slice(0, -1),
                  { ...aiMessage }
                ]);
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'system', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyNotification = () => {
    setCopyNotification({ message: 'Code copied!', id: Date.now() });
    setTimeout(() => setCopyNotification(null), 2000);
  };

  const handleFileUpload = (files) => {
    const newFiles = files.map(file => ({
      name: file.name,
      content: file.content
    }));
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Immediately update the context when files are uploaded
    const newContext = newFiles.map(file => `File: ${file.name}\n\nContent:\n${file.content}`).join('\n\n');
    setContext(prevContext => prevContext ? `${prevContext}\n\n${newContext}` : newContext);

    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'system', content: `Files uploaded successfully: ${newFiles.map(file => file.name).join(', ')}` }
    ]);
  };

  const handleRemoveFile = (fileName) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    
    // Immediately update the context when a file is removed
    setContext(prevContext => {
      const lines = prevContext.split('\n');
      const newLines = lines.filter(line => !line.includes(`File: ${fileName}`));
      return newLines.join('\n');
    });

    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'system', content: `File removed: ${fileName}` }
    ]);
  };

  const clearContext = () => {
    setContext('');
    setUploadedFiles([]);
    localStorage.removeItem('chatContext');
    localStorage.removeItem('uploadedFiles');
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'system', content: 'All context has been cleared.' }
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 font-sans">
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
        <div className="flex-grow overflow-auto p-4">
          <MessageDisplay
            messages={messages}
            onCopy={handleCopyNotification}
          />
          <div ref={messagesEndRef} />
        </div>
      </FileDropZone>
      <div className="p-4 bg-white border-t border-gray-200">
        {uploadedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-blue-100 p-2 rounded">
                <span className="text-sm text-blue-800 mr-2">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
      <AnimatePresence>
        {copyNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg"
          >
            {copyNotification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistantApp;