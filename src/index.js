import { config } from "dotenv";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { DisTube } from "distube";

config(); // Load .env

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.DisTube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false
});

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

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
        console.log(`Added ${song} to queue`);
        client.DisTube.play(interaction.member.voice.channel, song, {
            textChannel: interaction.channel,
            member: interaction.member,
        });
        interaction.reply({ content: `Added ${song} to queue` });
    }
});

client.DisTube.on("playSong", (queue, song) => {
    queue.textChannel.send(
        `**Playing**: ${song.name}\n` +
        `**Duration**: ${song.formattedDuration}\n` +
        `**Requested By**: ${song.member.displayName}\n` +
        `**URL:** ${song.url}`);
})

async function main() {

    const playCommand = new SlashCommandBuilder().setName("play")
        .setDescription("Play music command")
        .addStringOption((option) =>
            option.setName("song")
                .setDescription("Song to play")
                .setRequired(true)
        );

    const commands = [playCommand.toJSON()];
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