import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Paperclip, Mic } from 'lucide-react';

const MessageApp = ({ onClose }) => {
  const [activeChat, setActiveChat] = useState(1); // Set default active chat
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', status: 'online', avatar: '👨' },
    { id: 2, name: 'Jane Smith', status: 'offline', avatar: '👩' },
  ]);
  const [messages, setMessages] = useState({
    1: [
      { id: 1, type: 'text', content: 'Hello!', sender: 'John Doe', timestamp: '10:00 AM' },
      { id: 2, type: 'text', content: 'Hi there!', sender: 'You', timestamp: '10:01 AM' },
      { id: 3, type: 'image', content: '/api/placeholder/300/200', sender: 'John Doe', timestamp: '10:05 AM' },
    ],
  });
  const [newMessage, setNewMessage] = useState('');
  const [theme, setTheme] = useState('light');

  const mockReplies = [
    "That's interesting! Tell me more.",
    "I see what you mean. What do you think about...",
    "Thanks for sharing that. By the way, did you hear about...",
    "I'm not sure I agree. Can you explain your reasoning?",
    "That reminds me of something I read recently...",
  ];

  const handleSend = () => {
    if (newMessage.trim() && activeChat) {
      const updatedMessages = {
        ...messages,
        [activeChat]: [
          ...(messages[activeChat] || []),
          {
            id: Date.now(),
            type: 'text',
            content: newMessage,
            sender: 'You',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
      setMessages(updatedMessages);
      setNewMessage('');

      // Simulate a reply after a short delay
      setTimeout(() => {
        const replyContent = mockReplies[Math.floor(Math.random() * mockReplies.length)];
        const updatedMessagesWithReply = {
          ...updatedMessages,
          [activeChat]: [
            ...updatedMessages[activeChat],
            {
              id: Date.now() + 1,
              type: 'text',
              content: replyContent,
              sender: contacts.find(c => c.id === activeChat)?.name || 'Unknown',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        };
        setMessages(updatedMessagesWithReply);
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const MessageBubble = ({ message }) => {
    const isOwnMessage = message.sender === 'You';
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
      >
        {!isOwnMessage && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-gray-300">
            {contacts.find(c => c.name === message.sender)?.avatar || '👤'}
          </div>
        )}
        <div className={`p-2 rounded-lg max-w-xs ${
          isOwnMessage
            ? `${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`
            : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`
        }`}>
          {message.type === 'text' && <p>{message.content}</p>}
          {message.type === 'image' && <img src={message.content} alt="Shared image" className="rounded-md" />}
          <p className="text-xs text-right mt-1 opacity-75">{message.timestamp}</p>
        </div>
        {isOwnMessage && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2 bg-gray-300">
            {'👤'}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
      {/* Header and other components remain the same */}
      <div className="flex flex-1 overflow-hidden">
        {/* Contact list remains the same */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {activeChat && messages[activeChat]?.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
          <div className={`p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="flex space-x-2 items-center">
              <button className="text-gray-500 hover:text-gray-700">
                <Camera size={20} />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Paperclip size={20} />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Mic size={20} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className={`flex-1 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'} rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageApp;