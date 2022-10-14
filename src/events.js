import { playCommand, disconnectCommand, skipCommand, queueCommand, setLastUserInteraction, executePlayCommand, executeDisconnectCommand } from "./commands.js";

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
            const interGuild = interaction.guild;
            if (interaction.commandName === playCommand.name) {
                const song = interaction.options.get("song").value;
                executePlayCommand(distubeC, interaction, song);
            } else if (interaction.commandName === disconnectCommand.name) {
                executeDisconnectCommand(distubeC, interaction);
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
