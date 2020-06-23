import { exists, mkdir, PathLike } from 'fs';

function times(times: number): string {
    if (times % 10 <= 1 || times % 10 > 4) return 'раз';
    if (1 < times % 10 && times % 10 < 5) return 'раза';
    return '';
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
