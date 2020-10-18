<template>
    <v-card class="chat-content">
        <v-expansion-panel v-model="expansionPanel">
            <v-expansion-panel-content key="#groups">
                <template v-slot:header class="chat-sidebar-header">
                    <div>
                        Groups
                        <v-btn
                            color="primary"
                            small
                            fab
                            @click.native.stop="$refs.CreateGroupDialogRef.openDialog()"
                        >
                            <v-icon>add</v-icon>
                        </v-btn>
                    </div>
                </template>
                <v-card>
                    <v-list>
                        <vue-perfect-scrollbar
                            class="chat-sidebar-scroll"
                            :style="getScrollHeight()"
                            :settings="settings"
                        >
                            <template v-for="(item, index) in chatGroups">
                                <v-list-tile
                                    v-if="item._id != getAuthUser('_id')"
                                    avatar
                                    :to="'/chat/gc/'+ item._id"
                                    :key="index"
                                    :class="{'grey lighten-3': (item._id == id) }"
                                >
                                    <v-list-tile-content>
                                        <h6 class="mb-1" v-html="'# ' + item.name"></h6>
                                    </v-list-tile-content>
                                </v-list-tile>
                                <hr :key="'hr-'+item._id" class="pa-0 ma-0" />
                            </template>
                        </vue-perfect-scrollbar>
                    </v-list>
                </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content key="#chatUsers">
                <template v-slot:header>
                    <div>Users</div>
                </template>
                <v-list>
                    <vue-perfect-scrollbar
                        class="chat-sidebar-scroll"
                        :style="getScrollHeight()"
                        :settings="settings"
                    >
                        <template v-for="(item, index) in chatUsers">
                            <v-list-tile
                                v-if="item._id != getAuthUser('_id')"
                                avatar
                                :to="'/chat/pc/'+ item._id"
                                :key="index"
                                :class="{'grey lighten-3': (item._id == id) }"
                            >
                                <v-list-tile-avatar>
                                    <v-icon
                                        v-if="!item.image"
                                        dark
                                        size="40"
                                        class="img-responsive rounded-circle"
                                        style="color:black"
                                    >face</v-icon>
                                    <img v-else :src="item.image" class="chat-user-icon" />
                                    <span
                                        v-if="activeUsers[item._id]"
                                        class="v-badge success rounded floating"
                                    ></span>
                                    <span v-else class="v-badge grey rounded floating"></span>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <h6
                                        class="mb-1"
                                        v-html="item.first_name + ' ' + item.last_name"
                                    ></h6>
                                    <span
                                        v-if="item.last_chat && item.last_chat.message.length > 27"
                                        v-html="item.last_chat.message.substring(0, 30) + '...'"
                                        :class="{'fs-12 grey--text': !item.no_of_unread_message, 'fs-12 black--text font-weight-medium': item.no_of_unread_message}"
                                    ></span>
                                    <span
                                        v-else-if="item.last_chat"
                                        v-html="item.last_chat.message"
                                        :class="{'fs-12 grey--text': !item.no_of_unread_message, 'fs-12 black--text font-weight-medium': item.no_of_unread_message}"
                                    ></span>
                                    <span class="fs-12 grey--text" v-else>No chat yet!</span>
                                    <span
                                        style="position: absolute; right: 10px; top: 13px; border: 1px solid;
                                        padding: 1px 10px;
                                        font-size: 10px;
                                        background: red;
                                        color: white;
                                        font-weight: bold;
                                        border-radius: 9px;"
                                        v-if="item.no_of_unread_message"
                                    >{{item.no_of_unread_message}}</span>
                                </v-list-tile-content>
                            </v-list-tile>
                            <hr :key="item._id" class="pa-0 ma-0" />
                        </template>
                    </vue-perfect-scrollbar>
                </v-list>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <CreateGroupDialog v-if="!isAdmin()" :group_id="null" ref="CreateGroupDialogRef"></CreateGroupDialog>
    </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { getCurrentAppLayout } from "Helpers/helpers";
import CreateGroupDialog from "./CreateGroupDialog";

export default {
    components: {
        CreateGroupDialog
    },
    computed: {
        ...mapGetters(["chatUsers", "activeUsers", "chatGroups"])
    },
    data() {
        return {
            type: this.$route.path.split("/")[2],
            id: this.$route.path.split("/")[3],
            settings: {
                maxScrollbarLength: 160
            },
            expansionPanel: this.$route.path.split("/")[2] === "gc" ? 0 : 1,
            groupModal: false
        };
    },
    methods: {
        openGroupModal() {
            this.groupModal = !this.groupModal;
        },
        getScrollHeight() {
            let layout = getCurrentAppLayout(this.$router);
            switch (layout) {
                case "default":
                    return "height: calc(100vh - 150px)";
                case "horizontal":
                    return "height: calc(100vh - 180px)";
                case "boxed":
                    return "height: calc(100vh - 305px)";
                case "boxed-v2":
                    return "height: calc(100vh - 305px)";
                default:
                    return "height: calc(100vh - 160px)";
            }
        }
    }
};
</script>


<style scoped>
@import "./../chat.scss";
</style>
