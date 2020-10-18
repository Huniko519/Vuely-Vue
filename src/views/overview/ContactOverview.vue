<template>
    <div class="pos-absolute fixed-div d-custom-flex flex-column w-100">
        <v-container fluid grid-list-xl scrollArea>
            <!-- main content area -->
            <app-card :heading="$t('message.activity')" colClasses="activity-widget-wrap pa-0">
                <div class="activity-widget">
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
        <!-- Contact Edit Section : Bottom Right Button-->
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
                v-if="hasAccess('contact', 'update_contact_info')"
                @click="edit_form('Contact')"
                style="right:32px;"
                class="pl-2 pr-2"
                dark
                color="primary"
            >
                <strong>Edit</strong>&nbsp;&nbsp;
                <v-icon>edit</v-icon>
            </v-btn>
        </v-speed-dial>
        <contactEditBox ref="contactEdit"></contactEditBox>
    </div>
</template>

<script>
import moment from "moment";
import { vm } from "@/main";
import ApiService from "@/common/api.service";

import Timeline from "@/components/timeline/timeline";
import contactEditBox from "@/components/DialogBox/ContactEditBox";

export default {
    name: "ContactOverview",
    components: {
        Timeline,
        contactEditBox: contactEditBox
    },
    data() {
        return {
            fab: false,
            log_dtype: "last",
            latest_date: new Date(),
            oldest_date: new Date(),
            show_recent: false,
            contact: {},
            type: this.$route.path.split("/")[1],
            id: this.$route.params.id,

            activities: [],
            new_activities: [],
            selectedUser: {}
        };
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
        edit_form(type) {
            if (type == "Contact")
                this.$refs.contactEdit.openDialog(this.contact);
        },
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

            ApiService.get("contacts_overview", {
                id: id,
                req_activity: this.$route.params.log
            }).then(response => {
                let contact = response.contact;
                this.contact = response.contact;
                this.selectedUser = {
                    name: contact.first_name + " " + contact.last_name,
                    type: "contact",
                    id: contact._id,
                    contact
                };

                this.activities = contact.activity.reverse();
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

                this.$emit(
                    "emitselectedUserInfoFromOverview",
                    this.selectedUser
                );
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
        }
    }
};
</script>

<style scoped>
@import "./Overview.scss";
</style>
