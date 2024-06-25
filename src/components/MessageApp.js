import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Paperclip, Mic, Menu } from 'lucide-react';

const MessageApp = ({ onClose }) => {
  const [activeChat, setActiveChat] = useState(1);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', status: 'online', avatar: '👨' },
    { id: 2, name: 'Jane Smith', status: 'offline', avatar: '👩' },
    { id: 3, name: 'Alice Johnson', status: 'online', avatar: '👧' },
  ]);
  const [messages, setMessages] = useState({
    1: [
      { id: 1, type: 'text', content: 'Hello!', sender: 'John Doe', timestamp: '10:00 AM' },
      { id: 2, type: 'text', content: 'Hi there!', sender: 'You', timestamp: '10:01 AM' },
      { id: 3, type: 'image', content: '/api/placeholder/300/200', sender: 'John Doe', timestamp: '10:05 AM' },
    ],
    2: [
      { id: 1, type: 'text', content: 'Hey Jane!', sender: 'You', timestamp: '11:00 AM' },
      { id: 2, type: 'text', content: 'Hello! How are you?', sender: 'Jane Smith', timestamp: '11:02 AM' },
    ],
    3: [
      { id: 1, type: 'text', content: 'Alice, did you get my email?', sender: 'You', timestamp: '09:30 AM' },
      { id: 2, type: 'text', content: 'Yes, I\'ll reply soon!', sender: 'Alice Johnson', timestamp: '09:35 AM' },
    ],
  });
  const [newMessage, setNewMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const mockReplies = [
    "That's interesting! Tell me more.",
    "I see what you mean. What do you think about...",
    "Thanks for sharing that. By the way, did you hear about...",
    "I'm not sure I agree. Can you explain your reasoning?",
    "That reminds me of something I read recently...",
  ];

  const handleSend = useCallback(() => {
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
      }, 1000 + Math.random() * 2000);
    }
  }, [newMessage, activeChat, messages, contacts, mockReplies]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  const MessageBubble = React.memo(({ message }) => {
    const isOwnMessage = message.sender === 'You';
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
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
      </div>
    );
  });

  const drawerVariants = {
    open: { width: 250, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
      <div className={`p-2 flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="p-1 rounded-full hover:bg-gray-300">
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold">Messages</h2>
        <div className="flex items-center space-x-2">
          <button onClick={toggleTheme} className="p-1 rounded-full hover:bg-gray-300">
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <motion.div
          variants={drawerVariants}
          initial="closed"
          animate={isDrawerOpen ? "open" : "closed"}
          className={`border-r overflow-hidden ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Search contacts..."
              className={`w-full px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            />
          </div>
          <ul className="overflow-y-auto" style={{height: 'calc(100% - 40px)'}}>
            {contacts.map((contact) => (
              <li
                key={contact.id}
                onClick={() => {
                  setActiveChat(contact.id);
                  setIsDrawerOpen(false);
                }}
                className={`p-2 cursor-pointer ${activeChat === contact.id ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200') : ''}`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-gray-300">
                    {contact.avatar}
                  </div>
                  <div>
                    <div>{contact.name}</div>
                    <div className={`text-xs ${contact.status === 'online' ? 'text-green-500' : 'text-gray-500'}`}>
                      {contact.status}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {activeChat && messages[activeChat]?.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
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