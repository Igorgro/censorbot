import { Client, Message } from 'discord.js';

import './env';
import { BotDatabase } from './database';
import { times } from './utils';
import { regexps } from './regexps';

let bot:Client;
let database: BotDatabase;

async function init() {
    database = await BotDatabase.getDatabase();
    bot = new Client();
    bot.on('message', (msg) => {
        void handleMessage(msg); // this is a dirty hack because handler cannot be async and must reurn void
    });

    await bot.login(process.env.TOKEN);
    process.on('beforeExit', stop);
    process.on('SIGTERM', stop);
}

async function handleMessage(msg: Message) {
    // make bot ignore self messages
    if (msg.author.id != bot.user?.id) {
        // check if message recieved from guild
        if (msg.guild){
            if (/^!rank$/.exec(msg.content)) {
                const rank: number = await database.getUserRank(msg.author.id, msg.guild?.id);
                if (rank) await msg.channel.send(`Поздравляю, ты матерился ${rank} ${times(rank)}`);
                else await msg.channel.send('Поздравляю, ты ни разу не матерился');
            }
            else {
                for (const regexp in regexps) {
                    if ((new RegExp(regexp)).exec(msg.content)){
                        await database.addToLog(msg.author.id, msg.guild.id, regexps[regexp]);
                        await msg.react('🤬');
                    }
                }
            }
        }
    }
}

function stop(): void {
    database.close().finally(() => {
        bot.destroy();
        process.exit(0);
    });
}

init().catch((err) => {
    if(err) {
        console.log('Initialization failed');
        console.log(err);
    }
});
