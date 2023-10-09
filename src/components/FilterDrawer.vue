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
                <div :style="{ margin: '15px' }">
                    <el-slider
                        range
                        :max="20"
                        :min="1"
                        :step="1"
                        show-stops
                        :model-value="diffRange"
                        @update:model-value="diffChangeHandle"
                    />
                </div>
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

const diffRange = computed(() => {
    if (!props.diffFilters.length) return [1, 20];

    const range = [Infinity, 0];
    props.diffFilters.forEach((item) => {
        if (item < range[0]) range[0] = item;
        else if (item > range[1]) range[1] = item;
    });
    return range;
});

const diffChangeHandle = ([s, e]: any) => {
    console.log(s, e);
    emit(
        "update:diffFilters",
        Array(e - s + 1)
            .fill(s)
            .map((item, idx) => idx + item)
    );
};
</script>
<style scoped>
.header {
    width: 100%;
    margin: 0;
}
</style>
