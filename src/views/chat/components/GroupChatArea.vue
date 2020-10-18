<template>
    <div class="chat-wrapper">
        <div class="app-flex justify-center align-center h-vh-100" v-if="loadingChat">
            <single-chat-loader></single-chat-loader>
        </div>
        <template v-else>
            <template v-if="id && selectedGroup">
                <!-- Start | Chat Group Header -->
                <v-toolbar class="chat-head">
                    <div class="chat-head-left d-custom-flex align-items-center">
                        <v-btn
                            class="mr-2 ham-menu-icon d-none gray--text"
                            @click="toggleChatSidebar"
                            flat
                            icon
                            small
                        >
                            <v-icon dark>menu</v-icon>
                        </v-btn>
                        <div class="media align-items-center">
                            <div class="media-body">
                                <h6
                                    class="mb-0"
                                    style="cursor: pointer;"
                                    @click="$refs.CreateGroupDialogRef.openDialog()"
                                >{{'# '+selectedGroup.name}}</h6>
                                <span
                                    v-html="userNames"
                                    class="grey--text fs-12 d-inline-block"
                                >{{userNames}}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Start Leave Group | Button -->
                    <div class="chat-head-right">
                        <v-menu offset-y origin="left left" transition="scale-transition" left>
                            <v-btn slot="activator" icon>
                                <v-icon>more_vert</v-icon>
                            </v-btn>
                            <v-list>
                                <v-list-tile @click="leaveGroup()">
                                    <v-list-tile-title>Leave Group</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </div>
                </v-toolbar>
                <!-- End | Chat Group Header -->

                <!-- Start | Chat Area -->
                <vue-perfect-scrollbar
                    :style="getScrollHeight()"
                    class="chat-area-scroll"
                    :settings="settings"
                >
                    <div class="chat-body" v-if="selectedGroup.chats">
                        <template v-for="(chat, index) in selectedGroup.chats">
                            <div
                                class="chat-block mb-3"
                                :key="index"
                                :class="{'flex-row-reverse': chat.sender == getAuthUser('_id') && chat.message_type !== 'log'}"
                            >
                                <!-- Log Message -->
                                <span
                                    class="chat-log-message text-center"
                                    v-if="chat.message_type == 'log'"
                                    v-html="chat.message"
                                >{{chat.message}}</span>

                                <!-- Received Messages -->
                                <template v-else-if="chat.sender !== getAuthUser('_id')">
                                    <!-- Sender Image Icon -->
                                    <div class="avatar-wrap mr-3">
                                        <v-icon
                                            v-if="!chat.sender_image"
                                            dark
                                            size="40"
                                            class="img-responsive rounded-circle"
                                            style="color:black"
                                        >face</v-icon>
                                        <img
                                            v-else
                                            :src="chat.sender_image"
                                            alt="user-profile"
                                            class="rounded-circle"
                                            width="40"
                                            height="40"
                                        />
                                    </div>

                                    <!-- Message Details -->
                                    <div v-if="chat.status" class="chat-bubble-wrap">
                                        <div
                                            class="chat-bubble even aqua-bg px-3 d-custom-flex align-items-center"
                                        >
                                            <span class="d-inline-block fs-14">{{chat.message}}</span>
                                        </div>
                                        <span
                                            class="fs-12 grey--text text-xs-left d-block mt-1 fw-light"
                                        >{{chat.sender_name + ', ' + dateOutputFormat(chat.createdAt)}}</span>
                                    </div>

                                    <!-- Deleted Messages -->
                                    <div v-else class="chat-bubble-wrap">
                                        <span
                                            class="deleted-message-icon-area d-inline-block font-italic fs-14 white--text error border-round"
                                        >
                                            <v-icon class="deleted-message-icon">not_interested</v-icon>This Message was deleted
                                        </span>

                                        <span
                                            class="fs-12 grey--text text-xs-left d-block mt-1 fw-light"
                                        >{{chat.sender_name + ', ' + dateOutputFormat(chat.createdAt)}}</span>
                                    </div>

                                    <!-- Icon will be displayed if message edited -->
                                    <v-icon
                                        v-if="chat.status && chat.edited"
                                        class="edited-icon"
                                        small
                                    >edit</v-icon>
                                </template>

                                <!-- Sent Messages -->
                                <div
                                    class="chat-block mb-3 flex-row-reverse"
                                    v-else
                                    v-on:mouseover="onMouseOver(chat._id)"
                                    v-on:mouseleave="onMouseLeave(chat._id)"
                                >
                                    <!-- Sender Image Icon -->
                                    <div class="avatar-wrap ml-3">
                                        <v-icon
                                            v-if="!chat.sender_image"
                                            dark
                                            size="40"
                                            class="img-responsive rounded-circle"
                                            style="color:black"
                                        >face</v-icon>
                                        <img
                                            v-else
                                            :src="chat.sender_image"
                                            alt="user-profile"
                                            class="rounded-circle"
                                            width="40"
                                            height="40"
                                        />
                                    </div>

                                    <!-- Message | Option Menu -->
                                    <v-menu
                                        v-if="chat.status"
                                        :class="{'chat-option-menu': true, 'show-chat-option-menu': showChatOptionMenu[chat._id] == true }"
                                        offset-y
                                        origin="left left"
                                        transition="scale-transition"
                                        left
                                    >
                                        <v-icon small slot="activator">more_vert</v-icon>

                                        <v-list>
                                            <v-list-tile @click="deleteGroupChat(chat._id)">
                                                <v-icon small>delete</v-icon>&nbsp;&nbsp;
                                                <v-list-tile-title>Delete Message</v-list-tile-title>
                                            </v-list-tile>
                                            <v-divider style="padding:0; margin:0"></v-divider>
                                            <v-list-tile @click="editGroupChat(chat)">
                                                <v-icon small>edit</v-icon>&nbsp;&nbsp;
                                                <v-list-tile-title>Edit Message</v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                    </v-menu>

                                    <!-- Message Details -->
                                    <div v-if="chat.status" class="chat-bubble-wrap">
                                        <div
                                            class="chat-bubble odd primary px-3 d-custom-flex align-items-center"
                                        >
                                            <span
                                                class="d-inline-block fs-14 white--text"
                                            >{{chat.message}}</span>
                                        </div>
                                        <span
                                            class="fs-12 grey--text text-xs-right d-block mt-1 fw-light"
                                        >{{chat.sender_name + ', ' + dateOutputFormat(chat.createdAt)}}</span>
                                    </div>

                                    <!-- Deleted Message -->
                                    <div v-else class="chat-bubble-wrap">
                                        <span
                                            class="deleted-message-icon-area d-inline-block font-italic fs-14 white--text error border-round"
                                        >
                                            <v-icon class="deleted-message-icon">not_interested</v-icon>This Message was deleted
                                        </span>

                                        <span
                                            class="fs-12 grey--text text-xs-right d-block mt-1 fw-light"
                                        >{{chat.sender_name + ', ' + dateOutputFormat(chat.createdAt)}}</span>
                                    </div>

                                    <!-- Icon will be displayed if message edited -->
                                    <v-icon
                                        v-if="chat.status && chat.edited"
                                        class="edited-icon"
                                        small
                                    >edit</v-icon>
                                </div>
                            </div>
                        </template>
                    </div>
                </vue-perfect-scrollbar>
                <!-- End | Chat Area -->

                <div class="chat-footer px-3">
                    <div class="d-custom-flex">
                        <v-text-field
                            hide-details
                            name="input-1-3"
                            label="Send Message..."
                            single-line
                            ref="newMessage"
                            :value="newMessage"
                            v-model="newMessage"
                            v-focus="focused"
                            @focus="uddateMessageStatus();focused = true"
                            @blur="focused = false"
                            @keyup.enter="sendMessage"
                        ></v-text-field>
                        <v-icon
                            v-if="chatId"
                            @click="clearChat()"
                            small
                            class="chat-message-clear-icon"
                        >clear</v-icon>&nbsp;&nbsp;
                        <v-btn fab dark small color="primary" @click="sendMessage">
                            <v-icon dark>send</v-icon>
                        </v-btn>
                    </div>
                </div>
            </template>
            <div class="chat-box-main" v-else>
                <div class="centered">
                    <p>
                        <i class="zmdi zmdi-comments font-3x primary--text"></i>
                    </p>
                    <v-btn
                        class="select-user d-none"
                        flat
                        color="primary"
                        @click="toggleChatSidebar"
                    >Select Group/User</v-btn>
                </div>
            </div>
        </template>
        <CreateGroupDialog :group_id="this.id" v-if="!isAdmin()" ref="CreateGroupDialogRef"></CreateGroupDialog>
    </div>
