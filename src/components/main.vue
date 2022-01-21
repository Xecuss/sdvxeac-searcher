<template>
    <h1>コナステ版 SDVXEG 乐曲検索</h1>
    <div class="search-bar">
        <input type="text" v-model="keyword" @input="changeHandle" placeholder="keyword..." class="keyword">
        <div class="setting-row">
            <span class="filter" @click="filterOpen = !filterOpen">filter</span>
        </div>
        <div class="filter-list" v-show="filterOpen">
            <label class="package" v-for="pack in packages">
                <input type="checkbox" v-model="selectedPack" :value="pack" @input="changeHandle"> {{pack}}
            </label>
        </div>
    </div>
    <div class="musics">
        <MusicItem v-for="(item, index) in results" :key="index" :data="item"/>
    </div>
</template>
<script setup lang="ts">
import MusicItem from './MusicItem.vue';
import MusicDB from '../data/music_db.json';
import Fuse from 'fuse.js';
import { computed, Ref, ref } from 'vue';

let keyword = ref('');
const musics: IMusicItem[] = MusicDB.data;
let results = ref(musics);
// 取出目录，去重并排序
const packages = [...new Set(musics.map(music => music.pacakge))].sort((x, y) => x.localeCompare(y, 'ja', {
    numeric: true
}));
const selectedPack: Ref<string[]> = ref([]);
let filterOpen = ref(false);

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
.search-bar .filter-list {
    max-height: 300px;
    overflow: auto;
}
.search-bar .filter-list .package {
    display: block;
}
.musics {
    display: flex;
    flex-wrap: wrap;
}
</style>