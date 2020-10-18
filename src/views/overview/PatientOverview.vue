<template>
    <div class="pos-absolute fixed-div d-custom-flex flex-column w-100">
        <v-container fluid grid-list-xl scrollArea>
            <!-- Patients Section -->
            <vue-perfect-scrollbar class="sub-header row" v-if="!isAdmin() && selectedUser.patient">
                <app-card full class="subHeaderDiv elevation-1">
                    <div
                            class="d-custom-flex align-items-center justify-content-between"
                            v-if="!selectedUser.patient.location"
                    >
                        <div class="f_2 text-center px-2" style="width:140px;">
                            <div class="text-uppercase font-weight-bold">No location</div>
                            <div v-if="hasAccess('patient', 'update_patient_info')">
                                <v-menu offset-y ma-0 pa-0 style="max-height:300px;">
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                                style="text-transform: none; height: unset"
                                                class="ma-0 pa-0"
                                                flat
                                                color="primary link"
                                                v-on="on"
                                        >Add / Set a location
                                        </v-btn>
                                    </template>

                                    <v-list style="max-height:300px;" color="primary">
                                        <v-list-tile
                                                v-if="hasAccess('location', 'add_new_location')"
                                                @click="update_patient_location()"
                                                class="v-list__tile_location_dropdown"
                                        >
                                            <v-list-tile-title>
                                                <strong>
                                                    Add a new location
                                                    <v-icon class="pl-0 ml-0" dark>add</v-icon>
                                                </strong>
                                            </v-list-tile-title>
                                        </v-list-tile>
                                        <v-divider class="ma-0 pa-0"></v-divider>
                                        <v-list-tile
                                                @click="
                                                update_patient_location(
                                                    location._id
                                                )
                                            "
                                                class="v-list__tile_location_dropdown"
                                                v-for="(location,
                                            index) in locations"
                                                :key="index"
                                        >
                                            <v-list-tile-title>
                                                {{
                                                location.name
                                                ? location.name
                                                : location.address
                                                }}
                                            </v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </div>
                        </div>
                    </div>
                    <div
                            @click="$refs.LocationShowBox.openDialog()"
                            class="d-custom-flex align-items-center justify-content-between cursor-pointer"
                            v-else
                    >
                        <v-avatar color="primary" extended>
                            <i
                                    :class="[
                                    'primary',
                                    { zmdi: true },
                                    'zmdi-hc-lg',
                                    'zmdi-' +
                                        selectedUser.patient.location.type.icon
                                ]"
                            ></i>
                        </v-avatar>
                        <div class="f_2 px-2">
                            <div
                                    class="font-weight-bold"
                                    v-if="
                                    selectedUser.patient.location.type.name !==
                                        'Primary residence / house'
                                "
                            >
                                {{
                                selectedUser.patient.location.type.acronym
                                }}:
                                {{ selectedUser.patient.location.name }}
                            </div>
                            <div class>
                                {{ selectedUser.patient.location.address }}
                                {{
                                selectedUser.patient.location.suite
                                ? ", " +
                                selectedUser.patient.location.suite
                                : ""
                                }}
                                {{
                                selectedUser.patient.location.unit
                                ? ", " +
                                selectedUser.patient.location.unit
                                : ""
                                }}
                                #
                            </div>
                            <div class>
                                {{
                                selectedUser.patient.location.city
                                ? selectedUser.patient.location.city
                                : ""
                                }}
                                {{
                                selectedUser.patient.location.state
                                ? ", " +
                                selectedUser.patient.location.state
                                : ""
                                }}
                                {{
                                selectedUser.patient.location.zip
                                ? ", " +
                                selectedUser.patient.location.zip
                                : ""
                                }}
                            </div>
                        </div>
                    </div>
                    <!-- Location Info Display Modal For Patient -->
                    <LocationShowBox
                            ref="LocationShowBox"
                            :info="selectedUser.patient"
                            :locations="this.locations"
                            :update_patient_location="update_patient_location"
                    ></LocationShowBox>
                </app-card>
            </vue-perfect-scrollbar>

            <!-- Patient Overview Section : Dialog Model For Location -->
            <LocationDialogBox
                    v-if="selectedUser.patient"
                    calledFrom="patient_overview"
                    :patientId="selectedUser.patient._id"
                    ref="LocationDialog"
            />

            <!-- Tabs | Will show only for patients -->
            <v-tabs
                    v-if="contacts.length && hasAccess('contact', 'view')"
                    v-model="tab"
                    class="mb-4"
            >
                <v-tab key="#tab-contacts" href="#tab-contacts">Contacts</v-tab>
                <v-tab-item key="tab-contacts" value="tab-contacts">
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
                        getPatientActivities(); no_of_new_activities=0;"
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

            <!-- Dialog Model For Contact -->
            <ContactDialogBox ref="ContactDialog" action="add" :extraInfo="selectedUser"/>

            <CustomFormBox ref="CustomForm" action="add" :extraInfo="selectedUser"/>
        </v-container>

        <!-- Patient / Location Overview Section : Bottom Right Button-->
        <v-menu v-if="!isAdmin()"
                origin="top" nudge-top="90"
        >
            <template v-slot:activator="{ on }">
                <v-btn
                        color="primary"
                        dark
                        v-on="on"
                        fixed
                        fab
                        bottom
                        right
                        small
                >
                    <v-icon>zmdi zmdi-plus</v-icon>
                </v-btn>
            </template>
            <v-list style="overflow: auto;max-height: 90vh;">
                <v-list-tile
                        @click="$refs.CustomForm.openDialog(item,undefined,'add')"
                        v-for="item in form_data" :key="item.form_id"
                        v-if="getAuthUserGroup(item._id,'patient')['build_status'] && getAuthUserGroup(item._id,'patient')['status'] && item.status===1"
                >
                    <v-list-tile-content>{{ item.form_name }}</v-list-tile-content>
                    <v-list-tile-action>
                        <v-icon color="grey">{{item.icon}}</v-icon>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile
                        v-if="hasAccess('contact', 'add_new_contact')"
                        @click="$refs.ContactDialog.openDialog()"
                >
                    <v-list-tile-content>Contact</v-list-tile-content>
                    <v-list-tile-action>
                        <v-icon>account_box</v-icon>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
  import moment from "moment";
  import { vm } from "@/main";
  import ApiService from "@/common/api.service";

  import DataTable from "@/components/table/datatable";
  import Timeline from "@/components/timeline/timeline";

  import ApiUrl from "@/config";
  import io from "socket.io-client";

  var socket = io.connect( ApiUrl );

  const CustomFormBox = () =>
    import("@/components/DialogBox/CustomFormBox");
  const ContactDialogBox = () =>
    import("@/components/DialogBox/ContactDialogBox");
  const LocationDialogBox = () =>
    import("@/components/DialogBox/LocationDialogBox");
  const LocationShowBox = () => import("@/components/DialogBox/LocationShowBox");

  export default {
    name : "PatientOverview",
    components : {
      Timeline,
      DataTable,
      ContactDialogBox,
      LocationDialogBox,
      LocationShowBox,
      CustomFormBox
    },
    data() {
      return {
        form_data : [],
        fab : false,
        tab : null,
        status : "Active",

        log_dtype : "last",
        latest_date : new Date(),
				oldest_date: new Date(),
				show_recent: false,

				type: this.$route.path.split("/")[1],
				id: this.$route.params.id,
				activities: [],
				new_activities: [],
				selectedUser: {},
				locations: [],
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
					}
				],
				no_of_new_activities: 0
			};
		},
		created() {
          vm.$on( "FetchPageData", this.getDetails );
          vm.$on( "FetchFormData", ( id ) => {
            this.getForm( id )
          } );

          socket.on( "new-activity-log", fetchedData => {
            if (
              this.isAdmin() &&
              this.$route.params.id == fetchedData.data[ 0 ].metadata.patient_id
            ) {
              this.no_of_new_activities = this.no_of_new_activities + 1;
            } else {
              if (
                this.getAuthClient( "_id" ) ===
                fetchedData.data[ 0 ].client_id &&
                this.getAuthUser( "_id" ) === fetchedData.data[ 0 ].user_id &&
                this.$route.params.id ===
                fetchedData.data[ 0 ].metadata.patient_id
              ) {
                this.no_of_new_activities = this.no_of_new_activities + 1;
                if ( fetchedData.data[ 0 ].sub_operation == 'patient_form' )
                  this.getDetails()

              }
            }
          } );
        },
		beforeDestroy() {
			vm.$off("FetchPageData", this.getDetails);
		},
		mounted() {
			window.moment = require("moment-timezone");
			let timezone = this.getAuthUser("timezone") || "UTC";
			moment.tz.setDefault(timezone);
			this.getDetails();
			this.getLocationData();
		},
		methods: {
			get_other_logs(type, extraInfo) {
				if (type === "new") this.getmoreActivities(type);
				else if (type === "mid") {
					this.latest_date = extraInfo.latest;
					this.oldest_date = extraInfo.oldest;
					this.getmoreActivities(type);
				}
			},
			getDetails() {
				let type = this.$route.path.split("/")[1];
				let id = this.$route.params.id;

				ApiService.get("get_forms").then(response => {
					this.form_data = response.forms
				});

				ApiService.get("patients_overview", {
					id: id,
					req_activity: this.$route.params.log
				}).then(response => {
					let patient = response.patient;
					this.selectedUser = {
						name:
							patient.first_name +
							" " +
							patient.middle_name +
							" " +
							patient.last_name,
						type: "patient",
						id: patient._id,
						patient
					};
					this.contacts = patient.contacts;
					this.activities = patient.activity.reverse();

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

					this.no_of_new_activities = 0;

					this.$emit(
						"emitselectedUserInfoFromOverview",
						this.selectedUser
					);
				});
			},
			getPatientActivities() {
				let type = this.$route.path.split("/")[1];
				let id = this.$route.params.id;

				ApiService.get("patient_activities", {
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
			onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
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
				});
			},
			relOrtitle(data) {
				return data.relationship || data.title;
			},
			getLocationData() {
				ApiService.get("locations").then(response => {
					this.locations = response.locations;
				});
			},
			update_patient_location(location_id) {
				if (location_id) {
					this.$store.dispatch("STORE_PATIENT", {
						action: "update",
						patient: {
							_id: this.selectedUser.patient._id,
							location: location_id
						}
					});
				} else {
					this.$refs.LocationDialog.openDialog();
				}
			},
			getForm(patient_form_id) {
				ApiService.get("get_patient_form_data", {'patient_form_id': patient_form_id}).then(response => {
					if (response.code === 1) {
						this.form_data.forEach((e) => {
							if (e._id === response.patient_form.form_id) {
								this.$refs.CustomForm.openDialog(e, response.patient_form, 'update');
								return false;
							}
						});
					}
				});
			}
		}
	};
</script>

<style scoped>
    @import "./Overview.scss";
</style>