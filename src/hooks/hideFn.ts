import { Ref, ref, watchEffect } from "vue";
import { readLSValue, writeLSValue } from "../lib/utils";

export default function useHideFn() {
    /* 暂时隐藏还没开发完的功能 */
    const selectedMusic: Ref<Set<IMusicItem>> = ref(new Set());
    const initSelectedMusic = (musics: IMusicItem[]) => {
        selectedMusic.value = new Set([]);
        watchEffect(() => {
            writeLSValue(
                "selected-music",
                [...selectedMusic.value].map((item) => item.id)
            );
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
    const selectMusic = (music: IMusicItem) => {
        if (selectedMusic.value.has(music)) {
            selectedMusic.value.delete(music);
        } else {
            selectedMusic.value.add(music);
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
