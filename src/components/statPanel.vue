<template>
<Panel v-model:show="show">
    <div class="stat-panel">
        <p v-for="item in showViewModel" :key="item.name">{{item.name}} - {{item.favPer}} - {{item.avgLevel}}</p>
    </div>
</Panel>
</template>
<script setup lang="ts">
import { computed, ComputedRef, inject, PropType } from 'vue';
import Panel from './panel.vue';

interface IStatViewModel {
    name: string;
    favCount: number;
    favPer: number;
    avgLevel: number;
}

let packInfo = inject<Map<string, number>>('packInfo');

const props = defineProps({ 
    show: { 
        default: false, 
        type: Boolean 
    },
    data: {
        type: Array as PropType<[string, IMusicItem[]][]>,
        default: []
    }
});

const showViewModel: ComputedRef<IStatViewModel[]> = computed(() => {
    return props.data.map(item => {
        const [name, packs] = item;
        const packContains = packInfo?.get(name);
        const favCount = packs.length;
        const favPer = packContains !== undefined ? favCount / packContains : 0;
        const avgLevel = packs.reduce((prev, item) => prev + item.difficulties.slice(-1)[0].level, 0) / favCount;
        return {
            name,
            favCount,
            favPer,
            avgLevel,
        }
    }).sort((x, y) => {
        if(x.favPer !== y.favPer) return x.favPer - y.favPer;
        return x.avgLevel - y.avgLevel;
    })
});
</script>