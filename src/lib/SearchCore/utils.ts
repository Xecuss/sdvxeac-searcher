import { version as currentVersion } from "../../../public/music_db_final.json";
import { IMusicData } from "./type";

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
