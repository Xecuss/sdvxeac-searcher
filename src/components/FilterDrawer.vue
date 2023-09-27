<template>
    <el-drawer direction="ltr" size="80%">
        <template #header><h3 class="header">Filter</h3></template>
        <el-collapse accordion>
            <el-collapse-item title="Package"
                ><select-list v-model="packValue" :options="packFilterList"
            /></el-collapse-item>
            <el-collapse-item title="Difficulty"> Package </el-collapse-item>
            <el-collapse-item title="Category"> Category </el-collapse-item>
        </el-collapse>
    </el-drawer>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import type { ICompressedItem } from "../lib/SearchCore";
import SelectList from "./SelectList.vue";
import { simpleDisplay } from "../lib/utils";

const props = defineProps<{
    packInfo: ICompressedItem[];
}>();

const packFilterList = computed(() =>
    props.packInfo.map((item) => ({
        value: item.id,
        label: simpleDisplay(item.name),
        sub: item.count.toString(),
    }))
);

const packValue = ref<number[]>([]);
</script>
<style scoped>
.header {
    width: 100%;
    margin: 0;
}
</style>
