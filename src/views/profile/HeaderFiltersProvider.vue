<template>
    <div class="header-filter pa-0 elevation-0">
        <h5 class="mb-3">{{$t('message.headerFilters')}}</h5>
        <v-list class="theme-list">
            <v-list-tile
                :class="{'active-theme': headerFilter.id === activeHeaderFilter.id}"
                @click="changeHeaderFilter(headerFilter)"
                v-for="headerFilter in headerFilters"
                :key="headerFilter.id"
            >
                <span :class="headerFilter.class"></span>
            </v-list-tile>
        </v-list>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters(["headerFilters", "activeHeaderFilter"])
    },
    methods: {
        changeHeaderFilter(filter) {
            this.$store.dispatch("changeHeaderFilter", filter);
            this.$store.dispatch("store_user_details", {
                key: "headerFilter",
                value: filter
            });
        }
    }
};
</script>
