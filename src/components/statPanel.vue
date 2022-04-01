<template>
<Panel :show="show" @update:show="$emit('update:show', false)">
    <div class="stat-panel">
        <table class="stat-table">
            <tr>
                <th>Pack</th>
                <th>Select/Total</th>
                <th>Avg Diff</th>
            </tr>
            <tr v-for="item in showViewModel" :key="item.name">
                <td>{{simpleDisplay(item.name)}}</td>
                <td>{{item.favPer.toFixed(3)}}</td>
                <td>{{item.avgLevel.toFixed(3)}}</td>
            </tr>
        </table>
    </div>
</Panel>
</template>
<script setup lang="ts">
import { computed, ComputedRef, inject, PropType } from 'vue';
import { simpleDisplay } from '../lib/utils';
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
        if(x.favPer !== y.favPer) return y.favPer - x.favPer;
        return y.avgLevel - x.avgLevel;
    })
});
</script>
<style scoped>
.stat-panel .stat-table {
    min-width: 100%;
}
</style>