import Fuse from "fuse.js";
import { Filter, ICompressedMusicItem } from "./type";
// 共享同一个实例，避免反复创建
const fuse = new Fuse<ICompressedMusicItem>([], {
    keys: ["name", "artist"],
});

// 曲包过滤器
export const packFilter: Filter = (from, { pack }) => {
    if (!pack.length) return from;

    const packSet = new Set(pack);
    return from.filter((item) => {
        return packSet.has(item.package);
    });
};
// 类型过滤器
export const cateFilter: Filter = (from, { cate }) => {
    if (!cate.length) return from;

    const cateSet = new Set(cate);
    return from.filter((item) => {
        for (let cateItem of item.category) {
            if (cateSet.has(cateItem)) return true;
        }
        return false;
    });
};
// 难度过滤器
export const diffFilter: Filter = (from, { difficulties }) => {
    console.log(">>>> searchDiff", difficulties);
    if (!difficulties.length) return from;

    const diffSet = new Set(difficulties);
    return from.filter((item) => {
        for (let diffItem of item.difficulties) {
            if (diffSet.has(diffItem.l)) return true;
        }
        return false;
    });
};
// 关键词过滤器
export const keywordFilter: Filter = (from, { keyword }) => {
    if (!keyword.trim().length) return from;

    fuse.setCollection(from);
    return fuse.search(keyword).map((x) => x.item);
};

export const composeFilter = (filters: Filter[]) => {
    return filters.reduceRight(
        (prev, curr) => {
            return (from, params) => curr(prev(from, params), params);
        },
        (from) => from
    );
};
