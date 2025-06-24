'use client';

import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Send, LogOut, HelpCircle, X, User} from 'lucide-react';
import UserInfoPopup from './UserInfoPopup';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Lấy thông tin user từ localStorage token(HS256), nếu không có hoặc hết hạn thì điều hướng về trang login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }else{
      // Thêm tin nhắn bot mặc định khi mở giao diện
      setMessages([{
        id: uuidv4(),
        text: `Xin chào! 👋\n\nTôi là trợ lý ảo, sẵn sàng hỗ trợ bạn với 3 chức năng chính:\n\n1. **Tạo công việc** – Bạn chỉ cần mô tả ngắn gọn công việc cần làm và địa chỉ thực hiện. Tôi sẽ giúp bạn tạo job phù hợp.\n2. **Gửi khiếu nại** – Nếu có vấn đề với công việc đã hoàn thành, hãy cho tôi biết. Tôi sẽ gửi khiếu nại giúp bạn.\n3. **Tạo yêu cầu hỗ trợ** – Khi cần trợ giúp bất kỳ vấn đề nào khác, bạn chỉ cần mô tả. Tôi sẽ xử lý ngay.\n\n💡 Ví dụ: *"Tôi cần thợ sửa điện tại nhà vào chiều mai."*\n\nBạn cần hỗ trợ gì hôm nay?`,
        sender: 'bot'
      }]);
    }
  }, []);

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

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
          authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, token: localStorage.getItem('token') }),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative backdrop-blur-sm border-b border-blue-400/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-400/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                </div>
                <h1 className="text-xl font-semibold text-white">AI Agent</h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsUserInfoOpen(true)}
                  className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 backdrop-blur-sm border border-blue-400/20"
                  title="Thông tin cá nhân"
                >
                  <User size={20} />
                </button>
                <button
                  onClick={() => setIsHelpOpen(!isHelpOpen)}
                  className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 backdrop-blur-sm border border-blue-400/20"
                  title="Hướng dẫn sử dụng"
                >
                  <HelpCircle size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200 backdrop-blur-sm border border-red-400/20"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-12">
                <div className="inline-flex p-4 bg-blue-500/10 rounded-full backdrop-blur-sm border border-blue-400/20 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                </div>
                <p className="text-blue-200 text-lg mb-2">Chào mừng bạn đến với AI Agent!</p>
                <p className="text-blue-300/70">Hãy bắt đầu cuộc trò chuyện bằng cách gửi một tin nhắn.</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-slate-800/60 text-blue-100 shadow-lg backdrop-blur-sm border border-slate-700/50'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/60 text-blue-100 shadow-lg backdrop-blur-sm border border-slate-700/50 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-blue-300">Đang trả lời...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-700/50 bg-slate-900/20 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-3">
                <input
                  autoFocus
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-lg"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Sidebar */}
        <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-lg border-l border-slate-700/50 transform transition-transform duration-300 ease-in-out z-50 ${
          isHelpOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Hướng dẫn sử dụng</h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto h-full">
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                <h4 className="text-blue-300 font-medium mb-3">Đang cập nhật...</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Tính năng hướng dẫn sử dụng chi tiết đang được phát triển. 
                  Vui lòng quay lại sau để xem các câu lệnh và mẹo sử dụng chatbot hiệu quả nhất.
                </p>
              </div>
              
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
                <h4 className="text-blue-300 font-medium mb-3">Mẹo sử dụng cơ bản</h4>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>• Hãy nói chuyện tự nhiên với AI Agent</li>
                  <li>• Nhấn Enter để gửi tin nhắn</li>
                  <li>• Sử dụng ngôn ngữ rõ ràng và cụ thể</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isHelpOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsHelpOpen(false)}
          />
        )}
        {/* User Info Popup */}
        {isUserInfoOpen && (
          <UserInfoPopup onClose={() => setIsUserInfoOpen(false)} />
        )}

      </div>
    </div>
  );
}