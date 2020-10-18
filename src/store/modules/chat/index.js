/**
 * Auth Module
 */
import ApiService from "@/common/api.service";
import GlobalMixin from "@/common/global.mixin";
import Vue from "vue";

const state = {
    chatUsers: null,
    chatGroups: null,
    loadingChatModule: false,
    loadingChat: false,
    chatSidebar: false,
    activeUsers: null,
    chatFieldFocused: false,
    scrollEnabled: true
};

// getters
const getters = {
    loadingChatModule: state => {
        return state.loadingChatModule;
    },
    chatUsers: state => {
        return _.orderBy(
            state.chatUsers,
            ["updatedAt", "no_of_unread_message"],
            ["desc", "desc"]
        );
    },
    chatGroups: state => {
        return state.chatGroups;
    },
    selectedUser: state => {
        return id => (id && state.chatUsers ? state.chatUsers[id] : null);
    },
    chatUserName: state => {
        return id =>
            id && state.chatUsers && state.chatUsers[id]
                ? state.chatUsers[id].first_name
                : null;
    },
    selectedGroup: state => id => {
        if (id && state.chatGroups) {
            state.chatGroups[id].users = _.without(
                state.chatGroups[id].users,
                GlobalMixin.methods.getAuthUser("_id")
            );
            return state.chatGroups[id];
        } else {
            return null;
        }
    },
    loadingChat: state => {
        return state.loadingChat;
    },
    chatSidebar: state => {
        return state.chatSidebar;
    },
    activeUsers: state => {
        return state.activeUsers;
    },
    chatFieldFocused: state => {
        return state.chatFieldFocused;
    },
    chatGroupMessages: state => {
        return state.chatGroupMessages;
    },
    scrollEnabled: state => {
        return state.scrollEnabled;
    }
};

// actions
const actions = {
    ACTION_LOAD_CHAT_INFO(context, payload) {
        return new Promise((resolve, reject) => {
            context.commit("MUTAION_LOADING_CHAT_START", payload);
            if (!state.chatUsers) {
                ApiService.get("chat_users", { loadingPartial: true }).then(
                    response => {
                        context.commit("MUTATION_SET_CHAT_DATA", response);
                        context.commit("MUTAION_LOADING_CHAT_END", payload);
                        resolve();
                    }
                );
            } else {
                context.commit("MUTAION_LOADING_CHAT_END", payload);
                resolve();
            }
        });
    },
    ACTION_LOAD_PRIVATE_CHAT(context, payload) {
        context.commit("MUTAION_LOADING_CHAT_START", payload);

        if (state.chatUsers && !state.chatUsers[payload.id].chats) {
            ApiService.get("private_chat", {
                id: payload.id,
                loadingPartial: true
            }).then(response => {
                context.commit("MUTAION_SET_PRIVATE_CHAT_MESSAGES", {
                    id: payload.id,
                    data: response.chats
                });
                context.commit("MUTAION_LOADING_CHAT_END", payload);
            });
        } else {
            context.commit("MUTAION_LOADING_CHAT_END", payload);
        }
    },
    ACTION_LOAD_GROUP_CHAT(context, payload) {
        context.commit("MUTAION_LOADING_CHAT_START", payload);

        if (state.chatGroups && !state.chatGroups[payload.id].chats) {
            ApiService.get("group_chat", {
                group_id: payload.id,
                loadingPartial: true
            }).then(response => {
                context.commit("MUTAION_SET_GROUP_CHAT_MESSAGES", {
                    id: payload.id,
                    data: response.chats
                });
                context.commit("MUTAION_LOADING_CHAT_END", payload);
            });
        } else {
            context.commit("MUTAION_LOADING_CHAT_END", payload);
        }
    },
    toggleChatSidebar(context, payload) {
        context.commit("toggleChatSidebarHandler", payload);
    }
};

