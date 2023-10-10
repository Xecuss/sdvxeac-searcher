<template>
    <el-drawer direction="ltr" size="80%">
        <template #header><h3 class="header">Filter</h3></template>
        <el-collapse accordion>
            <el-collapse-item title="Package"
                ><select-list
                    :model-value="packFilters"
                    :options="packFilterList"
                    @update:model-value="(v) => $emit('update:packFilters', v)"
            /></el-collapse-item>
            <el-collapse-item title="Difficulty">
                <select-list
                    :model-value="diffFilters"
                    :options="diffFilterList"
                    @update:model-value="(v) => $emit('update:diffFilters', v)"
                />
            </el-collapse-item>
            <el-collapse-item title="Category">
                <select-list
                    :model-value="cateFilters"
                    :options="cateFilterList"
                    @update:model-value="(v) => $emit('update:cateFilters', v)"
                />
            </el-collapse-item>
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
    cateInfo: ICompressedItem[];
    packFilters: number[];
    cateFilters: number[];
    diffFilters: number[];
}>();

const emit = defineEmits<{
    (e: "update:packFilters", value: number[]): void;
    (e: "update:cateFilters", value: number[]): void;
    (e: "update:diffFilters", value: number[]): void;
}>();

const convert2SelectItem = (rawList: ICompressedItem[]) =>
    rawList.map((item) => ({
        value: item.id,
        label: simpleDisplay(item.name),
        sub: item.count.toString(),
    }));

const packFilterList = computed(() => convert2SelectItem(props.packInfo));
const cateFilterList = computed(() => convert2SelectItem(props.cateInfo));
const diffFilterList = Array(20)
    .fill(1)
    .map((item, idx) => ({
        value: idx + 1,
        label: `Lv.${idx + 1}`,
    }));
</script>
<style scoped>
.header {
    width: 100%;
    margin: 0;
}
</style>
