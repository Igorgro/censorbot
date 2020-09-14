import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { resolve } from 'path';

import { regexps } from './regexps';
import { existsAsync, mkdirAsync } from './utils';

interface RankResult {
    'count(*)': number
}

interface StatsRow {
    user: string,
    'count(*)': number
}

type StatsResult = Array<StatsRow>;


class BotDatabase {
    private db: Database;

    private constructor(db: Database) {
        this.db = db;
    }

    async init(): Promise<void> {
        await this.db.run('PRAGMA foreign_keys');
        await this.createMissingTables();
    }

    async createMissingTables(): Promise<void> {
        await this.db.run('CREATE TABLE IF NOT EXISTS words (word TEXT PRIMARY KEY NOT NULL UNIQUE)');
        for (const key in regexps) {
            await this.db.run(`INSERT OR IGNORE INTO words VALUES ('${regexps[key]}')`);
        }
        await this.db.run(`
            CREATE TABLE IF NOT EXISTS words_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                user TEXT NOT NULL,
                guild text NOT NULL,
                date INTEGER NOT NULL,
                word REFERENCES words
            )
        `);
    }

    async addToLog(user: string, guild:string, word:string): Promise<void> {
        const now = Math.floor(new Date().getTime() / 1000);
        await this.db.run(`INSERT INTO words_log (user, guild, date, word) VALUES('${user}', '${guild}', ${now}, '${word}')`);
    }

    async getUserRank(user: string, guild:string): Promise<number> {
        const result: RankResult|undefined = await this.db.get(
            `SELECT count(*) FROM words_log
                             WHERE user='${user}'
                             AND guild='${guild}'
                             GROUP BY user;`
        );
        if (result) {
            return result['count(*)'];
        }
        else return 0;
    }

    async getStats(guild: string): Promise<StatsResult> {
        const result:StatsResult = await this.db.all(
            `SELECT user, count(*) FROM words_log
                                   WHERE guild='${guild}'
                                   GROUP BY user
                                   ORDER BY COUNT(*) DESC
            `);
        return result;
    }

    async close(): Promise<void> {
        await this.db.close();
    }

    private static instance: BotDatabase;

    static async getDatabase(): Promise<BotDatabase> {
        if (!this.instance) {
            if (! await existsAsync(resolve(__dirname, '../database'))) {
                await mkdirAsync(resolve(__dirname, '../database'));
            }
            const db = await open({ filename: resolve(__dirname, '../database/database.db'), driver: sqlite3.Database });
            this.instance = new BotDatabase(db);
            await this.instance.init();
        }
        return this.instance;
    }
}

export {
    BotDatabase
};
