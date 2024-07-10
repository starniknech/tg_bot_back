const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '7313717876:AAFrD2fgTMcElYRG0qpriyh85AdZhJDtwDE';
const webAppUrl = 'https://bright-bienenstitch-e0c74e.netlify.app/';

const app = express();
const bot = new TelegramBot(token, { polling: true });

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Down here will appear the button, fill in form', {
      reply_markup: {
        inline_keyboard: [[{ text: 'fill in form', web_app: { url: webAppUrl + '/form' } }]],
      },
    });

    await bot.sendMessage(chatId, 'enter our web store', {
      reply_markup: {
        inline_keyboard: [[{ text: 'make an orders', web_app: { url: webAppUrl } }]],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(chatId, 'thanks for review');
      await bot.sendMessage(chatId, 'Your country: ' + data?.country);
      await bot.sendMessage(chatId, 'Your street: ' + data?.street);
      setTimeout(async () => {
        await bot.sendMessage(chatId, 'You will get all the information in the chat');
      }, 3000);
    } catch (error) {
      console.log(e);
    }
  }
});

app.post('/web-data', async (req, res) => {
  const { queryId, products, totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'success',
      input_message_content: { message_text: "Congratulations! You've just spent" + totalPrice },
    });
    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'error while processing a request',
      input_message_content: { message_text: "You didn't buy anything because of the errror" },
    });
    return res.status(500).json({});
  }
});

const PORT = 5000;

app.listen(PORT, () => console.log('server started on PORT' + PORT));
