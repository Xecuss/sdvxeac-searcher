import { createApp } from "vue";
import App from "./App.vue";
import VueLazyLoad from "vue3-lazy";

createApp(App)
    .use(VueLazyLoad, {
        error: "",
        loading: "",
    })
    .mount("#app");
