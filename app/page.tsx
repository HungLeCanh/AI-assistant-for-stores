'use client';
import React from 'react';
import { Bot, Users, Wrench, MessageSquare, Shield, CheckCircle, ArrowRight, Star, Zap } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-blue-500" />,
      title: "Chatbot Thông minh",
      description: "Tự động tạo và quản lý công việc thông qua trò chuyện tự nhiên với AI"
    },
    {
      icon: <Wrench className="w-8 h-8 text-green-500" />,
      title: "Quản lý Công việc",
      description: "Theo dõi trạng thái công việc từ tiếp nhận đến hoàn thành một cách dễ dàng"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
      title: "Khiếu nại & Hỗ trợ",
      description: "Gửi khiếu nại công việc và yêu cầu hỗ trợ kỹ thuật nhanh chóng"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Bảo mật Cao",
      description: "Xác thực an toàn với access token, bảo vệ thông tin cá nhân"
    }
  ];

  const workCategories = [
    "Sửa chữa nhà cửa",
    "Chăm sóc sân vườn", 
    "Điện nước",
    "Vệ sinh",
    "Bảo dưỡng thiết bị",
    "Và nhiều hơn nữa..."
  ];

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = () => {
    window.location.href = '/register';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-38 ">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-400/30">
                <Bot className="w-16 h-16 text-blue-400" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Hệ thống
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Chatbot{" "}
              </span>
              Quản lý
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Hệ thống AI hỗ trợ tiếp nhận công việc và quản lý công việc, khiếu nại, yêu cầu hỗ trợ thông qua AI chatbot thông minh. 
              Tối ưu hóa quy trình làm việc của khách hàng.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={handleRegister}
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 min-w-48"
              >
                Đăng ký ngay
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={handleLogin}
                className="group px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 backdrop-blur-sm border border-white/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-48"
              >
                Đăng nhập
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tính năng
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {" "}Nổi bật
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hệ thống được thiết kế để đáp ứng mọi nhu cầu quản lý công việc và hỗ trợ khách hàng
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105 h-full">
                  <div className="mb-6 flex justify-center">
                    <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Danh mục
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {" "}Công việc
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Hệ thống hỗ trợ nhiều loại công việc khác nhau, từ sửa chữa nhà cửa đến bảo dưỡng thiết bị
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workCategories.map((category, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white font-medium">{category}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-500/20 rounded-xl">
                    <Zap className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="text-white font-semibold">Tạo công việc tự động</h4>
                      <p className="text-gray-300 text-sm">AI phân tích và tạo công việc theo yêu cầu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-green-500/20 rounded-xl">
                    <Star className="w-6 h-6 text-green-400" />
                    <div>
                      <h4 className="text-white font-semibold">Theo dõi trạng thái</h4>
                      <p className="text-gray-300 text-sm">Quản lý từ tiếp nhận đến hoàn thành</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-purple-500/20 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                    <div>
                      <h4 className="text-white font-semibold">Hỗ trợ 24/7</h4>
                      <p className="text-gray-300 text-sm">Chatbot luôn sẵn sàng hỗ trợ bạn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Cách thức
              <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                {" "}Hoạt động
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Đăng nhập An toàn</h3>
              <p className="text-gray-300">Xác thực bằng access token để bảo vệ thông tin cá nhân</p>
            </div>
            
            <div className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Trò chuyện với AI</h3>
              <p className="text-gray-300">Mô tả công việc cần làm bằng ngôn ngữ tự nhiên</p>
            </div>
            
            <div className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Quản lý & Theo dõi</h3>
              <p className="text-gray-300">Theo dõi tiến độ và quản lý các yêu cầu hỗ trợ</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Tham gia cùng hệ thống quản lý công việc thông minh và tối ưu hóa quy trình làm việc của bạn ngay hôm nay!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={handleRegister}
                className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-3"
              >
                Tạo tài khoản miễn phí
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={handleLogin}
                className="px-10 py-5 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 backdrop-blur-sm border border-white/30 transform hover:scale-105 transition-all duration-300"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Bot className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-400">
            © 2025 Hệ thống Chatbot Quản lý Công việc. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
}