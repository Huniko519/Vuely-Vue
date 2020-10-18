/**
 * Auth Module
 */

import Nprogress from "nprogress";
import router from "../../../router";

import ApiService from "@/common/api.service";
import jwtService from "../../../common/jwt.service";

import chatStore from "../auth/index";

const state = {
    user: null,
    client: null,
    user_group: null,
    profile: null,
    appInfo: null,
};

// getters
const getters = {
    appInfo: (state) => {
        return state.appInfo;
    },
};

// actions
const actions = {
    unsetAuthData(context) {
        context.commit("unsetAuthData");
    },
    getAppInfo(context) {
        ApiService.get("/app_info").then((response) => {
            context.commit("MUTATION_SET_APP_INFO", response.appInfo);
        });
    },
    forceLogout() {
        jwtService.destroyToken();
        jwtService.destroyClientData();
        router.push("/session/login");
    },
    getLinkDetails(context, payload) {
        let { linkDetail } = payload;
        ApiService.post("/linkdetails", linkDetail).then(
            (response) => {
                if (response.user.status == 2) {
                    router.push("/session/login");
                }
            },
            (error) => {
                router.push("/expired");
            }
        );
    },
    getPasswordVerifyLinkDetails(context, payload) {
        let { linkDetail } = payload;
        ApiService.post("/getPasswordVerifyLinkDetails", linkDetail).then(
            (response) => {},
            (error) => {
                router.push("/expired");
            }
        );
    },
    async activateUser(context, payload) {
        let { passDetail } = payload;
        await ApiService.post("activate", passDetail).then((response) => {
            setTimeout(() => {
                router.push("/session/login");
            }, 3000);
        });
    },
    async activateSuperAdmin(context, payload) {
        let { passDetail } = payload;
        await ApiService.post("activate_superadmin", passDetail).then(
            (response) => {
                setTimeout(() => {
                    router.push("/session/login");
                }, 3000);
            }
        );
    },
    async signupNewUser(context, payload) {
        let { userDetail } = payload;
        await ApiService.post( "signup", userDetail ).then( ( response ) => {
            if ( response.code == 1 ) {
                setTimeout( function () {
                    router.push( "/session/login" )
                }, 5000 );
            }
        } );
    },
    async forgotPassword(context, payload) {
        let { userEmail } = payload;
        await ApiService.post("requestotp", userEmail).then((response) => {});
    },
    async resetPassword(context, payload) {
        await ApiService.post("reset_password", payload).then((response) => {
            setTimeout(() => {
                router.push("/session/login");
            }, 3000);
        });
    },

    async signinUser(context, payload) {
        const { user } = payload;
        Nprogress.start();
        await ApiService.post("login", user).then(
            (response) => {
                // JWT Token
                jwtService.saveToken(response.token);
                context.commit("singinUserSuccess");
            },
            (error) => {
                context.commit("signinUserFailure", error);
            }
        );
    },

    signOutUser(context) {
        Nprogress.start();
        ApiService.post("/logout").then(
            (response) => {
                Nprogress.done();
                context.commit("signOutUser");
            },
            (error) => {
                Nprogress.done();
            }
        );
    },

    checkEmailExists(context, payload) {
        let { userEmail } = payload;
        ApiService.post("/checkEmailExists", userEmail).then(
            (response) => {
                this.valid = true;
            },
            (error) => {
                this.valid = false;
            }
        );
    },

    store_user_image(context, payload) {
        context.commit("store_user_details", payload);
    },
};

// mutations
const mutations = {
    MUTATION_SET_APP_INFO(state, payload) {
        state.appInfo = payload;
    },
    MUTAION_SET_AUTH_USER(state, payload) {
        state.user = payload;
    },
    MUTAION_SET_AUTH_CLIENT(state, payload) {
        state.client = payload;
    },
    MUTAION_SET_AUTH_USER_GROUP(state, payload) {
        state.user_group = payload;
    },
    MUTAION_SET_AUTH_USER_PROFILE(state, payload) {
        state.profile = payload;
    },
    store_user_details(state, payload) {
        if (payload.key === "client") {
            state.client = { ...state.client, ...payload.value };
        } else if (payload.key === "address") {
            state.user.address = { ...state.user.address, ...payload.value };
        } else if (payload.key === "contact_info") {
            state.user.contact_info = [...payload.value];
        } else if (payload.key === "profile") {
            state.profile = payload.value;
        } else if (
            payload.key === "user" ||
            payload.key === "userImage" ||
            payload.key === "email"
        ) {
            state.user = { ...state.user, ...payload.value };
        }
    },
    singinUserSuccess() {
        Nprogress.done();
        router.push({ name: "loginas", params: { fromLogin: true } });
    },
    signinUserFailure(state, error) {
        Nprogress.done();
    },
    unsetAuthData(state) {
        // Unsert Auth Data
        state.user = null;
        state.client = null;
        state.user_group = null;
        state.profile = null;

        /*
        state = {
            user: null,
            client: null,
            user_group: null
        };
        */

        // Unset Chat data
        chatStore.state = {
            users: null,
            loadingChatModule: false,
            loadingChat: false,
            chatSidebar: false,
            activeUsers: null,
        };
    },
    signOutUser(state) {
        jwtService.destroyToken();
        jwtService.destroyClientData();
        router.push("/session/login");
    },
    signUpUser(state) {
        Nprogress.start();
    },
    signUpUserSuccess(state, user) {
        state.user = localStorage.setItem("user", user);
        router.push("/session/loginas");
    },
    signUpUserFailure(state, error) {
        Nprogress.done();
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
