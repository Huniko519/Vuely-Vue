/**
 * App Entry File
 */
import "babel-polyfill";
import Vue from "vue";
import Vuetify from "vuetify";
import VueQuillEditor from "vue-quill-editor";
import VueBreadcrumbs from "vue2-breadcrumbs";
import Notifications from "vue-notification";
import velocity from "velocity-animate";
import Nprogress from "nprogress";
import VueI18n from "vue-i18n";
import fullscreen from "vue-fullscreen";
import VueClipboard from "vue-clipboard2";

import VueSocketIO from "vue-socket.io";

window._ = require("lodash");

// global components
import GlobalComponents from "./globalComponents";

// app.vue
import App from "./App";

// router
import router from "./router";

// store
import { store } from "./store/store";

// include all css files
import "./lib/VuelyCss";

// messages
import messages from "./lang";

import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";
import GlobalMixin from "@/common/global.mixin";

import ApiUrl from "@/config";

// navigation guards before each
router.beforeEach(async (to, from, next) => {
    Nprogress.start();

    if (!store.getters.appInfo) {
        store.dispatch("getAppInfo");
    }

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (JwtService.getToken()) {
            if (
                to.path.split("/")[1] === "session" &&
                to.path.split("/")[2] === "loginas"
            ) {
                next();
            } else {
                if (!GlobalMixin.methods.getAuthUser()) {
                    next({
                        path: "/session/loginas",
                    });
                } else {
                    if (!GlobalMixin.methods.isAdmin()) {
                        ApiService.setClient(
                            GlobalMixin.methods.getAuthClient("_id"),
                            GlobalMixin.methods.getAuthUserGroup("_id")
                        );
                    } else {
                        ApiService.unsetClient();
                    }

                    if (
                        GlobalMixin.methods.hasUrlAccess(to.path.split("/")[1])
                    ) {
                        next();
                    } else {
                        next({
                            path: "/session/login",
                        });
                    }
                }
            }
        } else {
            next({
                path: "/session/login",
                query: { redirect: to.fullPath },
            });
        }
    } else {
        store.dispatch("unsetAuthData");
        next();
    }
});

// navigation guard after each
router.afterEach((to, from) => {
    Nprogress.done();
    const contentWrapper = document.querySelector(".v-content__wrap");
    if (contentWrapper !== null) {
        contentWrapper.scrollTop = 0;
    }
    const boxedLayout = document.querySelector(
        ".app-boxed-layout .app-content"
    );
    if (boxedLayout !== null) {
        boxedLayout.scrollTop = 0;
    }
    const miniLayout = document.querySelector(".app-mini-layout .app-content");
    if (miniLayout !== null) {
        miniLayout.scrollTop = 0;
    }
});

// plugins
Vue.use(Vuetify, {
    theme: store.getters.selectedTheme.theme,
    options: {
        customProperties: true,
    },
});
Vue.use(VueClipboard);
Vue.use(VueI18n);
Vue.use(VueQuillEditor);
Vue.use(VueBreadcrumbs);
Vue.use(Notifications, { velocity });
Vue.use(fullscreen);
Vue.use(GlobalComponents);
Vue.use(require("vue-cookies"));

// Socket
if (JwtService.getToken()) {
    Vue.use(
        new VueSocketIO({
            debug: true,
            connection: ApiUrl,
            vuex: {
                store,
                actionPrefix: "SOCKET_",
                mutationPrefix: "SOCKET_",
            },
        })
    );
}

// Initialize api service
ApiService.init();

// Set global Mixin
Vue.mixin(GlobalMixin);

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: store.getters.selectedLocale.locale, // set locale
    messages, // set locale messages
    silentTranslationWarn: true,
});

/* eslint-disable no-new */
export let vm = new Vue({
    store,
    i18n,
    router,
    render: (h) => h(App),
    data: {
        loading: false,
        loadingPartial: false,
        snackbar: false,
        snackbarText: "",
        snackbarColor: "",
    },
    components: { App },
    mounted() {},
}).$mount("#app");
