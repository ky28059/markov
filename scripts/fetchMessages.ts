import { Client, Message, TextBasedChannel } from 'discord.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { getMessages, getMostRecent } from '../util/data';


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

async function fetchAllMessages(channel: TextBasedChannel, after?: string) {
    let ret: Message[] = [];

    while (true) {
        const messages = await channel.messages.fetch({ limit: 100, after: ret[0]?.id ?? after });
        if (messages.size === 0) break;
        ret.unshift(...messages.values());
    }
    return ret;
}

client.on('clientReady', async () => {
    const id = process.argv[2] ?? '511675552386777099';
    console.log('Fetching messages for', id);

    const guild = client.guilds.cache.get(id);
    if (!guild) return; // TODO

    const keyed: Record<string, [timestamp: number, content: string][]> = {};
    const messages = await getMessages(id);
    const mostRecent = await getMostRecent(id);

    const channels = guild.channels.cache; // await guild.channels.fetch();
    console.log('Starting fetch...')

    await Promise.all(channels.map(async (channel) => {
        if (!channel?.isTextBased() || !channel.viewable) return;

        const fetched = await fetchAllMessages(channel, mostRecent[channel.id]);
        const filtered = fetched.filter(m => !m.author.bot && m.content);

        // Key messages by user, storing timestamp and content
        for (const message of filtered) {
            if (!keyed[message.author.id]) keyed[message.author.id] = [];
            keyed[message.author.id].push([message.createdTimestamp, message.content]);
        }

        const len = messages.push(...filtered.map((m) => [m.createdTimestamp, m.content] as [number, string]));

        if (fetched.length > 0) mostRecent[channel.id] = fetched[0].id;
        console.log(`Processed ${channel.name}:`, len);
    }));

    await mkdir(`./data/${id}`, { recursive: true });

    await writeFile(`./data/${id}/messages.json`, JSON.stringify(messages));
    await writeFile(`./data/${id}/messages_user.json`, JSON.stringify(keyed));
    await writeFile(`./data/${id}/most_recent.json`, JSON.stringify(mostRecent));

    console.log('Fetch finished :)')
})

void client.login(process.env.TOKEN);
