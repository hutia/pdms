import { IDoc } from './Doc';
import * as db from './db';

/** 根据 id 获取指定的文档 */
export function getDocById(id: string): Promise<IDoc | null> {
    return db.findOne<IDoc>({ _id: id });
}

/** 根据 id 获取指定的文档 */
export function getDocsByIds(ids: string[]): Promise<IDoc[]> {
    return db.find<IDoc>({ _id: { $in: ids } });
}

/** 获取文档的子节点数组 */
export function children(d?: IDoc): Promise<IDoc[]> {
    if (d && d.link && d.link.type === 'doc') {
        return db.find<IDoc>({ parentId: d.link.href }, undefined, { sort: { name: 1 } });
    } else if (d) {
        return db.find<IDoc>({ parentId: d._id }, undefined, { sort: { name: 1 } });
    } else {
        return db.find<IDoc>({ parentId: '' }, undefined, { sort: { name: 1 } });
    }
}

/** 获取文档的父节点 */
export function parent(d: IDoc): Promise<IDoc | null> {
    if (d.parentId) {
        return db.findOne<IDoc>({ _id: d.parentId });
    } else {
        return Promise.resolve(null);
    }
}

/** 获取文档的祖先节点数组 */
export async function parents(d: IDoc): Promise<IDoc[]> {
    const result: IDoc[] = [];
    const resultIdSet = new Set();
    let doc: IDoc | null = d;
    while (doc && !resultIdSet.has(doc._id)) {
        result.push(doc);
        resultIdSet.add(doc._id);
        doc = await parent(doc);
    }
    return result;
}

/** 插入文档 */
export function insertDoc(d: Partial<IDoc>): Promise<IDoc> {
    return db.insert(d);
}

/** 更新文档 */
export async function updateDoc(d: IDoc): Promise<void> {
    await db.update({ _id: d._id }, d);
}

/** 删除文档，会优先遍历并删除其子节点 */
export async function removeDoc(d: IDoc): Promise<void> {
    const children = await db.find<IDoc>({ parentId: d._id });
    await removeDocs(children);
    await db.remove({ _id: d._id });
}

/** 批量删除文档 */
export async function removeDocs(list: IDoc[]): Promise<void[]> {
    return Promise.all(list.map(removeDoc))
}


