import { Client, GatewayIntentBits, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { DisTube } from "distube";
import { commands, executeDisconnectCommand, executePlayCommand, executeSkipCommand } from "./commands.js";
import { onDisPlaySongEvent, onInteractionCreateEvent, onReadyEvent } from "./events.js";

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

export const distubeC = client.DisTube;

export function runWebPlayCommand(song) {
    return executePlayCommand(distubeC, undefined, song);
}

export function runWebDisconnectCommand() {
    return executeDisconnectCommand(distubeC, undefined);
}

export function runWebSkipCommand() {
    return executeSkipCommand(distubeC, undefined);
}

export async function runBot(BOT_TOKEN, CLIENT_ID, GUILD_ID) {
    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

    try {
        //Update the slash commands
        console.log("Started refreshing application (/) commands.");
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });
        
        //Events:
        onReadyEvent(client);
        onInteractionCreateEvent(client, distubeC);
        onDisPlaySongEvent(distubeC);

        client.login(BOT_TOKEN);
    } catch (err) {
        console.log(err);
    }
}