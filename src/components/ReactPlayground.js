import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as monaco from 'monaco-editor';
import * as Babel from '@babel/standalone';
import * as HeroIcons from '@heroicons/react/24/solid';

const ReactPlayground = () => {
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const monacoEditor = monaco.editor.create(document.getElementById('codeEditor'), {
      value: '',
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false }
    });

    setEditor(monacoEditor);

    return () => {
      monacoEditor.dispose();
    };
  }, []);

  const handleRunCode = useCallback(() => {
    if (!editor) return;

    let currentCode = editor.getValue();
    setCode(currentCode);

    try {
      // Clear previous error
      setError(null);

      // Remove import statements but keep track of what's imported
      const imports = {};
      currentCode = currentCode.replace(/import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"][^'"]+['"]/g, (match) => {
        const importName = match.match(/import\s+(\w+|\*\s+as\s+\w+|\{[^}]+\})/)[1];
        const fromModule = match.match(/from\s+['"]([^'"]+)['"]/)[1];
        imports[importName] = fromModule;
        return '';
      });

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

      // Map of dependencies from package.json
      const dependencies = {
        'react': React,
        'react-dom': require('react-dom'),
        'framer-motion': { motion },
        '@heroicons/react/24/solid': HeroIcons,
        // Add other dependencies as needed
      };

      // Wrap the transformed code
      const wrappedCode = `
        (function() {
          const React = window.React;
          const { useState, useEffect, useCallback } = React;
          const { motion } = window.FramerMotion;
          const HeroIcons = window.HeroIcons;

          // Simulate import behavior
          ${Object.entries(imports).map(([name, module]) => `const ${name} = require('${module}');`).join('\n')}

          function require(module) {
            switch(module) {
              ${Object.entries(dependencies).map(([name, value]) => `case '${name}': return ${JSON.stringify(value)};`).join('\n')}
              default:
                throw new Error(\`Module not found: \${module}\`);
            }
          }

          ${transformedCode}

          return ${exportedComponent || 'null'};
        })()
      `;

      // Evaluate the code
      const Component = eval(wrappedCode);

      // Set the preview
      setPreview(React.createElement(Component));
    } catch (err) {
      console.error(err);
      setError(err.toString());
    }
  }, [editor]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex">
        <div id="codeEditor" className="w-1/2 h-full"></div>
        <div className="w-1/2 h-full p-4 bg-gray-100 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Preview</h2>
          {error ? (
            <div className="text-red-500 whitespace-pre-wrap">{error}</div>
          ) : (
            <div className="border border-gray-300 p-4 bg-white rounded">
              {preview}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-gray-200 flex justify-center">
        <button 
          onClick={handleRunCode}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Run Code
        </button>
      </div>
    </div>
  );
};

export default ReactPlayground;
