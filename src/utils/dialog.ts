import { remote } from 'electron';

const { dialog } = remote;

export function confirm(options: Electron.MessageBoxOptions): Promise<[number, boolean]> {
    const defaultOption: Electron.MessageBoxOptions = {
        type: 'question',
        buttons: ['是', '否'],
        defaultId: 0,
        cancelId: 1,
        title: '确认',
        message: '请确认',
    };
    return new Promise(resolve => {
        dialog.showMessageBox(Object.assign({}, defaultOption, options), (response, checkboxChecked) => {
            resolve([response, checkboxChecked]);
        });
    })
}