// mutations
const mutations = {
    MUTAION_LOADING_CHAT_MODULE_START() {
        state.loadingChatModule = true;
    },
    MUTAION_LOADING_CHAT_MODULE_END() {
        state.loadingChatModule = false;
    },
    MUTAION_LOADING_CHAT_START() {
        state.loadingChat = true;
    },
    MUTAION_LOADING_CHAT_END() {
        state.loadingChat = false;
    },
    MUTATION_ADD_CHAT_GROUP(state, payload) {
        if (state.chatGroups[payload._id]) {
            state.chatGroups[payload._id].name = payload.name;
            state.chatGroups[payload._id].users = payload.users;
        } else {
            Vue.set(state.chatGroups, payload._id, payload);
        }
    },
    MUTATION_REMOVE_CHAT_GROUP(state, payload) {
        delete state.chatGroups[payload.id];
    },
    MUTATION_DELETE_GROUP_CHAT(state, payload) {
        state.scrollEnabled = false;
        _.forEach(state.chatGroups[payload.group_id].chats, function(
            value,
            key
        ) {
            if (value._id == payload.chat_id) {
                Vue.set(
                    state.chatGroups[payload.group_id].chats[key],
                    "status",
                    false
                );
            }
        });
        setTimeout(function() {
            state.scrollEnabled = true;
        }, 1000);
    },
    MUTATION_UPDATE_GROUP_CHAT(state, payload) {
        state.scrollEnabled = false;
        _.forEach(state.chatGroups[payload.group_id].chats, function(
            value,
            key
        ) {
            if (value._id == payload.chat_id) {
                Vue.set(
                    state.chatGroups[payload.group_id].chats[key],
                    "message",
                    payload.message
                );
                Vue.set(
                    state.chatGroups[payload.group_id].chats[key],
                    "edited",
                    true
                );
            }
        });
        setTimeout(function() {
            state.scrollEnabled = true;
        }, 1000);
    },
    MUTATION_DELETE_PRIVATE_CHAT(state, payload) {
        state.scrollEnabled = false;
        _.forEach(state.chatUsers[payload.user_id].chats, function(value, key) {
            if (value._id == payload.chat_id) {
                Vue.set(
                    state.chatUsers[payload.user_id].chats[key],
                    "status",
                    false
                );
            }
        });
        setTimeout(function() {
            state.scrollEnabled = true;
        }, 1000);
    },
    MUTATION_UPDATE_PRIVATE_CHAT(state, payload) {
        state.scrollEnabled = false;
        _.forEach(state.chatUsers[payload.user_id].chats, function(value, key) {
            if (value._id == payload.chat_id) {
                Vue.set(
                    state.chatUsers[payload.user_id].chats[key],
                    "message",
                    payload.message
                );
                Vue.set(
                    state.chatUsers[payload.user_id].chats[key],
                    "edited",
                    true
                );
            }
        });
        setTimeout(function() {
            state.scrollEnabled = true;
        }, 1000);
    },
    MUTATION_LEAVE_GROUP(state, payload) {
        if (GlobalMixin.methods.getAuthUser("_id") == payload.user_id) {
            delete state.chatGroups[payload.group_id];
        } else {
            state.chatGroups[payload.group_id].users = _.remove(
                state.chatGroups[payload.group_id].users,
                function(id) {
                    return !(id == payload.user_id);
                }.bind(payload)
            );
        }
    },
    MUTAION_SET_PRIVATE_CHAT_MESSAGES(state, payload) {
        Vue.set(state.chatUsers[payload.id], "chats", payload.data);
    },
    MUTAION_SET_GROUP_CHAT_MESSAGES(state, payload) {
        Vue.set(state.chatGroups[payload.id], "chats", payload.data);
    },
    MUTATION_SET_CHAT_DATA(state, payload) {
        // Delete Loggedin user informatin from the list
        delete payload.users[GlobalMixin.methods.getAuthUser("_id")];
        state.chatUsers = payload.users;
        state.chatGroups = payload.chat_groups;
    },
    MUTATION_SET_GROUP_CHAT_NEW_MESSAGE(state, payload) {
        if (state.chatGroups[payload.id].chats) {
            state.chatGroups[payload.id].chats.push(payload.data);
        } else {
            state.chatGroups[payload.id].chats = [payload.data];
        }
    },
    MUTATION_SET_PRIVATE_CHAT_NEW_MESSAGE(state, payload) {
        // IF chat's already loaded then push the new chat to the existing
        if (state.chatUsers[payload.id].chats) {
            state.chatUsers[payload.id].chats.push(payload.data);
        }

        // Set Last chat and updated time
        state.chatUsers[payload.id].last_chat = payload.data;
        state.chatUsers[payload.id].updatedAt = payload.data.updatedAt;

        if (
            payload.data.sender != GlobalMixin.methods.getAuthUser("_id") &&
            (!state.chatFieldFocused || payload.currentChatId !== payload.id)
        ) {
            state.chatUsers[payload.id].no_of_unread_message++;
        }
    },
    MUTATION_MARK_LAST_CHAT_AS_READ(state, payload) {
        state.chatUsers[payload.id].no_of_unread_message = 0;
    },
    MUTATION_UPDATE_FOCUS_STATUS(state, payload) {
        state.chatFieldFocused = payload.focused;
    },
    SOCKET_activeUsers(state, payload) {
        if (state && state.chatUsers) {
            let notFoundUsers = _.difference(
                [
                    ...Object.keys(payload),
                    GlobalMixin.methods.getAuthUser("_id")
                ],
                [
                    ...Object.keys(state.chatUsers),
                    GlobalMixin.methods.getAuthUser("_id")
                ]
            );
            if (notFoundUsers.length) {
                ApiService.get("chat_users", { loadingPartial: true }).then(
                    response => {
                        // Delete Loggedin user informatin from the list
                        delete response.users[
                            GlobalMixin.methods.getAuthUser("_id")
                        ];
                        state.chatUsers = response.users;
                        state.chatGroups = response.chat_groups;
                    }
                );
            }
        }

        state.activeUsers = { ...payload };
    },
    toggleChatSidebarHandler(state, val) {
        state.chatSidebar = val;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
