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

export const fromIdsGetMusic = (ids: string[], musics: IMusicItem[]) => {
    const result = new Set<IMusicItem>();
    if (ids.length === 0) return result;

    const idsSet = new Set(ids);
    for (let item of musics) {
        if (idsSet.has(item.id)) {
            result.add(item);
        }
        if (!idsSet.size) break;
    }
    return result;
};

export const simpleDisplay = (name: string) => {
    if (name.startsWith("コナステ版 SOUND VOLTEX")) {
        return name.replace("コナステ版 SOUND VOLTEX", "");
    }
    return name;
};

export const statMusic = (musics: IMusicItem[]) => {
    const result = new Map<string, IMusicItem[]>();
    for (const music of musics) {
        let musicArr = result.get(music.pacakge);
        if (musicArr === undefined) {
            musicArr = [];
            result.set(music.pacakge, musicArr);
        }
        musicArr.push(music);
    }
    return [...result];
};
