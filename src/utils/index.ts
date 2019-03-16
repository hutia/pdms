

export function bindThis(that: any, ...args: string[]) {
    args.forEach(methodName => that[methodName] = that[methodName].bind(that));
}

export function bindDeferThis(that: any, ...args: string[]) {
    args.forEach(methodName => that[methodName] = debounce(that[methodName].bind(that)));
}


export function overwrite(that: any, ...args: string[]) {
    that[args[args.length - 1]] = args.reduce((acc, name) => Object.assign(acc, that[name]), {})
}

export function debounce(fn: () => void, delay = 8) {
    let timer: NodeJS.Timer | undefined = undefined;
    return () => {
        if (timer) { return; }
        timer = setTimeout(() => {
            timer = undefined;
            fn();
        }, delay);
    };
}