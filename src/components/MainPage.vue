<template>
    <h1 @click="titleClickHandle">コナステ版 SDVXEG 楽曲検索</h1>
    <Panel v-model:show="filterOpen">
        <div class="filter-list">
            <label
                v-for="pack in packInfo"
                :key="pack.id"
                class="package"
                :class="{ active: searchParam.pack.indexOf(pack.id) !== -1 }"
            >
                <input
                    v-model="searchParam.pack"
                    class="checkbox"
                    type="checkbox"
                    :value="pack.id"
                    @input="changeHandle"
                />
                {{ simpleDisplay(pack.name) }}
            </label>
            <label
                v-if="displayHidden"
                class="package"
                :class="{ active: optEnable }"
            >
                <input v-model="optEnable" class="checkbox" type="checkbox" />
                ？？？
            </label>
        </div>
    </Panel>
    <StatPanel v-model:show="statOpen" :data="statResults" />
    <div class="search-bar">
        <input
            v-model="searchParam.keyword"
            type="text"
            placeholder="keyword..."
            class="keyword"
            @input="changeHandle"
        />
        <div class="setting-row">
            <button
                class="filter"
                :class="{ active: searchParam.pack.length }"
                @click="filterOpen = true"
            >
                filter
            </button>
            <button
                v-if="selectedMusic.size && optEnable"
                class="filter"
                @click="statOpen = true"
            >
                stat
            </button>
        </div>
    </div>
    <p class="total">total {{ realResultLength }} songs</p>
    <div class="musics">
        <MusicItem
            v-for="item in results"
            :key="item.id"
            :data="item"
            :selected="selectedMusic.has(item.id)"
            :opt-enable="optEnable"
            @select-click="selectMusic(item.id)"
        />
    </div>
</template>
<script setup lang="ts">
import MusicItem from "./MusicItem.vue";
import { computed, reactive, Ref, ref, watchEffect } from "vue";
import Panel from "./FloatPanel.vue";
import { simpleDisplay, readLSValue, writeLSValue } from "../lib/utils";
import StatPanel from "./statPanel.vue";
import useHideFn from "../hooks/hideFn";
import { EacSearcher, ICompressedItem, ISearchParams } from "../lib/SearchCore";

const filterKey = "filter2";

let searchCore: EacSearcher;
const searchParam: ISearchParams = reactive({
    keyword: "",
    pack: readLSValue<number[]>(filterKey) ?? [],
    cate: [],
    difficulties: [],
});
let results: Ref<IMusicItem[]> = ref([]);
let realResultLength: Ref<number> = ref(0);
const optEnable: Ref<boolean> = ref(false);
const filterOpen = ref(false);
const statOpen = ref(false);

let packInfo: ICompressedItem[] = reactive([]);
const {
    selectedMusic,
    selectMusic,
    initSelectedMusic,
    displayHidden,
    titleClickHandle,
} = useHideFn();

const search = () => {
    if (!searchCore) return;

    const realResults = searchCore.search(searchParam);
    realResultLength.value = realResults.length;
    results.value = realResults.slice(0, 200);
};

const statResults = computed(() => {
    const selectMusicList = [...selectedMusic];
    if (!searchCore) return [];
    const res = searchCore.statSelect(selectMusicList);
    return res;
});

EacSearcher.createSearcher("./music_db_final.json").then((core) => {
    searchCore = core;
    packInfo.push(...core.packInfo);
    search();
    initSelectedMusic();
    changeHandle();
});

watchEffect(() => {
    search();
    writeLSValue(filterKey, searchParam.pack);
});

let timer: number;
const changeHandle = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        search();
    }, 200);
};
</script>
<style scoped>
.search-bar {
    position: sticky;
    top: 0px;
    background: white;
    padding: 10px;
    z-index: 1;
    box-sizing: border-box;
}
.search-bar .keyword {
    font-size: 14px;
    padding: 5px;
    width: 90%;
    box-sizing: border-box;
    display: block;
    margin: 0px auto;
}
.search-bar .setting-row {
    width: 90%;
    text-align: left;
    margin: 5px auto 0;
    display: flex;
    justify-content: space-between;
}
.search-bar .filter {
    color: rgba(255, 255, 255, 0.83);
    border: none;
    background: #49c9fb;
    font-size: 14px;
    line-height: 30px;
    height: 30px;
    border-radius: 4px;
    padding: 0 10px;
    display: block;
}
.search-bar .filter.active {
    background-color: aquamarine;
    color: rgba(0, 0, 0, 0.83);
}
.search-bar .filter.active::after {
    content: "√";
    margin-right: 4px;
}
.filter-list .package {
    display: block;
    line-height: 30px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.filter-list .package.active {
    color: cyan;
}
.filter-list .package .checkbox {
    display: none;
}
.musics {
    display: flex;
    flex-wrap: wrap;
}
.total {
    margin: 0 20px;
    text-align: left;
}
</style>
