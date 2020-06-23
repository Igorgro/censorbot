import { readFileSync } from 'fs';
import { resolve } from 'path';

interface Regexps {
    [key: string]: string
}

const text:string = readFileSync(resolve(__dirname, '../assets/regexps.json'), { 'encoding': 'utf-8' });
const regexps:Regexps = JSON.parse(text) as Regexps;


export {
    Regexps,
    regexps
};
