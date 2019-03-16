import * as crypto from 'crypto';

const SALT = 'UxusnOX82OXis@#du!';
const SALT2 = 'Xusz9@8$1z%!oiI#Soazp';

function sha256(s: string, salt: string): string {
    return crypto.createHmac('sha256', salt)
        .update(s)
        .digest('hex');
}

function xor(b1: Buffer, b2: Buffer): Buffer {
    const result = Buffer.alloc(b1.length);
    const b2len = b2.length;
    for (let i = 0; i < b1.length; i++) {
        result[i] = b1[i] ^ b2[i % b2len];
    }
    return result;
}

export function encode(source: string, password: string): string {
    const b1 = Buffer.from(source, 'utf8');
    const b2 = Buffer.from(sha256(password, SALT));
    return xor(b1, b2).toString('base64');
}

export function decode(data: string, password: string): string {
    const b1 = Buffer.from(data, 'base64');
    const b2 = Buffer.from(sha256(password, SALT));
    return xor(b1, b2).toString('utf8');
}

export function encodePassword(password: string): string {
    return sha256(password, SALT2);
}

export function validate(password: string, target: string): boolean {
    return encodePassword(password) === target;
}

