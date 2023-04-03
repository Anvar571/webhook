require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { Telegraf } = require("telegraf");

const token = process.env.TOKEN;

const bot = new Telegraf(token);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

bot.start((ctx) => {
  const chatId = ctx.chat.id;
  const messageText =
    "Salom bu bot sizga githubdagi o'zgarishlar haqida xabar berib turadi";

  // Send the message to the chat
  ctx.telegram.sendMessage(chatId, messageText).catch((err) => {
    console.log("Error sending message:", err);
  });
});

bot.help((ctx) => {
  const chatid = ctx.chat.id;
    
    const messageText = "Salom bu bot sizga githubdagi o'zgarishlar haqida xabar berib turadi";
    ctx.telegram.sendMessage(chatid, messageText).catch(err => {
      console.log("Error", err);
    })
})

app.get("/", (req, res) => {
  res.status(200).json({ ok: "true", message: "home page" });
});

app.post("/webhook", async (req, res) => {
  try {
    const payload = req.body;
    if (payload.action == "opened") {
      const title = payload.issue.title;
      const url = payload.issue.html_url;

      const message = `New Issue title: ${title}\t\nIssue url: ${url}`;

      const botToken = process.env.TOKEN;
      const chatId = process.env.CHAT_ID;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?text=${message}`;
      await axios.get(telegramUrl);

    } else if (payload.action == "edited") {
      const title = payload.issue.body;
      const url = payload.issue.html_url;
      const issueTitle = payload.issue.title;

      const message = `Issue Nomi: ${issueTitle}\t\nComment o'zgartirildi: ${title}\t\nIssue url: ${url}`;

      const botToken = process.env.TOKEN;
      const chatId = process.env.CHAT_ID;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?text=${message}`;
      await axios.get(telegramUrl);

    } else if (payload.action == "deleted") {
      const title = payload.issue.title;
      
      const message = `${title} nomli issue o'chirildi:`;

      const botToken = process.env.TOKEN;
      const chatId = process.env.CHAT_ID;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?text=${message}`;
      await axios.get(telegramUrl);

    } else if (payload.action == "created") {
      const issuename = payload.issue.title;
      const url = payload.issue.html_url;
      const body = payload.comment.body;

      const message = `${issuename} nomili issuega \nyangi comment qo'shildi \n${body}\n Url: ${url}`;

      const botToken = process.env.TOKEN;
      const chatId = process.env.CHAT_ID;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?text=${message}`;
      await axios.get(telegramUrl);
    } else {

      const message = `Qanaqadir xatolik bo'ldi`;

      const botToken = process.env.TOKEN;
      const chatId = process.env.CHAT_ID;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?text=${message}`;
      await axios.get(telegramUrl);
    }

    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(5000, () => {
  console.log("Webhook server listening on port 5000");
});
