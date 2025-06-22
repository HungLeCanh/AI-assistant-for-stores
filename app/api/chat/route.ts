import { NextRequest, NextResponse } from 'next/server';
import { decode } from 'punycode';

export async function POST(request: NextRequest) {
  try {
    // Lấy message từ request body
    const { message, token } = await request.json();

    // Kiểm tra xem token có hợp lệ không
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' }, 
        { status: 401 }
      );
    }
    // Giải mã token để lấy userId
    let tempSessionId, tempUserName, tempEmail;// biến này dùng để lưu trữ ngữ cảnh chat của người dùng và chatbot trên n8n nha
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      tempSessionId = decoded.userId; // Giả sử userId được lưu trong token
      tempUserName = decoded.username; // Giả sử username được lưu trong token
      tempEmail = decoded.email; // Giả sử email được lưu trong token
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' + ' - ' + error }, 
        { status: 401 }
      );
    }
    
    // Kiểm tra xem message có tồn tại không
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' }, 
        { status: 400 }
      );
    }

    const n8nURL = process.env.WEBHOOK_URL || 'https://n8n.portal-demo.online';


    // Gọi API webhook với message
    const webhookUrl = `${n8nURL}?message=${encodeURIComponent(message)}&sessionId=${encodeURIComponent(tempSessionId)}&username=${encodeURIComponent(tempUserName)}&email=${encodeURIComponent(tempEmail)}`;
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Kiểm tra xem response có thành công không
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Lấy response text trước
    const responseText = await response.text();
    
    // Xử lý response từ webhook
    let botMessage = '';
    
    try {
      // Thử parse JSON trước
      const data = JSON.parse(responseText);
      
      if (typeof data === 'string') {
        botMessage = data;
      } else if (data.output) {
        botMessage = data.output;
      } else if (data.botMessage) {
        botMessage = data.botMessage;
      } else {
        botMessage = responseText;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (jsonError) {
      // Nếu không phải JSON, sử dụng text trực tiếp
      botMessage = responseText;
    }
    
    // Làm sạch message (loại bỏ \n và khoảng trắng thừa)
    botMessage = botMessage.replace(/\\n/g, '\n').trim();
    
    // Trả về botMessage trong format mong muốn
    return NextResponse.json({
      botMessage: botMessage,
      success: true
    });

  } catch (error) {
    console.error('Error calling webhook:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from chatbot',
        botMessage: 'Sorry, there was an error processing your request.',
        success: false
      }, 
      { status: 500 }
    );
  }
}