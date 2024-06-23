import React, { useState, useRef } from 'react';

const SafariApp = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org'); // 默认网址
  const [inputUrl, setInputUrl] = useState(url);
  const [history, setHistory] = useState([url]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef(null);

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
  };

  const handleGoClick = () => {
    navigateToUrl(inputUrl);
  };

  const navigateToUrl = (newUrl) => {
    setIsLoading(true);
    setUrl(newUrl);
    setInputUrl(newUrl);
    const newHistory = [...history];
    newHistory.splice(currentIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const handleBackClick = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const handleForwardClick = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    alert('Unable to load the requested page. This might be due to security restrictions set by the website.');
    setUrl('about:blank');
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-none p-2 bg-gray-200 flex items-center space-x-2">
        <div className="flex space-x-2">
          <button
            onClick={handleBackClick}
            disabled={currentIndex === 0}
            className={`p-2 ${currentIndex === 0 ? 'text-gray-400' : 'text-black'} rounded-l`}
          >
            ◀
          </button>
          <button
            onClick={handleForwardClick}
            disabled={currentIndex === history.length - 1}
            className={`p-2 ${currentIndex === history.length - 1 ? 'text-gray-400' : 'text-black'}`}
          >
            ▶
          </button>
        </div>
        <div className="flex flex-grow items-center bg-white rounded border border-gray-300">
          <img src="https://www.apple.com/favicon.ico" alt="Site Icon" className="h-6 w-6 ml-2" />
          <input
            type="text"
            value={inputUrl}
            onChange={handleInputChange}
            className="flex-grow p-2 bg-transparent outline-none"
            placeholder="Enter URL"
          />
          <button onClick={handleGoClick} className="p-2 bg-blue-500 text-white rounded-r">
            Go
          </button>
        </div>
        <div className="flex items-center">
          {isLoading && <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <iframe
          ref={iframeRef}
          src={url}
          title="Safari Browser"
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        ></iframe>
      </div>
    </div>
  );
};

export default SafariApp;
