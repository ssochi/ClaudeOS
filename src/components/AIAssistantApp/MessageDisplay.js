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
          className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
        >
          <div className={`inline-block p-3 rounded-lg ${
            message.role === 'user'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-800 shadow-sm'
          } break-words max-w-[70%]`}>
            <CustomMarkdown content={message.content} onCopy={onCopy} />
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default MessageDisplay;