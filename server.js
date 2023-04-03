const express = require('express');
const axios = require('axios');

const app = express();

app.get("/" , (req, res) => {
    res.status(200).json({ok: "true", message: "home page"})
})

app.post('/webhook', async (req, res) => {
  const payload = req.body;
  if (payload.action === 'opened') {
    const title = payload.issue.title;
    const url = payload.issue.html_url;
    const message = `New issue opened: ${title}\n${url}`;
    const botToken = '6218741924:AAGqBuivP1k69-QKYpaxcMsBtTXILoNaV58';
    const chatId = '2098458081';
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;
    await axios.get(telegramUrl);
  }
  res.status(200).end();
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
