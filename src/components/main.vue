<template>
    <h1>コナステ版 SDVXEG 乐曲検索</h1>
    <Panel  v-model:show="filterOpen">
        <div class="filter-list">
            <label class="package" v-for="pack in packages" :class="{ active: selectedPack.indexOf(pack) !== -1 }">
                <input class="checkbox" type="checkbox" v-model="selectedPack" :value="pack" @input="changeHandle"> {{simpleDisplayPipe(pack)}}
            </label>
        </div>
    </Panel>
    <div class="search-bar">
        <input type="text" v-model="keyword" @input="changeHandle" placeholder="keyword..." class="keyword">
        <div class="setting-row">
            <span class="filter" @click="filterOpen = true">filter</span>
        </div>
    </div>
    <div class="musics">
        <MusicItem v-for="item in results" :key="item.id" :data="item"/>
    </div>
</template>
<script setup lang="ts">
import MusicItem from './MusicItem.vue';
import Fuse from 'fuse.js';
import { computed, reactive, Ref, ref } from 'vue';
import Panel from './panel.vue';
import { loadMusicDB, sortPackages } from '../lib/utils';

let keyword = ref('');
let musics: IMusicItem[] = reactive([]);
let results = ref(musics);

loadMusicDB().then(res => {
    musics.push(...res);
})

// 取出目录，去重并排序
const packages = computed(() => sortPackages([...new Set(musics.map(music => music.pacakge))]));
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
const simpleDisplayPipe = (name: string) => {
    if(name.startsWith('コナステ版 SOUND VOLTEX')) {
        return name.replace('コナステ版 SOUND VOLTEX', '')
    }
    return name;
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