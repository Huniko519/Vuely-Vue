<template>
    <!-- Dialog Model For Patinent -->
    <v-dialog v-model="addpat" scrollable max-width="700px" class="patient-dialog-box">
        <v-card>
            <v-card-title class="patient-card-header">
                <h2 class="px-3 mb-0">{{ action == "add" ? "Add New Patient" : "Edit Patient"}}</h2>
                <span class="close-model text-right">
                    <v-icon dark @click.stop="addpat = false">close</v-icon>
                </span>
            </v-card-title>
            <v-divider class="ma-0 pa-0"></v-divider>
            <v-card-text class="pb-0">
                <v-container grid-list-md pt-0 pb-0>
                    <v-layout wrap>
                        <v-flex xs12 sm12 xl12 lg12 md12 class="col-height-auto pb-0">
                            <v-form v-model="valid" class="pb-0 mb-0">
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md4>
                                        <v-text-field
                                            prepend-icon="zmdi-account"
                                            v-model="patient.first_name"
                                            :rules="[v => !!v || 'First name is required']"
                                            required
                                        >
                                            <template slot="label">
                                                First name
                                                <span class="required">*</span>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4>
                                        <v-text-field
                                            label="Middle name"
                                            v-model="patient.middle_name"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4>
                                        <v-text-field
                                            v-model="patient.last_name"
                                            :rules="[v => !!v || 'Last name is required']"
                                            required
                                        >
                                            <template slot="label">
                                                Last name
                                                <span class="required">*</span>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field
                                            prepend-icon="zmdi-assignment-account"
                                            v-model="patient.prefix"
                                            label="Prefix"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field label="Suffix" v-model="patient.suffix"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap pos-relative>
                                    <v-flex xs12 sm4 md4>
                                        <v-text-field
                                            slot="activator"
                                            v-model="patient.date_of_birth"
                                            label="Date of birth"
                                            prepend-icon="event"
                                            v-on:focus="activeDatepicker()"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm4 md4>
                                        <v-text-field
                                            label="Social Security Number"
                                            v-model="patient.ssn"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm4 md4>
                                        <v-select
                                            :items="['Male', 'Female']"
                                            label="Gender"
                                            v-model="patient.gender"
                                        ></v-select>
                                    </v-flex>
                                    <v-date-picker
                                        v-model="patient.date_of_birth"
                                        v-show="calendar"
                                        no-title
                                        scrollable
                                        class="pos-absolute zindex-1 top-5"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="calendar = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="calendar = false">OK</v-btn>
                                    </v-date-picker>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field
                                            prepend-icon="phone"
                                            label="Phone"
                                            v-model="patient.contact_info.contact"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-select
                                            :items="['Mobile', 'Work','Home']"
                                            label="Phone type"
                                            v-model="patient.contact_info.type"
                                            persistent-hint
                                        ></v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 md12 sm12>
                                        <v-text-field
                                            prepend-icon="email"
                                            type="email"
                                            :rules="emailRules"
                                            label="Email address"
                                            v-model="patient.email"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 md12 sm12 v-if="this.action === 'add'">
                                        <v-select
                                            :items="locations"
                                            item-value="_id"
                                            label="Location"
                                            prepend-icon="zmdi-pin"
                                            v-model="patient.location"
                                        >
                                            <template
                                                slot="selection"
                                                slot-scope="data"
                                            >{{ data.item.name ? data.item.name : data.item.address }}</template>
                                            <template
                                                slot="item"
                                                slot-scope="data"
                                            >{{ data.item.name ? data.item.name : data.item.address }}</template>
                                        </v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap v-if="action == 'add'">
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field
                                            prepend-icon="zmdi-file"
                                            label="Note"
                                            v-model="patient.notes[0]"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout v-if="hasAccess('patient', 'co_field')" row wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field
                                            prepend-icon="zmdi-file"
                                            label="CO"
                                            v-model="patient.co"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="text-md-right">
                <v-btn class="float-right" flat @click.native="addpat = false">CANCEL</v-btn>
                <v-btn
                    flat
                    v-if="action == 'update'"
                    color="success"
                    :disabled="!valid"
                    @click.native="store_patient()"
                >Update</v-btn>
                <v-btn
                    v-else
                    flat
                    color="success"
                    :disabled="!valid"
                    @click.native="store_patient()"
                >Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Vue from "vue";
import ApiService from "@/common/api.service";
import { vm } from "../../main";

export default {
    props: {
        action: String,
        patientInfo: Object,
        locationInfo: Object
    },
    data() {
        return {
            addpat: false,
            valid: false,

            btnSaveDisable: true,
            calendar: false,
            nameLastRules: [v => !!v || "Last Name is required"],
            emailRules: [
                v =>
                    !v ||
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
                        v
                    ) ||
                    "E-mail must be valid"
            ],
            nameFirstRules: [v => !!v || "First Name is required"],
            patient: {
                first_name: "",
                middle_name: "",
                last_name: "",
                prefix: "",
                suffix: "",
                email: "",
                notes: [],
                ssn: "",
                date_of_birth: "",
                location: null,
                contact_info: {
                    contact: "",
                    type: ""
                },
                gender: "",
                co: ""
            },
            locations: []
        };
    },
    watch: {
        locationInfo() {
            this.locations = [];
            this.locations.push(this.locationInfo);
            this.patient.location = this.locationInfo._id;
        }
    },
    mounted() {
        if (this.$route.path.split("/")[1] !== "locations") {
            this.getLocationData();
        }
        if (this.action == "update") {
            // this.patient = Object.assign({}, this.patientInfo);

            this.assignPatientData(this.patientInfo);
        }
    },
    methods: {
        getLocationData() {
            ApiService.get("locations").then(response => {
                this.locations = response.locations;
            });
        },
        openDialog() {
            this.addpat = true;
        },
        activeDatepicker() {
            this.calendar = !this.calendar;
        },
        store_patient(type) {
            if (this.valid) {
                this.$store
                    .dispatch("STORE_PATIENT", {
                        patient: this.patient,
                        action: this.action
                    })
                    .then(() => {
                        this.addpat = false;
                    });
            }
        },
        assignPatientData(data) {
            this.patient = {
                _id: data._id,
                first_name: data.first_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                prefix: data.prefix,
                suffix: data.suffix,
                email: data.email,
                //notes: data.notes,
                ssn: data.ssn,
                date_of_birth: data.date_of_birth,
                // location: data.location ? data.location._id : null,
                contact_info: data.contact_info,
                gender: data.gender,
                co: data.co
            };
        }
    }
};
</script>