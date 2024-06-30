import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileDropZone = ({ onFileUpload, children }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const filesWithContent = acceptedFiles.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        resolve({
          name: file.name,
          content: reader.result
        });
      };
      reader.readAsText(file);
    }));

    Promise.all(filesWithContent).then(files => {
      onFileUpload(files);
    });
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'text/*',
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className="relative flex-grow overflow-auto"
    >
      <input {...getInputProps()} />
      {children}
      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-100 bg-opacity-75 z-50">
          <p className="text-blue-500 font-bold text-xl">Drop your files here</p>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;