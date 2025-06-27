import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { LRUCache } from 'lru-cache';

const rateLimiter = new LRUCache<string, { count: number; timestamp: number }>({
  max: 500, // số người dùng tối đa được lưu trong bộ nhớ cache
  ttl: 60 * 1000, // TTL mỗi entry là 60 giây
});

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    let { message, token } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const userKey = user?.userId || 'anonymous'; // key phân biệt người dùng
    const now = Date.now();
    const entry = rateLimiter.get(userKey);

    if (entry) {
      const withinWindow = now - entry.timestamp < 60_000; // trong 1 phút
      if (withinWindow && entry.count >= 10) {
        return NextResponse.json(
          {
            success: false,
            botMessage: 'Bạn đang gửi quá nhanh. Vui lòng chờ một chút rồi thử lại.',
          },
          { status: 429 }
        );
      }

      rateLimiter.set(userKey, {
        count: withinWindow ? entry.count + 1 : 1,
        timestamp: now,
      });
    } else {
      rateLimiter.set(userKey, { count: 1, timestamp: now });
    }

    // tạm thời hardcode token
    token = ""
    // --- Gửi tới N8N ---
    const n8nURL = process.env.WEBHOOK_URL || 'https://n8n.portal-demo.online';
    const webhookUrl = `${n8nURL}?message=${encodeURIComponent(message)}`;

    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const responseText = await response.text();
    let botMessage = '';

    try {
      const data = JSON.parse(responseText);
      if (typeof data === 'string') botMessage = data;
      else if (data.output) botMessage = data.output;
      else if (data.botMessage) botMessage = data.botMessage;
      else botMessage = responseText;
    } catch {
      botMessage = responseText;
    }

    botMessage = botMessage.replace(/\\n/g, '\n').trim();

    return NextResponse.json({
      botMessage,
      success: true,
    });

  } catch (error) {
    console.error('Error calling webhook:', error);

    return NextResponse.json(
      {
        error: 'Failed to get response from chatbot',
        botMessage: 'Sorry, there was an error processing your request.',
        success: false,
      },
      { status: 500 }
    );
  }
}
