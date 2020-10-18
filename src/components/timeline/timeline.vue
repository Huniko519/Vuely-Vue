<template>
    <div class="hover-wrapper advanced-timeline-wrapper ml-2 timeline-wrapper pt-4">
        <app-section-loader :status="loadingPartial"></app-section-loader>
        <v-timeline dense clipped align-top>
            <v-slide-x-reverse-transition group hide-on-leave mr-2>
                <v-timeline-item
                    class="white--text mb-12 pos-relative"
                    :color="activity.sub_operation=='patient_comment' || activity.sub_operation=='location_comment' ? 'pink' : activity.badgeClass"
                    v-for="(activity,index) in items"
                    :key="activity.id"
                    small
                >
                    <template v-slot:icon>
                        <v-icon size="10" v-if="activity.activity.form_icon">{{activity.activity.form_icon}}</v-icon>
                        <span v-else>{{activity.shortform}}</span>
                    </template>
                    <v-flex justify="space-between" row black--text no-gutter>
                        <v-expansion-panel
                            :class="{'custom-activity-border':$route.params.log===activity.id}"
                        >
                            <v-expansion-panel-content
                                :class="{'custom-activity-border':$route.params.log===activity.id}"
                            >
                                <template v-slot:header>
                                    <v-flex class="xl10 sm10 no-gutter">
                                        <p
                                            class="mb-0"
                                            v-if="activity.sub_operation=='location_add'"
                                        >
                                            <span>
                                                Location
                                                <a
                                                    v-if="isAdmin() || hasAccess('location', 'view')"
                                                    @click="getUrl({type:'location', id:activity.activity.location_id})"
                                                >{{activity.activity.location_name}}</a>
                                                <span v-else>
                                                    <b>{{activity.activity.location_name}}</b>
                                                </span> is added
                                                <span v-if="isAdmin()">
                                                    for client
                                                    <a
                                                        @click="getUrl({type:'client',id:activity.activity.client_id})"
                                                    >{{activity.activity.client_name}}</a>
                                                </span>
                                                <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                    by user
                                                    <a
                                                        @click="getUrl({type:'user', id:activity.activity.user_id})"
                                                    >{{activity.activity.user_name}}</a>
                                                </span>
                                                <span v-else>
                                                    by user
                                                    <b>{{activity.activity.user_name}}</b>
                                                </span>
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='patient_add'"
                                        >
                                            <span>
                                                Patient
                                                <a
                                                    v-if="isAdmin() || hasAccess('patient', 'view')"
                                                    @click="getUrl({type:'patient',id:activity.activity.patient_id})"
                                                >{{activity.activity.patient_name}}</a>
                                                <span v-else>
                                                    <b>{{activity.activity.patient_name}}</b>
                                                </span> is added
                                                <span v-if="isAdmin()">
                                                    for client
                                                    <a
                                                        @click="getUrl({type:'client',id:activity.activity.client_id})"
                                                    >{{activity.activity.client_name}}</a>
                                                </span>
                                                <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                    by user
                                                    <a
                                                        @click="getUrl({type:'user', id:activity.activity.user_id})"
                                                    >{{activity.activity.user_name}}</a>
                                                </span>
                                                <span v-else>
                                                    by user
                                                    <b>{{activity.activity.user_name}}</b>
                                                </span>
                                                <template v-if="activity.activity.location_id">
                                                    for location
                                                    <a
                                                        @click="getUrl({type:'location', id:activity.activity.location_id})"
                                                    >{{activity.activity.location_name}}</a>
                                                </template>.
                                            </span>
                                        </p>
                                        <p
                                                class="mb-0"
                                                v-else-if="activity.sub_operation=='patient_import'"
                                        >
                                            <span v-if="$route.fullPath.includes('patient')">
                                                Patient was added
                                                <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                    by user
                                                    <a
                                                            @click="getUrl({type:'user', id:activity.activity.user_id})"
                                                    >{{activity.activity.user_name}}</a>
                                                </span>
                                                <span v-if="isAdmin()">
                                                    of client
                                                    <a
                                                            @click="getUrl({type:'client',id:activity.activity.client_id})"
                                                    >{{activity.activity.client_name}}</a>
                                                </span>
                                            </span>
                                            <span v-else>User <a @click="getUrl({type:'user', id:activity.activity.user_id})"
                                                                 v-if="isAdmin() || hasAccess('user', 'view')">
                                                {{activity.activity.user_name}}</a>
                                                <span v-if="isAdmin()">
                                                    of client
                                                    <a @click="getUrl({type:'client',id:activity.activity.client_id})">
                                                        {{activity.activity.client_name}}</a>
                                                </span>
                                                 added {{activity.activity.patient_id.length}} patients</span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='patient_update'"
                                        >
                                            <span>
                                                Patient
                                                <a
                                                    v-if="isAdmin() || hasAccess('patient', 'view')"
                                                    @click="getUrl({type:'patient',id:activity.activity.patient_id})"
                                                >{{activity.activity.patient_name}}</a>
                                                <span v-else>
                                                    <b>{{activity.activity.patient_name}}</b>
                                                </span> is updated
                                                <span v-if="isAdmin()">
                                                    for client
                                                    <a
                                                        @click="getUrl({type:'client',id:activity.activity.client_id})"
                                                    >{{activity.activity.client_name}}</a>
                                                </span>
                                                <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                    by user
                                                    <a
                                                        @click="getUrl({type:'user', id:activity.activity.user_id})"
                                                    >{{activity.activity.user_name}}</a>
                                                </span>
                                                <span v-else>
                                                    by user
                                                    <b>{{activity.activity.user_name}}</b>
                                                </span>
                                                <template v-if="activity.activity.location_id">
                                                    for location
                                                    <a
                                                        @click="getUrl({type:'location', id:activity.activity.location_id})"
                                                    >{{activity.activity.location_name}}</a>
                                                </template>.
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='patient_form'"
                                        >
                                            <span>
                                                Form
                                                <a
                                                    v-if="isAdmin() || hasAccess('patient', 'view')"
                                                    @click="getUrl({type:'patient_form',path:$route.path,id:activity.activity.patient_form_id,patient_id:activity.activity.patient_id})"
                                                >{{activity.activity.form_name}}</a>
                                                is <span v-if="activity.activity.save_type==='save'"><b>submitted</b></span><span v-else>{{"saved as a "+activity.activity.save_type.toLowerCase()}}</span> for
                                                Patient
                                                <a
                                                    v-if="isAdmin() || hasAccess('patient', 'view')"
                                                    @click="getUrl({type:'patient',id:activity.activity.patient_id})"
                                                >{{activity.activity.patient_name}}</a>
                                                <span v-else>
                                                    <b>{{activity.activity.patient_name}}</b>
                                                </span>
                                                <span v-if="isAdmin()">
                                                    is updated for client
                                                    <a
                                                        @click="getUrl({type:'client',id:activity.activity.client_id})"
                                                    >{{activity.activity.client_name}}</a>
                                                </span>
                                                <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                    by user
                                                    <a
                                                        @click="getUrl({type:'user', id:activity.activity.user_id})"
                                                    >{{activity.activity.user_name}}</a>
                                                </span>
                                                <span v-else>
                                                    by user
                                                    <b>{{activity.activity.user_name}}</b>
                                                </span>
                                                <template v-if="activity.activity.location_id">
                                                    for location
                                                    <a
                                                        @click="getUrl({type:'location', id:activity.activity.location_id})"
                                                    >{{activity.activity.location_name}}</a>
                                                </template>.
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='user_login'"
                                        >
                                            <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                User
                                                <a
                                                    @click="getUrl({type:'user',id:activity.activity.user_id})"
                                                >{{activity.activity.user_name}}</a> logged
                                            </span>
                                            <span v-else>
                                                User
                                                <b>{{activity.activity.user_name}}</b> logged
                                            </span>
                                            <span v-if="activity.activity.is_admin">
                                                in as
                                                <b>ADMIN</b>.
                                            </span>
                                            <span v-else>
                                                into
                                                <strong>{{activity.activity.user_group_name}}</strong>
                                                under
                                                <span
                                                    v-if="isAdmin()"
                                                >
                                                    <a
                                                        @click="getUrl({type:'client',id:activity.activity.client_id})"
                                                    >{{activity.activity.client_name}}</a>
                                                </span>
                                                <span v-else>
                                                    <strong>{{activity.activity.client_name}}</strong>
                                                </span>
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='user_logout'"
                                        >
                                            <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                User
                                                <a
                                                    @click="getUrl({type:'user',id:activity.activity.user_id})"
                                                >{{activity.activity.user_name}}</a> logged out
                                            </span>
                                            <span v-else>
                                                User
                                                <b>{{activity.activity.user_name}}</b> logged out
                                            </span>
                                            <span v-if="!activity.activity.is_admin">
                                                from
                                                <strong>{{activity.activity.user_group_name}}</strong>
                                                of
                                                <span
                                                    v-if="isAdmin()"
                                                >
                                                    <a
                                                        @click="getUrl({type:'client',id:activity.activity.client_id})"
                                                    >{{activity.activity.client_name}}</a>
                                                </span>
                                                <span v-else>
                                                    <strong>{{activity.activity.client_name}}</strong>
                                                </span>
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='signup'"
                                        >
                                            New
                                            User
                                            <strong>{{activity.activity.user_group_name}}</strong>&nbsp;
                                            <span
                                                v-if="isAdmin() || hasAccess('user', 'view')"
                                            >
                                                <a
                                                    @click="getUrl({type:'user', id:activity.activity.user_id})"
                                                >{{activity.activity.user_name}}</a>
                                            </span>
                                            <span v-else>
                                                <b>{{activity.activity.user_name}}</b>
                                            </span>
                                            for Client
                                            <b>{{activity.activity.client_group_name}}</b>&nbsp;
                                            <span v-if="isAdmin()">
                                                <a
                                                    @click="getUrl({type:'client', id:activity.activity.client_id})"
                                                >{{activity.activity.client_name}}</a> created with pending status
                                            </span>
                                            <span v-else>
                                                <b>{{activity.activity.client_name}}</b> created with pending status
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='user_added'"
                                        >
                                            User
                                            <a
                                                v-if="isAdmin() || hasAccess('user', 'view')"
                                                @click="getUrl({type:'user', id:activity.activity.user_id})"
                                            >{{activity.activity.user_name}}</a>
                                            <span v-else>
                                                <b>{{activity.activity.user_name}}</b>
                                            </span>
                                            Added by
                                            <a
                                                v-if="isAdmin() || hasAccess('user', 'view')"
                                                @click="getUrl({type:'user', id:activity.activity.user_id_added_by})"
                                            >{{activity.activity.user_name_added_by}}</a>
                                            <span v-else>
                                                <b>{{activity.activity.user_name_added_by}}</b>
                                            </span>
                                            to
                                            <strong>{{activity.activity.user_group_name}}</strong>
                                            under
                                            <span
                                                v-if="isAdmin()"
                                            >
                                                <a
                                                    @click="getUrl({type:'client',id:activity.activity.client_id})"
                                                >{{activity.activity.client_name}}</a>
                                            </span>
                                            <span v-else>
                                                <strong>{{activity.activity.client_name}}</strong>
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='activate'"
                                        >
                                            User
                                            <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                <a
                                                    @click="getUrl({type:'user', id:activity.activity.user_id})"
                                                >{{activity.activity.user_name}}</a> status changed to active
                                            </span>
                                            <span v-else>
                                                <b>{{activity.activity.user_name}}</b> status changed to active
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='user_update'"
                                        >
                                            <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                User
                                                <a
                                                    @click="getUrl({type:'user', id:activity.activity.user_id})"
                                                >{{activity.activity.user_name}}</a> changed their profile information.
                                            </span>
                                            <span v-else>
                                                User
                                                <b>{{activity.activity.user_name}}</b> changed their profile information.
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='patient_comment'"
                                        >
                                            <span>
                                                <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                    User
                                                    <a
                                                        @click="getUrl({type:'user',id:activity.activity.user_id})"
                                                    >{{activity.activity.user_name}}</a>
                                                </span>
                                                <span v-else>
                                                    User
                                                    <b>{{activity.activity.user_name}}</b>
                                                </span>
                                                commented
                                                <b>"{{activity.activity.note}}"</b> for patient
                                                <a
                                                    v-if="isAdmin() || hasAccess('patient', 'view')"
                                                    @click="getUrl({type:'patient',id: activity.activity.patient_id})"
                                                >{{activity.activity.patient_name}}</a>
                                                <span v-else>
                                                    <b>{{activity.activity.patient_name}}</b>
                                                </span>
                                                <span v-if="isAdmin()">
                                                    for client
                                                    <a
                                                        @click="getUrl({type:'client', id:activity.activity.client_id})"
                                                    >{{activity.activity.client_name}}</a>
                                                </span>
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='location_comment'"
                                        >
                                            <span>
                                                <span v-if="isAdmin() || hasAccess('user', 'view')">
                                                    User
                                                    <a
                                                        @click="getUrl({type:'user',id:activity.activity.user_id})"
                                                    >{{activity.activity.user_name}}</a>
                                                </span>
                                                <span v-else>
                                                    User
                                                    <b>{{activity.activity.user_name}}</b>
                                                </span>
                                                commented
                                                <b>"{{activity.activity.note}}"</b> for location
                                                <a
                                                    v-if="isAdmin() || hasAccess('location', 'view')"
                                                    @click="getUrl({type:'location',id:activity.activity.location_id})"
                                                >{{activity.activity.location_name}}</a>
                                                <span v-else>
                                                    <b>{{activity.activity.location_name}}</b>
                                                </span>
                                                <span v-if="isAdmin()">
                                                    for client
                                                    <a
                                                        @click="getUrl({type:'client',id:activity.activity.client_id})"
                                                    >{{activity.activity.client_name}}</a>
                                                </span>
                                            </span>
                                        </p>

                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='remove_location'"
                                        >
                                            <span v-if="isAdmin()">
                                                Location
                                                <a
                                                    @click="getUrl({type:'location',id:activity.activity.location_id})"
                                                >{{activity.activity.location_name}}</a> is removed by user
                                                <a
                                                    @click="getUrl({type:'user',id:activity.activity.user_id})"
                                                >{{activity.activity.user_name}}</a>
                                            </span>
                                            <span
                                                v-else
                                            >Location {{activity.activity.location_name}} is removed by user</span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='remove_patient' "
                                        >
                                            <span v-if="isAdmin()">
                                                Patient
                                                <a
                                                    @click="getUrl({type:'patient', id:activity.activity.patient_id})"
                                                >{{activity.activity.patient_name}}</a> is removed by user
                                                <a
                                                    @click="getUrl({type:'user',id:activity.activity.user_id})"
                                                >{{activity.activity.user_name}}</a>
                                            </span>
                                            <span
                                                v-else
                                            >Patient {{activity.activity.patient_name}} is removed by user</span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='contact_add'"
                                        >
                                            Contact {{activity.activity.contact_name}} added
                                            <span
                                                v-if="activity.activity.type!=='client' || isAdmin() || hasAccess(activity.activity.type, 'view')"
                                            >
                                                for {{activity.activity.type}}
                                                <a
                                                    @click="getUrl({type:activity.activity.type, id:activity.activity.type_id})"
                                                >{{activity.activity.type_name}}</a>
                                            </span>
                                            <span
                                                v-if="isAdmin() && activity.activity.type != 'client'"
                                            >
                                                for client
                                                <a
                                                    @click="getUrl({type:'user',id:activity.activity.client_id})"
                                                >{{activity.activity.client_name}}</a>
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='contact_comment'"
                                        >
                                            Comment "
                                            <b>{{activity.activity.note}}</b>
                                            " added
                                            for Contact {{activity.activity.contact_name}}
                                            <span
                                                v-if="isAdmin() || hasAccess(activity.activity.type, 'view')"
                                            >
                                                for {{activity.activity.type}}
                                                <a
                                                    @click="getUrl({type:activity.activity.type, id:activity.activity.type_id})"
                                                >{{activity.activity.type_name}}</a>
                                            </span>
                                            <span
                                                v-if="isAdmin() && activity.activity.type != 'client'"
                                            >
                                                for client
                                                <a
                                                    @click="getUrl({type:'user',id:activity.activity.client_id})"
                                                >{{activity.activity.client_name}}</a>
                                            </span>
                                        </p>
                                        <p
                                            class="mb-0"
                                            v-else-if="activity.sub_operation=='status_change'"
                                        >
                                            <span
                                                class="text-capitalize"
                                            >{{activity.activity.change_type}}</span>&nbsp;
                                            <a
                                                v-if="isAdmin()"
                                                @click="getUrl({type:activity.activity.change_type, id:activity.activity.change_id})"
                                            >
                                                <b>{{activity.activity.change_name}}'s</b>
                                            </a>
                                            <span v-else>
                                                <b>"{{activity.activity.change_name}}'s"</b>
                                            </span>
                                            status changed to {{activity.activity.change_status}}
                                            by
                                            <a
                                                v-if="isAdmin()"
                                                @click="getUrl({type:'user', id:activity.activity.activator_id})"
                                            >{{activity.activity.activator}}</a>
                                            <span v-else>
                                                <b>{{activity.activity.activator}}</b>
                                            </span>
                                        </p>

                                        <p class="mb-0" v-else>Unformatted Activity - TO BE Deleted</p>
                                    </v-flex>
                                    <div class="text-right">{{activity.date}}</div>
                                </template>
                                <div>
                                    <div class="v-small font-weight-bold" v-if="isAdmin()">
                                        IP:
                                        <span v-html="activity.ip_address"></span>
                                    </div>
                                    <div
                                        class="d-custom-flex"
                                        v-if="$route.fullPath.includes('dashboard') || $route.params.id!=undefined"
                                    >
                                        <v-flex
                                            class="xl10 sm10 no-gutter v-small"
                                            v-html="createUrl(activity.id)"
                                        ></v-flex>
                                        <div class="w-10 text-center">
                                            <button
                                                v-clipboard:copy="createUrl(activity.id)"
                                                v-clipboard:success="handleCopyStatus"
                                                v-clipboard:error="handleCopyStatus"
                                            >
                                                <v-icon class="icon_1">zmdi zmdi-copy</v-icon>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-flex class="w-100 align-items-center" v-show="elems[activity.id]">
                            <v-btn
                                color="primary"
                                outline
                                round
                                small
                                class="d-custom-flex align-items-center ma-auto"
                                @click="getMidLog(activity.createdAt,items[index+1].createdAt)"
                            >Load More</v-btn>
                        </v-flex>
                    </v-flex>
                </v-timeline-item>
            </v-slide-x-reverse-transition>

            <!-- Start: Add comment section -->
            <v-timeline-item
                fill-dot
                class="white--text mb-0 pr-0"
                color="white"
                large
                v-if="!isAdmin()
                && (
                    (page==='locations' && hasAccess('location', 'add_comment')) ||
                    (page==='patients'  && hasAccess('patient', 'add_comment')) ||
                    (page==='contFacts'  && hasAccess('contact', 'add_comment'))
                ) && id && noComment!=1"
            >
                <span slot="icon">
                    <v-icon
                        v-if="!getAuthUser('image')"
                        dark
                        size="52"
                        class="img-responsive rounded-circle"
                        style="color:black"
                    >face</v-icon>

                    <img
                        v-else
                        :src="getAuthUser('image')"
                        alt="user profile"
                        class="img-responsive rounded-circle pa-0 mt-1"
                        style="width: 52px; height:52px"
                    />
                </span>

                <v-textarea
                    v-model="note"
                    hide-details
                    flat
                    label="Leave a comment..."
                    solo
                    auto-grow
                    single-line
                    rows="2"
                    class="mr-0 pr-0 time-line-text-area"
                    :rules="[v => !!v || 'Comment is required']"
                >
                    <template slot="append" class="mr-0 pr-0">
                        <v-btn class="mx-0 mr-0" depressed @click="save_note">Post</v-btn>
                    </template>
                </v-textarea>
            </v-timeline-item>
            <!-- End: Add comment section -->
        </v-timeline>
        <div class="activity_read_more mt-2" v-show="show_recent">
            <v-btn
                color="primary"
                outline
                round
                small
                class="d-custom-flex align-items-center ma-auto"
                @click="getRecentLog"
            >
                <v-icon class="mr-2" small>zmdi zmdi-long-arrow-down</v-icon>Go to recent logs
            </v-btn>
        </div>
    </div>
