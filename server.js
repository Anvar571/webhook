require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Telegraf } = require("telegraf");
const morgan = require("morgan");
const fs = require("fs")
const path = require("path");

const token = process.env.TOKEN;

const bot = new Telegraf(token);
const chatuserids = [];

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

morgan.token('type', function (req, res) { return req.headers['content-type'] })

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

bot.start((ctx) => {
  const chatId = ctx.chat.id;
  chatuserids.push(chatId);

  const messageText =
    `${ctx.chat.first_name} Salom bu bot sizga githubdagi o'zgarishlar haqida xabar berib turadi`;

  // Send the message to the chat
  ctx.telegram.sendMessage(chatId, messageText).catch((err) => {
    console.log("Error sending message:", err);
  });
});

bot.help((ctx) => {
  const chatid = ctx.chat.id;
    
    const messageText = "Salom bu bot sizga githubdagi o'zgarishlar haqida xabar berib turadi";

    ctx.telegram.sendMessage(chatid, messageText)
    .catch(err => {
      console.log("Error", err);
    })
})

bot.launch();

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


      for (let chatId of chatuserids){
        bot.telegram.sendMessage(chatId, message);
      }

    } else if (payload.action == "edited") {
      const title = payload.issue.body;
      const url = payload.issue.html_url;
      const issueTitle = payload.issue.title;

      const message = `Issue Nomi: ${issueTitle}\t\nComment o'zgartirildi: ${title}\t\nIssue url: ${url}`;


      for (let chatId of chatuserids){
        bot.telegram.sendMessage(chatId, message);
      }

    } else if (payload.action == "deleted") {
      const title = payload.issue.title;
      
      const message = `${title} nomli issue o'chirildi:`;

      for (let chatId of chatuserids){
        bot.telegram.sendMessage(chatId, message);
      }



    } else if (payload.action == "created") {
      const issuename = payload.issue.title;
      const url = payload.issue.html_url;
      const body = payload.comment.body;

      const message = `${issuename} nomili issuega \nyangi comment qo'shildi \n${body}\n Url: ${url}`;

      for (let chatId of chatuserids){
        bot.telegram.sendMessage(chatId, message);
      }

    } else {

      const message = `Qanaqadir xatolik bo'ldi`;

      for (let chatId of chatuserids){
        bot.telegram.sendMessage(chatId, message);
      }
    
    }

    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(5000, () => {
  console.log("Webhook server listening on port 5000");
});