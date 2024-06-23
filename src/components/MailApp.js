import React, { useState } from 'react';

const MailApp = () => {
  const [emails, setEmails] = useState([
    { id: 1, sender: 'John Doe', subject: 'Meeting Reminder', content: 'Don\'t forget about our meeting tomorrow at 10 AM.' },
    { id: 2, sender: 'Jane Smith', subject: 'Project Update', content: 'The project is progressing well. Here are the latest updates...' }
  ]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeMode, setComposeMode] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const openEmail = (email) => {
    setSelectedEmail(email);
  };

  const closeEmail = () => {
    setSelectedEmail(null);
  };

  const toggleCompose = () => {
    setComposeMode(!composeMode);
    setNewEmail({ to: '', subject: '', content: '' });
  };

  const saveDraft = () => {
    setDrafts([...drafts, { ...newEmail, id: drafts.length + 1 }]);
    toggleCompose();
  };

  const sendEmail = () => {
    setEmails([...emails, { id: emails.length + 1, sender: 'Me', subject: newEmail.subject, content: newEmail.content }]);
    toggleCompose();
  };

  const deleteEmail = (id) => {
    setEmails(emails.filter(email => email.id !== id));
    closeEmail();
  };

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    email.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-none p-2 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold">Mail</h1>
        <div className="flex">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded p-1 border border-gray-300"
          />
          <button onClick={toggleCompose} className="ml-2 rounded bg-blue-500 text-white px-3 py-1">Compose</button>
        </div>
      </div>
      <div className="flex flex-row h-full">
        <div className="flex-none w-1/3 border-r border-gray-200 p-2">
          <h2 className="text-lg font-bold mb-2">Inbox</h2>
          <ul>
            {filteredEmails.map(email => (
              <li key={email.id} onClick={() => openEmail(email)} className="cursor-pointer mb-1 p-2 hover:bg-gray-100">
                <strong>{email.sender}</strong><br />
                <span>{email.subject}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 p-2">
          {composeMode ? (
            <div>
              <h2 className="text-lg font-bold">Compose New Email</h2>
              <input
                type="text"
                placeholder="To"
                value={newEmail.to}
                onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                className="w-full mb-2 p-1 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Subject"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                className="w-full mb-2 p-1 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Content"
                value={newEmail.content}
                onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                className="w-full mb-2 p-1 border border-gray-300 rounded"
                rows="10"
              />
              <button onClick={sendEmail} className="rounded bg-green-500 text-white px-3 py-1 mr-2">Send</button>
              <button onClick={saveDraft} className="rounded bg-yellow-500 text-white px-3 py-1 mr-2">Save as Draft</button>
              <button onClick={toggleCompose} className="rounded bg-gray-500 text-white px-3 py-1">Cancel</button>
            </div>
          ) : selectedEmail ? (
            <div>
              <h2 className="text-lg font-bold">{selectedEmail.subject}</h2>
              <p><strong>From:</strong> {selectedEmail.sender}</p>
              <p>{selectedEmail.content}</p>
              <button onClick={() => deleteEmail(selectedEmail.id)} className="mt-2 rounded bg-red-500 text-white px-3 py-1 mr-2">Delete</button>
              <button onClick={closeEmail} className="mt-2 rounded bg-blue-500 text-white px-3 py-1">Back to Inbox</button>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold">Select an email to view its contents</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MailApp;
