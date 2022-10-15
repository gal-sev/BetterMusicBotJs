import { playCommand, disconnectCommand, skipCommand, queueCommand, setLastUserInteraction, executePlayCommand, executeDisconnectCommand, executeSkipCommand, executeQueueCommand } from "./commands.js";

export function onReadyEvent(client) {
    client.on("ready", () => {
        console.log(`${client.user.tag} is running`);
    });
}

// on Slash Command event
export function onInteractionCreateEvent(client, distubeC) {
    client.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand()) {
            // set the last user interaction to current one
            setLastUserInteraction(interaction);
            if (interaction.commandName === playCommand.name) {
                const song = interaction.options.get("song").value;
                executePlayCommand(distubeC, interaction, song);
            } else if (interaction.commandName === disconnectCommand.name) {
                executeDisconnectCommand(distubeC, interaction);
            } else if (interaction.commandName === skipCommand.name) {
                executeSkipCommand(distubeC, interaction);
            } else if (interaction.commandName === queueCommand.name) {
                executeQueueCommand(distubeC, interaction);
            }
        }
    });
}

export function onDisPlaySongEvent(distubeC) {
    distubeC.on("playSong", (queue, song) => {
        queue.textChannel.send(
            `>>> **Playing**: ${song.name}\n` +
            `**Duration**: ${song.formattedDuration}\n` +
            //Using username instead of displayName so it will display "web interface" when needed
            `**Requested By**: ${song.member.username}\n` +
            `**URL:** ${song.url}`);
    })
}
