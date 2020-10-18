<!-- App Main Structure -->
<template>
    <div class="app-default-layout">
        <app-section-loader :status="loading"></app-section-loader>
        <Snackbar />
        <template>
            <!-- App Header -->
            <app-header :selectedUserInfo="selectedUserInfo"></app-header>
            <!-- App Main Content -->
            <v-content>
                <!-- App Router -->
                <transition
                    name="router-anim"
                    :enter-active-class="`animated ${selectedRouterAnimation}`"
                >
                    <router-view
                        @emitselectedUserInfoFromOverview="emitselectedUserInfoFromOverview"
                    ></router-view>
                </transition>
            </v-content>
            <!-- app customizer -->
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "Components/Header/Header.vue";
import Snackbar from "Components/Snackbar/Snackbar.vue";
import AppConfig from "Constants/AppConfig";
import { vm } from "../main";
export default {
    data() {
        return {
            selectedUserInfo: {}
        };
    },
    components: {
        appHeader: Header,
        Snackbar
    },
    computed: {
        ...mapGetters(["selectedRouterAnimation", "selectedTheme"]),
        loading() {
            return vm.loading;
        }
    },
    methods: {
        emitselectedUserInfoFromOverview(selectedUserInfo) {
            this.selectedUserInfo = selectedUserInfo;
        }
    },
    beforeRouteUpdate(to, from, next) {
        this.selectedUserInfo = "";
        next();
    },
    mounted() {
        this.$vuetify.theme = this.selectedTheme.theme;
    }
};
</script>

<style scoped>
.app-default-layout {
    height: 100vh;
}
</style>
