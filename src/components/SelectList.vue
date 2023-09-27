<template>
    <div class="multiselect-list">
        <div
            v-for="item in options"
            :key="item.value"
            class="select-option"
            :class="{ 'is-selected': modelValue.includes(item.value) }"
            @click="clickHandle(item.value)"
        >
            <div class="text">{{ item.label }}</div>
            <div v-if="item.sub !== undefined">{{ item.sub }}</div>
        </div>
    </div>
</template>
<script setup lang="ts" generic="T extends string | number">
interface ISelectListItem<V> {
    label: string;
    sub?: string;
    value: V;
}

const props = defineProps<{
    options: ISelectListItem<T>[];
    modelValue: T[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: T[]): void;
}>();

const clickHandle = (v: T) => {
    if (props.modelValue.includes(v)) {
        emit(
            "update:modelValue",
            props.modelValue.filter((item) => item !== v)
        );
    } else {
        emit("update:modelValue", [...props.modelValue, v]);
    }
};
</script>
<style scoped>
.multiselect-list {
    width: 100%;
}
.select-option {
    font-size: var(--el-select-font-size);
    padding: 0 40px 0 0;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--el-text-color-regular);
    min-height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.select-option:hover {
    background-color: var(--el-fill-color-light);
}
.select-option.is-selected {
    color: var(--el-color-primary);
}
.select-option.is-selected::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 20px;
    border-top: none;
    border-right: none;
    background-repeat: no-repeat;
    background-position: center;
    background-color: var(--el-color-primary);
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    -webkit-mask: url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E")
        no-repeat;
    -webkit-mask-size: 100% 100%;
}
.select-option .text {
    text-wrap: wrap;
    margin-right: 10px;
}
</style>
