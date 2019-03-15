import { EventEmitter } from 'events';

const state: { [key: string]: any } = {};
const evt = new EventEmitter();

export function set(name: string, value: any) {
    if (state[name] !== value) {
        state[name] = value;
        evt.emit(name);
    }
}

export function get(name: string): any {
    return state[name];
}

export function watch(name: string, fn: () => void) {
    evt.on(name, fn);
}

export function unwatch(name: string, fn: () => void) {
    evt.off(name, fn);
}

export function emit(name: string) {
    evt.emit(name);
}

export const STATUS = {
    CURRENT_ID: 'Current Id',
    SELECTED_DOC_IDs: 'Selected Doc IDs',
};