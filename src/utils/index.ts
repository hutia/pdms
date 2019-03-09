

export function bindThis(that: any, ...args: string[]) {
    args.forEach(methodName => that[methodName] = that[methodName].bind(that));
}

export function overwrite(that: any, ...args: string[]) {
    that[args[args.length - 1]] = args.reduce((acc, name) => Object.assign(acc, that[name]), {})
}