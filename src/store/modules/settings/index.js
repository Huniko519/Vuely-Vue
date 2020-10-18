/**
 * Settings Module
 */
import {
    languages,
    //sidebarBackgroundImages,
    sidebarFilters,
    routerAnimations,
    themes,
    headerFilters,
} from "./data";
import ApiService from "@/common/api.service";
import Vue from "vue";
import { vm } from "../../../main";
import router from "../../../router";

import authStore from "../auth/index";

const state = {
    darkMode: false, // dark mode
    collapseSidebar: false, // mini sidevar
    rtlLayout: false, // rtl layout
    backgroundImage: false, // enable sidebar background image
    horizontalLayoutSidebar: false, // horizontal layout sidebar
    languages, // languages
    selectedLocale: languages[0], // selected locale
    //sidebarBackgroundImages, // sidebar backgorund images
    //selectedSidebarBgImage: sidebarBackgroundImages[0], // selected sidebar background image
    sidebarFilters, // sidebar filters
    sidebarSelectedFilter: sidebarFilters[0], // selected sidebar filter
    routerAnimations, // router animations
    selectedRouterAnimation: routerAnimations[1], // selected router animation
    themes, // themes
    selectedTheme: themes[0], // selected theme
    headerFilters, // header filters
    activeHeaderFilter: headerFilters[1], // selected header filter
    mobileSearchForm: false, // Is Mobile Search Form Open
};

// getters
const getters = {
    darkMode: (state) => {
        return state.darkMode;
    },
    collapseSidebar: (state) => {
        return state.collapseSidebar;
    },
    boxLayout: (state) => {
        return state.boxLayout;
    },
    rtlLayout: (state) => {
        return state.rtlLayout;
    },
    backgroundImage: (state) => {
        return state.backgroundImage;
    },
    selectedLocale: (state) => {
        return state.selectedLocale;
    },
    languages: (state) => {
        return state.languages;
    },
    /*
    sidebarBackgroundImages: state => {
        return state.sidebarBackgroundImages;
    },
    */
    selectedSidebarBgImage: (state) => {
        return state.selectedSidebarBgImage;
    },
    sidebarFilters: (state) => {
        return state.sidebarFilters;
    },
    sidebarSelectedFilter: (state) => {
        return state.sidebarSelectedFilter;
    },
    selectedRouterAnimation: (state) => {
        return state.selectedRouterAnimation;
    },
    routerAnimations: (state) => {
        return state.routerAnimations;
    },
    themes: (state) => {
        return state.themes;
    },
    selectedTheme: (state) => {
        return state.selectedTheme;
    },
    headerFilters: (state) => {
        return state.headerFilters;
    },
    activeHeaderFilter: (state) => {
        return state.activeHeaderFilter;
    },
    horizontalLayoutSidebar: (state) => {
        return state.horizontalLayoutSidebar;
    },
    mobileSearchForm: (state) => {
        return state.mobileSearchForm;
    },
};

