
/**
 * All APIs used for Views
 */

import * as store from './store';
import { IDoc } from './store/Doc';
import { confirm } from './utils/dialog';
import * as status from './utils/status';
import * as enc from './utils/enc';

const { CURRENT_ID, SELECTED_DOC_IDs, EDITING_DOC_IDs } = status.STATUS;

export function onKeyDown(e: React.KeyboardEvent) {
    e.key === 'Delete' && removeSelectedDocs();
    e.key === 'Backspace' && navUp();
};

export function navDoc(d?: IDoc) {
    setCurrentId(d ? d._id : '');
}

export function setCurrentId(id: string) {
    if (status.get(CURRENT_ID) !== id) {
        status.set(SELECTED_DOC_IDs, undefined);
    }
    status.set(CURRENT_ID, id);
}

export function getCurrentId(): string | undefined {
    return status.get(CURRENT_ID);
}

export function getCurrentDoc(): Promise<IDoc | null> {
    const id = getCurrentId();
    if (id) { return store.getDocById(id); }
    else { return Promise.resolve(null); }
}

export async function getCurrentChildren(): Promise<IDoc[]> {
    const cur = await getCurrentDoc();
    if (cur) {
        return store.children(cur);
    } else {
        return store.children();
    }
}

export async function navUp() {
    const cur = await getCurrentDoc();
    if (cur) {
        setCurrentId(cur.parentId || '');
    }
}

export async function createDocUnderCurrent(name?: string) {
    if (!name) { return; }
    const doc = await store.insertDoc({ name, parentId: getCurrentId() || '' });
    status.emit(CURRENT_ID);
    return doc;
}

export function watchCurrentId(fn: () => void) {
    status.watch(CURRENT_ID, fn);
}

export function unwatchCurrentId(fn: () => void) {
    status.unwatch(CURRENT_ID, fn);
}

export function getSelectedDocIds(): Set<string> {
    return status.get(SELECTED_DOC_IDs) || new Set();
}

export function getLastSelectedDocId(): string | undefined {
    const selectedDocIds = [...getSelectedDocIds()];
    return selectedDocIds[selectedDocIds.length - 1];
}

export async function getLastSelectedDoc(): Promise<IDoc | null> {
    const id = getLastSelectedDocId();
    if (!id) { return null; }
    return await store.getDocById(id);
}

export function selectDoc(d: IDoc, list?: IDoc[], options?: { shift?: boolean, ctrl?: boolean }): void {
    const ctrl = options && options.ctrl;
    const shift = options && options.shift;
    const selectedDocIds = getSelectedDocIds();
    if (ctrl || selectedDocIds.size === 0) {
        if (selectedDocIds.has(d._id)) {
            const s = new Set(selectedDocIds);
            s.delete(d._id);
            status.set(SELECTED_DOC_IDs, s);
        } else {
            status.set(SELECTED_DOC_IDs, new Set([...selectedDocIds, d._id]));
        }
        cancelEditDoc();
    } else if (shift && list) {
        const lastDocId = getLastSelectedDocId();
        if (!lastDocId) { return selectDoc(d); }
        const lastDocIndex = list.findIndex(doc => doc._id === lastDocId);
        const docIndex = list.findIndex(doc => doc._id === d._id);
        if (lastDocIndex === -1) { return selectDoc(d); }
        status.set(SELECTED_DOC_IDs, new Set([
            ...selectedDocIds,
            ...list.slice(
                Math.min(docIndex, lastDocIndex),
                Math.max(docIndex, lastDocIndex) + 1
            ).map(d => d._id),
        ]));
        cancelEditDoc();
    } else if (selectedDocIds.size === 1 && selectedDocIds.has(d._id)) {
        // do nothing
    } else {
        status.set(SELECTED_DOC_IDs, new Set([d._id]));
        cancelEditDoc();
    }
}

export async function removeSelectedDocs() {
    const ids = [...getSelectedDocIds()];
    const docs = await store.getDocsByIds(ids.slice(0, 5));
    const docNames = docs.map(d => '\t' + d.name).join('\r\n') + (ids.length > 5 ? '\r\n......' : '');
    const [confirmed] = await confirm({ message: `确实要删除选定的 ${ids.length} 个项目吗？\r\n${docNames}` });
    if (confirmed !== 0) { return; }
    await store.removeDocs(docs);
    status.set(SELECTED_DOC_IDs, undefined);
    status.emit(CURRENT_ID);
}

export function watchSelect(fn: () => void) {
    status.watch(SELECTED_DOC_IDs, fn);
}

export function unwatchSelect(fn: () => void) {
    status.unwatch(SELECTED_DOC_IDs, fn);
}

export function validatePassword(d: IDoc, password: string): boolean {
    if (!d.password) { return true; }
    return enc.validate(password, d.password || '');
}

export function sealPassword(d: IDoc) {
    if (!d.password || !d.content) { return; }
    d.content = enc.encode(d.content, d.password);
    d.password = enc.encodePassword(d.password);
}

export function unsealPassword(d: IDoc, password: string): [boolean, IDoc] {
    if (!enc.validate(password, d.password || '') || !d.content) { return [false, d]; }
    const nd = Object.assign({}, d);
    nd.content = enc.decode(d.content, password);
    nd.password = password;
    return [true, nd];
}

export function getDocContent(d: IDoc, password: string): string {
    if (!enc.validate(password, d.password || '') || !d.content) { return ''; }
    return enc.decode(d.content, password);
}

export async function getDocInView() {
    let data = await getLastSelectedDoc();
    if (!data) {
        data = await getCurrentDoc();
    }
    return data;
}

export function getEditingDocIds(): Set<string> {
    return status.get(EDITING_DOC_IDs) || new Set();
}

export async function isEditingInView(): Promise<boolean> {
    const d = await getDocInView();
    return !!d && getEditingDocIds().has(d._id);
}

export function watchEditing(fn: () => void) {
    status.watch(EDITING_DOC_IDs, fn);
}

export function unwatchEditing(fn: () => void) {
    status.unwatch(EDITING_DOC_IDs, fn);
}

export function editDoc(d: IDoc) {
    const list = getEditingDocIds();
    if (!list.has(d._id)) {
        status.set(EDITING_DOC_IDs, new Set([...list, d._id]));
    }
}

export function cancelEditDoc() {
    status.set(EDITING_DOC_IDs, null);
}

export async function saveEditDoc(d: IDoc) {
    sealPassword(d);
    await store.updateDoc(d);
    cancelEditDoc();
    status.emit(CURRENT_ID);
    status.emit(SELECTED_DOC_IDs);
}


