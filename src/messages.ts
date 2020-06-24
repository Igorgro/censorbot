import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Messages {
    stats: {
        count: Array<string> [3],
        never: string
    },
    rank: {
        never: string,
        count: string,
        times: Array<string> [10]
    }
}

const text:string = readFileSync(resolve(__dirname, '../assets/messages.json'), { 'encoding': 'utf-8' });
const messages:Messages = JSON.parse(text) as Messages;


export {
    Messages,
    messages
};
