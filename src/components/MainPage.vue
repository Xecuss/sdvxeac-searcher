<template>
    <el-container>
        <filter-drawer
            v-model="filterOpen"
            v-model:pack-filters="searchParam.pack"
            v-model:cate-filters="searchParam.cate"
            v-model:diff-filters="searchParam.difficulties"
            :pack-info="packInfo"
            :cate-info="cateInfo"
        />
        <el-header height="40px" @click="titleClickHandle">
            <h2 class="main-title">コナステ版 SDVX 楽曲検索</h2>
        </el-header>
        <el-main>
            <div class="search-bar">
                <el-input
                    v-model="searchParam.keyword"
                    type="text"
                    placeholder="keyword..."
                    :prefix-icon="Search"
                />
            </div>
            <div class="setting-row">
                <el-button
                    type="primary"
                    :icon="Filter"
                    @click="filterClickHandle"
                    >Filter</el-button
                >
            </div>
            <p class="total">
                <span>total {{ realResultLength }} songs</span>
                <span>update on {{ dataVersion }}</span>
            </p>
            <div v-loading.fullscreen.lock="isLoading" class="loading" />
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
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import MusicItem from "./MusicItem.vue";
import FilterDrawer from "./FilterDrawer.vue";
import { computed, reactive, Ref, ref, watch } from "vue";
import { Filter, Search } from "@element-plus/icons-vue";
import { readLSValue, writeLSValue } from "../lib/utils";
import StatPanel from "./statPanel.vue";
import useHideFn from "../hooks/hideFn";
import { EacSearcher, ICompressedItem, ISearchParams } from "../lib/SearchCore";
import debounce from "lodash/debounce";

const filterKey = "filter2";

let searchCore: EacSearcher;
const searchParam: ISearchParams = reactive({
    keyword: "",
    pack: readLSValue<number[]>(filterKey) ?? [],
    cate: [],
    difficulties: [],
});
const results: Ref<IMusicItem[]> = ref([]);
const realResultLength: Ref<number> = ref(0);
const dataVersion = window.DATA_VERSION.slice(0, -4);
const isLoading = ref(true);

const filterOpen = ref(false);

const optEnable: Ref<boolean> = ref(false);
const statOpen = ref(false);

const packInfo: ICompressedItem[] = reactive([]);
const cateInfo: ICompressedItem[] = reactive([]);

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
    cateInfo.push(...core.cateInfo);
    search();
    initSelectedMusic();
    isLoading.value = false;
});

watch(
    searchParam,
    debounce(() => {
        search();
    }, 200)
);

let timer: number;
const changeHandle = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        search();
    }, 200);
};

const filterClickHandle = () => {
    filterOpen.value = !filterOpen.value;
};
</script>
<style scoped>
.search-bar {
    position: sticky;
    top: 0px;
    background: white;
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
.setting-row {
    width: 100%;
    text-align: left;
    margin: 10px auto 0;
    display: flex;
    justify-content: space-between;
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
    justify-content: space-around;
}
.total {
    width: 100%;
    margin: 10px auto 0;
    display: flex;
    justify-content: space-between;
}
</style>
