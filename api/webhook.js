// // pages/api/webhook.js
// import { NextResponse } from 'next/server';

// // Helper function to answer callback query
// async function answerCallbackQuery(callbackQueryId, url) {
//   const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
  
//   const response = await fetch(TELEGRAM_API, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       callback_query_id: callbackQueryId,
//       url: url
//     }),
//   });
  
//   return response.json();
// }

// // Helper function to send game
// async function sendGame(chatId, gameShortName) {
//   const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendGame`;
  
//   const response = await fetch(TELEGRAM_API, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       chat_id: chatId,
//       game_short_name: gameShortName
//     }),
//   });
  
//   return response.json();
// }

// // API route handler
// export async function POST(req) {
//   try {
//     const body = await req.json();

//     // Handle game callback query
//     if (body.callback_query && body.callback_query.game_short_name) {
//       await answerCallbackQuery(
//         body.callback_query.id,
//         "https://www.fusednfurious.xyz/game/index.html"
//       );
//       return NextResponse.json({ ok: true });
//     }

//     // Handle regular messages
//     if (body.message) {
//       const chatId = body.message.from.id;
//       const text = body.message.text;

//       // Handle /start command
//       if (text === '/start') {
//         await sendGame(chatId, 'greentest');
//         return NextResponse.json({ ok: true });
//       }

//       // Handle other messages
//       await sendTelegramMessage(chatId, `You said: ${text}`);
//     }

//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     console.error('Error processing webhook:', error);
//     return NextResponse.json({ ok: false }, { status: 500 });
//   }
// }
import TelegramBot from 'node-telegram-bot-api';

// 텔레그램 봇 API 토큰
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: false });

export default async function handler(req, res) {
  // POST 요청만 처리하도록 설정
  if (req.method === 'POST') {
    const { message } = req.body;

    // 메시지가 존재하면 응답 처리
    if (message) {
      const chatId = message.chat.id;
      await bot.sendMessage(chatId, 'Received your message!');
      res.status(200).send('OK');
    } else {
      res.status(400).send('No message in the request');
    }
  } else {
    // POST가 아닌 다른 메서드는 405 에러 반환
    res.status(405).send('Method Not Allowed');
  }
}
