'use client';

import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Send } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // lay thông tin user từ localStorage token(HS256), neu không có hoặc hết hạn thì điều hướng về trang login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Điều hướng về trang đăng nhập nếu không có token
    }
  }, []);

  // in ra thong tin payload của token
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     try {
  //       const payload = JSON.parse(atob(token.split('.')[1]));
  //       console.log('Token Payload:', payload);
  //     } catch (error) {
  //       console.error('Invalid token format:', error);
  //     }
  //   }
  // }, []);

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Thêm tin nhắn user vào danh sách
    const newUserMessage: Message = {
      id: uuidv4(),
      text: userMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Gọi API chatbot
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, token: localStorage.getItem('token')})
      });

      const data = await response.json();

      if (data.success && data.botMessage) {
        // Thêm tin nhắn bot vào danh sách
        const newBotMessage: Message = {
          id: uuidv4(),
          text: data.botMessage,
          sender: 'bot'
        };

        setMessages(prev => [...prev, newBotMessage]);
      } else {
        // Xử lý lỗi
        const errorMessage: Message = {
          id: uuidv4(),
          text: data.botMessage || 'Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn.',
          sender: 'bot'
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: uuidv4(),
        text: 'Không thể kết nối đến chatbot. Vui lòng thử lại sau.',
        sender: 'bot'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý nhấn Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-800">AI AGENT</h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Chào bạn! Hãy bắt đầu cuộc trò chuyện bằng cách gửi một tin nhắn.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800 shadow-sm border'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-sm border max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-500">Đang trả lời...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            autoFocus
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn của bạn..."
            className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}