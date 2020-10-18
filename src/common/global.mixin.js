import { store } from "@/store/store";
import root from "vue-resource/src/url/root";

const GlobalMixin = {
    methods: {
        hasAccess(module = null, feature = "view") {
            if (store.state.auth.user === null) return false;
            if (store.state.auth.user.is_admin && module == "chat")
                return false;
            if (store.state.auth.user.is_admin) return true;
            if (store.state.auth.user_group === null) return false;
            return store.state.auth.user_group.modules_access[module]
                ? store.state.auth.user_group.modules_access[module][feature]
                : false;
        },

        hasUrlAccess(path) {
            let module = null;
            switch (path) {
                case "clients":
                    module = "client";
                    break;
                case "users":
                    module = "user";
                    break;
                case "locations":
                    module = "location";
                    break;
                case "patients":
                    module = "patient";
                    break;
                case "contacts":
                    module = "contact";
                    break;
                case "alerts":
                    module = "alert";
                    break;
                case "settings":
                    module = "settings";
                    break;
                case "vendors":
                    module = "vendor";
                    break;
                case "form-builder":
                    module = "form_builder";
                    break;
            }

            return module ? this.hasAccess(module, "view") : true;
        },

        isAdmin() {
            if (store.state.auth.user) return store.state.auth.user.is_admin;
            return false;
        },

        inArray(haystack = [], needle) {
            return haystack.hasOwnProperty(needle);
        },

        getAuthUser(key = "", rootKey = "") {
            if (!key && !rootKey && store.state.auth.user === null)
                return false;

            if (!key && !rootKey) return store.state.auth.user;

            if (store.state.auth.user === null) return "";

            if (rootKey) {
                if (
                    !this.inArray(store.state.auth.user, rootKey) ||
                    store.state.auth.user[rootKey] === null ||
                    !this.inArray(store.state.auth.user[rootKey], key)
                ) {
                    return "";
                } else {
                    return store.state.auth.user[rootKey][key];
                }
            } else {
                if (!this.inArray(store.state.auth.user, key)) {
                    return "";
                } else {
                    return store.state.auth.user[key];
                }
            }
        },

        getAppInfo(key = "", rootKey = "") {
            if (!key && !rootKey && store.state.auth.appInfo === null)
                return false;

            if (!key && !rootKey) return store.state.auth.appInfo;

            if (store.state.auth.appInfo === null) return "";

            if (rootKey) {
                if (
                    !this.inArray(store.state.auth.appInfo, rootKey) ||
                    store.state.auth.appInfo[rootKey] === null ||
                    !this.inArray(store.state.auth.appInfo[rootKey], key)
                ) {
                    return "";
                } else {
                    return store.state.auth.appInfo[rootKey][key];
                }
            } else {
                if (!this.inArray(store.state.auth.appInfo, key)) {
                    return "";
                } else {
                    return store.state.auth.appInfo[key];
                }
            }
        },

        getAuthUserProfile(key = "", rootKey = "") {
            if (!key && !rootKey && store.state.auth.profile === null)
                return false;

            if (!key && !rootKey) return store.state.auth.profile;

            if (store.state.auth.profile === null) return "";

            if (rootKey) {
                if (
                    !this.inArray(store.state.auth.profile, rootKey) ||
                    store.state.auth.profile[rootKey] === null ||
                    !this.inArray(store.state.auth.profile[rootKey], key)
                ) {
                    return "";
                } else {
                    return store.state.auth.profile[rootKey][key];
                }
            } else {
                if (!this.inArray(store.state.auth.profile, key)) {
                    return "";
                } else {
                    return store.state.auth.profile[key];
                }
            }
        },

        getAuthClient(key = "", rootKey = "") {
            if (!key && !rootKey && store.state.auth.client === null)
                return false;

            if (!key && !rootKey) return store.state.auth.client;

            if (store.state.auth.client === null) return "";

            if (rootKey) {
                if (
                    !this.inArray(store.state.auth.client, rootKey) ||
                    store.state.auth.client[rootKey] === null ||
                    !this.inArray(store.state.auth.client[rootKey], key)
                ) {
                    return "";
                } else {
                    return store.state.auth.client[rootKey][key];
                }
            } else {
                if (!this.inArray(store.state.auth.client, key)) {
                    return "";
                } else {
                    return store.state.auth.client[key];
                }
            }
        },

        getAuthUserGroup(key = "", rootKey = "") {
            if (!key && !rootKey && store.state.auth.user_group === null)
                return false;

            if (!key && !rootKey) return store.state.auth.user_group;

            if (store.state.auth.user_group === null) return "";

            if (rootKey) {
                if (
                    !this.inArray(store.state.auth.user_group, rootKey) ||
                    store.state.auth.user_group[rootKey] === null ||
                    !this.inArray(store.state.auth.user_group[rootKey], key)
                ) {
                    return "";
                } else {
                    return store.state.auth.user_group[rootKey][key];
                }
            } else {
                if (!this.inArray(store.state.auth.user_group, key)) {
                    return "";
                } else {
                    return store.state.auth.user_group[key];
                }
            }
        },
    },
};
export default GlobalMixin;
