<template>
    <h1 @click="titleClickHandle">コナステ版 SDVXEG 楽曲検索</h1>
    <Panel v-model:show="filterOpen">
        <div class="filter-list">
            <label class="package" v-for="pack in packInfo" :key="pack.id" :class="{ active: searchParam.pack.indexOf(pack.id) !== -1 }">
                <input 
                    class="checkbox" 
                    type="checkbox" 
                    v-model="searchParam.pack" 
                    :value="pack.id" 
                    @input="changeHandle"
                > {{simpleDisplay(pack.name)}}
            </label>
            <label class="package" :class="{ active: optEnable }" v-if="displayHidden">
                <input class="checkbox" type="checkbox"  v-model="optEnable"> ？？？
            </label>
        </div>
    </Panel>
    <StatPanel v-model:show="statOpen" :data="statMusic([...selectedMusic])"/>
    <div class="search-bar">
        <input type="text" v-model="searchParam.keyword" @input="changeHandle" placeholder="keyword..." class="keyword">
        <div class="setting-row">
            <button class="filter" :class="{ active: searchParam.pack.length }" @click="filterOpen = true">filter</button>
            <button class="filter" v-if="selectedMusic.size && optEnable" @click="statOpen = true">stat</button>
        </div>
    </div>
    <p class="total">total {{ realResultLength }} songs</p>
    <div class="musics">
        <MusicItem v-for="item in results" :key="item.id" :data="item" :selected="selectedMusic.has(item)" :opt-enable="optEnable" @select-click="selectMusic(item)"/>
    </div>
</template>
<script setup lang="ts">
import MusicItem from './MusicItem.vue';
import { provide, reactive, Ref, ref, watchEffect } from 'vue';
import Panel from './panel.vue';
import { simpleDisplay, readLSValue, writeLSValue, statMusic } from '../lib/utils';
import StatPanel from './statPanel.vue';
import useHideFn from '../hooks/hideFn';
import { EacSearcher, ICompressedItem, ISearchParams } from '../lib/SearchCore';

const filterKey = 'filter2';

let musics: IMusicItem[] = reactive([]);
let searchCore: EacSearcher;
const searchParam: ISearchParams = reactive({
    keyword: '', 
    pack: readLSValue<number[]>(filterKey) ?? [], 
    cate: [], 
    difficulties: []
});
let results: Ref<IMusicItem[]> = ref([]);
let realResultLength: Ref<number> = ref(0);
const optEnable: Ref<boolean> = ref(false)

// 统计各个区包下的歌曲数
let packInfo: ICompressedItem[] = reactive([]);
const { selectedMusic, selectMusic, initSelectedMusic, displayHidden, titleClickHandle } = useHideFn();

const search = () => {
    if (!searchCore) return;

    const realResults = searchCore.search(searchParam);
    realResultLength.value = realResults.length;
    results.value = realResults.slice(0, 200);
}

EacSearcher.createSearcher('./music_db_final.json').then(core => {
    searchCore = core;
    core.packInfo.forEach(item => packInfo.push(item));
    search();
    // initSelectedMusic(results.value);
    changeHandle();
})

let filterOpen = ref(false);
let statOpen = ref(false);
// 提供出去供子组件使用
provide('musics', musics);
provide('packInfo', packInfo);

watchEffect(() => {
    search();
    writeLSValue(filterKey, searchParam.pack);
});

let timer: number;
const changeHandle = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        search();
    }, 200)
}
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
    content: '√';
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