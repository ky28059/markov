import { Message, TextBasedChannel } from 'discord.js';


export async function fetchAllMessages(channel: TextBasedChannel, after?: string) {
    let ret: Message[] = [];

    while (true) {
        // If an `after` is provided, we need to fetch old -> new to ensure we only fetch messages after
        // the given id. Otherwise, we must fetch new -> old since by default, the Discord API will return
        // the newest messages first (and we don't have the ID of the oldest message).
        const messages = await channel.messages.fetch({
            limit: 100,
            after: after ? (ret[0]?.id ?? after) : undefined,
            before: !after ? ret.at(-1)?.id : undefined
        });

        console.log(messages.at(0)?.id);

        if (messages.size === 0) break;
        if (after)
            ret.unshift(...messages.values());
        else
            ret.push(...messages.values());
    }
    return ret;
}
