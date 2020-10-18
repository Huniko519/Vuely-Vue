<template>
    <v-container fluid py-0 px-0>
        <template v-if="!loadingChatModule">
            <v-navigation-drawer temporary absolute v-model="chatSidebar" :width="250">
                <chat-sidebar></chat-sidebar>
            </v-navigation-drawer>
            <v-layout row wrap class="chat-layout">
                <v-flex xl2 lg3 md3 sm0 xs0 class="chat-sidebar">
                    <chat-sidebar></chat-sidebar>
                </v-flex>
                <v-flex xl10 lg9 md9 sm12 xs12 class="chat-main">
                    <group-chat-area v-if="type=='gc'"></group-chat-area>
                    <chat-area v-else></chat-area>
                </v-flex>
            </v-layout>
        </template>
        <template v-else>
            <div class="app-flex justify-center align-center h-vh-100">
                <chat-module-loader></chat-module-loader>
            </div>
        </template>
    </v-container>
</template>

<script>
import ApiService from "@/common/api.service";

import { mapGetters } from "vuex";
import ChatArea from "./components/ChatArea";
import GroupChatArea from "./components/GroupChatArea";
import ChatSidebar from "./components/ChatSidebar";
import ChatModuleLoader from "./components/ChatModuleLoader";

export default {
    components: {
        ChatArea,
        GroupChatArea,
        ChatSidebar,
        ChatModuleLoader
    },
    computed: {
        ...mapGetters(["chatFieldFocused", "selectedUser"]),
        chatSidebar: {
            get() {
                return this.$store.getters.chatSidebar;
            },
            set(val) {
                this.$store.dispatch("toggleChatSidebar", val);
            }
        }
    },
    data() {
        return {
            type: this.$route.path.split("/")[2],
            id: this.$route.path.split("/")[3],
            loadingChatModule: false
        };
    },
    sockets: {
        newMessagePrivateChat: function(data) {
            if (
                data.sender == this.getAuthUser("_id") &&
                this.$store.getters.selectedUser(data.receiver)
            ) {
                this.$store.commit("MUTATION_SET_PRIVATE_CHAT_NEW_MESSAGE", {
                    id: data.receiver,
                    data,
                    currentChatId: this.id
                });
            } else if (
                data.receiver == this.getAuthUser("_id") &&
                this.$store.getters.selectedUser(data.sender)
            ) {
                this.$store.commit("MUTATION_SET_PRIVATE_CHAT_NEW_MESSAGE", {
                    id: data.sender,
                    data,
                    currentChatId: this.id
                });

                if (this.chatFieldFocused) {
                    this.$socket.emit("markPrivateChatAsRead", {
                        sender: payload.id,
                        receiver: this.getAuthUser("_id")
                    });
                }
            }
        },
        newMessageGroupChat: function(data) {
            if (this.$store.getters.selectedGroup(data.group_id)) {
                this.$store.commit("MUTATION_SET_GROUP_CHAT_NEW_MESSAGE", {
                    id: data.group_id,
                    data
                });
            }
        },
        deleteGroupChat: function(data) {
            if (this.$store.getters.selectedGroup(data.group_id)) {
                this.$store.commit("MUTATION_DELETE_GROUP_CHAT", {
                    ...data
                });
            }
        },
        updateGroupChat: function(data) {
            if (this.$store.getters.selectedGroup(data.group_id)) {
                this.$store.commit("MUTATION_UPDATE_GROUP_CHAT", {
                    ...data
                });
            }
        },
        deletePrivateChat: function(data) {
            if (
                data.sender == this.getAuthUser("_id") &&
                this.$store.getters.selectedUser(data.receiver)
            ) {
                this.$store.commit("MUTATION_DELETE_PRIVATE_CHAT", {
                    user_id: data.receiver,
                    chat_id: data.chat_id
                });
            } else if (
                data.receiver == this.getAuthUser("_id") &&
                this.$store.getters.selectedUser(data.sender)
            ) {
                this.$store.commit("MUTATION_DELETE_PRIVATE_CHAT", {
                    user_id: data.sender,
                    chat_id: data.chat_id
                });
            }
        },
        updatePrivateChat: function(data) {
            if (
                data.sender == this.getAuthUser("_id") &&
                this.$store.getters.selectedUser(data.receiver)
            ) {
                this.$store.commit("MUTATION_UPDATE_PRIVATE_CHAT", {
                    user_id: data.receiver,
                    chat_id: data.chat_id,
                    message: data.message
                });
            } else if (
                data.receiver == this.getAuthUser("_id") &&
                this.$store.getters.selectedUser(data.sender)
            ) {
                this.$store.commit("MUTATION_UPDATE_PRIVATE_CHAT", {
                    user_id: data.sender,
                    chat_id: data.chat_id,
                    message: data.message
                });
            }
        },
        leaveGroupChat: function(data) {
            if (
                data.user_id != this.getAuthUser("_id") &&
                this.$store.getters.selectedGroup(data.group_id)
            ) {
                this.$store.commit("MUTATION_LEAVE_GROUP", {
                    ...data
                });
            }
        },
        updateChatGroupInformation: function(data) {
            if (_.indexOf(data.users, this.getAuthUser("_id")) == -1) {
                if (data._id == this.id) {
                    this.$router.push("/chat/gc");
                }
                this.$store.commit("MUTATION_REMOVE_CHAT_GROUP", {
                    id: data._id
                });
            } else {
                this.$store.commit("MUTATION_ADD_CHAT_GROUP", data);
            }
        }
    },
    created() {
        this.$socket.emit("joinChatRoom", {
            room: this.getAuthClient("_id")
        });
    },
    beforeMount() {
        this.$store.dispatch("ACTION_LOAD_CHAT_INFO").then(() => {
            if (this.id && this.type === "pc") {
                this.$store.dispatch("ACTION_LOAD_PRIVATE_CHAT", {
                    id: this.id
                });
            } else if (this.id && this.type === "gc") {
                this.$store.dispatch("ACTION_LOAD_GROUP_CHAT", { id: this.id });
            }
        });
    },
    mounted() {
        document.querySelector("html").style.overflow = "hidden";
        const defaultLayout = document.querySelector(
            ".app-default-layout .v-content__wrap"
        );
        const miniLayout = document.querySelector(
            ".app-mini-layout .v-content__wrap"
        );
        const boxLayout = document.querySelector(
            ".app-boxed-layout .app-content"
        );
        if (defaultLayout) {
            defaultLayout.style.overflow = "hidden";
        } else if (miniLayout) {
            miniLayout.style.overflow = "hidden";
        } else if (boxLayout) {
            boxLayout.style.overflow = "hidden";
        } else {
            document.querySelector(
                ".app-horizontal-layout .v-content__wrap"
            ).style.overflow = "hidden";
        }
    },
    destroyed() {
        document.querySelector("html").style.overflow = "hidden";
        const defaultLayout = document.querySelector(
            ".app-default-layout .v-content__wrap"
        );
        const miniLayout = document.querySelector(
            ".app-mini-layout .v-content__wrap"
        );
        const boxLayout = document.querySelector(
            ".app-boxed-layout .app-content"
        );
        const horizontallayout = document.querySelector(
            ".app-horizontal-layout .v-content__wrap"
        );
        if (defaultLayout) {
            defaultLayout.style.overflow = "auto";
        }
        if (miniLayout) {
            miniLayout.style.overflow = "auto";
        }
        if (boxLayout) {
            boxLayout.style.overflow = "auto";
        }
        if (horizontallayout) {
            horizontallayout.style.overflow = "auto";
        }
    }
};
</script>