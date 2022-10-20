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

export interface ICompressedItem {
    id: number;
    name: string;
}
export interface IMusicData {
    version: number;
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

export type Filter = (from: ICompressedMusicItem[], params: ISearchParams) => ICompressedMusicItem[];