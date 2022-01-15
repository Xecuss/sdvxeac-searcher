<template>
<div class="music-item">
    <img class="cover" v-lazy="`https://p.eagate.573.jp/${data.cover}`" />
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
</template>
<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
    data: {
        type: Object as PropType<IMusicItem>,
        required: true
    }
});
</script>
<style scoped>
.music-item {
    width: 90%;
    margin: 20px auto 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    padding: 10px;
}
.music-item .cover{
    display: block;
    width: 187px;
    height: 187px;
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
    border: 1px solid red;
    padding: 5px 0;
    border-radius: 4px;
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
</style>