<template>
    <h1>コナステ版 SDVXEG 乐曲検索</h1>
    <Panel v-model:show="filterOpen">
        <div class="filter-list">
            <label class="package" v-for="pack in packages" :class="{ active: selectedPack.indexOf(pack) !== -1 }">
                <input class="checkbox" type="checkbox" v-model="selectedPack" :value="pack" @input="changeHandle"> {{simpleDisplay(pack)}}
            </label>
        </div>
    </Panel>
    <StatPanel v-model:show="statOpen" :data="statMusic([...selectedMusic])"/>
    <div class="search-bar">
        <input type="text" v-model="keyword" @input="changeHandle" placeholder="keyword..." class="keyword">
        <div class="setting-row">
            <span class="filter" @click="filterOpen = true">filter</span>
            <span class="filter" @click="statOpen = true">stat</span>
        </div>
    </div>
    <div class="musics">
        <MusicItem v-for="item in results" :key="item.id" :data="item" :selected="selectedMusic.has(item)" @select-click="selectMusic(item)"/>
    </div>
</template>
<script setup lang="ts">
import MusicItem from './MusicItem.vue';
import MusicDB from '../data/music_db.json';
import Fuse from 'fuse.js';
import { computed, provide, Ref, ref } from 'vue';
import Panel from './panel.vue';
import { sortPackages, statMusic, simpleDisplay, statPackInfo } from '../lib/utils';
import StatPanel from './statPanel.vue';

let keyword = ref('');
const musics: IMusicItem[] = MusicDB.data;
let results = ref(musics);
// 统计各个区包下的歌曲数
const packInfo = statPackInfo(musics);
// 这个map的keys就是曲包名，拿出来排序
const packages = sortPackages([...packInfo.keys()]);
const selectedPack: Ref<string[]> = ref([]);
const selectedMusic: Ref<Set<IMusicItem>> = ref(new Set());
let filterOpen = ref(false);
let statOpen = ref(false);
// 提供出去供子组件使用
provide('musics', musics);
provide('packInfo', packInfo);

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
            results.value = filteredMusics.value.slice(0, 200);
        }
        else {
            const fuse = new Fuse(filteredMusics.value, {
                keys: ['name', 'artist']
            });
            results.value = fuse.search(keyword.value).map(x => x.item);
        }
    }, 200)
}
const selectMusic = (music: IMusicItem) => {
    if(selectedMusic.value.has(music)) {
        selectedMusic.value.delete(music);
    }
    else {
        selectedMusic.value.add(music);
    }
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
    margin: 0px auto;
}
.search-bar .filter {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
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
</style>