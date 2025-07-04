import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your interview coach. I can help you prepare for interviews, practice answers, give feedback, or discuss career advice. What would you like to work on today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Prepare chat history for API (excluding system message)
      const chatHistory = newMessages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await axios.post('/api/chat', {
        message: userMessage,
        history: chatHistory.slice(0, -1) // Don't include the current message
      });

      // Add assistant response
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: response.data.response 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 Interview Coach Chat</h2>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="chat-input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about interview preparation..."
            className="chat-input"
            rows="1"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              '🚀'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
