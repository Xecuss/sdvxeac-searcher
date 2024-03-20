import { version as currentVersion } from "../../../public/music_db_final.json";
import {
    ICompressedItem,
    ICompressedMusicItem,
    IMusicData,
    IStatResult,
} from "./type";

window.DATA_VERSION = String(currentVersion);

export const loadMusicsWithCache = async (url: string, storeKey: string) => {
    const storageRes = localStorage.getItem(storeKey);
    if (storageRes) {
        const data = JSON.parse(storageRes) as IMusicData;
        console.log(data.version, currentVersion);
        if (data.version >= currentVersion) return data;
    }

    const fetchRes = await fetch(`${url}?r=${new Date().valueOf()}`);
    const res = (await fetchRes.json()) as IMusicData;
    localStorage.setItem(storeKey, JSON.stringify(res));
    return res;
};

export function statMusics(
    musics: ICompressedMusicItem[],
    packMap: Map<number, ICompressedItem>
): IStatResult[] {
    const result = new Map<number, ICompressedMusicItem[]>();
    for (const music of musics) {
        let musicArr = result.get(music.package);
        if (musicArr === undefined) {
            musicArr = [];
            result.set(music.package, musicArr);
        }
        musicArr.push(music);
    }
    return [...result]
        .map((item) => {
            const [packId, packs] = item;
            const packContains = packMap.get(packId)?.count || 1;
            const favCount = packs.length;
            const favPer =
                packContains !== undefined ? favCount / packContains : 0;
            const avgLevel =
                packs.reduce(
                    (prev, item) => prev + item.difficulties.slice(-1)[0].l,
                    0
                ) / favCount;
            return {
                name: packMap.get(packId)?.name || "",
                favCount,
                favPer,
                avgLevel,
            };
        })
        .sort((x, y) => {
            if (x.favPer !== y.favPer) return y.favPer - x.favPer;
            return y.avgLevel - x.avgLevel;
        });
}
