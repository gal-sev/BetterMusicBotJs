import { SlashCommandBuilder } from "@discordjs/builders";

export const playCommand = new SlashCommandBuilder().setName("play")
    .setDescription("Play music")
    .addStringOption((option) =>
        option.setName("song")
            .setDescription("Song to play")
            .setRequired(true)
    );
export const disconnectCommand = new SlashCommandBuilder().setName("disconnect")
    .setDescription("Disconnect bot from voice channel");
    
export const commands = [playCommand.toJSON(), disconnectCommand.toJSON()];