import Vue from "vue";
import Vuex from "vuex";

// modules
import auth from "./modules/auth";
import settings from "./modules/settings";
import sidebar from "./modules/sidebar";
import common from "./modules/common";
import chat from "./modules/chat";

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        auth,
        settings,
        sidebar,
        common,
        chat
    }
});
