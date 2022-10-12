import { config } from "dotenv";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { DisTube } from "distube";
import { commands, playCommand, disconnectCommand, skipCommand, queueCommand } from "./commands.js";

config(); // Load .env

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
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
            const currentQueue = distubeC.getQueue(interGuild);
            if (currentQueue !== undefined &&
                (currentQueue.songs.length > 0 || 
                    currentQueue.playing)) {
                if (currentQueue.songs.length == 1 && !currentQueue.autoplay) {
                    distubeC.stop(interGuild);
                } else {
                    distubeC.skip(interGuild);
                }
                interaction.reply({ content: `Skipping current song - (**${interaction.member.displayName}**)` });
            } else {
                interaction.reply({ content: `The queue is empty` });
            }
        } else if (interaction.commandName === queueCommand.name) {
            const currentQueue = distubeC.getQueue(interGuild);
            if (currentQueue !== undefined) {
                interaction.reply({ content: 
                    `>>> **Songs in queue**: ${currentQueue.songs.length}\n` +
                    `**Queue Duration**: ${currentQueue.formattedDuration}\n` +
                    `**Current Song**: ${currentQueue.songs[0].name} - (${currentQueue.songs[0].formattedDuration})\n` +
                    `**Queue:**\n` + "```" +
                    currentQueue.songs.map((song, index) => `${index}. ${song.name}\n`).toString().replaceAll(",", "") +
                    "```"});
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