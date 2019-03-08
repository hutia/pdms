import * as Datastore from 'nedb';
import { nedbConfig } from '../config';

const db = new Datastore(Object.assign({ autoload: true }, nedbConfig));

export function insert(d: any): Promise<any> {
    return new Promise((resolve, reject) => {
        db.insert(d, (err, doc) => {
            if (err) { return reject(err); }
            resolve(doc);
        })
    });
}

export function update(query: any, updateQuery: any, options: Datastore.UpdateOptions = {}): Promise<number> {
    return new Promise((resolve, reject) => {
        db.update(query, updateQuery, options, (err, num) => {
            if (err) { return reject(err); }
            resolve(num);
        })
    });
}

export function remove(query: any, options: Datastore.RemoveOptions = {}): Promise<number> {
    return new Promise((resolve, reject) => {
        db.remove(query, options, (err, num) => {
            if (err) { return reject(err); }
            resolve(num);
        })
    });
}

export function find<T>(query: any, projection?: any, options?: { sort?: any, skip?: number, limit?: number }): Promise<T[]> {
    return new Promise((resolve, reject) => {
        let cursor = db.find<T>(query, projection);
        if (options) {
            if (options.sort) { cursor = cursor.sort(options.sort); }
            if (options.skip) { cursor = cursor.skip(options.skip); }
            if (options.limit) { cursor = cursor.limit(options.limit); }
        }
        cursor.exec((err, docs) => {
            if (err) { return reject(err); }
            resolve(docs);
        });
    });
}

export function findOne<T>(query: any): Promise<T | null> {
    return new Promise((resolve, reject) => {
        db.findOne<T>(query, (err, doc) => {
            if (err) { return reject(err); }
            resolve(doc);
        });
    });
}
