import { config } from "dotenv";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { DisTube } from "distube";
import { commands, playCommand, disconnectCommand, skipCommand } from "./commands.js";

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
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false
});
const distubeC = client.DisTube;

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

client.on("ready", () => {
    console.log(`${client.user.tag} is running`);
});

client.on("messageCreate", (message) => {
    if (message.author.tag !== client.user.tag) {
        if (message.content.toLowerCase() === "hello there") {
            message.channel.send("General Kenobi");
        }
    }
});

client.on("interactionCreate", (interaction) => {
    if (interaction.isChatInputCommand()) {
        const interGuild = interaction.guild;
        if (interaction.commandName === playCommand.name) {
            const song = interaction.options.get("song").value;
            console.log(`Added ${song} to queue`);
            distubeC.play(interaction.member.voice.channel, song, {
                textChannel: interaction.channel,
                member: interaction.member,
            });
            interaction.reply({ content: `Added \`${song}\` to queue - (**${interaction.member.displayName}**)` });
        } else if (interaction.commandName === disconnectCommand.name) {
            distubeC.voices.leave(interGuild);
            interaction.reply({ content: `Leaving voice channel - (**${interaction.member.displayName}**)` });
        } else if (interaction.commandName === skipCommand.name) {
            let currentQueue = distubeC.getQueue(interGuild);
            if (currentQueue !== undefined &&
                (distubeC.getQueue(interGuild).songs.length > 0 || 
                distubeC.getQueue(interGuild).playing)) {
                if (distubeC.getQueue(interGuild).songs.length == 1 && !distubeC.getQueue(interGuild).autoplay) {
                    distubeC.stop(interGuild);
                } else {
                    distubeC.skip(interGuild);
                }
                interaction.reply({ content: `Skipping current song - (**${interaction.member.displayName}**)` });
            } else {
                interaction.reply({ content: `The queue is empty` });
            }
        }
    }
});

distubeC.on("playSong", (queue, song) => {
    queue.textChannel.send(
        `>>> **Playing**: ${song.name}\n` +
        `**Duration**: ${song.formattedDuration}\n` +
        `**Requested By**: ${song.member.displayName}\n` +
        `**URL:** ${song.url}`);
})

async function main() {
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