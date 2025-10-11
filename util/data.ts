import { readFile, writeFile } from 'node:fs/promises';
import type { SerializedWeights, Weights } from './train';


export async function getMessages(id: string) {
    const raw = await readFile(`./data/${id}/messages.json`);
    return JSON.parse(raw.toString()) as [number, string][];
}

export async function getKeyedMessages(id: string) {
    const raw = await readFile(`./data/${id}/messages_user.json`);
    return JSON.parse(raw.toString()) as Record<string, [number, string][]>;
}

export async function saveWeights(key: string, id: string, weights: Weights) {
    // We have to handle maps a bit carefully, since they don't JSON stringify well.
    await writeFile(`./data/${id}/${key}.json`, JSON.stringify(
        Object.fromEntries([...weights.entries()].map(([k, v]) => [k, Object.fromEntries(v)])),
    ));
}

export async function saveKeyedWeights(key: string, id: string, data: Record<string, Weights>) {
    // We have to handle maps a bit carefully, since they don't JSON stringify well.
    await writeFile(`./data/${id}/keyed_${key}.json`, JSON.stringify(
        Object.fromEntries(Object.entries(data).map(([k, weights]) => (
            [k, Object.fromEntries([...weights.entries()].map(([k, v]) => [k, Object.fromEntries(v)]))]
        )))
    ));
}

export async function loadWeights(key: string, id: string): Promise<Weights> {
    const raw = await readFile(`./data/${id}/${key}.json`);
    const tmp = JSON.parse(raw.toString()) as SerializedWeights;

    // Again, map back to `Map`s to handle quirky tokens
    // TODO: is this necessary?
    return new Map(Object.entries(tmp).map(([k, v]) => [k, new Map(Object.entries(v))]));
}

export async function loadKeyedWeights(key: string, id: string): Promise<Record<string, Weights>> {
    const raw = await readFile(`./data/${id}/keyed_${key}.json`);
    const tmp = JSON.parse(raw.toString()) as Record<string, SerializedWeights>;

    // Again, map back to `Map`s to handle quirky tokens
    // TODO: is this necessary?
    return Object.fromEntries(Object.entries(tmp).map(([k, t]) => (
        [k, new Map(Object.entries(t).map(([k, v]) => [k, new Map(Object.entries(v))]))]
    )));
}
