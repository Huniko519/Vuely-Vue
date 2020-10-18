<!-- Side Structure -->
<template>
    <div class="sidebar" :class="sidebarSelectedFilter.class">
        <vue-perfect-scrollbar class="scroll-area" :settings="settings">
            <v-toolbar flat class="transparent scroll-area navigation">
                <v-list>
                    <router-link :to="`/dashboard`" class="pa-3">
                        <h4>{{ isAdmin() ? 'Dashboard': getAuthClient('name')}}</h4>
                    </router-link>
                    <template v-for="(category, key) in menus">
                        <div :key="key">
                            <div class="sidebar-title px-3">
                                <span>{{$t(key)}}</span>
                            </div>
                            <template v-for="item in category">
                                <template>
                                    <v-list-tile
                                        :to="!item.exact ? `/${getCurrentAppLayoutHandler() + item.path}` : item.path"
                                        :key="item.path"
                                        v-if="hasAccess(item.module, 'view')"
                                    >
                                        <v-list-tile-action>
                                            <i class="zmdi zmdi-caret-right op-0"></i>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>
                                                <i class="mr-2 zmdi" :class="item.action"></i>
                                                <span>{{ textTruncate($t(item.title)) }}</span>
                                            </v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </template>
                            </template>
                        </div>
                    </template>
                    <user-block></user-block>
                </v-list>
            </v-toolbar>
        </vue-perfect-scrollbar>
    </div>
</template>

<script>
import UserBlock from "./UserBlock";
import { textTruncate, getCurrentAppLayout } from "Helpers/helpers";
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            settings: {
                maxScrollbarLength: 160
            },
            client: {
                name: ""
            }
        };
    },
    components: {
        UserBlock
    },
    computed: {
        ...mapGetters(["sidebarSelectedFilter", "menus", "permissions"])
    },
    mounted() {
        this.$store.dispatch("setActiveMenuGroup", this.$router);
    },
    methods: {
        textTruncate(text) {
            return textTruncate(text, 18);
        },
        getCurrentAppLayoutHandler() {
            return getCurrentAppLayout(this.$router);
        }
    }
};
</script>
