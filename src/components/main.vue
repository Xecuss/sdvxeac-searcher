<template>
    <h1>コナステ版 SDVXEG 乐曲検索</h1>
    <div class="search-bar">
        <input type="text" v-model="keyword" @input="changeHandle" placeholder="keyword...">
    </div>
    <div class="musics">
        <MusicItem v-for="(item, index) in results" :key="index" :data="item"/>
    </div>
</template>
<script setup lang="ts">
import MusicItem from './MusicItem.vue';
import MusicDB from '../data/music_db.json';
import Fuse from 'fuse.js';
import { ref } from 'vue';

let keyword = ref('');
const musics: IMusicItem[] = MusicDB.data;
let results = ref(musics);

const fuse= new Fuse(musics, {
    keys: ['name', 'artist']
});

let timer: number;
const changeHandle = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        if(!keyword.value.trim()) {
            results.value = musics.slice(0, 200);
        }
        else {
            results.value = fuse.search(keyword.value).map(x => x.item);
        }
    }, 1000)
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
.search-bar input {
    font-size: 14px;
    padding: 5px;
    width: 90%;
    box-sizing: border-box;
}
.musics {
    display: flex;
    flex-wrap: wrap;
}
</style>