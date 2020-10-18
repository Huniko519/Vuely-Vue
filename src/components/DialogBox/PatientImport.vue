<template>
    <!-- Dialog Model For Patinent -->
    <v-dialog class="patient-dialog-box" fullscreen scrollable v-model="ImportCSV">
        <v-card>
            <v-toolbar color="primary" dark>
                <v-card-title class="patient-card-header w-100">
                    <h2 class="px-3 mb-0">Import CSV</h2>

                    <div class="close-model text-right d-flex align-items-center">
                        <a class="mr-3" download="" href="static/template.csv">Sample
                            <v-icon size="16">zmdi zmdi-download</v-icon>
                        </a>
                        <v-icon @click.stop="ImportCSV = false" dark>close</v-icon>
                    </div>
                </v-card-title>
            </v-toolbar>

            <v-divider class="ma-0 pa-0"></v-divider>
            <v-card-text class="pa-0">
                <v-stepper v-model="e1">
                    <v-stepper-header class="mb-1">
                        <v-stepper-step :complete="e1 == 1" step="1">Import</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="e1 == 2" step="2">Preview</v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-layout wrap>
                                <v-flex lg9 md9 sm9 xl9 xs12>
                                    <vue-dropzone :options="dropzoneOptions"
                                                  id="dropzone"
                                                  ref="csvDropzone"></vue-dropzone>
                                </v-flex>
                                <v-flex class="col-height-auto pl-2 " lg3 md3 sm3 xl12 xs12>
                                    <div>
                                        <h4>Columns and Restrictions</h4>
                                        <ol>
                                            <li>First name*: text only</li>
                                            <li>Middle name: text only</li>
                                            <li>Last name*: text only</li>
                                            <li>Prefix: text only</li>
                                            <li>Suffix: text and numbers only</li>
                                            <li>Date of birth: DD/MM/YYYY format</li>
                                            <li>Social Security Number: Number and letters only</li>
                                            <li> Gender: letters only</li>
                                            <li>Phone: numbers only</li>
                                            <li>Phone type: letters only</li>
                                            <li>Email address: valid email format only</li>
                                        </ol>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-stepper-content>
                        <v-stepper-content class="patient-import full-screen-height" step="2">
                            <v-alert class="d-custom-flex" color="red" v-if="excludedRows > 0">
                                Error in csv({{ excludedRows }} rows excluded)
                            </v-alert>
                            <data-table :columns="columns" :rows="previewData" type="clients"></data-table>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-card-text>

            <v-flex class="pos-absolute w-100 bg-light" style="bottom: 0;">
                <v-divider class="pa-0"></v-divider>
                <v-layout class="px-4 py-2" style="height: 4em;">
                    <v-btn
                            :disabled="!isCSVReady"
                            @click="e1 = 2"
                            color="primary"
                            v-show="e1 === 1 || e1 === '1'"
                    >PREVIEW
                    </v-btn>

                    <v-btn @click="backRemove" color="primary" v-show="e1 === 2 || e1 === '2'">Back</v-btn>
                    <v-btn
                            @click.native="store_csv('close')"
                            color="success"
                            flat
                            v-bind:disabled="btnSaveDisable"
                            v-show="e1 === 2 || e1 === '2'"
                    >Submit
                    </v-btn>
                    <v-btn @click.stop="backRemove();ImportCSV = false" flat>Cancel</v-btn>
                </v-layout>
            </v-flex>
        </v-card>
    </v-dialog>
