<template>
    <div class="pos-absolute fixed-div d-custom-flex flex-column w-100">
        <v-toolbar v-if="selectedUser.location">
            <span>
                Type : {{ selectedUser.location.type.acronym }}
                &nbsp;&nbsp;|&nbsp;&nbsp;
                Address : {{ selectedUser.location.address }}
            </span>
        </v-toolbar>

        <v-container fluid grid-list-xl scrollArea>
            <!-- Tabs | Will show only for location -->
            <v-tabs
                v-if="hasAccess('patient', 'view') || (hasAccess('contact', 'view') && contacts.length)"
                v-model="tab"
                class="mb-4"
            >
                <v-tab key="#tab-patients" href="#tab-patients">Patients</v-tab>
                <v-tab v-if="contacts.length" key="#tab-contacts" href="#tab-contacts">Contacts</v-tab>
                <v-tab-item
                    v-if="hasAccess('patient', 'view')"
                    key="tab-patients"
                    value="tab-patients"
                >
                    <v-card flat tile>
                        <v-card-text>
                            <DataTable
                                :columns="locationPatientColumns"
                                :rows="patients"
                                type="patients"
                                :searchEnable="false"
                            />
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item
                    v-if="contacts.length && hasAccess('contact', 'view')"
                    key="tab-contacts"
                    value="tab-contacts"
                >
                    <v-card flat tile>
                        <v-card-text>
                            <DataTable
                                :columns="contactColumns"
                                :rows="contacts"
                                type="contacts"
                                :searchEnable="false"
                            />
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
            <!-- End : Tabs -->

            <!-- main content area -->
            <app-card :heading="$t('message.activity')" colClasses="activity-widget-wrap pa-0">
                <div class="activity-widget">
                    <a
                        @click="
                        activities = [];
                        new_activities = [];
                        getLocationActivities(); no_of_new_activities=0;"
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

            <!-- Dialog Model For Patient -->
            <PatientDialogBox
                ref="PatientDialog"
                action="add"
                :locationInfo="selectedUser.location"
            />

            <!-- Dialog Model For Contact -->
            <ContactDialogBox ref="ContactDialog" action="add" :extraInfo="selectedUser" />
        </v-container>

        <!-- Patient / Location Overview Section : Bottom Right Button-->
        <v-speed-dial
            v-if="!isAdmin()"
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
                v-if="hasAccess('patient', 'add_new_patient')"
                @click="add_form('Patient')"
                style="right:32px;"
                class="pl-2 pr-2"
                dark
                color="primary"
            >
                <strong>Patient</strong>&nbsp;&nbsp;
                <v-icon>account_circle</v-icon>
            </v-btn>
            <v-btn
                v-if="hasAccess('contact', 'add_new_contact')"
                @click="add_form('Contact')"
                style="right:35px;"
                class="pl-2 pr-2"
                dark
                color="primary"
            >
                <strong>Contact</strong>&nbsp;&nbsp;
                <v-icon>account_box</v-icon>
            </v-btn>
        </v-speed-dial>
    </div>
</template>

<script>
import moment from "moment";
import { vm } from "@/main";
import ApiService from "@/common/api.service";

import DataTable from "@/components/table/datatable";
import Timeline from "@/components/timeline/timeline";

import ApiUrl from "@/config";

const PatientDialogBox = () =>
    import("@/components/DialogBox/PatientDialogBox");
const ContactDialogBox = () =>
    import("@/components/DialogBox/ContactDialogBox");

export default {
    name: "Overview",
    components: {
        Timeline: Timeline,
        DataTable,
        PatientDialogBox,
        ContactDialogBox
    },
    data() {
        return {
            fab: false,
            tab: null,
            status: "Active",

            log_dtype: "last",
            latest_date: new Date(),
            oldest_date: new Date(),
            show_recent: false,

            type: this.$route.path.split("/")[1],
            id: this.$route.params.id,

            activities: [],
            new_activities: [],
            selectedUser: {},

            patients: [],
            contacts: [],

            contactColumns: [
                {
                    text: "First",
                    value: "first_name"
                },
                {
                    text: "Last",
                    value: "last_name"
                },
                {
                    text: "Rel/Title",
                    value: "relationship",
                    formatFn: this.relOrtitle
                },
                {
                    text: "Phone",
                    value: "contact"
                },
                {
                    text: "Email",
                    value: "email"
                },
                {
                    text: "Type",
                    value: "type"
                }
            ],
            locationPatientColumns: [
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
                }
            ],
            no_of_new_activities: 0
        };
    },
    sockets: {
        "new-activity-log": function(fetchedData) {
            if (
                this.isAdmin() &&
                this.$route.params.id ==
                    fetchedData.data[0].metadata.location_id
            ) {
                this.no_of_new_activities = this.no_of_new_activities + 1;
            } else {
                if (
                    this.getAuthClient("_id") ==
                        fetchedData.data[0].client_id &&
                    this.getAuthUser("_id") == fetchedData.data[0].user_id &&
                    this.$route.params.id ==
                        fetchedData.data[0].metadata.location_id
                ) {
                    this.no_of_new_activities = this.no_of_new_activities + 1;
                }
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

            ApiService.get("locations_overview", {
                id: id,
                req_activity: this.$route.params.log
            }).then(response => {
                let location = response.location;
                this.selectedUser = {
                    name: location.name || location.address,
                    type: "location",
                    id: location._id,
                    location
                };
                this.activities = location.activity.reverse();

                if (this.activities.length > 0) {
                    this.latest_date = this.activities[0].createdAt;
                    this.oldest_date = this.activities[
                        this.activities.length - 1
                    ].createdAt;
                }
                this.show_recent = response.show_recent;

                this.patients = location.patient;
                this.contacts = location.contacts;

                setTimeout(() => {
                    const container = this.$el.querySelector(
                        ".activity-scroll"
                    );
                    container.scrollTop = container.scrollHeight;
                }, 0);

                this.no_of_new_activities = 0;

                this.$emit(
                    "emitselectedUserInfoFromOverview",
                    this.selectedUser
                );
            });
        },
        getLocationActivities() {
            let type = this.$route.path.split("/")[1];
            let id = this.$route.params.id;

            ApiService.get("location_activities", {
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
                    container.scrollTop = container.scrollHeight;
                }, 0);
            });
        },
        add_form(type) {
            if (type == "Patient") this.$refs.PatientDialog.openDialog();
            else if (type == "Contact") this.$refs.ContactDialog.openDialog();
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
                loadingPartial: true,
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
                //container.scrollTop =
                //container.scrollHeight > 480 ? 480 : container.scrollHeight;
            });
        },

        relOrtitle(data) {
            return data.relationship || data.title;
        }
    }
};
</script>

<style scoped>
@import "./Overview.scss";
</style>
