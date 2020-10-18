<template>
    <div class="pos-absolute fixed-div d-custom-flex flex-column w-100">
        <!-- Secondary Header -->
        <v-toolbar v-if="status !== 'Pending'" class="overview-toolbar">
            <span v-if="selectedUser.client">
                Type : {{ selectedUser.client.client_group.name }}
                &nbsp; | &nbsp;
            </span>
            <span v-if="isAdmin()">Status :</span>
            <v-menu offset-y v-if="isAdmin()">
                <template v-slot:activator="{ on }">
                    <v-btn flat color="primary" v-on="on">{{ status }}</v-btn>
                </template>
                <v-list v-if="isAdmin()">
                    <v-list-tile
                        v-for="(item, index) in [
                            'Active',
                            'Inactive'
                        ]"
                        :key="index"
                    >
                        <v-list-tile-title
                            @click="change_status(item)"
                            style="cursor:pointer"
                        >{{ item }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>

        <v-container fluid grid-list-xl scrollArea>
            <v-tabs v-if="isAdmin()" v-model="tab" class="mb-4">
                <v-tab key="#tab-users" href="#tab-users">Users</v-tab>
                <v-tab key="#tab-locations" href="#tab-locations">Locations</v-tab>
                <v-tab key="#tab-patients" href="#tab-patients">Patients</v-tab>

                <v-tab-item key="tab-users" value="tab-users">
                    <v-card flat tile>
                        <v-card-text>
                            <DataTable :columns="usersColumns" :rows="users" type="users" />
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="tab-locations" value="tab-locations">
                    <v-card flat tile>
                        <v-card-text>
                            <DataTable
                                :columns="locationsCcolumns"
                                :rows="locations"
                                type="locations"
                            ></DataTable>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="tab-patients" value="tab-patients">
                    <v-card flat tile>
                        <v-card-text>
                            <DataTable :columns="patientsCcolumns" :rows="patients" type="patients"></DataTable>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>

            <!-- main content area -->
            <app-card :heading="$t('message.activity')" colClasses="activity-widget-wrap pa-0">
                <div class="activity-widget">
                    <a
                        @click="
                        activities = [];
                        new_activities = [];
                        getClientActivities(); no_of_new_activities=0;"
                        v-if="no_of_new_activities"
                    >There are {{no_of_new_activities}}+ new activities. Click here to see.</a>

                    <vue-perfect-scrollbar
                        @ps-scroll-up="onScroll"
                        style="max-height:500px;overflow-y:auto"
                        class="activity-scroll"
                    >
                        <Timeline
                            :items="activities"
                            :newitems="new_activities"
                            :show_recent="show_recent"
                            :log_dtype="log_dtype"
                            @get_other_logs="get_other_logs"
                        ></Timeline>
                    </vue-perfect-scrollbar>
                </div>
            </app-card>
        </v-container>
    </div>
</template>

<script>
import moment from "moment";
import { vm } from "@/main";
import ApiService from "@/common/api.service";

import DataTable from "@/components/table/datatable";
import Timeline from "@/components/timeline/timeline";

import ApiUrl from "@/config";

export default {
    name: "ClientOverview",
    components: {
        Timeline,
        DataTable
    },
    data() {
        return {
            tab: null,
            status: "Active",

            log_dtype: "last",
            latest_date: new Date(),
            oldest_date: new Date(),
            show_recent: false,

            client_group: "",
            type: this.$route.path.split("/")[1],
            id: this.$route.params.id,
            activities: [],
            new_activities: [],
            no_of_new_activities: 0,
            selectedUser: {},
            users: [],
            locations: [],
            patients: [],

            usersColumns: [
                {
                    text: "First",
                    value: "first_name"
                },
                {
                    text: "Last",
                    value: "last_name"
                },
                {
                    text: "Group",
                    value: "user_group",
                    class: this.isAdmin() ? "" : "d-none"
                },
                {
                    text: "Email",
                    value: "email"
                },
                {
                    text: "Status",
                    value: "status"
                },
                {
                    text: "Created",
                    value: "createdAt",
                    formatFn: this.dateOutputFormat
                }
            ],
            locationsCcolumns: [
                {
                    text: "Name",
                    value: "name"
                },
                {
                    text: "Address",
                    value: "address"
                },
                {
                    text: "Type",
                    value: "type"
                },
                {
                    text: "Residents",
                    value: "capacity"
                },
                {
                    text: "Created",
                    value: "createdAt",
                    formatFn: this.dateOutputFormat
                },
                {
                    text: "Last Modified",
                    value: "updatedAt",
                    formatFn: this.dateOutputFormat
                }
            ],
            patientsCcolumns: [
                {
                    text: "First",
                    value: "first_name"
                },
                {
                    text: "Last",
                    value: "last_name"
                },
                {
                    text: "Age",
                    value: "age"
                },
                {
                    text: "Gender",
                    value: "gender"
                },
                {
                    text: "Services",
                    value: "services"
                },
                {
                    text: "Location",
                    value: "location"
                }
            ]
        };
    },
    sockets: {
        "new-activity-log": function(fetchedData) {
            if (
                this.isAdmin() &&
                this.$route.params.id == fetchedData.data[0].client_id
            ) {
                this.no_of_new_activities = this.no_of_new_activities + 1;
            }
        }
    },
    created() {
        vm.$on("FetchPageData", this.getDetails);
    },
    beforeDestroy() {
        vm.$off("FetchPageData", this.getDetails);
    },
    mounted() {
        window.moment = require("moment-timezone");
        let timezone = this.getAuthUser("timezone") || "UTC";
        moment.tz.setDefault(timezone);
        this.getDetails();
    },
    methods: {
        get_other_logs(type, extraInfo) {
            if (type == "new") this.getmoreActivities(type);
            else if (type == "mid") {
                this.latest_date = extraInfo.latest;
                this.oldest_date = extraInfo.oldest;
                this.getmoreActivities(type);
            }
        },
        getDetails() {
            let type = this.$route.path.split("/")[1];
            let id = this.$route.params.id;

            ApiService.get("clients_overview", {
                id: id,
                req_activity: this.$route.params.log
            }).then(response => {
                let client = response.client;
                this.client_group = client.client_group;
                this.selectedUser = {
                    name: client.name,
                    type: "client",
                    id: client._id,
                    client
                };
                //this.activities = client.activity.reverse();
                if (this.activities.length > 0) {
                    this.latest_date = this.activities[0].createdAt;
                    this.oldest_date = this.activities[
                        this.activities.length - 1
                    ].createdAt;
                }
                this.show_recent = response.show_recent;

                this.users = client.users;
                this.locations = client.location;
                this.patients = client.patient;
                this.activities = client.activity.reverse();
                this.status = client.status;

                setTimeout(() => {
                    const container = this.$el.querySelector(
                        ".activity-scroll"
                    );
                    //container.scrollTop = container.scrollHeight;
                }, 0);

                this.no_of_new_activities = 0;

                this.$emit(
                    "emitselectedUserInfoFromOverview",
                    this.selectedUser
                );
            });
        },
        getClientActivities() {
            let type = this.$route.path.split("/")[1];
            let id = this.$route.params.id;

            ApiService.get("client_activities", {
                loadingPartial: true,
                id: id,
                req_activity: this.$route.params.log
            }).then(response => {
                this.activities = response.activities.reverse();
                if (this.activities.length > 0) {
                    this.latest_date = this.activities[0].createdAt;
                    this.oldest_date = this.activities[
                        this.activities.length - 1
                    ].createdAt;
                }
                this.show_recent = response.show_recent;

                setTimeout(() => {
                    const container = this.$el.querySelector(
                        ".activity-scroll"
                    );
                    //container.scrollTop = container.scrollHeight;
                }, 0);
            });
        },
        onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
            if (scrollTop <= 0) {
                this.getmoreActivities("last");
            }
        },
        getmoreActivities(log_type) {
            let type = this.$route.path.split("/")[1];
            let id = this.$route.params.id;
            ApiService.get("more_activities", {
                offset: this.activities.length,
                id: id,
                type: type,
                latest_date: this.latest_date,
                oldest_date: this.oldest_date,
                log_type: log_type
            }).then(response => {
                this.new_activities = response.activity;
                if (this.activities.length > 0) {
                    if (log_type === "new") {
                        this.latest_date = this.activities[0].createdAt;
                        this.show_recent = false;
                    } else if (
                        log_type === "last" &&
                        this.new_activities.length > 0
                    ) {
                        this.oldest_date = this.new_activities[
                            this.new_activities.length - 1
                        ].createdAt;
                    }
                }

                const container = this.$el.querySelector(".activity-scroll");
                container.scrollTop = 28;
            });
        },
        dateOutputFormat: function(value) {
            return moment(value.createdAt).fromNow();
        },
        change_status(status) {
            let type = this.$route.path.split("/")[1];
            let id = this.$route.params.id;

            ApiService.put("/update_status", {
                id: id,
                type: type,
                status: status
            }).then(response => {
                this.status = status;
            });
        }
    }
};
</script>
<style scoped>
@import "./Overview.scss";
</style>
