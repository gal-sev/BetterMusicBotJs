import { config } from "dotenv";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import { REST } from "@discordjs/rest";

config(); // Load .env

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations
    ]
});

const rest = new REST({ version: '10'}).setToken(BOT_TOKEN);

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

client.on("interactionCreate", (interaction) => {
    if (interaction.isChatInputCommand()) {
        const song = interaction.options.get("song").value;
        console.log("Playing: " + song);
        interaction.reply({ content: `Playing: ${song}`});
    }
});

async function main() {
    const commands = [
        {
            name: "play",
            description: "Play music command",
            options: [
                {
                    name: "song",
                    description: "Song to play",
                    type: 3,
                    required: true
                },
            ]
        }
    ];
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });

        client.login(BOT_TOKEN);
    } catch (err) {
        console.log(err);
    }
}

main();