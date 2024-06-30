import React from 'react';
import { motion } from 'framer-motion';
import CustomMarkdown from './CustomMarkdown';

const MessageDisplay = ({ messages, onCopy }) => {
  return (
    <>
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
        >
          <div className={`inline-block p-3 rounded-lg max-w-3/4 ${
            message.role === 'user'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-800 shadow-sm'
          }`}>
            <CustomMarkdown content={message.content} onCopy={onCopy} />
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default MessageDisplay;