type Tmp = Record<string, unknown>;
export const readLSValue = <T = Tmp>(key: string) => {
    try {
        const str = localStorage.getItem(key);
        if (!str) return null;
        return JSON.parse(str) as T;
    } catch (e) {
        return null;
    }
};

export const writeLSValue = <T = Tmp>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const simpleDisplay = (name: string) => {
    if (name.startsWith("コナステ版 SOUND VOLTEX")) {
        return name.replace("コナステ版 SOUND VOLTEX", "");
    }
    return name;
};
