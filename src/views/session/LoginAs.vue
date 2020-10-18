<template>
    <div class="session-wrapper">
        <app-section-loader :status="loading"></app-section-loader>
        <div class="session-right text-xs-center ml-0">
            <div class="session-table-cell">
                <div class="session-content">
                    <v-card pa-0 class="top-title" v-if="!loading">
                        <v-card-title primary-title pa-0>
                            <h3 class="headline">Login as</h3>
                        </v-card-title>
                    </v-card>

                    <v-card v-if="!loading">
                        <v-card-title primary-title>
                            <div
                                class="client-group"
                                v-for="(client_group, key, index) in clients"
                                :key="key"
                            >
                                <v-divider v-show="index > 0"></v-divider>
                                <h3 class="headline client-group">{{clients[key].client.name}}</h3>

                                <div
                                    v-for="(user_group, key2) in clients[key].user_groups"
                                    :key="key2"
                                >
                                    <span
                                        class="user-group"
                                        @click="selectUserGroup(key, key2)"
                                    >{{clients[key].user_groups[key2].name}}</span>
                                </div>
                            </div>
                        </v-card-title>
                    </v-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";

export default {
    name: "LoginAs",
    props: { fromLogin: { type: Boolean, default: false } },
    data() {
        return {
            loading: true,
            showDivider: false,
            clients: null,
            user: null
        };
    },
    mounted() {
        if (
            this.fromLogin ||
            this.$breadcrumbs[0].meta.redirect == "/" ||
            /^\/activate/i.exec(this.$breadcrumbs[0].meta.redirect) ||
            /^\/session/i.exec(this.$breadcrumbs[0].meta.redirect) ||
            /^\/expired/i.exec(this.$breadcrumbs[0].meta.redirect)
        ) {
            this.$breadcrumbs[0].meta.redirect = "/dashboard";
        }

        this.getUserData();
    },
    methods: {
        getUserData() {
            ApiService.get("user_details").then(data => {
                this.user = data.user;
                this.clients = {};
                if (data.user.is_admin) {
                    this.$store
                        .dispatch("SET_USER_CONFIGURATION", {
                            user: this.user,
                            client: null,
                            user_group: null,
                            profile: null
                        })
                        .then(() => {
                            this.$router.push(
                                this.$breadcrumbs[0].meta.redirect
                            );
                        });
                } else if (!data.user.clients.length) {
                    this.$socket.emit("logout");
                    this.$store.dispatch("forceLogout");
                } else if (data.user.clients.length === 1) {
                    this.$store
                        .dispatch("SET_USER_CONFIGURATION", {
                            user: this.user,
                            client: this.user.clients[0].client,
                            user_group: this.user.clients[0].user_group,
                            profile: this.user.clients[0].profile
                        })
                        .then(() => {
                            if (this.fromLogin) {
                                ApiService.post("loginas", {
                                    hideSnackbar: true
                                }).then(data => {
                                    this.$router.go(
                                        this.$breadcrumbs[0].meta.redirect
                                    );
                                });
                            } else {
                                this.$socket.emit("login", {
                                    user_id: this.getAuthUser("_id"),
                                    client_id: this.getAuthClient("_id")
                                });
                                this.$router.push(
                                    this.$breadcrumbs[0].meta.redirect
                                );
                            }
                        });
                } else {
                    data.user.clients.forEach(client => {
                        if (client.user_group) {
                            if (!this.clients[client.client._id]) {
                                this.clients[client.client._id] = {
                                    client: client.client
                                };
                            }
                            if (
                                !this.clients[client.client._id]["user_groups"]
                            ) {
                                this.clients[client.client._id][
                                    "user_groups"
                                ] = {};
                                this.clients[client.client._id][
                                    "profiles"
                                ] = {};
                            }
                            this.clients[client.client._id]["user_groups"][
                                client.user_group._id
                            ] = client.user_group;
                            this.clients[client.client._id]["profiles"][
                                client.user_group._id
                            ] = client.profile;
                        }
                    });

                    const {
                        CLIENT_GROUP,
                        USER_GROUP
                    } = JwtService.getClientData();

                    if (CLIENT_GROUP && USER_GROUP) {
                        this.selectUserGroup(CLIENT_GROUP, USER_GROUP);
                    } else {
                        this.loading = false;
                    }
                }
            });
        },
        selectUserGroup(client_group, user_group) {
            JwtService.saveClientData(client_group, user_group);
            this.$store
                .dispatch("SET_USER_CONFIGURATION", {
                    user: this.user,
                    client: this.clients[client_group].client,
                    user_group: this.clients[client_group].user_groups[
                        user_group
                    ],
                    profile: this.clients[client_group].profiles[user_group]
                })
                .then(() => {
                    if (this.fromLogin) {
                        ApiService.post("loginas", {
                            hideSnackbar: true
                        }).then(data => {
                            this.$router.go(this.$breadcrumbs[0].meta.redirect);
                        });
                    } else {
                        this.$socket.emit("login", {
                            user_id: this.getAuthUser("_id"),
                            client_id: this.getAuthClient("_id")
                        });
                        this.$router.push(this.$breadcrumbs[0].meta.redirect);
                    }
                });
        }
    }
};
</script>
<style scoped>
.top-title {
    background: #f1f1f1;
}
.client-group {
    width: 100%;
    text-align: left;
}
.user-group {
    cursor: pointer;
}
.user-group:hover {
    font-weight: bold;
}
</style>