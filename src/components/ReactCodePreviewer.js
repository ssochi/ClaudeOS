import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';

// 预定义的模块
const modules = {
  react: React,
  'lucide-react': { X },
  // 可以添加更多预定义的模块
};

const ReactCodePreviewer = ({ onClose }) => {
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('code');

  const renderPreview = useCallback(() => {
    try {
      // 创建一个模拟的 import 函数
      const importModule = (moduleName) => {
        if (modules[moduleName]) {
          return modules[moduleName];
        }
        throw new Error(`Module "${moduleName}" not found`);
      };

      // 将代码包装在一个异步函数中以支持顶级 await
      const wrappedCode = `
        (async function() {
          const imports = {};
          ${code.replace(/import\s+(\{[^}]+\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g, 
            (match, importClause, moduleName) => {
              return `imports['${moduleName}'] = await importModule('${moduleName}');
                      const ${importClause} = imports['${moduleName}'];`;
            }
          )}
          return eval(${JSON.stringify(code)});
        })()
      `;

      // 执行代码并获取组件
      const Component = eval(wrappedCode);

      // 渲染组件
      return <Component />;
    } catch (error) {
      return <div className="text-red-500">Error: {error.message}</div>;
    }
  }, [code]);

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden">
      <div className="bg-gray-200 p-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold">React Code Previewer</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-grow flex flex-col">
        <div className="bg-gray-200 p-1 flex">
          <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'code' ? 'bg-white' : 'bg-gray-300'}`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ml-2 ${activeTab === 'preview' ? 'bg-white' : 'bg-gray-300'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
        
        <div className="flex-grow p-4 bg-white">
          {activeTab === 'code' ? (
            <textarea
              className="w-full h-full p-2 font-mono text-sm border rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your React component code here..."
            />
          ) : (
            <div className="border rounded p-4 h-full overflow-auto">
              {renderPreview()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactCodePreviewer;