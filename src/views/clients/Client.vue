<template>
    <div>
        <v-container fluid grid-list-xl class="patient-section">
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <DataTable :columns="columns" :rows="clients" type="clients"></DataTable>
            </app-card>
        </v-container>

        <v-container fluid grid-list-xl class="patient-section pt-0">
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <h5>Types</h5>
                <StandardTable
                        :columns="clientTypesColumns"
                        :rows="client_groups"
                        :user_groups="user_groups"
                        type="client_groups"
                ></StandardTable>
            </app-card>
        </v-container>

        <ClientGroupDialogBox ref="ClientGroupDialog" />

        <!-- Client Group : Bottom Right Button-->
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
                    @click="$refs.ClientGroupDialog.user_groups = user_groups;$refs.ClientGroupDialog.openDialog()"
                    style="right:50px;"
                    class="pl-2 pr-2"
                    dark
                    color="primary"
            >
                <strong>Client Group</strong>&nbsp;&nbsp;
                <v-icon>supervisor_account</v-icon>
            </v-btn>
        </v-speed-dial>
    </div>
</template>

<script>
	import moment from "moment";
	import { vm } from "@/main";
	import ApiService from "@/common/api.service";

	import StandardTable from "@/components/table/standard";
	import DataTable from "@/components/table/datatable";

	const ClientGroupDialogBox = () =>
		import("@/components/DialogBox/ClientGroupDialogBox");

	export default {
		components: {
			DataTable,
			StandardTable,
			ClientGroupDialogBox
		},
		data() {
			return {
				fab: false,
				clients: [],
				client_groups: [],
				user_groups: [],
				user_groups_acronym: {},
				clientTypesColumns: [
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
                    },
                    {
                        label: "Access Modules",
                        field: this.moduleFealdFn,
                        thClass: "vgt-center-align",
                        tdClass: "vgt-center-align"
                    },
                    */
					{
						label: "User Groups",
						field: this.userGroupsFieldFn,
						thClass: "vgt-center-align",
						tdClass: "vgt-center-align"
					},
					{
						label: "Sign Up",
						field: "signup",
						type: "boolean",
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
						text: "Name",
						value: "name"
					},
					{
						text: "Type",
						value: "client_group"
					},
					{
						text: "Users",
						value: "users"
					},
					{
						text: "Locations",
						value: "locations"
					},
					{
						text: "Patients",
						value: "patients"
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
				]
			};
		},
		created() {
			vm.$on("FetchPageData", this.getClientData);
		},
		beforeDestroy() {
			vm.$off("FetchPageData", this.getClientData);
		},
		mounted() {
			this.getClientData();
		},
		methods: {
			getClientData() {
				ApiService.get("clients").then(response => {
					this.clients = response.clients;
					this.client_groups = response.client_groups;
					this.user_groups = response.user_groups;
					// set acronym array
					this.user_groups_acronym = {};
					this.user_groups.forEach(element => {
						this.user_groups_acronym[element._id] = element.acronym;
					});
				});
			},
			dateOutputFormat: function(data, key) {
				return moment.utc(data[key]).fromNow();
			},
			statusOutputFormat: function(value) {
				return value ? "Active" : "Inactive";
			},

			userGroupsFieldFn: function(data) {
				let user_groups = "[";
				let addComma = false;

				data.user_groups.forEach(element => {
					if (this.user_groups_acronym[element]) {
						if (addComma) {
							user_groups += ", ";
						}
						user_groups += this.user_groups_acronym[element];

						if (data.default_user_group === element && data.signup) {
							user_groups += " (Default)";
						}
						addComma = true;
					}
				});

				user_groups += "]";

				return addComma ? user_groups : "";
			}
		}
	};
</script>