import { config } from "dotenv";
import { Client } from "discord.js";

config(); // Load .env
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent"]});

client.on("ready", () => {
    console.log(`${client.user.tag} is running`);
});

client.on("messageCreate", (message) => {
    if (message.author.tag != client.user.tag) {
        if (message.content.toLowerCase() === "hello there") {
            message.channel.send("General Kenobi");
        }
    }
});

client.login(process.env.BOT_TOKEN);