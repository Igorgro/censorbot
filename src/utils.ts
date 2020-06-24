import { exists, mkdir, PathLike } from 'fs';
import { messages } from './messages';

function times(times: number): string {
    return messages.rank.times[times];
}

function existsAsync(path: PathLike): Promise<boolean> {
    return new Promise<boolean> ((resolve) => {
        exists(path, (flag) => {
            resolve(flag);
        });
    });
}

function mkdirAsync(path: PathLike): Promise<void> {
    return new Promise((resolve, reject) => {
        mkdir(path, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

export {
    times,
    existsAsync,
    mkdirAsync
};
