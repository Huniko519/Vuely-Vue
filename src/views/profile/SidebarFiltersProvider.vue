<template>
    <div class="sidebar-filter pa-0 elevation-0" v-if="isDefaultLayout()">
        <h5 class="mb-3">{{$t('message.sidebarFilters')}}</h5>
        <v-list class="theme-list">
            <v-list-tile
                :class="{'active-theme': sidebarFilter.id === sidebarSelectedFilter.id}"
                @click="emitSidebarFilters(sidebarFilter)"
                v-for="sidebarFilter in sidebarFilters"
                :key="sidebarFilter.id"
            >
                <span :class="sidebarFilter.class" class="py-3"></span>
            </v-list-tile>
        </v-list>
    </div>
</template>

<script>
import { getCurrentAppLayout } from "Helpers/helpers";
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters(["sidebarFilters", "sidebarSelectedFilter"])
    },
    methods: {
        // color filter handler
        emitSidebarFilters(value) {
            this.$store.dispatch("changeSidebarFilter", value);
            this.$store.dispatch("store_user_details", {
                key: "sidebarFilter",
                value: value
            });
        },
        // function which return app current layout
        isDefaultLayout() {
            const layout = getCurrentAppLayout(this.$router);
            if (
                layout === "boxed" ||
                layout === "horizontal" ||
                layout === "boxed-v2"
            ) {
                return false;
            } else {
                return true;
            }
        }
    }
};
</script>
