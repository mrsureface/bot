const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();
const token = process.env.TELEGRAM_TOKEN;

console.log(token);

// Create an instance of the TelegramBot and Express app
const bot = new TelegramBot(token);
const app = express();

// Middleware to parse incoming requests
app.use(bodyParser.json());

// Set the bot to use webhooks instead of long polling
const url = process.env.URL || "https://6b71-90-156-162-46.ngrok-free.app";
bot.setWebHook(`${url}/bot${token}`);

// Webhook endpoint for Telegram to send updates
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Initial message to be sent on `/start` or any text input
const startMessage = `Salom, kanalga qo'shilish 5,000 so'm, karta: "card number here", to'lov o'tkazganligingizni tasdiqlash uchun chek jo'nating.`;

// Error message for repeated photo uploads
const errorMessage = "Xatolik yuz berdi, iltimos yana urinib ko‘ring.";

// Handle any message sent to the bot
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // Check if a photo is sent
  if (msg.photo) {
    if (msg.photo.length === 1) {
      bot.sendMessage(chatId, startMessage);
    } else {
      bot.sendMessage(chatId, errorMessage);
    }
  } else {
    bot.sendMessage(chatId, startMessage);
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot is listening on port ${PORT}`);
});
