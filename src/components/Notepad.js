import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotesApp = ({ onClose }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
    if (savedNotes.length > 0) {
      setSelectedNoteId(savedNotes[0].id);
    }
  }, []);

  const saveNote = (updatedNote) => {
    const updatedNotes = notes.map(note =>
      note.id === updatedNote.id ? { ...updatedNote, lastModified: Date.now() } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const addNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      createdAt: Date.now(),
      lastModified: Date.now()
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setSelectedNoteId(newNote.id);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    if (selectedNoteId === id) {
      setSelectedNoteId(updatedNotes[0]?.id || null);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <div className="flex h-full bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-gray-100 border-r border-gray-200 flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">Notes</h2>
          <button 
            className="text-blue-500 hover:text-blue-600"
            onClick={addNewNote}
          >
            + New Note
          </button>
        </div>
        <div className="px-4 pb-4">
          <input 
            type="text"
            placeholder="Search notes..."
            className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-grow overflow-y-auto">
          <AnimatePresence>
            {filteredNotes.map(note => (
              <motion.div 
                key={note.id} 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-4 cursor-pointer border-l-4 ${selectedNoteId === note.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-200'}`}
                onClick={() => setSelectedNoteId(note.id)}
              >
                <h3 className="font-medium text-gray-800 truncate">{note.title}</h3>
                <p className="text-sm text-gray-600 truncate mt-1">{note.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(note.lastModified).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-grow flex flex-col bg-white">
        {selectedNote ? (
          <>
            <div className="border-b border-gray-200 p-4">
              <input 
                type="text"
                className="text-2xl font-semibold w-full bg-transparent border-none focus:outline-none"
                value={selectedNote.title}
                onChange={(e) => saveNote({ ...selectedNote, title: e.target.value })}
              />
            </div>
            <textarea 
              className="flex-grow p-4 text-gray-800 bg-transparent resize-none focus:outline-none"
              value={selectedNote.content}
              onChange={(e) => saveNote({ ...selectedNote, content: e.target.value })}
              placeholder="Start typing here..."
            />
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a note or create a new one
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button 
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          onClick={() => selectedNoteId && deleteNote(selectedNoteId)}
        >
          🗑️
        </button>
        <button 
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          onClick={onClose}
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default NotesApp;