import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'
import { apiSendChatMessage } from '../api'

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me anything about upcoming university events.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }])
    setIsLoading(true)

    try {
      const data = await apiSendChatMessage(userMessage)
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I couldn\'t process that request right now.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-1/3 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-slate-900 border border-slate-800 w-80 sm:w-96 h-[450px] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 absolute bottom-0 right-0">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-white font-semibold text-sm">Campus AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col bg-slate-950">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white self-end rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 self-start rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-slate-800 text-slate-200 p-3 rounded-xl rounded-tl-none text-sm self-start flex items-center gap-2 max-w-[75%]">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about events..."
              className="flex-1 bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}