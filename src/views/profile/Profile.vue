<template>
    <div>
        <v-container fluid grid-list-xl pt-0>
            <v-layout row wrap>
                <v-flex xl12 lg12 md12 sm12 xs12 pt-5 pb-0>
                    <p>Access and modify your information</p>
                </v-flex>
                <v-flex xs12 md12 lg12 sm12 class="col-height-auto">
                    <div>
                        <div class="profile-body">
                            <v-layout row wrap>
                                <v-flex xs12 md4 lg4 class="col-height-auto">
                                    <app-card>
                                        <contact-request></contact-request>
                                    </app-card>
                                </v-flex>
                                <v-flex xs12 md8 lg8>
                                    <app-card :fullBlock="true">
                                        <UserInfo></UserInfo>
                                    </app-card>
                                </v-flex>
                            </v-layout>
                        </div>
                    </div>
                </v-flex>
                <v-flex
                    xl12
                    lg12
                    md12
                    sm12
                    xs12
                    v-show="!isAdmin() && hasAccess('client', 'update_client_info')"
                    class="mb-3"
                >
                    <h4>{{$t('message.groupInformation')}}</h4>
                    <p class="mb-0">{{$t('message.groupSubtext')}}</p>
                    <v-layout row wrap>
                        <!-- Group Info -->
                        <app-card
                            :heading="$t('message.groupInfo')"
                            colClasses="xl6 lg6 md6 sm6 xs12"
                            customClasses="mb-0"
                            :fullBlock="true"
                        >
                            <vue-perfect-scrollbar :settings="settings">
                                <v-list class="card-list">
                                    <v-list-tile ripple>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>
                                                <h5 class="mb-1">Name</h5>
                                                <span>{{getAuthClient('name')}}</span>
                                            </v-list-tile-sub-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-btn
                                                icon
                                                class="small"
                                                @click.stop="open_client_dialog()"
                                            >
                                                <v-icon color="grey">zmdi zmdi-edit</v-icon>
                                            </v-btn>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-list-tile ripple>
                                        <v-list-tile-content>
                                            <v-list-tile-sub-title>
                                                <p class="mb-0 text-wrap">
                                                    Enter the label below for what you call the
                                                    people that you help as a community liason. Example: friends,
                                                    guests, patients, residents, etc.
                                                </p>
                                            </v-list-tile-sub-title>
                                            <v-text-field
                                                class="mb-1 w-100"
                                                placeholder="Patients"
                                                v-model="form.clientpref"
                                                v-on:keyup.enter="submit('user')"
                                                required
                                            ></v-text-field>
                                            <v-autocomplete
                                                class="mb-1 w-100"
                                                :items="TimeZones"
                                                label="Time Zone"
                                                :search-input.sync="fill_timezone"
                                                @input="submit('user')"
                                                v-model="form.timezone"
                                            ></v-autocomplete>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </vue-perfect-scrollbar>
                        </app-card>

                        <!-- Theme -->
                        <app-card
                            :heading="$t('message.generalTheme')"
                            colClasses="xl6 lg6 md6 sm6 xs12"
                            customClasses="mb-0"
                            :fullBlock="true"
                        >
                            <vue-perfect-scrollbar :settings="settings">
                                <div class="inner-toolbar">
                                    <sidebar-filters-provider></sidebar-filters-provider>
                                    <header-filters-provider v-if="isHeaderFilterAvaiable()"></header-filters-provider>
                                    <theme-provider></theme-provider>
                                </div>
                            </vue-perfect-scrollbar>
                        </app-card>

                        <!-- To Do list -->
                        <app-card
                            colClasses="lg4 md4  sm12 xs12 "
                            v-show="false"
                            :heading="$t('message.advancedTheme')"
                            :fullBlock="true"
                        >
                            <vue-perfect-scrollbar :settings="settings">
                                <div class="inner-toolbar pb-0">
                                    <p>{{$t('message.routerAnimation')}}</p>
                                    <v-select
                                        :items="routerAnimations"
                                        label="Select Animation"
                                        :value="selectedRouterAnimation"
                                        @change="changeRouterAnimation($event)"
                                        outline
                                    ></v-select>
                                </div>
                                <div class="inner-toolbar sidebar-overlay-color py-0">
                                    <v-list class="mb-4 theme-layouts pa-0 elevation-0">
                                        <v-list-tile>
                                            <v-list-tile-content>
                                                <v-checkbox
                                                    :label="$t('message.darkMode')"
                                                    color="primary"
                                                    @change="emitDarkMode"
                                                    :input-value="darkMode"
                                                ></v-checkbox>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                        <v-list-tile v-if="isSidebarAvailable()">
                                            <v-list-tile-content>
                                                <v-checkbox
                                                    :label="$t('message.collapseSidebar')"
                                                    color="primary"
                                                    @change="emitCollapseSidebar"
                                                    :input-value="collapseSidebar"
                                                ></v-checkbox>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                        <v-list-tile>
                                            <v-list-tile-content>
                                                <v-checkbox
                                                    :label="$t('message.rtlLayout')"
                                                    color="primary"
                                                    @change="emitRtlLayout"
                                                    :input-value="rtlLayout"
                                                ></v-checkbox>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                        <v-list-tile v-if="isSidebarAvailable()">
                                            <v-list-tile-content>
                                                <v-checkbox
                                                    :label="$t('message.backgroundImage')"
                                                    color="primary"
                                                    @change="emitEnableBackgroundImage"
                                                    :input-value="backgroundImage"
                                                ></v-checkbox>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                    <!--
                                    <div class="sidebar-images" v-if="backgroundImage">
                                        <div
                                            class="d-inline-block mx-1 mb-2"
                                            v-for="backgroundImage in sidebarBackgroundImages"
                                            :key="backgroundImage.id"
                                        >
                                            <a
                                                href="javascript:void(0)"
                                                class="img-holder"
                                                :class="{'active' : selectedSidebarBgImage.id === backgroundImage.id}"
                                            >
                                                <img
                                                    :src="backgroundImage.url"
                                                    height="200"
                                                    width="75"
                                                    @click="changeBackgroundImage(backgroundImage)"
                                                    alt="dynamic sidebar images"
                                                    class="img-responsive"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    -->
                                </div>
                            </vue-perfect-scrollbar>
                        </app-card>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
        <v-dialog v-model="client_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title class="text-capitalize">Name</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text class="mb-0 pb-0">
                    <v-form v-model="client_valid" class="mb-4">
                        <v-text-field
                            class="reqField"
                            placeholder="Name"
                            v-model="client.name"
                            :rules="nameRules"
                            required
                            clearable
                        ></v-text-field>
                        <v-btn
                            @click="submit('client'); client_dialog = false"
                            :disabled="!changed_client_dialog || !client_valid"
                            large
                            class="ml-0"
                            color="primary"
                        >{{$t('message.submit')}}</v-btn>
                        <v-btn
                            class="ml-0"
                            color="error"
                            large
                            @click.native="client_dialog = false"
                        >Cancel</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import UserInfo from "Components/Widgets/Userinfo";
