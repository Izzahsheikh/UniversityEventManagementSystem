import { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I am EventBot. I can help you browse events, register, or answer questions.", sender: "bot" }
  ]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { text: getBotReply(input), sender: 'bot' }]);
    }, 1000);
  };

  const getBotReply = (text) => {
    const msg = text.toLowerCase();
    if (msg.includes('event'))        return 'There are several upcoming events! Go to Browse Events to see them all.';
    if (msg.includes('register'))     return 'You can register for any event from the Browse Events section!';
    if (msg.includes('feedback'))     return 'You can submit feedback from the Feedback section in your dashboard.';
    if (msg.includes('help'))         return 'I can help you with events, registrations, and feedback. Just ask!';
    return "I'm here to help! Try asking about events or registrations.";
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">

          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <div className="chatbot-title">EventBot</div>
                <div className="chatbot-status">● Online</div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="chatbot-msgs">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-msg ${msg.sender}`}>
                <div className="chatbot-msg-bubble">{msg.text}</div>
              </div>
            ))}

            {/* Typing Animation */}
            {isTyping && (
              <div className="chatbot-typing">
                <div className="chatbot-typing-dots">
                  <div className="chatbot-dot" />
                  <div className="chatbot-dot" />
                  <div className="chatbot-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Buttons */}
          <div className="chatbot-quick-btns">
            {['Browse events', 'My registrations', 'Help'].map(label => (
              <button key={label} className="chatbot-quick-btn" onClick={() => setInput(label)}>
                {label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chatbot-input-row">
            <input
              className="chatbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
            />
            <button className="chatbot-send-btn" onClick={sendMessage}>➤</button>
          </div>

        </div>
      )}

      {/* Floating Bubble */}
      <div className="chatbot-bubble" onClick={() => setIsOpen(!isOpen)}>
        <span>{isOpen ? '✕' : '🤖'}</span>
      </div>
    </>
  );
};

export default Chatbot;