import React, { useState } from 'react';
import api from './axiosConfig';

interface ChatbotProps {
  onDataQuery: (query: string) => void; // This prop triggers a query to update data
}

const Chatbot: React.FC<ChatbotProps> = ({ onDataQuery }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // To handle loading state

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setLoading(true); // Show loading state

    // Add user's message to the chat
    setMessages([...messages, { sender: 'user', text: input }]);

    try {
      const token = localStorage.getItem('access_token');  // Fetch the token

      const response = await api.post(
        '/chatbot/query/',  // Correct URL here
        { query: input },
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // Pass the token in headers
          },
        }
      );

      // Add chatbot's response to the chat
      setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: response.data.response }]);

      // Clear the input field
      setInput('');
    } catch (error) {
      console.error('Error querying chatbot:', error);
      setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: 'Sorry, there was an issue.' }]);
    } finally {
      setLoading(false); // Hide loading state
    }
  };


  return (
    <div>
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-1 rounded-full shadow-lg"
        onClick={toggleChatbot}
      >
        <img src='./img/bot.png' className='w-10 h-10 rounded-full'></img>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 bg-white border border-gray-300 shadow-lg w-80 h-96 p-4 flex flex-col rounded-2xl">
          <div className="flex-1 overflow-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
                <p className={msg.sender === 'user' ? 'bg-blue-200 p-2 rounded-lg inline-block' : 'bg-gray-200 p-2 rounded-lg inline-block'}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border flex-1 p-2"
              placeholder="Ask something..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
