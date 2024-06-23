import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

const VSCodeApp = ({ onClose }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [fileName, setFileName] = useState('untitled.js');
  const [language, setLanguage] = useState('typescript');

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: '// Type your code here\n',
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true }
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, [language]);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    monaco.editor.setModelLanguage(editorRef.current.getModel(), newLang);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white rounded-t-lg overflow-hidden">
      {/* Menu bar */}
      <div className="flex items-center bg-[#3c3c3c] p-2 text-sm">
        <button className="px-2 hover:bg-[#505050]">File</button>
        <button className="px-2 hover:bg-[#505050]">Edit</button>
        <button className="px-2 hover:bg-[#505050]">View</button>
        <select 
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-[#3c3c3c] ml-4"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (file explorer) */}
        <div className="w-48 bg-[#252526] p-2 overflow-y-auto">
          <div className="text-sm font-bold mb-2">EXPLORER</div>
          <div className="text-sm">{fileName}</div>
        </div>

        {/* Editor */}
        <div ref={containerRef} className="flex-grow" />
      </div>

      {/* Status bar */}
      <div className="flex justify-between items-center bg-[#007acc] text-white text-xs p-1">
        <div>{fileName}</div>
        <div>{language}</div>
      </div>
    </div>
  );
};

export default VSCodeApp;