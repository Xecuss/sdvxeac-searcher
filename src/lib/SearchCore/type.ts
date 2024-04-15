interface ICompressedDifficulty {
    n: number;
    l: number;
}

export interface ICompressedMusicItem {
    id: string;
    name: string;
    artist: string;
    difficulties: ICompressedDifficulty[];
    category: number[];
    cover: string;
    package: number;
}

export interface ICoreMusicItem extends ICompressedMusicItem {
    alias: string[];
}

export interface ICompressedItem {
    id: number;
    name: string;
    count: number;
}

export interface ICacheableData {
    version: number;
}
export interface IMusicData extends ICacheableData {
    packInfo: ICompressedItem[];
    cateInfo: ICompressedItem[];
    musics: ICompressedMusicItem[];
}

export interface ISearchParams {
    pack: number[];
    cate: number[];
    difficulties: number[];
    keyword: string;
}

export type Filter = (
    from: ICompressedMusicItem[],
    params: ISearchParams
) => ICompressedMusicItem[];

export interface IStatResult {
    name: string;
    favCount: number;
    favPer: number;
    avgLevel: number;
}
