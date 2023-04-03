const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.status(200).json({ ok: "true", message: "home page" });
});

app.post("/webhook", async (req, res) => {
  try {
    const payload = req.body;
    console.log(payload);
    console.log(req);
    //   if (payload.action === 'opened') {
    //     const title = payload.issue.title;
    //     const url = payload.issue.html_url;
    //     const message = `New issue opened: ${title}\n${url}`;
    //     const botToken = '6218741924:AAGqBuivP1k69-QKYpaxcMsBtTXILoNaV58';
    //     const chatId = '2098458081';
    //     const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;
    //     await axios.get(telegramUrl);
    //   }
      res.status(200).json({message: "ok"});
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Webhook server listening on port 3000");
});
