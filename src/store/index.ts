import { IDoc } from './Doc';
import * as db from './db';
import * as state from './state';

export function getDocById(id: string): Promise<IDoc | null> {
    return db.findOne<IDoc>({ __id: id });
}

export function children(d: IDoc): Promise<IDoc[]> {
    if (d.link && d.link.type === 'doc') {
        return db.find<IDoc>({ parentId: d.link.href });
    } else {
        return db.find<IDoc>({ parentId: d.__id });
    }
}

export function parent(d: IDoc): Promise<IDoc | null> {
    if (d.parentId) {
        return db.findOne<IDoc>({ __id: d.parentId });
    } else {
        return Promise.resolve(null);
    }
}

export async function parents(d: IDoc): Promise<IDoc[]> {
    const result: IDoc[] = [];
    const resultIdSet = new Set();
    let doc: IDoc | null = d;
    while (doc && !resultIdSet.has(doc.__id)) {
        result.push(doc);
        resultIdSet.add(doc.__id);
        doc = await parent(doc);
    }
    return result;
}

export function insertDoc(d: Partial<IDoc>): Promise<IDoc> {
    return db.insert(d);
}

export async function updateDoc(d: IDoc): Promise<void> {
    await db.update({ __id: d.__id }, d);
}

export async function removeDoc(d: IDoc): Promise<void> {
    await db.remove({ __id: d.__id });
}

export function setCurrentId(id: string) {
    state.set('currentId', id);
}

export function getCurrentId(): string | undefined {
    return state.get('currentId');
}

export function getCurrentDoc(): Promise<IDoc | null> {
    const id = getCurrentId();
    if (id) { return getDocById(id); }
    else { return Promise.resolve(null); }
}

export function watchCurrentId(fn: () => void) {
    state.watch('currentId', fn);
}

export function unwatchCurrentId(fn: () => void) {
    state.unwatch('currentId', fn);
}