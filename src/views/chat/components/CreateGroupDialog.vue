<template>
    <!-- Dialog Model For Location -->
    <v-dialog v-model="createGroupModal" scrollable max-width="500px" class="dialog-box">
        <app-section-loader :status="loadingPartial"></app-section-loader>
        <v-card>
            <v-card-title class="card-header">
                <h2 class="px-3 mb-0">{{group_id ? 'Update Group Information': 'Create a group'}}</h2>
                <span class="close-model text-right">
                    <v-icon dark @click.stop="createGroupModal = false">close</v-icon>
                </span>
            </v-card-title>
            <v-divider class="mt-0"></v-divider>
            <v-card-text class="pt-0">
                <v-form v-on:submit.prevent="createChatGroup" v-model="valid">
                    <v-container grid-list-md pt-0 pb-0>
                        <v-layout wrap>
                            <v-flex xs12 sm12 xl12 lg12 md12 class="col-height-auto">
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-select
                                            multiple
                                            placeholder="Select User"
                                            v-model="group.users"
                                            :options="chatUsers"
                                            :reduce="user => user._id"
                                            label="first_name"
                                        ></v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 m12>
                                        <v-text-field
                                            label="Group Name"
                                            v-model="group.name"
                                            :rules="groupNameRules"
                                            @keyup="validateGroupName()"
                                            required
                                        >
                                            <template slot="label">
                                                Group Name (e.g. new-group)
                                                <span class="required">*</span>
                                            </template>
                                        </v-text-field>
                                        <span
                                            style="margin-top:-15px;"
                                            v-if="groupNameFound && valid"
                                            class="red--text"
                                        >That name is already taken.</span>
                                    </v-flex>
                                </v-layout>
                                
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-layout row wrap>
                    <v-btn
                        flat
                        color="primary"
                        :disabled="!valid || groupNameFound"
                        @click.native="createChatGroup"
                    >{{group_id ? 'Update' : 'Save'}}</v-btn>
                    <v-btn flat @click.stop="resetForm();">Reset</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import vSelect from "vue-select";
import "vue-select/src/scss/vue-select.scss";

import ApiService from "@/common/api.service";
import { vm } from "@/main";

export default {
    props: {
        group_id: {
            default: null
        }
    },
    components: { "v-select": vSelect },
    computed: {
        ...mapGetters(["chatUsers", "chatGroups"]),
        loadingPartial() {
            return vm.loadingPartial;
        }
    },
    data() {
        return {
            valid: false,
            groupNameFound: false,
            createGroupModal: false,
            group: {
                name: "",
                users: []
            },
            groupNameRules: [
                v => !!v || "Group name required",
                v =>
                    /^[a-zA-Z0-9-_]+$/.test(v) ||
                    "Only Dash, Underscore and Alpha Numeric characters are allowed"
            ],
            timer: null
        };
    },

    watch: {
        chatGroups(newValue) {
            if (newValue && newValue[this.group_id]) {
                this.setGroupData();
            }
        }
    },

    mounted() {
        if (this.group_id && this.chatGroups) {
            this.setGroupData();
        }
    },

    methods: {
        setGroupData() {
            this.group = JSON.parse(
                JSON.stringify({
                    name: this.chatGroups[this.group_id].name,
                    users: this.chatGroups[this.group_id].users
                })
            );
            //= this.chatGroups[this.group_id].name;

            this.group.users = _.remove(
                this.group.users,
                function(id) {
                    return !(id == this.getAuthUser("_id"));
                }.bind(this)
            );
        },
        openDialog() {
            this.resetForm();
            this.createGroupModal = true;
        },
        resetForm() {
            if (this.group_id && this.chatGroups) {
                this.setGroupData();
            } else {
                this.group = {
                    name: "",
                    users: []
                };
            }
        },
        createChatGroup() {
            if (this.group_id) {
                ApiService.put("/chat_group/" + this.group_id, {
                    loadingPartial: true,
                    ...this.group
                }).then(response => {
                    this.createGroupModal = false;

                    let message = this.getGeneratedMessage();

                    // Update Group Information
                    this.$socket.emit("updateChatGroupInformation", {
                        data: {
                            _id: this.group_id,
                            name: this.group.name,
                            users: _.concat(this.group.users, [
                                this.getAuthUser("_id")
                            ])
                        },
                        room: this.getAuthClient("_id")
                    });

                    // SEND MESSAGE
                    let data = {
                        client_id: this.getAuthClient("_id"),
                        group_id: this.group_id,
                        message: message,
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
                });
            } else {
                ApiService.post("/chat_group", {
                    loadingPartial: true,
                    ...this.group
                }).then(response => {
                    this.createGroupModal = false;

                    this.$store.commit(
                        "MUTATION_ADD_CHAT_GROUP",
                        response.chat_group
                    );

                    this.$socket.emit("updateChatGroupInformation", {
                        data: response.chat_group,
                        room: this.getAuthClient("_id")
                    });
                    this.$router.push("/chat/gc/" + response.chat_group._id);
                });
            }
        },
        getGeneratedMessage() {
            let message = "";
            if (this.chatGroups[this.group_id].name != this.group.name) {
                message +=
                    "The group name was chaged from <b>" +
                    this.chatGroups[this.group_id].name +
                    "</b> to <b>" +
                    this.group.name +
                    "</b>";
            }

            let noOfAddedUsers = 0;
            let addedUsers = "";
            _.forEach(
                this.group.users,
                function(value) {
                    if (
                        _.indexOf(
                            this.chatGroups[this.group_id].users,
                            value
                        ) == -1
                    ) {
                        noOfAddedUsers++;
                        addedUsers += addedUsers
                            ? ", <b>" +
                              this.$store.getters.chatUserName(value) +
                              "</b>"
                            : " <b>" +
                              this.$store.getters.chatUserName(value) +
                              "</b>";
                    }
                }.bind(this)
            );
            if (noOfAddedUsers) {
                message += message
                    ? " &" +
                      addedUsers +
                      (noOfAddedUsers == 1 ? " was" : " were") +
                      " added"
                    : addedUsers +
                      (noOfAddedUsers == 1 ? " was" : " were") +
                      " added";
            }

            let noOfRemovedUsers = 0;
            let removedUsers = "";
            _.forEach(
                this.chatGroups[this.group_id].users,
                function(value) {
                    if (_.indexOf(this.group.users, value) == -1) {
                        noOfRemovedUsers++;
                        removedUsers += removedUsers
                            ? ", <b>" +
                              this.$store.getters.chatUserName(value) +
                              "</b>"
                            : " <b>" +
                              this.$store.getters.chatUserName(value) +
                              "</b>";
                    }
                }.bind(this)
            );
            if (noOfRemovedUsers) {
                message += message
                    ? " &" +
                      removedUsers +
                      (noOfRemovedUsers == 1 ? " was" : " were") +
                      " removed"
                    : removedUsers +
                      (noOfRemovedUsers == 1 ? " was" : " were") +
                      " removed";
            }

            message += " by <b>" + this.getAuthUser("first_name") + "</b>";
            return message;
        },
        validateGroupName() {
            if (this.valid) {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.timer = setTimeout(() => {
                    ApiService.get("/chat_group/", {
                        group_id: this.group_id,
                        ...this.group
                    }).then(response => {
                        if (response.chat_group) this.groupNameFound = true;
                        else this.groupNameFound = false;
                    });
                }, 1000);
            }
        }
    }
};
</script>


<style scoped>
@import "./../chat.scss";
</style>
