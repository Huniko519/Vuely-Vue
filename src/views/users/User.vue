<template>
    <div>
        <v-container fluid grid-list-xl class="patient-section">
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <DataTable :columns="columns" :rows="users" type="users"></DataTable>
            </app-card>
        </v-container>

        <v-container fluid grid-list-xl class="user-type-section pt-0" v-if="isAdmin()">
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <h5>Types</h5>
                <StandardTable :columns="userTypesColumns" :rows="user_groups" type="user_groups"></StandardTable>
            </app-card>
        </v-container>

        <UserGroupDialogBox ref="UserGroupDialog" />

        <!-- User Group : Bottom Right Button-->
        <v-speed-dial
            class="patient-overview-v-speed-dial"
            v-model="fab"
            bottom
            right
            direction="top"
            transition="slide-y-reverse-transition"
        >
            <template v-slot:activator>
                <v-btn v-model="fab" color="primary" fab>
                    <v-icon v-if="fab">close</v-icon>
                    <v-icon v-else>add</v-icon>
                </v-btn>
            </template>

            <v-btn
                v-if="!isAdmin() && hasAccess('user', 'add_new_user')"
                @click="onUserDialog()"
                style="right:45px;"
                class="pl-2 pr-2"
                dark
                color="primary"
            >
                <strong>Add new uesr</strong>&nbsp;&nbsp;
                <v-icon>person</v-icon>
            </v-btn>

            <v-btn
                v-if="isAdmin()"
                @click="$refs.UserGroupDialog.openDialog()"
                style="right:38px;"
                class="pl-2 pr-2"
                dark
                color="primary"
            >
                <strong>User Group</strong>&nbsp;&nbsp;
                <v-icon>supervisor_account</v-icon>
            </v-btn>
        </v-speed-dial>

        <UserDialogBox v-if="!isAdmin()" ref="UserDialog" action="add"></UserDialogBox>
    </div>
</template>

<script>
import moment from "moment";
import { vm } from "@/main";
import ApiService from "@/common/api.service";

import StandardTable from "@/components/table/standard";
import DataTable from "@/components/table/datatable";
import UserDialogBox from "@/components/DialogBox/UserDialogBox";

const UserGroupDialogBox = () =>
    import("@/components/DialogBox/UserGroupDialogBox");

export default {
    components: {
        DataTable,
        StandardTable,
        UserGroupDialogBox,
        UserDialogBox
    },
    data() {
        return {
            fab: false,
            users: [],
            user_groups: [],
            userTypesColumns: [
                {
                    label: "Name",
                    field: "name"
                },
                {
                    label: "Acronym",
                    field: "acronym"
                },
                {
                    label: "Total",
                    field: "total",
                    type: "number",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align"
                },
                /*{
                    label: "Time out",
                    field: "timeout",
                    type: "number",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align"
                },*/
                {
                    label: "Access Modules",
                    field: this.moduleFealdFn,
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align"
                },
                {
                    label: "Status",
                    field: "status",
                    type: "boolean",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align"
                }
            ],
            columns: [
                {
                    text: "First Name",
                    value: "first_name"
                },
                {
                    text: "Last Name",
                    value: "last_name"
                },
                {
                    text: "Email",
                    value: "email"
                },
                {
                    text: "Groups",
                    value: "user_groups",
                    class: !this.isAdmin() ? "" : "d-none"
                },
                {
                    text: "Clients",
                    value: "clients",
                    class: this.isAdmin() ? "" : "d-none"
                },
                {
                    text: "Status",
                    value: "status"
                },
                {
                    text: "Created",
                    value: "createdAt",
                    class: this.isAdmin() ? "" : "d-none",
                    formatFn: this.dateOutputFormat
                }
            ]
        };
    },
    mounted() {
        this.getUserData();
    },
    created() {
        vm.$on("FetchPageData", this.getUserData);
    },
    beforeDestroy() {
        vm.$off("FetchPageData", this.getUserData);
    },
    methods: {
        getUserData() {
            ApiService.get("users").then(response => {
                this.users = response.users;
                this.user_groups = response.user_groups;
            });
        },
        dateOutputFormat: function(data, key) {
            return moment.utc(data[key]).fromNow();
        },
        statusOutputFormat: function(value) {
            return value ? "Active" : "Inactive";
        },
        moduleFealdFn: function(data) {
            let modules_access = "";

            if (data.acronym === "super-user") {
                modules_access = "FULL ACCESS";
                return modules_access;
            }

            if (data.acronym === "client-super-user") {
                modules_access = "CLIENT FULL ACCESS";
                return modules_access;
            }

            const keys = Object.keys(data.modules_access);
            for (const key of keys) {
                let modules_access_temp = "";
                let addComma = false;

                for (const key2 of Object.keys(data.modules_access[key])) {
                    if (key2 === "add_new_user") {
                        if (data.modules_access[key][key2].length) {
                            if (addComma) {
                                modules_access_temp += ", ";
                            }
                            modules_access_temp += this.$t(
                                "message['" + key2 + "']"
                            );
                            addComma = true;
                        }
                    } else if (data.modules_access[key][key2]) {
                        if (addComma) {
                            modules_access_temp += ", ";
                        }
                        modules_access_temp += this.$t(
                            "message['" + key2 + "']"
                        );
                        addComma = true;
                    }
                }
                if (modules_access_temp) {
                    modules_access +=
                        this.$t("message['" + key + "']") +
                        "[" +
                        modules_access_temp +
                        "] ";
                }
            }

            return modules_access ? modules_access : "NO ACCESS";
        },
        onUserDialog() {
            this.$refs.UserDialog.openDialog();
        }
    }
};
</script>

