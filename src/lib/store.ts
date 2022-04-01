import { Ref, ref } from "vue";

export const useFilter = () => {
    const selectedPack: Ref<string[]> = ref(filterOptions);
    
}