import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import CoreuiVue from "@coreui/vue";

const app = createApp(App);
app.use(CoreuiVue);
app.mount("#app");
