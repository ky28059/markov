import { Client, Message, TextBasedChannel } from 'discord.js';
import { mkdir, writeFile } from 'node:fs/promises';


const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildPresences",
        "GuildMembers",
        "GuildMessageReactions",
        "MessageContent"
    ],
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
    const id = process.argv[2] ?? '511675552386777099';
    console.log('Fetching messages for', id);

    const guild = client.guilds.cache.get(id);
    if (!guild) return; // TODO

    const keyed: Record<string, [timestamp: number, content: string][]> = {};
    const data: [number, string][] = [];
    const mostRecent: Record<string, string> = {};

    console.log('Starting fetch...')

    await Promise.all(guild.channels.cache.map(async (channel) => {
        if (!channel.isTextBased() || !channel.viewable) return;

        const messages = await fetchAllMessages(channel);
        const filtered = messages.filter(m => !m.author.bot && m.content);

        // Key messages by user, storing timestamp and content
        for (const message of filtered) {
            if (!keyed[message.author.id]) keyed[message.author.id] = [];
            keyed[message.author.id].push([message.createdTimestamp, message.content]);
        }

        const len = data.push(...filtered.map((m) => [m.createdTimestamp, m.content] as [number, string]));

        if (messages.length > 0) mostRecent[channel.id] = messages[0].id;
        console.log(`Processed ${channel.name}:`, len);
    }));

    await mkdir(`./data/${id}`, { recursive: true });

    await writeFile(`./data/${id}/messages.json`, JSON.stringify(data));
    await writeFile(`./data/${id}/messages_user.json`, JSON.stringify(data));
    await writeFile(`./data/${id}/most_recent.json`, JSON.stringify(mostRecent));

    console.log('Fetch finished :)')
})

void client.login(process.env.TOKEN);
