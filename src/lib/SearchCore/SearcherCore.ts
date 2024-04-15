import {
    composeFilter,
    cateFilter,
    diffFilter,
    keywordFilter,
    packFilter,
} from "./filters";
import {
    Filter,
    ICompressedItem,
    ICompressedMusicItem,
    ICoreMusicItem,
    IMusicData,
    ISearchParams,
} from "./type";
import { loadMusicsWithCache, statMusics } from "./utils";

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
    private packIdMap: Map<number, ICompressedItem> = new Map();
    private cateIdMap: Map<number, ICompressedItem> = new Map();
    private musicsIdMap: Map<string, ICompressedMusicItem> = new Map();
    private musics: ICoreMusicItem[] = [];
    private filter: Filter = (from) => from;
    private __raw: IMusicData;

    get packInfo() {
        return this.__raw.packInfo;
    }
    get cateInfo() {
        return this.__raw.cateInfo;
    }

    get allSongs() {
        return this.mapToLegacy(this.musics);
    }

    constructor(musicData: IMusicData, filters?: Filter[]) {
        this.musics = musicData.musics.map((item) => ({ ...item, alias: [] }));
        this.__raw = musicData;
        musicData.packInfo.forEach((item) => this.packIdMap.set(item.id, item));
        musicData.cateInfo.forEach((item) => this.cateIdMap.set(item.id, item));
        musicData.musics.forEach((item) => this.musicsIdMap.set(item.id, item));
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
            pacakge: this.packIdMap.get(music.package)?.name || "",
            category: music.category.map(
                (cate) => this.cateIdMap.get(cate)?.name || ""
            ),
            cover: "/game/sdvx/vi/common/jacket.html?img=" + music.cover,
        }));
    }

    public search(params: ISearchParams) {
        const res = this.filter(this.musics, params);
        return this.mapToLegacy(res);
    }

    public statSelect(selectedIds: string[]) {
        const selectedMusics = selectedIds.map((id) =>
            this.musicsIdMap.get(id)
        ) as ICompressedMusicItem[];
        return statMusics(selectedMusics, this.packIdMap);
    }

    static async createSearcher(url: string) {
        const musicData = await loadMusicsWithCache(url);
        const useFilter = [packFilter, cateFilter, diffFilter, keywordFilter];
        return new EacSearcher(musicData, useFilter);
    }
}