</template>
<script>
	import * as d3 from 'd3-dsv'
	import moment from 'moment';
	import vue2Dropzone from 'vue2-dropzone'
	import 'vue2-dropzone/dist/vue2Dropzone.min.css'
	import DataTable from "../../components/table/datatable";
	import ApiService from "../../common/api.service";
	import { vm } from "../../main";

	export default {
		components: {
			vueDropzone: vue2Dropzone,
			DataTable
		},
		data: function () {
			return {
				e1: 0,
				uploadedFiles: {},
				ImportCSV: false,
				isCSVReady: false,
				excludedRows: 0,
				btnSaveDisable: true,
				previewData: [],
				columns: [
					{
						text: "First name",
						value: "first_name"
					},
					{
						text: "Middle name",
						value: "middle_name"
					},
					{
						text: "Last name",
						value: "last_name"
					},
					{
						text: "Prefix",
						value: "prefix"
					},
					{
						text: "Suffix",
						value: "suffix"
					},
					{
						text: "Date of birth",
						value: "date_of_birth"
					},
					{
						text: "Social Security Number",
						value: "ssn",
					},
					{
						text: "Gender",
						value: "gender"
					},
					{
						text: "Phone",
						value: "contact",
						formatFn: this.contact
					},
					{
						text: "Phone Type",
						value: "type",
						formatFn: this.contact
					},
					{
						text: "Email",
						value: "email"
					}
				],
				dropzoneOptions: {
					url: 'https://httpbin.org/post',
					thumbnailWidth: 150,
					maxFiles: 1,
					addRemoveLinks: true,
					acceptedFiles: '.csv',
					accept: ( file, done ) => {
						var reader = new FileReader();
						reader.addEventListener( "loadend", ( event ) => {
							this.excludedRows = 0;
							this.previewData = d3.csvParse( event.target.result, ( d ) => {
								// to make it to server side structure
								let formattedData = {
									'first_name': d[ "First name" ] !== undefined ? d[ "First name" ].trim() : '',
									'middle_name': d[ 'Middle name' ] !== undefined ? d[ 'Middle name' ].trim() : '',
									'last_name': d[ 'Last name' ] !== undefined ? d[ 'Last name' ].trim() : '',
									'prefix': d[ 'Prefix' ] !== undefined ? d[ 'Prefix' ].trim() : '',
									'suffix': d[ 'Suffix' ] !== undefined ? d[ 'Suffix' ].trim() : '',
									'date_of_birth': d[ 'Date of birth' ] !== undefined ? d[ 'Date of birth' ].trim() : '',
									'ssn': d[ 'Social Security Number' ] !== undefined ? d[ 'Social Security Number' ].trim() : '',
									'gender': d[ 'Gender' ] !== undefined ? d[ 'Gender' ].trim() : '',
									'contact_info': {
										'contact': d[ 'Phone' ] !== undefined ? d[ 'Phone' ] : '',
										'type': d[ 'Phone' ] !== undefined ? d[ 'Phone type' ] : '',
									},
									'email': d[ 'Email address' ].trim()
								};

								let valid = this.validateCsv( formattedData );
								if ( valid ) {
									return formattedData
								} else {
									this.excludedRows++
								}
							} );
							this.isCSVReady = true;
							if ( this.previewData.length !== 0 )
								this.btnSaveDisable = false
						} );
						reader.readAsText( file );
						done()
					}
				},
			}
		},
		methods: {
			openDialog() {
				this.ImportCSV = true
			},
			validateCsv( data ) {
				return ( data.first_name !== '' && !/[^a-z]/i.test( data.first_name ) ) &&
					( data.middle_name === '' || !/[^a-z]/i.test( data.middle_name ) ) &&
					( data.last_name !== '' && !/[^a-z]/i.test( data.last_name ) ) &&
					( data.prefix === '' || !/[^a-z]/i.test( data.prefix ) ) &&
					( data.suffix === '' || !/[^a-z0-9]/i.test( data.suffix ) ) &&
					( data.gender === '' || !/[^a-z]/i.test( data.gender ) ) &&
					( data.contact_info.type === '' || !/[^a-z]/i.test( data.contact_info.type ) ) &&
					( data.ssn === '' || !/[^a-z0-9]/i.test( data.ssn ) ) &&
					( data.date_of_birth === '' || moment( data.date_of_birth, 'D/M/YYYY', true ).isValid() ) &&
					( data.contact_info.contact === '' || /^[0-9]+$/.test( data.contact_info.contact ) ) &&
					( data.email === '' || this.validateEmail( data.email ) );
			},
			validateEmail( email ) {
				let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
				return re.test( String( email ).toLowerCase() );
			},
			backRemove() {
				this.$refs.csvDropzone.removeAllFiles();
				this.isCSVReady = false;
				this.excludedRows = 0;
				this.previewData = [];
				this.e1 = 1;
			},
			contact: function ( data, key ) {
				if ( data[ key ] === null ) {
					return "";
				} else {
					return data[ 'contact_info' ][ key ];
				}
			},
			store_csv() {
				let payload = {
					'patients': this.previewData
				}
				ApiService.post( "import_patients", payload ).then( response => {
					vm.$emit( "FetchPageData" );
					this.backRemove();
					this.ImportCSV = false
				} );
			},
		},
	}
</script>
<style>
    .full-screen-height {
        min-height: 66vh;
    }

    .patient-import .container {
        display: none;
    }

    .dz-error-message {
        top: 0 !important;
    }

    @media (max-width: 500px) {
        .full-screen-height {
            min-height: 50vh;
            margin-top: 2em;
        }
    }
</style>