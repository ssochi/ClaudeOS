import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as monaco from 'monaco-editor';
import * as Babel from '@babel/standalone';
import * as HeroIcons from '@heroicons/react/24/solid';

const Header = ({ isPreviewMode, onToggleView }) => (
  <div className="flex items-center justify-between bg-gray-800 text-white p-2">
    <div className="flex items-center">
      <span className="font-bold mr-4">Preview Demo.js</span>
      <button
        onClick={onToggleView}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded flex items-center"
      >
        {isPreviewMode ? (
          <>
            <HeroIcons.CodeBracketIcon className="w-4 h-4 mr-1" />
            Code
          </>
        ) : (
          <>
            <HeroIcons.EyeIcon className="w-4 h-4 mr-1" />
            Preview
          </>
        )}
      </button>
    </div>
    <div className="flex">
      <button className="text-gray-300 hover:text-white mx-2">
        <HeroIcons.ArrowPathIcon className="w-5 h-5" />
      </button>
      <button className="text-gray-300 hover:text-white mx-2">
        <HeroIcons.XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const ReactPlayground = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!isPreviewMode) {
      const monacoEditor = monaco.editor.create(document.getElementById('codeEditor'), {
        value: code,
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false }
      });

      setEditor(monacoEditor);

      return () => {
        monacoEditor.dispose();
      };
    }
  }, [isPreviewMode, code]);

  const handleRunCode = useCallback(() => {
    if (!editor) return;

    let currentCode = editor.getValue();
    setCode(currentCode);

    try {
      // Clear previous error
      setError(null);

      // Remove all lines starting with 'import' and ending with ';'
      currentCode = currentCode.split('\n').filter(line => !line.trim().startsWith('import') || !line.trim().endsWith(';')).join('\n');

      // Remove export statements and identify the exported component
      let exportedComponent = null;
      currentCode = currentCode.replace(/export\s+(?:default\s+)?(\w+);?/g, (match, name) => {
        exportedComponent = name;
        return '';
      });

      // Transform JSX to JavaScript
      const transformedCode = Babel.transform(currentCode, {
        presets: ['react'],
        filename: 'component.jsx'
      }).code;

      // Wrap the transformed code
      const wrappedCode = `
        (function() {
          const React = window.React;
          const { useState, useEffect, useCallback, useRef } = React;
          const { motion } = window.FramerMotion;
          const HeroIcons = window.HeroIcons;


          ${transformedCode}

          return ${exportedComponent || 'null'};
        })()
      `;

      // Evaluate the code
      const Component = eval(wrappedCode);

      // Set the preview
      setPreview(React.createElement(Component));
      setIsPreviewMode(true);
    } catch (err) {
      console.error(err);
      setError(err.toString());
    }
  }, [editor]);

  const handleToggleView = () => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
    } else {
      handleRunCode();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header isPreviewMode={isPreviewMode} onToggleView={handleToggleView} />
      <div className="flex-grow">
        {isPreviewMode ? (
          <div className="h-full p-4 bg-gray-100 overflow-auto">
            {error ? (
              <div className="text-red-500 whitespace-pre-wrap">{error}</div>
            ) : (
              <div className="border border-gray-300 p-4 bg-white rounded h-full">
                {preview}
              </div>
            )}
          </div>
        ) : (
          <div id="codeEditor" className="h-full"></div>
        )}
      </div>
    </div>
  );
};

export default ReactPlayground;