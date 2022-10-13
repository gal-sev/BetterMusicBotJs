import { playCommand, disconnectCommand, skipCommand, queueCommand } from "./commands.js";

export function onReadyEvent(client) {
    client.on("ready", () => {
        console.log(`${client.user.tag} is running`);
    });
}

// on Slash Command event
export function onInteractionCreateEvent(client, distubeC) {
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
                //TODO: Change to embed later? - https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor
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
            `**Requested By**: ${song.member.displayName}\n` +
            `**URL:** ${song.url}`);
    })
}
