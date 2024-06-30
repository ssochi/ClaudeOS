import React from 'react';

const AIAssistantLogic = ({
  input,
  setInput,
  isLoading,
  setIsLoading,
  messages,
  setMessages,
  selectedModel,
  context,
  setContext,
  uploadedFiles,
  setUploadedFiles,
  scrollToBottom,
  handleRemoveFile // 添加这个 prop
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && uploadedFiles.length === 0) return;
    if (!selectedModel) return;

    if (uploadedFiles.length > 0) {
      const newContext = uploadedFiles.map(file => `File: ${file.name}\n\nContent:\n${file.content}`).join('\n\n');
      setContext(prevContext => {
        const updatedContext = prevContext ? `${prevContext}\n\n${newContext}` : newContext;
        sendMessage(updatedContext);
        return updatedContext;
      });
      setUploadedFiles([]);
    } else {
      sendMessage(context);
    }
  };

  const sendMessage = async (currentContext) => {
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
            { role: 'system', content: `Context: ${currentContext}` },
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
              return;
            }
            try {
              const jsonData = JSON.parse(line.slice(5));
              if (jsonData.choices && jsonData.choices[0].delta.content) {
                aiMessage.content += jsonData.choices[0].delta.content;
                setMessages(prevMessages => [
                  ...prevMessages.slice(0, -1),
                  { ...aiMessage }
                ]);
                scrollToBottom();
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

  return (
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
  );
};

export default AIAssistantLogic;