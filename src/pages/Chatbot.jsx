import React, { useState } from 'react';

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { text: message, sender: 'user' };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5003/municipal-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.response || `HTTP error! status: ${response.status}`);
      }

      const botResponse = await response.json();
      setChatHistory(prevHistory => [
        ...prevHistory,
        { text: botResponse.response, sender: 'bot', isMunicipal: botResponse.is_municipal, nextSteps: botResponse.next_steps, contact: botResponse.contact }
      ]);

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Could not connect to the chatbot. Please try again later.');
      setChatHistory(prevHistory => [
        ...prevHistory,
        { text: 'Error: Could not get response.', sender: 'bot', isError: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Municipal Chatbot</h1>
      <div className="border rounded p-4 h-96 overflow-y-auto mb-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </span>
            {msg.sender === 'bot' && msg.isMunicipal !== undefined && (
              <div className="text-sm text-gray-600 mt-1">
                <p>Is Municipal: {msg.isMunicipal ? 'Yes' : 'No'}</p>
                {msg.nextSteps && msg.nextSteps.length > 0 && (
                  <p>Next Steps: {msg.nextSteps.join(', ')}</p>
                )}
                {msg.contact && <p>Contact: {msg.contact}</p>}
              </div>
            )}
             {msg.sender === 'bot' && msg.isError && (
              <div className="text-sm text-red-600 mt-1">{msg.text}</div>
            )}
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-500">Typing...</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border rounded-l p-2"
          placeholder="Ask about municipal services..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
} 