// actions
const actions = {
    darkModeHandler(context) {
        context.commit("darkModeHandler");
    },
    collapseSidebar(context) {
        context.commit("collapseSidebarHandler");
    },
    boxLayout(context) {
        context.commit("boxLayoutHandler");
    },
    rtlLayout(context) {
        context.commit("rtlLayoutHandler");
    },
    backgroundImage(context) {
        context.commit("sidebarBgImageHandler");
    },
    changeLanguage(context, payload) {
        context.commit("changeLanguageHandler", payload);
    },
    changeBackgroundImage(context, payload) {
        context.commit("changeBackgroundImageHandler", payload);
    },
    changeSidebarFilter(context, payload) {
        context.commit("changeSidebarFilterHandler", payload);
    },
    changeRouterAnimation(context, payload) {
        context.commit("changeRouterAnimationHandler", payload);
    },
    changeTheme(context, payload) {
        context.commit("changeThemeHandler", payload);
    },
    changeHeaderFilter(context, payload) {
        context.commit("changeHeaderFilterHandler", payload);
    },
    setMiniSidebarLayout(context, payload) {
        context.commit("setMiniSidebarLayoutHandler", payload);
    },
    toggleHorizontalLayoutSidebar(context, payload) {
        context.commit("toggleHorizontalLayoutSidebarHandler", payload);
    },
    toggleSearchForm(context) {
        context.commit("toggleSearchFormHandler");
    },
    store_user_details(context, payload) {
        return ApiService.post("store_user_details", payload).then(
            (response) => {
                context.commit("store_user_details", payload);
                return response;
            },
            (error) => {
                return error;
            }
        );
    },
    SET_USER_CONFIGURATION: (context, payload) => {
        return new Promise((resolve, reject) => {
            try {
                const { user, client, user_group, profile } = payload;
                // authStore.state.user = user;
                context.commit("MUTAION_SET_AUTH_USER", user);

                if (user.is_admin) {
                    /*
                    context.dispatch(
                        "changeBackgroundImage",
                        sidebarBackgroundImages[0]
                    );
                    */
                    context.dispatch("changeSidebarFilter", sidebarFilters[0]);
                    context.dispatch(
                        "changeRouterAnimation",
                        routerAnimations[1]
                    );
                    context.dispatch("changeTheme", themes[0]);
                    context.dispatch("changeHeaderFilter", headerFilters[1]);
                } else {
                    //authStore.state.client = client;
                    //authStore.state.user_group = user_group;
                    context.commit("MUTAION_SET_AUTH_CLIENT", client);
                    context.commit("MUTAION_SET_AUTH_USER_GROUP", user_group);
                    context.commit("MUTAION_SET_AUTH_USER_PROFILE", profile);

                    let settings = client.settings;

                    context.dispatch(
                        "changeRouterAnimation",
                        settings.routerAnimation ||
                            state.selectedRouterAnimation
                    );

                    if (settings.darkMode == "true")
                        context.dispatch("darkModeHandler");

                    context.dispatch(
                        "changeTheme",
                        Object.keys(settings.theme).length
                            ? settings.theme
                            : state.selectedTheme
                    );

                    context.dispatch(
                        "changeHeaderFilter",
                        Object.keys(settings.headerFilter).length
                            ? settings.headerFilter
                            : state.activeHeaderFilter
                    );

                    context.dispatch(
                        "changeSidebarFilter",
                        Object.keys(settings.sidebarFilter).length
                            ? settings.sidebarFilter
                            : state.sidebarSelectedFilter
                    );

                    context.dispatch(
                        "changeBackgroundImage",
                        Object.keys(settings.sidebarBgImage).length
                            ? settings.sidebarBgImage
                            : state.selectedSidebarBgImage
                    );
                    if (settings.rtlLayout == "true")
                        store.dispatch("rtlLayout");

                    if (settings.collapseSidebar == "true")
                        context.dispatch("collapseSidebar");
                }

                resolve();
            } catch (err) {
                reject(err);
            }
        });
    },
};

// mutations
const mutations = {
    darkModeHandler(state) {
        state.darkMode = !state.darkMode;
    },
    collapseSidebarHandler(state) {
        state.collapseSidebar = !state.collapseSidebar;
    },
    boxLayoutHandler(state) {
        state.boxLayout = !state.boxLayout;
    },
    rtlLayoutHandler(state) {
        state.rtlLayout = !state.rtlLayout;
    },
    sidebarBgImageHandler(state) {
        state.backgroundImage = !state.backgroundImage;
    },
    changeLanguageHandler(state, language) {
        state.selectedLocale = language;
        if (language.locale === "he" || language.locale === "ar") {
            state.rtlLayout = true;
        } else {
            state.rtlLayout = false;
        }
    },
    changeBackgroundImageHandler(state, image) {
        state.selectedSidebarBgImage = image;
    },
    changeSidebarFilterHandler(state, filter) {
        state.sidebarSelectedFilter = filter;
    },
    changeRouterAnimationHandler(state, animation) {
        state.selectedRouterAnimation = animation;
    },
    changeThemeHandler(state, theme) {
        state.selectedTheme = theme;
    },
    changeHeaderFilterHandler(state, filter) {
        state.activeHeaderFilter = filter;
    },
    setMiniSidebarLayoutHandler(state, isSet) {
        state.collapseSidebar = isSet;
    },
    toggleHorizontalLayoutSidebarHandler(state, value) {
        state.horizontalLayoutSidebar = value;
    },
    toggleSearchFormHandler(state) {
        state.mobileSearchForm = !state.mobileSearchForm;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
