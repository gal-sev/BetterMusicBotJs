import express from 'express';
import { config } from "dotenv";
import { runBot, runWebDisconnectCommand, runWebPlayCommand, runWebQueueCommand, runWebSkipCommand } from "./src/bot.js";
import path from "path";
import { fileURLToPath } from 'url';
import { createBaseTables, createPlaylist, insertSong } from './src/database.js';

const app = express();

config(); // Load .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const YT_TOKEN = process.env.YT_TOKEN;

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

app.get(`/skip`, (req, res) => {
    if (runWebSkipCommand()) {
        res.send(`Bot Skipped song`);
    } else {
        res.send(`Error: No discord user interaction avaliable.`);
    } 
});

app.get(`/queue`, (req, res) => {
    res.send(runWebQueueCommand());
});

app.get(`/ytapi`, (req, res) => {
    //TODO: remove the yt token from the build and get it from here instead when loading the page
    res.send(YT_TOKEN);
});

// playlists:
app.get(`/createPL/:title`, async (req, res) => {
    try {
        res.send(await createPlaylist(req.params.title));
    } catch (err) {
		console.error(err);
        res.send(err);
    }
});

app.get(`/addSong/:playlistID/:songID`, async (req, res) => {
    try {
        await insertSong(req.params.songID, req.params.playlistID);
        res.send(`inserted song ${req.params.songID} to playlist ${req.params.playlistID}`);
    } catch (err) {
		console.error(err);
        res.send(err);
    }
});

app.use(express.static(path.join(__dirname, "build")));

app.get(`*`, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Hosted: http://localhost:' + port);
    console.log('Creating db tables');
    createBaseTables();
});
