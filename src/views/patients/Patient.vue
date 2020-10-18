<template>
    <div>
        <v-container class="patient-section" fluid grid-list-xl>
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <!-- Dialog Model For Patient -->
                <patient-dialogBox action="add" ref="PatientDialog"></patient-dialogBox>
                <patient-import ref="PatientImport"></patient-import>
                <DataTable :columns="columns" :rows="patients" type="patients"></DataTable>

                <v-menu nudge-top="90"
                        origin="top" v-if="!isAdmin()"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn
                                bottom
                                color="primary"
                                dark
                                fab
                                fixed
                                right
                                v-on="on"
                        >
                            <v-icon>zmdi zmdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <v-list style="overflow: auto;max-height: 90vh;">
                        <v-list-tile
                                @click="onPatientDialog()"
                                v-if="!isAdmin() && hasAccess('patient', 'add_new_patient')">
                            <v-list-tile-content>Add New Patient</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                                @click="patientImport()"
                                v-if="!isAdmin() && hasAccess('patient', 'add_new_patient')">
                            <v-list-tile-content>Import</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </app-card>
        </v-container>
    </div>
</template>

<script>
	import moment from "moment";
	import ApiService from "@/common/api.service";
	import { vm } from "@/main";

	import DataTable from "@/components/table/datatable";
	import patientDialogBox from "@/components/DialogBox/PatientDialogBox";
    import PatientImport from "@/components/DialogBox/PatientImport"
	export default {
		components: {
			DataTable,
			PatientImport,
			"patient-dialogBox": patientDialogBox
		},
		data() {
			return {
				addpat: false,
				patients: [],
				columns: [
					{
						text: "CO",
						value: "co",
						class: this.hasAccess( "patient", "co_field" ) ? "" : "d-none"
					},
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
						value: "age",
						class: "text-center"
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
						//formatFn: this.locationFieldFn
					},
					{
						text: "Status",
						value: "status",
						class: this.isAdmin() ? "" : "d-none",
						formatFn: this.statusType
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
			vm.$on( "FetchPageData", this.getPatientData );
		},
		beforeDestroy() {
			vm.$off( "FetchPageData", this.getPatientData );
		},
		mounted() {
			this.getPatientData();
		},
		methods: {
			getPatientData() {
				ApiService.get( "patients" ).then( response => {
					this.patients = response.patient;
				} );
			},
			onPatientDialog() {
				this.$refs.PatientDialog.openDialog();
			},
			patientImport(){
			    this.$refs.PatientImport.openDialog();
            },
			dateOutputFormat: function ( data, key ) {
				return moment.utc( data[ key ] ).fromNow();
			},
			locationFieldFn( data, key ) {
				if ( data[ key ] === null ) {
					return "";
				} else if ( data[ key ].name ) {
					return data[ key ].name;
				} else {
					return data[ key ].address;
				}
			},
			statusType: function ( data, key ) {
				let status = [ "Deleted", "Active" ];
				return status[ data[ key ] ];
			}
		}
	};
</script>

<style>
    @import "./Patient.css";
</style>