// pages/api/webhook.js
import { NextResponse } from 'next/server';

// Helper function to answer callback query
async function answerCallbackQuery(callbackQueryId, url) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
  
  const response = await fetch(TELEGRAM_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      url: url
    }),
  });
  
  return response.json();
}

// Helper function to send game
async function sendGame(chatId, gameShortName) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendGame`;
  
  const response = await fetch(TELEGRAM_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      game_short_name: gameShortName
    }),
  });
  
  return response.json();
}

// API route handler
export async function POST(req) {
  try {
    const body = await req.json();

    // Handle game callback query
    if (body.callback_query && body.callback_query.game_short_name) {
      await answerCallbackQuery(
        body.callback_query.id,
        "https://www.fusednfurious.xyz/game/index.html"
      );
      return NextResponse.json({ ok: true });
    }

    // Handle regular messages
    if (body.message) {
      const chatId = body.message.from.id;
      const text = body.message.text;

      // Handle /start command
      if (text === '/start') {
        await sendGame(chatId, 'greentest');
        return NextResponse.json({ ok: true });
      }

      // Handle other messages
      await sendTelegramMessage(chatId, `You said: ${text}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}