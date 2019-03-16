const fs = require('fs');
const path = require('path');

function formatName(name) {
    return String(name).replace(/\.png$/i, '').toLowerCase().replace(/\-/g, ' ').replace(/\b\w/g, s => s.toUpperCase());
}

function main() {
    fs.writeFileSync(path.resolve(__dirname, './index.ts'), 'const ICONS: { [key: string]: string } = {};\r\n' +
        'export const ICON_NAMES: string[] = [];\r\n' +
        fs.readdirSync(__dirname)
            .filter(filename => /\.png$/i.test(filename))
            .map(filename => `ICONS["${formatName(filename)}"] = '${filename}';\r\nICON_NAMES.push("${formatName(filename)}");`)
            .join('\r\n') +
        '\r\nexport default ICONS;'
    );
}

main();