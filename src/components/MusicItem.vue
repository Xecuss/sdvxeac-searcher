<template>
<div class="music-item" :style="{ paddingBottom: optEnable ? '30px' : '0' }">
    <div class="content">
        <img class="cover" v-lazy="`https://p.eagate.573.jp${data.cover}`"/>
        <h3 class="name">{{ data.name }}</h3>
        <p class="artist">{{data.artist}}</p>
        <div class="difficulties">
            <div 
                v-for="difficulty in data.difficulties" 
                :key="difficulty.id" 
                class="difficulty"
                :class="difficulty.name"
            >
                {{difficulty.name}} {{ difficulty.level }}
            </div>
        </div>
        <p class="package">{{data.pacakge}}</p>
        <div class="categorys">
            <div 
                v-for="cate in data.category" 
                :key="cate" 
                class="category"
                :class="cate"
            >{{cate}}</div>
        </div>
    </div>
    <div class="btn-group" v-if="optEnable">
        <button class="select" :class="{ selected }" @click.stop="selectMusic">Select</button>
        <button class="copy">Copy</button>
    </div>
</div>
</template>
<script setup lang="ts">

const props = defineProps<{
    data: IMusicItem,
    selected: boolean,
    optEnable?: boolean,
}>();
const emit = defineEmits<{
    (e: 'select-click'): void
}>();

const selectMusic = () => {
    emit('select-click')
};
</script>
<style scoped>
.music-item {
    width: 90%;
    margin: 20px auto 0;
    /* border: 1px solid rgba(0, 0, 0, 0.1); */
    border-radius: 8px;
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.07);
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
}
.music-item .content {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}
@media screen and (min-width: 1366px) {
    .music-item {
        width: calc(30% - 20px);
    }
}
@media screen and (min-width: 1920px) {
    .music-item {
        width: calc(25% - 20px);
    }
}
.music-item .cover{
    display: block;
    max-width: 187px;
    max-height: 187px;
    margin: 0 auto;
    border-radius: 4px;
    position: relative;
}
.cover[lazy=loading] {
    width: 0;
    height: 0;
}
.cover[lazy=error] {
    display: none;
}
/* .cover[lazy=loaded] {
} */
.music-item .difficulties {
    display: flex;
    justify-content: center;
    gap: 10px;
}
.difficulties .difficulty {
    width: 150px;
    padding: 5px 0;
    border-radius: 4px;
    font-weight: bold;
    color: white;
}
.difficulties .difficulty.MXM {
    background: rgba(172,172,172,0.6);
    border: 1px solid #acacac;
}
.difficulties .difficulty.EXH {
    background-color: rgba(251,73,76,0.6);
    border: 1px solid #fb494c;
}
.difficulties .difficulty.ADV {
    background-color: rgba(251,182,73,0.6);
    border: 1px solid #fbb649;
}
.difficulties .difficulty.NOV {
    background-color: rgba(90,73,251,0.6);
    border: 1px solid #5a49fb;
}
.difficulties .difficulty.GRV {
    background-color: rgba(251,143,73,0.6);
    border: 1px solid #fb8f49;
}
.difficulties .difficulty.HVN {
    background-color: rgba(73,201,251,0.6);
    border: 1px solid #49c9fb;
}
.difficulties .difficulty.VVD {
    background-color: rgba(255,89,205,0.6);
    border: 1px solid #ff59cd;
}
.difficulties .difficulty.INF {
    background-color: rgba(238,101,229,0.3);
    border: 1px solid #ee65e5;
}
.music-item .categorys {
    display: flex;
    justify-content: center;
    gap: 10px;
}
.categorys .category {
    width: 150px;
    border: 1px solid blue;
    padding: 5px 0;
    border-radius: 4px;
}
.music-item .btn-group {
    display: flex;
    position: absolute;
    width: 100%;
    bottom: 0px;
}
.music-item .btn-group button{
    display: block;
    flex-grow: 1;
    border: none;
    line-height: 30px;
    font-size: 14px;
    width: 0;
    transition: background-color 0.2s linear;
    color: rgba(255, 255, 255, 0.83);
}
button.select {
    background-color: #fb494c;
}
button.select.selected {
    background-color: aquamarine;
    color: rgba(0, 0, 0, 0.83);
}
button.select.selected::before {
    content: '√';
    margin-right: 5px;
}
button.select.selected::after {
    content: 'ed';
}
button.copy {
    background-color: #49c9fb;
}
</style>