<template>
    <div>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <div class="d-custom-flex pa-4 w-100">
                    <div class="welcome-message">
                        <h4
                            v-if="isAdmin()"
                        >Good morning, {{getAuthUser('first_name')}} {{ getAuthUser('last_name')}}.</h4>
                        <h4
                            v-else
                        >Good morning, {{getAuthUserProfile('first_name')}} {{ getAuthUserProfile('last_name')}}.</h4>
                        <p>Here’s what’s happening with your store this week.</p>
                    </div>
                    <div class="ml-auto font-weight-bold text-right" id="datetime"></div>
                </div>
                <template v-if="isAdmin()">
                    <app-card
                        :heading="$t('message.activity')"
                        colClasses="xl12 lg12 md12 sm12 xs12"
                    >
                        <a
                            @click="
                            activities = [];
                            new_activities = [];
                            getActivityLog(); no_of_new_activities=0;"
                            v-if="no_of_new_activities"
                        >There are {{no_of_new_activities}}+ new activities. Click here to see.</a>
                        <v-btn
                            @click.stop="activity_filter_dialog = !activity_filter_dialog"
                            color="info activity-filter-button"
                        >
                            <v-icon class="small font-weight-bold mr-2">ti-filter</v-icon>Filter
                        </v-btn>
                        <vue-perfect-scrollbar
                            class="customizer-scroll-area activity-scroll"
                            :settings="settings"
                            @ps-scroll-up="onScroll"
                            style="max-height:500px;overflow-y:auto"
                        >
                            <Timeline
                                :items="activities"
                                :newitems="new_activities"
                                :show_recent="show_recent"
                                :log_dtype="log_dtype"
                                @get_other_logs="get_other_logs"
                            ></Timeline>
                        </vue-perfect-scrollbar>
                    </app-card>
                </template>
                <template v-else>
                    <app-card
                        v-if="hasAccess('patient', 'view')"
                        colClasses="xl6 lg6 md6 xs12 sm12"
                        customClasses="mb-0"
                        :fullBlock="true"
                    >
                        <div
                            class="d-custom-flex justify-content-between align-items-center py-2 px-3"
                        >
                            <h5 class="mb-0 pt-3 pb-3">
                                <i class="mr-2 zmdi zmdi-account"></i>
                                {{$t('message.patients')}}
                            </h5>
                            <v-btn
                                v-if="hasAccess('patient', 'add_new_patient')"
                                fab
                                small
                                color="primary"
                                @click="onPatientDialog()"
                            >
                                <v-icon dark>add</v-icon>
                            </v-btn>
                        </div>
                        <!-- Dialog Model For Patient -->
                        <patient-dialogBox ref="PatientDialog" action="add"></patient-dialogBox>

                        <v-list two-line>
                            <standard-table
                                :columns="patient_columns"
                                :rows="patient"
                                type="patients"
                                :pagination="false"
                            ></standard-table>
                        </v-list>
                    </app-card>

                    <app-card
                        v-if="hasAccess('location', 'view')"
                        colClasses="xl6 lg6 md6 xs12 sm12"
                        customClasses="mb-0"
                        :fullBlock="true"
                    >
                        <div
                            class="d-custom-flex justify-content-between align-items-center py-2 px-3"
                        >
                            <h5 class="mb-0 pt-3 pb-3">
                                <i class="mr-2 zmdi zmdi-pin"></i>
                                {{$t('message.locations')}}
                            </h5>
                            <v-btn
                                v-if="hasAccess('location', 'add_new_location')"
                                fab
                                small
                                color="primary"
                                @click="onLocationDialog()"
                            >
                                <v-icon dark>add</v-icon>
                            </v-btn>
                        </div>

                        <!-- Dialog Model For Location -->

                        <location-dialogBox ref="LocationDialog" @fetch_locations="getDashboard"></location-dialogBox>
                        <v-list two-line>
                            <standard-table
                                :columns="location_columns"
                                :rows="location"
                                type="locations"
                                :pagination="false"
                            ></standard-table>
                        </v-list>
                    </app-card>

                    <app-card
                        :heading="$t('message.activity')"
                        colClasses="xl12 lg12 md12 sm12 xs12"
                        customClasses="activity-card"
                    >
                        <a
                            @click="
                            activities = [];
                            new_activities = [];
                            getActivityLog(); no_of_new_activities=0;"
                            v-if="no_of_new_activities"
                        >There are {{no_of_new_activities}}+ new activities. Click here to see.</a>

                        <vue-perfect-scrollbar
                            class="customizer-scroll-area activity-scroll"
                            :settings="settings"
                            @ps-scroll-up="onScroll"
                            style="max-height:500px;overflow-y:auto"
                        >
                            <Timeline
                                :items="activities"
                                :newitems="new_activities"
                                :show_recent="show_recent"
                                :log_dtype="log_dtype"
                                @get_other_logs="get_other_logs"
                            ></Timeline>
                        </vue-perfect-scrollbar>
                    </app-card>
                </template>
            </v-layout>
        </v-container>
        <v-dialog v-model="activity_filter_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title class="text-capitalize">Fiter activity</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text class="mt-0 pt-0 mb-0 pb-0">
                    <v-checkbox
                        label="All"
                        v-model="activity_filter_values_all"
                        @change="activity_filter_selected_values = activity_filter_values_all ? activity_filter_values : []"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="User signup"
                        value="signup"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="User added"
                        value="user_added"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="User activate"
                        value="activate"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="User profile update"
                        value="user_update"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="User login"
                        value="user_login"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="User logout"
                        value="user_logout"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="Patient add"
                        value="patient_add"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                            class="mt-0 pt-0"
                            v-model="activity_filter_selected_values"
                            label="Patient import"
                            value="patient_import"
                            @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="Patient update"
                        value="patient_update"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="Location add"
                        value="location_add"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="User comment (On patient)"
                        value="patient_comment"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="User comment (On location)"
                        value="location_comment"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="Contact add"
                        value="contact_add"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="Contact comment"
                        value="contact_comment"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="Location remove"
                        value="remove_location"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                    <v-checkbox
                        class="mt-0 pt-0"
                        v-model="activity_filter_selected_values"
                        label="Patient remove"
                        value="remove_patient"
                        @change="activity_filter_values_all = activity_filter_selected_values.length == activity_filter_values.length"
                    ></v-checkbox>
                </v-card-text>
                <v-divider class="ma-0"></v-divider>
                <v-flex pa-2>
                    <v-btn
                        color="info"
                        @click="activity_filter_dialog = false; getActivityLog();"
                    >Filter</v-btn>
                    <v-btn color="danger" @click="activity_filter_dialog = false">Cancel</v-btn>
                </v-flex>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import TodayWeather from "Components/Widgets/TodayWeather";
