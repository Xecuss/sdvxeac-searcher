<template>
    <Panel :show="show" @update:show="$emit('update:show', false)">
        <div class="stat-panel">
            <table class="stat-table">
                <tr>
                    <th>Pack</th>
                    <th>Select/Total</th>
                    <th>Avg Diff</th>
                </tr>
                <tr v-for="item in data" :key="item.name">
                    <td>{{ simpleDisplay(item.name) }}</td>
                    <td>{{ item.favPer.toFixed(3) }}</td>
                    <td>{{ item.avgLevel.toFixed(3) }}</td>
                </tr>
            </table>
        </div>
    </Panel>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { IStatResult } from "../lib/SearchCore";
import { simpleDisplay } from "../lib/utils";
import Panel from "./FloatPanel.vue";

const props = defineProps({
    show: {
        default: false,
        type: Boolean,
    },
    data: {
        type: Array as PropType<IStatResult[]>,
        default: () => [],
    },
});

defineEmits({
    "update:show": Boolean,
});
</script>
<style scoped>
.stat-panel .stat-table {
    min-width: 100%;
}
</style>
