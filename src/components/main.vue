<template>
    <h1 @click="titleClickHandle">コナステ版 SDVXEG 楽曲検索</h1>
    <Panel v-model:show="filterOpen">
        <div class="filter-list">
            <label class="package" v-for="pack in packages" :class="{ active: selectedPack.indexOf(pack) !== -1 }">
                <input class="checkbox" type="checkbox" v-model="selectedPack" :value="pack" @input="changeHandle"> {{simpleDisplay(pack)}}
            </label>
            <label class="package" :class="{ active: optEnable }" v-if="displayHidden">
                <input class="checkbox" type="checkbox"  v-model="optEnable"> ？？？
            </label>
        </div>
    </Panel>
    <StatPanel v-model:show="statOpen" :data="statMusic([...selectedMusic])"/>
    <div class="search-bar">
        <input type="text" v-model="keyword" @input="changeHandle" placeholder="keyword..." class="keyword">
        <div class="setting-row">
            <button class="filter" :class="{ active: selectedPack.length }" @click="filterOpen = true">filter</button>
            <button class="filter" v-if="selectedMusic.size && optEnable" @click="statOpen = true">stat</button>
        </div>
    </div>
    <div class="musics">
        <p class="total">total {{ realResultLength }} songs</p>
        <MusicItem v-for="item in results" :key="item.id" :data="item" :selected="selectedMusic.has(item)" :opt-enable="optEnable" @select-click="selectMusic(item)"/>
    </div>
</template>
<script setup lang="ts">
import MusicItem from './MusicItem.vue';
import Fuse from 'fuse.js';
import { computed, provide, reactive, Ref, ref, watchEffect } from 'vue';
import Panel from './panel.vue';
import { sortPackages, statMusic, simpleDisplay, statPackInfo, readLSValue, writeLSValue, loadMusicDB } from '../lib/utils';
import StatPanel from './statPanel.vue';
import useHideFn from '../hooks/hideFn';

let keyword = ref('');
let musics: IMusicItem[] = reactive([]);
let results: Ref<IMusicItem[]> = ref([]);
let realResultLength: Ref<number> = ref(0);
const optEnable: Ref<boolean> = ref(false)

// 统计各个区包下的歌曲数
const packInfo = computed(() => statPackInfo(musics));
// 这个map的keys就是曲包名，拿出来排序
const packages = computed(() => sortPackages([...packInfo.value.keys()]));
const selectedPack: Ref<string[]> = ref(readLSValue<string[]>('filter') ?? []);
const { selectedMusic, selectMusic, initSelectedMusic, displayHidden, titleClickHandle } = useHideFn();

loadMusicDB().then(res => {
    musics.push(...res);
    initSelectedMusic(musics);
    changeHandle()
})

let filterOpen = ref(false);
let statOpen = ref(false);
// 提供出去供子组件使用
provide('musics', musics);
provide('packInfo', packInfo);

watchEffect(() => {
    writeLSValue('filter', selectedPack.value);
});

const filteredMusics = computed(() => {
    if(!selectedPack.value.length) return musics;
    const selectedPackSet = new Set(selectedPack.value);
    return musics.filter(music => selectedPackSet.has(music.pacakge));
});

let timer: number;
const changeHandle = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        if(!keyword.value.trim()) {
            realResultLength.value = filteredMusics.value.length;
            if (selectedPack.value.length) results.value = filteredMusics.value;
            else results.value = filteredMusics.value.slice(0, 200);
        }
        else {
            const fuse = new Fuse(filteredMusics.value, {
                keys: ['name', 'artist']
            });
            results.value = fuse.search(keyword.value).map(x => x.item);
            realResultLength.value = results.value.length;
        }
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
.musics .total {
    margin: 0 0 0 20px;
}
</style>