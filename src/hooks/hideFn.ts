import { reactive, Ref, ref, watchEffect } from "vue";
import { readLSValue, writeLSValue } from "../lib/utils";

export default function useHideFn() {
    /* 暂时隐藏还没开发完的功能 */
    const selectedMusic: Set<string> = reactive(
        new Set(readLSValue("selected-music") ?? [])
    );
    const initSelectedMusic = () => {
        watchEffect(() => {
            writeLSValue("selected-music", [...selectedMusic]);
        });
    };
    const displayHidden: Ref<boolean> = ref(false);
    let clickCount = 0;
    const titleClickHandle = () => {
        clickCount++;
        if (clickCount > 5) {
            displayHidden.value = true;
        }
    };
    const selectMusic = (id: string) => {
        if (selectedMusic.has(id)) {
            selectedMusic.delete(id);
        } else {
            selectedMusic.add(id);
        }
    };
    return {
        selectedMusic,
        initSelectedMusic,
        displayHidden,
        titleClickHandle,
        selectMusic,
    };
}
