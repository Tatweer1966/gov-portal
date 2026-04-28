'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AdvancedChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [tenantName, setTenantName] = useState<string>('المحافظة');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load tenant name and set initial message
  useEffect(() => {
    fetch('/api/tenant/theme')
      .then(res => res.json())
      .then(data => {
        const name = data.tenantName || 'المحافظة';
        setTenantName(name);
        setMessages([
          {
            id: '1',
            text: `مرحباً! أنا المساعد الذكي للبوابة الحكومية لـ ${name}. اسألني عن الخدمات، التصاريح، المراكز التكنولوجية، وأي شيء يخص ${name}.`,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      })
      .catch(() => {
        // Fallback if theme API fails
        setMessages([
          {
            id: '1',
            text: 'مرحباً! أنا المساعد الذكي للبوابة الحكومية. اسألني عن الخدمات، التصاريح، المراكز التكنولوجية، وأي شيء يخص المحافظة.',
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, userId, sessionId, tenant: tenantName }),
      });
      const data = await res.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'عذراً، حدث خطأ.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: 'حدث خطأ في الاتصال.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition z-50"
      >
        <span className="text-2xl">🤖</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border">
          <div className="bg-primary text-white p-4 rounded-t-xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold">المساعد الذكي</h3>
              <p className="text-xs opacity-90">متاح 24/7</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
            />
            <button
              onClick={sendMessage}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              إرسال
            </button>
          </div>
        </div>
      )}
    </>
  );
}