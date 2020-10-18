<template>
    <div class="theme-color pa-0 elevation-0">
        <h5 class="mb-3">{{$t('message.selectTheme')}}</h5>
        <v-list class="theme-list">
            <v-list-tile
                v-for="theme in themes"
                :key="theme.id"
                @click="changeTheme(theme)"
                :class="{'active-theme': selectedTheme.id === theme.id}"
            >
                <span :class="theme.bgColor"></span>
            </v-list-tile>
        </v-list>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters(["themes", "selectedTheme"])
    },
    methods: {
        changeTheme(theme) {
            this.$store.dispatch("store_user_details", {
                key: "theme",
                value: theme
            });
            switch (theme.id) {
                case 1:
                    this.$store.dispatch("changeTheme", theme);
                    this.$vuetify.theme = theme.theme;
                    break;
                case 2:
                    this.$store.dispatch("changeTheme", theme);
                    this.$vuetify.theme = theme.theme;
                    break;
                case 3:
                    this.$store.dispatch("changeTheme", theme);
                    this.$vuetify.theme = theme.theme;
                    break;
                case 4:
                    this.$store.dispatch("changeTheme", theme);
                    this.$vuetify.theme = theme.theme;
                    break;
                case 5:
                    this.$store.dispatch("changeTheme", theme);
                    this.$vuetify.theme = theme.theme;
                    break;
                case 6:
                    this.$store.dispatch("changeTheme", theme);
                    this.$vuetify.theme = theme.theme;
                    break;
                default:
                    this.$store.dispatch("changeTheme", theme);
                    this.$vuetify.theme = theme.theme;
                    break;
            }
        }
    }
};
</script>
