import { SlashCommandBuilder } from "@discordjs/builders";

//TODO: Change to embed later? - https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor

// Saving the interaction so we can fake a user call from the website later
let lastUserInteraction = undefined;
export function setLastUserInteraction(newInteraction) {
    lastUserInteraction = newInteraction;
}

export const playCommand = new SlashCommandBuilder().setName("play")
    .setDescription("Play music")
    .addStringOption((option) =>
        option.setName("song")
            .setDescription("Song to play")
            .setRequired(true)
    );

export function executePlayCommand(distubeC, interaction, song) {
    //TODO: Check if the interaction has a voice channel
    if (interaction === undefined) {
        if (lastUserInteraction === undefined) {
            console.log("No discord user interaction avaliable.");
            // Break out of the function
            return false;
        } else {
            interaction = lastUserInteraction;
            // Setting the username to web interface instead of the last user's name
            interaction.member.username = "Website Interface";
        }
    } else {
        // Setting username to be able to set website interface as the name as seen above ^
        interaction.member.username = interaction.member.displayName;
        interaction.reply({ content: `Added \`${song}\` to queue - (**${interaction.member.displayName}**)` });
    }
    distubeC.play(interaction.member.voice.channel, song, {
        textChannel: interaction.channel,
        member: interaction.member,
    });
    console.log(`Added ${song} to queue - ${interaction.member.username}`);
    return true;
}

export const disconnectCommand = new SlashCommandBuilder().setName("disconnect")
    .setDescription("Disconnect bot from voice channel");

export function executeDisconnectCommand(distubeC, interaction) {
    if (interaction === undefined) {
        if (lastUserInteraction === undefined) {
            // *Interaction from website without any prior discord interactions*
            console.log("No discord user interaction avaliable.");
            // Break out of the function
            return false;
        } else {
            // *Interaction from website with a prior discord interaction*
            interaction = lastUserInteraction;
        }
    } else {
        // *Interaction from discord*
        interaction.reply({ content: `Leaving voice channel - (**${interaction.member.displayName}**)` });
    }
    distubeC.voices.leave(interaction.guild);
    return true;
}

export const skipCommand = new SlashCommandBuilder().setName("skip")
    .setDescription("Skip the current song");

export function executeSkipCommand(distubeC, interaction) {
    if (interaction === undefined) {
        if (lastUserInteraction === undefined) {
            // *Interaction from website without any prior discord interactions*
            console.log("No discord user interaction avaliable.");
            // Break out of the function
            return false;
        } else {
            // *Interaction from website with a prior discord interaction*
            interaction = lastUserInteraction;
        }
    } else {
        // *Interaction from discord*
        const currentQueue = distubeC.getQueue(interaction.guild);
        if (currentQueue !== undefined &&
            (currentQueue.songs.length > 0 || currentQueue.playing)) {
            interaction.reply({ content: `Skipping current song - (**${interaction.member.displayName}**)` });
        } else {
            interaction.reply({ content: `The queue is empty` });
        }
    }
    const currentQueue = distubeC.getQueue(interaction.guild);
    if (currentQueue !== undefined &&
        (currentQueue.songs.length > 0 || currentQueue.playing)) {
        if (currentQueue.songs.length == 1 && !currentQueue.autoplay) {
            distubeC.stop(interaction.guild);
        } else {
            distubeC.skip(interaction.guild);
        }
    }
    return true;
}

export const queueCommand = new SlashCommandBuilder().setName("queue")
    .setDescription("Print the songs queue");

export function executeQueueCommand(distubeC, interaction) {
    if (interaction === undefined) {
        if (lastUserInteraction === undefined) {
            // *Interaction from website without any prior discord interactions*
            console.log("No discord user interaction avaliable.");
            // Break out of the function
            return "No discord user interaction avaliable";
        } else {
            // *Interaction from website with a prior discord interaction*
            interaction = lastUserInteraction;
            const currentQueue = distubeC.getQueue(interaction.guild);
            if (currentQueue !== undefined) {
                let formattedQueue = 
                {
                    length: currentQueue.songs.length,
                    duration: currentQueue.formattedDuration,
                    songs: currentQueue.songs.map((song, index) => {
                        return {
                            number: index,
                            name: song.name,
                            duration: song.formattedDuration,
                            author: song.uploader.name,
                            id: song.id
                        }})
                };
                return formattedQueue;
            } else {
                return "The queue is empty";
            }
        }
    } else {
        // *Interaction from discord*
        const currentQueue = distubeC.getQueue(interaction.guild);
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
    return "Success";
}

export const commands = [playCommand.toJSON(), disconnectCommand.toJSON(), skipCommand.toJSON(), queueCommand.toJSON()];