import ContactRequest from "Components/Widgets/ContactRequest";
import Activity from "Components/Widgets/Activity";
import ThemeProvider from "./ThemeProvider";
import { mapState, mapGetters, mapActions } from "vuex";
import SidebarFiltersProvider from "./SidebarFiltersProvider";
import HeaderFiltersProvider from "./HeaderFiltersProvider";
import { getCurrentAppLayout } from "Helpers/helpers";
// import TimeZones from "../../assets/timezone.json";
import moment from "moment";

export default {
    components: {
        UserInfo,
        ContactRequest,
        Activity,
        ThemeProvider,
        SidebarFiltersProvider,
        HeaderFiltersProvider
    },

    data() {
        return {
            TimeZones: [],
            fill_timezone: "",
            settings: {
                maxScrollbarLength: 160
            },
            form: {
                clientpref: "Patients",
                timeout: 600,
                timezone: ""
            },
            client: {
                _id: this.getAuthClient("_id"),
                name: this.getAuthClient("name")
            },
            client_dialog: false,
            client_valid: false,
            nameRules: [
                v => !!v || "Name is required",
                v =>
                    (v && v.length <= 50) ||
                    "Name must be less than 50 characters"
            ]
        };
    },
    mounted() {
        window.moment = require("moment-timezone");
        this.TimeZones = moment.tz.names();
        this.form.timezone = this.getAuthUser("timezone");
    },
    computed: {
        ...mapGetters([
            "darkMode",
            "collapseSidebar",
            "boxLayout",
            "rtlLayout",
            "backgroundImage",
            //"sidebarBackgroundImages",
            "selectedSidebarBgImage",
            "sidebarFilters",
            "sidebarSelectedFilter",
            "routerAnimations",
            "selectedRouterAnimation"
        ]),
        changed_client_dialog() {
            if (this.getAuthClient("name") !== this.client.name) {
                return true;
            }
            return false;
        }
    },
    methods: {
        open_client_dialog() {
            this.client = {
                _id: this.getAuthClient("_id"),
                name: this.getAuthClient("name")
            };
            this.client_dialog = !this.client_dialog;
        },
        submit(data_type) {
            let data = undefined;
            if (data_type == "client") {
                data = this.client;
            } else if (data_type == "user") {
                data = this.form;
            }
            if (data != undefined) {
                this.$store
                    .dispatch("store_user_details", {
                        key: data_type,
                        value: data
                    })
                    .then(res => {
                        if (res.code == 1) {
                            return true;
                        } else {
                            return false;
                        }
                    });
            }
        },
        emitDarkMode() {
            this.$store.dispatch("darkModeHandler");
            this.$store.dispatch("store_user_details", {
                key: "darkMode",
                value: this.$store.getters.darkMode
            });
        },
        // collapse sidebar handler
        emitCollapseSidebar() {
            this.$store.dispatch("collapseSidebar");
            this.$store.dispatch("store_user_details", {
                key: "collapseSidebar",
                value: this.$store.getters.collapseSidebar
            });
        },
        // enable background image handler
        emitEnableBackgroundImage() {
            this.$store.dispatch("backgroundImage");
            this.$store.dispatch("store_user_details", {
                key: "backgroundImage",
                value: this.$store.getters.backgroundImage
            });
        },
        // change BackgroundImage customizer
        changeBackgroundImage(sidebarImage) {
            this.$store.dispatch("changeBackgroundImage", sidebarImage);
            this.$store.dispatch("store_user_details", {
                key: "sidebarBgImage",
                value: this.$store.getters.selectedSidebarBgImage
            });
        },
        // toggle customizer
        toggleCustomizer() {
            this.customizerIn = !this.customizerIn;
        },
        // RTL handler
        emitRtlLayout() {
            this.$store.dispatch("rtlLayout");
            this.$store.dispatch("store_user_details", {
                key: "rtlLayout",
                value: this.$store.getters.rtlLayout
            });
        },
        // router animation handler
        changeRouterAnimation(value) {
            this.$store.dispatch("changeRouterAnimation", value);
            this.$store.dispatch("store_user_details", {
                key: "routerAnimation",
                value: this.$store.getters.selectedRouterAnimation
            });
        },
        isHeaderFilterAvaiable() {
            let layout = getCurrentAppLayout(this.$router);
            if (layout === "boxed" || layout === "boxed-v2") {
                return false;
            }
            return true;
        },
        isSidebarAvailable() {
            let layout = getCurrentAppLayout(this.$router);
            if (
                layout === "boxed" ||
                layout === "horizontal" ||
                layout === "boxed-v2"
            ) {
                return false;
            }
            return true;
        }
    }
};
</script>