import patientDialogBox from "../../components/DialogBox/PatientDialogBox";
import locationDialogBox from "../../components/DialogBox/LocationDialogBox";
import { vm } from "../../main";
import Vue from "vue";
import standardTable from "../../components/table/standard";
import Timeline from "../../components/timeline/timeline";
import { mapState } from "vuex";
import ApiService from "@/common/api.service";
import moment from "moment";

import ApiUrl from "@/config";

export default {
    components: {
        TodayWeather,
        "standard-table": standardTable,
        Timeline: Timeline,
        "patient-dialogBox": patientDialogBox,
        "location-dialogBox": locationDialogBox
    },
    data() {
        return {
            log_dtype: "last",
            settings: {
                maxScrollbarLength: 160
            },
            latest_date: new Date(),
            oldest_date: new Date(),
            show_recent: false,
            activities: [],
            new_activities: [],
            patient_columns: [
                {
                    label: "First",
                    field: "first_name"
                },
                {
                    label: "Last",
                    field: "last_name"
                },
                {
                    label: "Age",
                    field: "age",
                    type: "number",
                    thClass: "vgt-left-align",
                    tdClass: "vgt-left-align"
                },
                {
                    label: "Gender",
                    field: "gender"
                }
            ],
            location_columns: [
                {
                    label: "Name",
                    field: "name"
                },
                {
                    label: "Address",
                    field: "address"
                },
                {
                    label: "Type",
                    field: "type"
                },
                {
                    label: "Residents",
                    field: "capacity",
                    type: "number",
                    thClass: "vgt-left-align",
                    tdClass: "vgt-left-align"
                }
            ],
            patient: [],
            location: [],
            activity_filter_dialog: false,
            activity_filter_values_all: false,
            activity_filter_selected_values: [],
            activity_filter_values: [
                "signup",
                "user_added",
                "activate",
                "user_update",
                "user_login",
                "user_logout",
                "patient_add",
                "patient_import",
                "patient_update",
                "location_add",
                "patient_comment",
                "location_comment",
                "contact_add",
                "contact_comment",
                "remove_location",
                "remove_patient",
                "status_change"
            ],
            no_of_new_activities: 0
        };
    },
    sockets: {
        "new-activity-log": function(fetchedData) {
            if (this.isAdmin()) {
                this.no_of_new_activities = this.no_of_new_activities + 1;
            } else {
                if (
                    this.getAuthClient("_id") ==
                        fetchedData.data[0].client_id &&
                    this.getAuthUser("_id") == fetchedData.data[0].user_id &&
                    this.getAuthUserGroup("_id") ==
                        fetchedData.data[0].user_group_id
                ) {
                    this.no_of_new_activities = this.no_of_new_activities + 1;
                }
            }
        }
    },
    created() {
        vm.$on("FetchPageData", this.getDashboard);
    },
    beforeDestroy() {
        vm.$off("FetchPageData", this.getDashboard);
    },
    mounted() {
        if (this.isAdmin()) {
            this.getActivityLog();
        } else {
            this.getDashboard();
        }

        window.moment = require("moment-timezone");
        let update;
        (update = () => {
            let timezone = this.getAuthUser("timezone") || "UTC";
            if (document.getElementById("datetime") != null) {
                document.getElementById("datetime").innerHTML = moment()
                    .tz(timezone)
                    .format("Do MMMM YYYY<Br> h:mm:ss A");
            }
        })();
        if (document.getElementById("datetime") != null)
            setInterval(update, 1000);
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
        getActivityLog(e) {
            ApiService.get("fetch_activity_log", {
                loadingPartial: true,
                activity_filter_selected_values:
                    this.activity_filter_selected_values.length > 0
                        ? this.activity_filter_selected_values
                        : this.activity_filter_values,
                req_activity: this.$route.params.log
            }).then(response => {
                this.activities = response.activity.reverse();
                this.show_recent = response.show_recent;
                if (this.activities.length > 0) {
                    this.latest_date = this.activities[0].createdAt;
                    this.oldest_date = this.activities[
                        this.activities.length - 1
                    ].createdAt;
                }

                setTimeout(() => {
                    const container = this.$el.querySelector(
                        ".activity-scroll"
                    );
                    container.scrollTop = container.scrollHeight;
                }, 0);
            });
        },
        getDashboard() {
            ApiService.get("dashboard", {
                req_activity: this.$route.params.log
            }).then(response => {
                this.location = response.location;
                this.patient = response.patient;
                this.activities = response.activity.reverse();
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
                    container.scrollTop = container.scrollHeight;
                }, 0);
            });
        },
        onPatientDialog() {
            this.$refs.PatientDialog.openDialog();
        },
        onLocationDialog() {
            this.$refs.LocationDialog.openDialog();
        },
        onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
            if (scrollTop <= 0) {
                this.getmoreActivities("last");
            }
        },
        getmoreActivities(log_type) {
            ApiService.get("more_activities", {
                loadingPartial: true,
                offset: this.activities.length,
                latest_date: this.latest_date,
                oldest_date: this.oldest_date,
                log_type: log_type,
                activity_filter_selected_values:
                    this.activity_filter_selected_values.length > 0
                        ? this.activity_filter_selected_values
                        : this.activity_filter_values
            }).then(response => {
                this.log_dtype = log_type;
                this.new_activities = response.activity;
                if (this.activities.length > 0) {
                    if (log_type === "new") {
                        this.latest_date = this.activities[0].createdAt;
                        this.show_recent = false;
                    } else if (log_type === "last") {
                        this.oldest_date = this.new_activities[
                            this.new_activities.length - 1
                        ].createdAt;
                    }

                    const container = this.$el.querySelector(
                        ".activity-scroll"
                    );
                    container.scrollTop = 28;
                }
            });
        }
    }
};
</script>
<style>
@import "../locations/Location.css";
@import "../patients/Patient.css";
</style>
