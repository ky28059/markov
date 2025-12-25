import { Client } from 'discord.js';
import { writeFile } from 'node:fs/promises';
import { fetchAllMessages } from '../util/scrape';


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

client.on('clientReady', async () => {
    console.log('Fetching solves');

    const guild = client.guilds.cache.get('511675552386777099');
    if (!guild) return;

    const channel = guild.channels.cache.get('757358907034435686');
    if (!channel?.isTextBased()) return;

    const messages = await fetchAllMessages(channel);
    console.log(messages.length);

    const filtered = messages
        .filter((m) => m.content.includes('This request is approved by') && m.embeds.length > 0)
        .map((m) => {
            const [challenge, category, ctf, flag, participants] = m.embeds[0].fields;
            return {
                challenge: challenge.value,
                category: remapCategoryName(category.value),
                flag: flag.value.slice(3, -3), // '```flag{...}```' -> 'flag{...}'
                participants: participants
                    ? participants.value.split(', ').map((id) => id.slice(2, -1))
                    : [],
                ts: m.createdTimestamp,
            }
        });

    await writeFile('./solves.json', JSON.stringify(filtered)); // TODO

    console.log('Fetch finished :)')
})

function remapCategoryName(c: string) {
    if (c === 're') return 'rev';
    if (c === 'other') return 'misc';
    return c;
}

void client.login(process.env.TOKEN);
