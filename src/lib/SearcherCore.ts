import { loadMusicsWithCache } from "./utils2";

const musicUrl = './music_db.json'
const localStoreKey = 'x-sdvx-songdb'

interface ICompressedDifficulty {
    n: number;
    l: number;
}

interface ICompressedMusicItem {
    id: string;
    name: string;
    artist: string;
    difficulties: ICompressedDifficulty[];
    category: number[];
    cover: string;
    pacakge: number;
}

interface ICompressedItem {
    id: number;
    name: string;
}
export interface IMusicData {
    version: number;
    packInfo: ICompressedItem[];
    cateInfo: ICompressedItem[];
    musics: ICompressedMusicItem[];
}

type musicFilter = (musics: ICompressedMusicItem[]) => ICompressedMusicItem[];

export class EacSearcher {
    private packInfo: ICompressedItem[] = [];
    private cateInfo: ICompressedItem[] = [];
    private musics: ICompressedMusicItem[] = [];

    constructor(musicData: IMusicData) {
        this.packInfo = musicData.packInfo;
        this.cateInfo = musicData.cateInfo;
        this.musics = musicData.musics;
    }

    static async createSearcher(url: string) {
        const musicData = await loadMusicsWithCache(url, localStoreKey);
        return new EacSearcher(musicData);
    }
}