</template>

<script>
	import { mapActions } from "vuex";
	import ApiService from "@/common/api.service";
	import { vm } from "@/main";

	export default {
    data() {
        return {
            page: this.$route.path.split("/")[1],
            id: this.$route.params.id,
            nonce: 1,
            activity: [],
            log_type: "last",
            note: "", // Will be used to add user comment on patient / location
            elems: {},
            last_log_len: 0
        };
    },
    name: "Timeline",
    props: [
        "items",
        "newitems",
        "entityId",
        "noComment",
        "show_recent",
        "log_dtype"
    ],
    mounted() {
        Array.prototype.insert = function(index, item) {
            this.splice(index, 0, item);
        };
    },
    computed: {
        loadingPartial() {
            return vm.loadingPartial;
        }
    },
    watch: {
        log_dtype: {
            handler: function(newVal, oldVal) {
                this.log_type = newVal;
            },
            deep: true
        },
        newitems: {
            handler: function(newVal, oldVal) {
                let uncounted = 0;
                if (this.log_type === "mid")
                    Object.keys(this.elems).forEach(
                        v => (this.elems[v] = false)
                    );
                newVal.forEach((element, index) => {
                    this.elems[element.id] = false;
                    let flag = 0;
                    this.items.forEach(e1 => {
                        if (e1.id == element.id) {
                            uncounted += 1;
                            flag = 1;
                        }
                    });
                    if (flag == 0) {
                        if (this.log_type === "last") {
                            this.items.push(element);
                        } else if (this.log_type === "mid") {
                            this.items.insert(
                                this.items.length - this.last_log_len,
                                element
                            );
                        } else if (this.log_type === "new") {
                            this.items.insert(index, element);
                        }
                    }
                });
                if (
                    (this.log_type === "new" || this.log_type === "mid") &&
                    newVal.length === 10
                ) {
                    this.elems[newVal[newVal.length - 2].id] = true;
                }
                if (this.log_type == "last")
                    this.last_log_len =
                        this.last_log_len + newVal.length - uncounted;

                // additonal order validation

                this.items.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
            },
            deep: true
        },
        items: function(newVal, oldVal) {
            if (this.last_log_len == 0)
                this.last_log_len = this.last_log_len + newVal.length;
            this.activity = newVal;
        }
    },
    methods: {
        ...mapActions(["getUrl"]),
        getMidLog(new_date, old_date) {
            this.log_type = "mid";
            this.$emit("get_other_logs", this.log_type, {
                latest: new_date,
                oldest: old_date
            });
        },
        getRecentLog() {
            this.log_type = "new";
            this.$emit("get_other_logs", this.log_type);
        },
        createUrl(id) {
            if (location.href.includes("dashboard"))
                return location.origin + "/dashboard/" + id;
            return location.href + "/" + id;
        },
        handleCopyStatus(value) {
            vm.snackbar = true;
            vm.snackbarText = "Link copied. Ready to paste.";
            vm.snackbarColor = "success";
        },
        save_note() {
            if (this.note !== "") {
                let type = this.$route.path.split("/")[1].slice(0, -1);
                let id = this.$route.params.id || this.entityId;

                ApiService.put("/add_note", {
                    id: id,
                    type: type,
                    note: this.note
                }).then(response => {
                    this.status = status;

                    // Reset note field
                    this.note = "";
                    vm.$emit("FetchPageData");
                });
            }
        }
    }
};
</script>