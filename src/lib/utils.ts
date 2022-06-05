import versionData from '../data/data_version.json';

const localStoreKey = 'x-sdvx-songdb'

const sortMethod = (x: string, y: string) => x.localeCompare(y, 'ja', {
    numeric: true
});

export const readLSValue = <T = {}>(key: string) => {
    try {
        const str = localStorage.getItem(key);
        if(!str) return null;
        return JSON.parse(str) as T;
    }
    catch(e) {
        return null;
    }
}

export const writeLSValue = <T = {}>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
}

export const fromIdsGetMusic = (ids: string[], musics: IMusicItem[]) => {
    const result = new Set<IMusicItem>();
    if(ids.length === 0) return result;

    const idsSet = new Set(ids);
    for(let item of musics) {
        if(idsSet.has(item.id)) {
            result.add(item);
        }
        if(!idsSet.size) break;
    }
    return result;
}

export const sortPackages = (packages: string[]) => {
    // 月费会员曲包
    const monthPack = packages.filter(pack => pack.startsWith('20')).sort(sortMethod);
    // 乐曲曲包
    const normalPack = packages.filter(pack => pack.startsWith('コナステ版 SOUND VOLTEX 楽曲パック')).sort(sortMethod);
    // 免费
    const freePack = packages.filter(pack => pack === '最初からプレーできます').sort(sortMethod);
    // 其他 
    const othersPack = packages.filter(pack => 
        !pack.startsWith('コナステ版 SOUND VOLTEX 楽曲パック')
        && !pack.startsWith('20')
        && pack !== '最初からプレーできます'
    ).sort(sortMethod);
    return [...freePack, ...normalPack, ...monthPack, ...othersPack]
}

export const loadMusicDB = async () => {
    const storageRes = localStorage.getItem(localStoreKey);
    if (storageRes) {
        const data = JSON.parse(storageRes);
        if (data.version >= versionData.version) return data.songs as IMusicItem[];
    }

    const fetchRes = await fetch('./music_db.json?r=' + new Date().valueOf())
    const res = await fetchRes.json() as IMusicDB
    localStorage.setItem(localStoreKey, JSON.stringify({
        version: versionData.version,
        songs: res.data,
    }));
    return res.data;
}
export const simpleDisplay = (name: string) => {
    if(name.startsWith('コナステ版 SOUND VOLTEX')) {
        return name.replace('コナステ版 SOUND VOLTEX', '')
    }
    return name;
}

export const statMusic = (musics: IMusicItem[]) => {
    const result = new Map<string, IMusicItem[]>();
    for(const music of musics) {
        let musicArr = result.get(music.pacakge);
        if(musicArr === undefined) {
            musicArr = [];
            result.set(music.pacakge, musicArr);
        }
        musicArr.push(music);
    }
    return [...result]
}

export const statPackInfo = (musics: IMusicItem[]) => {
    const packagesMap = new Map<string, number>();
    musics.forEach(({ pacakge }) => {
        const current = packagesMap.get(pacakge);
        if(current !== undefined) {
            packagesMap.set(pacakge, current + 1);
        }
        else {
            packagesMap.set(pacakge, 1);
        }
    });
    return packagesMap;
}