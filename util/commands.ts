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
