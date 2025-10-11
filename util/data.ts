import { readFile, writeFile } from 'node:fs/promises';
import type { SerializedWeights, Weights } from './train';


export async function getMessages() {
    const raw = await readFile('./data/messages.json');
    return JSON.parse(raw.toString()) as [number, string][];
}

export async function getKeyedMessages() {
    const raw = await readFile('./data/messages_user.json');
    return JSON.parse(raw.toString()) as Record<string, [number, string][]>;
}

export async function saveWeights(key: string, weights: Weights) {
    // We have to handle maps a bit carefully, since they don't JSON stringify well.
    await writeFile(`./data/${key}.json`, JSON.stringify(
        Object.fromEntries([...weights.entries()].map(([k, v]) => [k, Object.fromEntries(v)])),
    ));
}

export async function saveKeyedWeights(key: string, data: Record<string, Weights>) {
    // We have to handle maps a bit carefully, since they don't JSON stringify well.
    await writeFile(`./data/keyed_${key}.json`, JSON.stringify(
        Object.fromEntries(Object.entries(data).map(([k, weights]) => (
            [k, Object.fromEntries([...weights.entries()].map(([k, v]) => [k, Object.fromEntries(v)]))]
        )))
    ));
}

export async function loadWeights(key: string): Promise<Weights> {
    const raw = await readFile(`./data/${key}.json`);
    const tmp = JSON.parse(raw.toString()) as SerializedWeights;

    // Again, map back to `Map`s to handle quirky tokens
    // TODO: is this necessary?
    return new Map(Object.entries(tmp).map(([k, v]) => [k, new Map(Object.entries(v))]));
}