</template>

<script>
import moment from "moment";
import { vm } from "@/main";
import ApiService from "@/common/api.service";

import { mapGetters } from "vuex";
import SingleChatLoader from "./SingleChatLoader";
import { getCurrentAppLayout } from "Helpers/helpers";
import { focus } from "vue-focus";

import CreateGroupDialog from "./CreateGroupDialog";

export default {
    directives: { focus: focus },

    components: {
        SingleChatLoader,
        CreateGroupDialog
    },
    computed: {
        ...mapGetters([
            "loadingChat",
            "chatGroups",
            "chatUsers",
            "activeUsers",
            "scrollEnabled"
        ]),
        selectedGroup() {
            return this.$store.getters.selectedGroup(this.id);
        },
        userNames() {
            if (this.selectedGroup && this.chatUsers) {
                if (
                    this.selectedGroup.users &&
                    this.selectedGroup.users.length > 0
                ) {
                    let addComma = false;
                    let userNames = "";
                    this.selectedGroup.users.forEach(element => {
                        if (element !== this.getAuthUser("_id")) {
                            if (addComma) {
                                userNames += "&nbsp;&nbsp;";
                            }

                            if (this.activeUsers[element]) {
                                userNames +=
                                    '<span class="v-badge success status-icon rounded"></span> ';
                            } else {
                                userNames +=
                                    '<span class="v-badge grey status-icon rounded"></span> ';
                            }

                            userNames += this.$store.getters.chatUserName(
                                element
                            );
                            addComma = true;
                        }
                    });
                    return userNames;
                } else {
                    return "No participants yet!";
                }
            }
        }
    },
    data() {
        return {
            type: this.$route.path.split("/")[2],
            id: this.$route.path.split("/")[3],
            focused: false,
            showingChatOptionMenu: false,
            showChatOptionMenu: [],
            chatId: null,
            settings: {
                maxScrollbarLength: 260
            },
            newMessage: "",
            editingMessage: false
        };
    },
    watch: {
        focused(newValue) {}
    },
    beforeMount() {
        if (this.id && this.chatGroups) {
            this.$store.dispatch("ACTION_LOAD_GROUP_CHAT", { id: this.id });
        }
    },

    mounted() {
        this.scrollToEnd();

        window.moment = require("moment-timezone");
        let timezone = this.getAuthUser("timezone") || "UTC";
        moment.tz.setDefault(timezone);
    },

    updated() {
        if (
            this.newMessage == "" &&
            !this.showingChatOptionMenu &&
            this.scrollEnabled &&
            !this.editingMessage
        ) {
            this.scrollToEnd();
        }
    },

    methods: {
        onMouseOver(id) {
            this.showingChatOptionMenu = true;
            this.$set(this.showChatOptionMenu, id, true);
        },
        onMouseLeave(id) {
            this.$set(this.showChatOptionMenu, id, false);
            setTimeout(
                function() {
                    this.showingChatOptionMenu = false;
                }.bind(this),
                1000
            );
        },
        sendMessage() {
            if (this.newMessage !== "" && this.chatId === null) {
                let data = {
                    client_id: this.getAuthClient("_id"),
                    group_id: this.id,
                    message: this.newMessage,
                    sender: this.getAuthUser("_id"),
                    sender_name:
                        this.getAuthUser("first_name") +
                        " " +
                        this.getAuthUser("last_name"),
                    sender_image: this.getAuthUser("image")
                };
                this.$socket.emit("groupChat", {
                    data,
                    room: this.getAuthClient("_id")
                });
                this.newMessage = "";
            } else if (this.newMessage !== "" && this.chatId) {
                let data = {
                    group_id: this.id,
                    chat_id: this.chatId,
                    message: this.newMessage
                };
                this.$socket.emit("updateGroupChat", {
                    data,
                    room: this.getAuthClient("_id")
                });
                this.newMessage = "";
                this.chatId = null;
                setTimeout(
                    function() {
                        this.editingMessage = false;
                    }.bind(this),
                    1000
                );
            }
        },
        leaveGroup() {
            ApiService.put("/leave_chat_group", {
                loadingPartial: true,
                group_id: this.id
            }).then(response => {
                // Send Left Message To All
                let data = {
                    client_id: this.getAuthClient("_id"),
                    group_id: this.id,
                    message: "Left " + this.getAuthUser("first_name"),
                    message_type: "log",
                    sender: this.getAuthUser("_id"),
                    sender_name:
                        this.getAuthUser("first_name") +
                        " " +
                        this.getAuthUser("last_name"),
                    sender_image: this.getAuthUser("image")
                };
                this.$socket.emit("groupChat", {
                    data,
                    room: this.getAuthClient("_id")
                });

                this.$store.commit("MUTATION_LEAVE_GROUP", {
                    group_id: this.id,
                    user_id: this.getAuthUser("_id")
                });
                this.$socket.emit("leaveGroupChat", {
                    data: {
                        group_id: this.id,
                        user_id: this.getAuthUser("_id")
                    },
                    room: this.getAuthClient("_id")
                });
                this.$router.push("/chat/gc");
            });
        },
        deleteGroupChat(id) {
            this.$socket.emit("deleteGroupChat", {
                data: {
                    group_id: this.id,
                    chat_id: id
                },
                room: this.getAuthClient("_id")
            });
        },
        editGroupChat(chatData) {
            this.editingMessage = true;
            this.chatId = chatData._id;
            this.newMessage = chatData.message;
        },
        clearChat() {
            this.chatId = null;
            this.newMessage = "";
        },
        uddateMessageStatus() {},
        toggleChatSidebar() {
            this.$store.dispatch("toggleChatSidebar", true);
        },
        getScrollHeight() {
            let layout = getCurrentAppLayout(this.$router);
            switch (layout) {
                case "default":
                    return "height: calc(100vh - 200px)";
                case "horizontal":
                    return "height: calc(100vh - 250px)";
                case "boxed":
                    return "height: calc(100vh - 380px)";
                case "boxed-v2":
                    return "height: calc(100vh - 380px)";
                default:
                    return "height: calc(100vh - 200px)";
            }
        },
        scrollToEnd() {
            var container = document.querySelector(".chat-area-scroll");
            if (container !== null) {
                var scrollHeight = container.scrollHeight;
                container.scrollTop = scrollHeight;
            }
        },
        dateOutputFormat(date) {
            return moment.utc(date).fromNow();
        }
    }
};
</script>



<style scoped>
@import "./../chat.scss";
</style>
