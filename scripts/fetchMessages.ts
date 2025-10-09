import { Client, Message, TextBasedChannel } from 'discord.js';
import { writeFile } from 'node:fs/promises';


const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildPresences",
        "GuildMembers",
        "GuildMessageReactions",
        "MessageContent"
    ],
    // presence: { activities: [{ type: ActivityType.Watching, name: 'y\'all 🥰' }] },
    allowedMentions: { repliedUser: false }
});

async function fetchAllMessages(channel: TextBasedChannel) {
    let ret: Message[] = [];

    while (true) {
        const messages = await channel.messages.fetch({ limit: 100, before: ret.at(-1)?.id });
        if (messages.size === 0) break;
        ret.push(...messages.values());
    }
    return ret;
}

client.on('clientReady', async () => {
    const guild = client.guilds.cache.get('511675552386777099');
    if (!guild) return;

    const content: string[] = [];
    const mostRecent: Record<string, string> = {};
    console.log('Starting fetch...')

    await Promise.all(guild.channels.cache.map(async (channel) => {
        if (!channel.isTextBased() || !channel.viewable) return;

        const messages = await fetchAllMessages(channel);
        const len = content.push(...messages.filter(m => !m.author.bot && m.content).map(m => m.content));

        if (messages.length > 0) mostRecent[channel.id] = messages[0].id;
        console.log(`Processed ${channel.name}:`, len);
    }));

    await writeFile('./data/messages.json', JSON.stringify(content));
    await writeFile('./data/most_recent.json', JSON.stringify(mostRecent));
    console.log('Fetch finished :)')
})

void client.login(process.env.TOKEN);
