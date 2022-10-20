<template>
    <div v-if="show" class="blur-bg" @click.stop="requireClose">
        <div class="float-panel" @click.stop>
            <slot />
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits<{
    (e: "update:show", value: boolean): void;
}>();

const requireClose = () => {
    emit("update:show", false);
};
</script>
<style scoped>
.blur-bg {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(3px);
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}
.blur-bg .float-panel {
    width: 90%;
    margin: 20px auto 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    padding: 10px;
    max-height: 50vh;
    background-color: white;
    overflow: auto;
}
</style>
