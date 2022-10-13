import express from 'express';
import { config } from "dotenv";
import { runBot } from "./bot.js";

const app = express();

config(); // Load .env

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

runBot(BOT_TOKEN, CLIENT_ID, GUILD_ID);

app.get(`*`, (req, res) => {
    res.send(`Result: Working`);
});

const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log('Hosted: http://localhost:' + port);
});
