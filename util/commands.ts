import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandBuilder
} from 'discord.js';
import type { ServerWeights } from '../bot';


export type Command = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    execute: (interaction: ChatInputCommandInteraction, d: ServerWeights) => Promise<any>,
    autocomplete?: (interaction: AutocompleteInteraction, d: ServerWeights) => Promise<any>
}

export type Subcommand = {
    data: SlashCommandSubcommandBuilder,
    execute: (interaction: ChatInputCommandInteraction, d: ServerWeights) => Promise<any>,
    autocomplete?: (interaction: AutocompleteInteraction, d: ServerWeights) => Promise<any>
}

export type CommandGroup = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    commands: { [key: string]: Subcommand }
}

export function commandGroupOf(name: string, commands: Subcommand[]): CommandGroup {
    const groupData = new SlashCommandBuilder()
        .setName(name)
        .setDescription(`[${name}] command group`)
    const commandMap: { [key: string]: Subcommand } = {};

    for (const command of commands) {
        commandMap[command.data.name] = command;
        groupData.addSubcommand(command.data);
    }

    return {
        data: groupData,
        commands: commandMap
    }
}
