<!-- Header Structure -->
<template>
    <div>
        <v-navigation-drawer
            v-if="!horizontal"
            app
            fixed
            v-model="drawer"
            :mini-variant.sync="collapseSidebar"
            mini-variant-width="70"
            :width="250"
            class="Vuely-sidebar"
            :right="rtlLayout"
        >
            <!-- App Sidebar -->
            <app-sidebar></app-sidebar>
        </v-navigation-drawer>

        <v-toolbar class="Vuely-toolbar" app :color="activeHeaderFilter.class" fixed>
            <div class="d-custom-flex align-items-center navbar-left">
                <div v-if="!horizontal">
                    <v-toolbar-side-icon icon large @click.stop="drawer = !drawer" class="v-step-0"></v-toolbar-side-icon>
                </div>

                <h2 class="text-capitalize mb-0 header-title">
                    <i :class="$t(pageIcon)"></i>
                    <router-link
                        :to="$t('/' + this.$route.fullPath.split('/')['1'])"
                    >{{$t(pageTitle)}}</router-link>
                    <span v-if="selectedUserInfo.name">{{ ' > ' + $t(selectedUserInfo.name) }}</span>
                    <span
                        v-if="selectedUserInfo.type == 'patient' && hasAccess('patient', 'co_field') && selectedUserInfo.patient.co"
                    >&nbsp;| CO: {{selectedUserInfo.patient.co}}</span>
                </h2>
            </div>
            <div class="navbar-right">
                <v-menu
                    v-if="!isAdmin() && selectedUserInfo.name"
                    offset-y
                    origin="left left"
                    transition="scale-transition"
                    left
                >
                    <v-btn
                        v-if="(
                                selectedUserInfo.type == 'patient' && hasAccess('patient', 'update_patient_info'))
                                || (selectedUserInfo.type == 'location' && hasAccess('location', 'update_location_info')
                            )
                            ||
                            (
                                (selectedUserInfo.type == 'patient' && hasAccess('patient', 'delete_patient'))
                                || (selectedUserInfo.type == 'location' && hasAccess('location', 'delete_location'))
                                || (selectedUserInfo.type == 'contact' && hasAccess('contact', 'delete_contact'))
                            )"
                        slot="activator"
                        icon
                    >
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile
                            v-if="(
                                selectedUserInfo.type == 'patient' && hasAccess('patient', 'update_patient_info'))
                                || (selectedUserInfo.type == 'location' && hasAccess('location', 'update_location_info')
                            )"
                            @click="onEditDialog"
                        >
                            <v-list-tile-title>Edit</v-list-tile-title>
                        </v-list-tile>

                        <v-list-tile
                            v-if="(
                                (selectedUserInfo.type == 'patient' && hasAccess('patient', 'delete_patient'))
                                || (selectedUserInfo.type == 'location' && hasAccess('location', 'delete_location'))
                                || (selectedUserInfo.type == 'contact' && hasAccess('contact', 'delete_contact'))
                            )"
                            @click="deleteDialog=true"
                        >
                            <v-list-tile-title>Delete</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>

                <notifications></notifications>
            </div>
        </v-toolbar>
        <!-- Dialog Model For Patient -->
        <patient-dialogBox
            v-if="selectedUserInfo.type && selectedUserInfo.type=='patient'"
            ref="PatientDialog"
            action="update"
            :patientInfo="selectedUserInfo.patient"
        ></patient-dialogBox>

        <!-- Edit Dialog Model For Location -->
        <location-edit-dialogBox
            v-if="selectedUserInfo.type && selectedUserInfo.type=='location'"
            ref="LocationDialog"
        ></location-edit-dialogBox>
        <v-dialog
            v-model="deleteDialog"
            scrollable
            max-width="500px"
            class="dialog-box"
            v-if="selectedUserInfo.type"
        >
            <v-card>
                <v-card-title class="card-header">
                    <p class="mb-0">
                        Are you sure, you want to delete
                        <b>{{selectedUserInfo[selectedUserInfo.type].type}} "{{selectedUserInfo.name}}" ?</b>
                    </p>
                    <v-layout row wrap class="justify-content-end">
                        <v-btn flat color="primary" @click.native="deleteEntity">{{$t('yes')}}</v-btn>
                        <v-btn flat @click.stop="deleteDialog=false">{{$t('no')}}</v-btn>
                    </v-layout>
                </v-card-title>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Sidebar from "../Sidebar/Sidebar.vue";
import Notifications from "./Notifications";
import { getCurrentAppLayout } from "Helpers/helpers";
import { mapGetters } from "vuex";
import patientDialogBox from "../../components/DialogBox/PatientDialogBox";
import locationEditDialogBox from "../../components/DialogBox/LocationEditDialogBox";
import ApiService from "@/common/api.service";
import Vue from "vue";

export default {
    name: "top-header",
    props: {
        horizontal: {
            default: false,
            type: Boolean
        },
        selectedUserInfo: {}
    },
    data() {
        return {
            deleteDialog: false,
            collapsed: false, // collapse sidebar
            drawer: null, // sidebar drawer default true
            chatSidebar: false, // chat component right sidebar
            sidebarImages: "", // sidebar background images
            enableDefaultSidebar: false
        };
    },
    computed: {
        ...mapGetters([
            "rtlLayout",
            "backgroundImage",
            "backgroundImage",
            "selectedSidebarBgImage",
            "darkMode",
            "collapseSidebar",
            "activeHeaderFilter"
        ]),
        pageTitle() {
            return this.$breadcrumbs[0].meta.title;
        },
        pageIcon() {
            return this.$breadcrumbs[0].meta.icon || "";
        }
    },
    methods: {
        // toggle full screen method
        toggleFullScreen() {
            if (screenfull.enabled) {
                screenfull.toggle();
            }
        },
        FetchPageData() {
            this.$emit("FetchPageData");
        },
        getMenuLink(link) {
            return "/" + getCurrentAppLayout(this.$router) + link;
        },
        toggleSearchForm() {
            this.$store.dispatch("toggleSearchForm");
        },
        onEditDialog() {
            if (this.selectedUserInfo.type == "patient") {
                this.$refs.PatientDialog.openDialog();
            }
            if (this.selectedUserInfo.type == "location") {
                this.$refs.LocationDialog.openDialog(
                    this.selectedUserInfo.location_id,
                    this.selectedUserInfo.location
                );
            }
        },
        deleteEntity() {
            ApiService.post("remove_entity", {
                id: this.selectedUserInfo[this.selectedUserInfo.type]._id,
                type: this.selectedUserInfo.type
            }).then(response => {
                this.$router.push("/" + this.selectedUserInfo.type + "s");
            });
        }
    },
    components: {
        appSidebar: Sidebar,
        Notifications,
        "patient-dialogBox": patientDialogBox,
        "location-edit-dialogBox": locationEditDialogBox
    }
};
</script>
