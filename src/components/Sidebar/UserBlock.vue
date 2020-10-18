<template>
    <v-list-tile class="sidebar-profile">
        <v-list-tile-avatar v-on:click.prevent="openLink" :style="{ cursor: 'pointer'}">
            <div
                v-if="getAuthUser('image') == null"
                @click.stop="profile_picture_dialog = !profile_picture_dialog"
                class="img-responsive rounded-circle primary font-weight-bold white--text font-lg cursor-pointer text-uppercase rounded-user"
            >{{getAuthUser('first_name')[0]}}{{getAuthUser('last_name')[0]}}</div>

            <img
                v-else
                :src="getAuthUser('image')"
                class="img-responsive rounded-circle cursor"
                alt="user profile"
                style="width: 40px; height:40px"
            />
        </v-list-tile-avatar>
        <v-list-tile-content
            v-on:click.prevent="openLink"
            class="left-sidebar-title"
            :style="{ cursor: 'pointer'}"
        >
            <v-list-tile-title>
                <span
                    v-if="isAdmin()"
                >{{ getAuthUser('first_name') }} {{ getAuthUser('last_name') }}</span>
                <span
                    v-else
                >{{ getAuthUserProfile('first_name') }} {{ getAuthUserProfile('last_name') }}</span>
            </v-list-tile-title>
        </v-list-tile-content>

        <v-menu
            bottom
            offset-y
            left
            content-class="userblock-dropdown"
            nudge-top="-10"
            nudge-right="0"
            transition="slide-y-transition"
        >
            <v-btn dark icon slot="activator" class="ma-0">
                <v-icon>more_vert</v-icon>
            </v-btn>
            <div class="dropdown-content">
                <v-list class="dropdown-list">
                    <template v-for="userLink in userLinks">
                        <v-list-tile
                            v-if="userLink.id !== 2"
                            :to="userLink.path"
                            :key="userLink.id"
                        >
                            <i :class="userLink.icon"></i>
                            <span>{{$t(userLink.title)}}</span>
                        </v-list-tile>
                        <v-list-tile v-else @click="signOutUser" :key="userLink.id">
                            <i :class="userLink.icon"></i>
                            <span>{{$t(userLink.title)}}</span>
                        </v-list-tile>
                    </template>
                </v-list>
            </div>
        </v-menu>
    </v-list-tile>
</template>

<script>
export default {
    data() {
        return {
            userLinks: [
                /*{
                    id: 1,
                    title: "message.userProfile",
                    icon: "ti-user mr-3 primary--text",
                    path: "/profile"
                },
                */
                {
                    id: 2,
                    title: "message.logOut",
                    icon: "ti-power-off mr-3 error--text"
                }
            ]
        };
    },
    methods: {
        openLink() {
            this.$router.push("/profile");
        },
        signOutUser() {
            if (!this.getAuthUser("is_admin")) {
                this.$socket.emit("logout");
            }
            this.$store.dispatch("signOutUser", this.$router);
        }
    }
};
</script>
