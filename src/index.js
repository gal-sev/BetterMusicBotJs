import express from 'express';
import { config } from "dotenv";
import { runBot, runWebDisconnectCommand, runWebPlayCommand } from "./bot.js";

const app = express();

config(); // Load .env

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

runBot(BOT_TOKEN, CLIENT_ID, GUILD_ID);

app.get(`/play/:songName`, (req, res) => {
    if (runWebPlayCommand(req.params.songName)) {
        res.send(`Playing ${req.params.songName}`);
    } else {
        res.send(`Error: No discord user interaction avaliable.`);
    } 
});

app.get(`/disconnect`, (req, res) => {
    if (runWebDisconnectCommand()) {
        res.send(`Bot disconnected from voice channel`);
    } else {
        res.send(`Error: No discord user interaction avaliable.`);
    } 
});

app.get(`*`, (req, res) => {
    res.send(`Result: Working`);
});

const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log('Hosted: http://localhost:' + port);
});
