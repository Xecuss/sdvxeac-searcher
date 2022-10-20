import {
    composeFilter,
    cateFilter,
    diffFilter,
    keywordFilter,
    packFilter,
} from "./filters";
import {
    Filter,
    ICompressedMusicItem,
    IMusicData,
    ISearchParams,
} from "./type";
import { loadMusicsWithCache } from "./utils";

const localStoreKey = "x-sdvx-songdb";

const diffMap: { [k: string]: string } = {
    0: "NOV",
    1: "ADV",
    2: "EXH",
    3: "INF",
    4: "GRV",
    5: "HVN",
    6: "VVD",
    7: "XCD",
    8: "MXM",
};

export class EacSearcher {
    private packIdMap: Map<number, string> = new Map();
    private cateIdMap: Map<number, string> = new Map();
    private musics: ICompressedMusicItem[] = [];
    private filter: Filter = (from) => from;
    private __raw: IMusicData;

    get packInfo() {
        return this.__raw.packInfo;
    }
    get cateInfo() {
        return this.__raw.cateInfo;
    }

    constructor(musicData: IMusicData, filters?: Filter[]) {
        this.musics = musicData.musics;
        this.__raw = musicData;
        musicData.packInfo.forEach(({ id, name }) =>
            this.packIdMap.set(id, name)
        );
        musicData.cateInfo.forEach(({ id, name }) =>
            this.cateIdMap.set(id, name)
        );
        if (filters) {
            this.setFilter(filters);
        }
    }

    public setFilter(filters: Filter[]) {
        this.filter = composeFilter(filters);
    }

    public mapToLegacy(musics: ICompressedMusicItem[]): IMusicItem[] {
        return musics.map((music) => ({
            ...music,
            difficulties: music.difficulties.map((diff, id) => ({
                id,
                name: diffMap[diff.n.toString()] || "",
                level: diff.l,
            })),
            pacakge: this.packIdMap.get(music.package) || "",
            category: music.category.map(
                (cate) => this.cateIdMap.get(cate) || ""
            ),
            cover: "/game/sdvx/vi/common/jacket.html?img=" + music.cover,
        }));
    }

    public search(params: ISearchParams) {
        const res = this.filter(this.musics, params);
        return this.mapToLegacy(res);
    }

    static async createSearcher(url: string) {
        const musicData = await loadMusicsWithCache(url, localStoreKey);
        const useFilter = [packFilter, cateFilter, diffFilter, keywordFilter];
        return new EacSearcher(musicData, useFilter);
    }
}
