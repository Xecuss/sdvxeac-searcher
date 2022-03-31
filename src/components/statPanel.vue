<template>
<Panel v-model:show="show">
    <div class="stat-panel">
    </div>
</Panel>
</template>
<script setup lang="ts">
import { computed, inject, PropType } from 'vue';

interface IStatViewModel {
    favCount: number;
    avgLevel: number;
}

const packInfo = inject<Map<string, number>>('packInfo');

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

const showViewModel = computed(() => {
    const result = []
    for(let item of props.data) {
    }
});
</script>