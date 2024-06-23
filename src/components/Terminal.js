import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FileSystem from './fileSystem';

const Terminal = ({ onClose }) => {
  const [history, setHistory] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fileSystem] = useState(new FileSystem());
  const terminalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    terminalRef.current.focus();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        const trimmedCommand = currentLine.trim();
        if (trimmedCommand) {
          setHistory(prev => [...prev, { type: 'input', content: trimmedCommand }]);
          processCommand(trimmedCommand);
          setCurrentLine('');
          setCursorPosition(0);
          setHistoryIndex(-1);
        }
        break;
      case 'ArrowLeft':
        if (cursorPosition > 0) {
          setCursorPosition(prev => prev - 1);
        }
        break;
      case 'ArrowRight':
        if (cursorPosition < currentLine.length) {
          setCursorPosition(prev => prev + 1);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          const historicalCommand = history[history.length - 1 - newIndex].content;
          setCurrentLine(historicalCommand);
          setCursorPosition(historicalCommand.length);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const historicalCommand = history[history.length - 1 - newIndex].content;
          setCurrentLine(historicalCommand);
          setCursorPosition(historicalCommand.length);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentLine('');
          setCursorPosition(0);
        }
        break;
      case 'Backspace':
        if (cursorPosition > 0) {
          setCurrentLine(prev => prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition));
          setCursorPosition(prev => prev - 1);
        }
        break;
      default:
        if (e.key.length === 1) {
          setCurrentLine(prev => prev.slice(0, cursorPosition) + e.key + prev.slice(cursorPosition));
          setCursorPosition(prev => prev + 1);
        }
    }
  };

  const processCommand = (command) => {
    const [cmd, ...args] = command.split(' ');
    let output = '';

    try {
      switch (cmd.toLowerCase()) {
        case 'mkdir':
          output = fileSystem.mkdir(args[0]);
          break;
        case 'touch':
          output = fileSystem.touch(args[0]);
          break;
        case 'ls':
          output = fileSystem.ls(args[0] || '.').join('\n');
          break;
        case 'cat':
          output = fileSystem.cat(args[0]);
          break;
        case 'cd':
          output = fileSystem.cd(args[0]);
          break;
        case 'pwd':
          output = fileSystem.pwd();
          break;
        case 'rm':
          output = fileSystem.rm(args[0]);
          break;
        case 'mv':
          output = fileSystem.mv(args[0], args[1]);
          break;
        case 'echo':
          output = args.join(' ');
          break;
        case 'clear':
          setHistory([]);
          return;
        case 'help':
          output = 'Available commands: mkdir, touch, ls, cat, cd, pwd, rm, mv, echo, clear, help';
          break;
        default:
          output = `Command not found: ${cmd}`;
      }
    } catch (error) {
      output = `Error: ${error.message}`;
    }

    setHistory(prev => [...prev, { type: 'output', content: output }]);
  };

  return (
    <div
      ref={terminalRef}
      className="flex flex-col h-full bg-black text-green-400 font-mono text-sm p-2 overflow-hidden focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div ref={contentRef} className="flex-grow overflow-y-auto scrollbar-hide">
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {item.type === 'input' ? (
              <div className="flex">
                <span className="mr-2">$</span>
                <span>{item.content}</span>
              </div>
            ) : (
              <div>{item.content}</div>
            )}
          </motion.div>
        ))}
        <div className="flex">
          <span className="mr-2">$</span>
          <span>{currentLine.slice(0, cursorPosition)}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            className="bg-green-400 w-2 h-5 inline-block mx-0.5"
          />
          <span>{currentLine.slice(cursorPosition)}</span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;