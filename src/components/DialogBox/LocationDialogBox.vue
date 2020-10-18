<template>
    <!-- Dialog Model For Location -->
    <v-dialog v-model="addloc" scrollable max-width="700px" class="location-dialog-box">
        <v-card>
            <v-card-title class="location-card-header">
                <h2
                    class="px-3 mb-0"
                >Add New Location {{ iSLocationTypeSelected? "("+selected_location_type+")" : ""}}</h2>
                <span class="close-model text-right">
                    <v-icon dark @click.stop="addloc = false">close</v-icon>
                </span>
            </v-card-title>

            <v-flex xs12 sm12 xl12 lg12 md12 class="col-height-auto">
                <v-stepper v-model="e1">
                    <v-stepper-header class="mb-1">
                        <v-stepper-step :complete="e1 > 1" step="1">Type</v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step :complete="e1 > 2" step="2">Details</v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items class="location-dialog-inside-content">
                        <v-stepper-content step="1">
                            <v-radio-group v-model="location.type">
                                <v-radio
                                    v-for="location_type in location_types"
                                    :key="location_type._id"
                                    :label="location_type.name"
                                    :value="location_type._id"
                                    @change="set_location_type_name(location_type.name)"
                                ></v-radio>
                            </v-radio-group>
                        </v-stepper-content>

                        <v-stepper-content step="2">
                            <div class="mb-4" color="lighten-1">
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field
                                            prepend-icon="zmdi-assignment-account"
                                            label="Location Name"
                                            v-model="location.name"
                                            v-if="!isPrimaryLocationType"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field
                                            prepend-icon="zmdi-city-alt"
                                            v-on:blur="saveValidation()"
                                            v-model="location.address"
                                            :rules="location.addressRules"
                                            required
                                        >
                                            <template slot="label">
                                                Address
                                                <span class="required">*</span>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field label="Suite,#,Unit" v-model="location.unit"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md4>
                                        <v-text-field
                                            prepend-icon="ti-map"
                                            v-model="location.city"
                                            :rules="location.cityRules"
                                            required
                                        >
                                            <template slot="label">City</template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field
                                            v-model="location.state"
                                            :rules="location.stateRules"
                                        >
                                            <template slot="label">State</template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field type="number" v-model="location.zip">
                                            <template slot="label">Zip</template>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field
                                            prepend-icon="zmdi-key"
                                            label="License Number"
                                            v-model="location.license_number"
                                            v-show="!isPrimaryLocationType"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field
                                            prepend-icon="phone"
                                            type="number"
                                            :rules="location.phoneRules"
                                            v-model="location.contact_info.contact"
                                        >
                                            <template slot="label">Phone</template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-select
                                            :items="['Mobile', 'Work', 'Home']"
                                            label="Phone type"
                                            v-model="location.contact_info.type"
                                        ></v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 md12 sm12>
                                        <v-text-field
                                            prepend-icon="email"
                                            type="email"
                                            label="Email address"
                                            v-model="location.email"
                                            :rules="location.emailRules"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 md12 sm12>
                                        <v-text-field
                                            prepend-icon="zmdi-accounts"
                                            type="number"
                                            label="Capacity"
                                            v-model="location.capacity"
                                            v-if="!isPrimaryLocationType"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field
                                            prepend-icon="zmdi-file"
                                            v-model="location.notes[0]"
                                            label="Note"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </div>
                        </v-stepper-content>
                    </v-stepper-items>
                    <v-divider class="pa-0 ma-0"></v-divider>
                    <v-layout class="pa-4">
                        <v-btn
                            v-show="e1 === 1 || e1 === '1'"
                            :disabled="!iSLocationTypeSelected"
                            color="primary"
                            @click="e1 = 2"
                        >Continue</v-btn>

                        <v-btn v-show="e1 === 2 || e1 === '2'" color="primary" @click="e1 = 1">Back</v-btn>
                        <v-btn
                            v-show="e1 === 2 || e1 === '2'"
                            flat
                            color="success"
                            v-bind:disabled="btnSaveDisable"
                            @click.native="store_location('close')"
                        >Save</v-btn>
                        <v-btn flat @click.stop="addloc = false">Cancel</v-btn>
                    </v-layout>
                </v-stepper>
            </v-flex>
        </v-card>
    </v-dialog>
</template>

<script>
import Vue from "vue";
import ApiService from "@/common/api.service";
import { vm } from "../../main";

export default {
    props: { calledFrom: String, patientId: String },
    data() {
        return {
            e1: 0,
            addloc: false,

            btnSaveDisable: true,
            options: ["mobile", "work"],
            location_types: [],
            selected_location_type: "",
            location: {
                0: "",
                address: "",
                unit: "",
                city: "",
                state: "",
                zip: "",
                type: "",
                license_number: "",
                capacity: "",
                contact_info: {
                    contact: "",
                    type: ""
                },
                selectStatus: "Active",
                nameRules: [
                    v => !!v || "Name is required",
                    v =>
                        (v && v.length <= 10) ||
                        "Name must be less than 10 characters"
                ],
                email: "",
                emailRules: [
                    v =>
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
                            v
                        ) || "E-mail must be valid"
                ],
                addressRules: [v => !!v || "Address is required"],
                cityRules: [v => !!v || "City is required"],
                stateRules: [v => !!v || "State is required"],
                locationRules: [v => !!v || "Location type is required"],
                phoneRules: [
                    v => !!v || "Phone is required",
                    v =>
                        (v && v.length >= 10) ||
                        "Phone Number minimum 10 digit required"
                ],
                notes: []
            }
        };
    },
    mounted() {
        this.get_location_types();
    },
    methods: {
        openDialog() {
            this.addloc = true;
        },
        set_location_type_name(name) {
            this.selected_location_type = name;
        },
        saveValidation() {
            if (this.location.address.length > 0) {
                this.btnSaveDisable = false;
            } else {
                this.btnSaveDisable = true;
            }
        },
        get_location_types() {
            ApiService.get("/location_types").then(response => {
                this.location_types = response.location_types;
            });
        },
        store_location(type) {
            ApiService.post("/store_location", {
                location: this.location
            }).then(response => {
                this.addloc = false;
                if (this.calledFrom == "patient_overview") {
                    this.$store.dispatch("STORE_PATIENT", {
                        action: "update",
                        patient: {
                            _id: this.patientId,
                            location: response.location._id
                        }
                    });
                } else {
                    this.$router.push("/locations/" + response.location._id);
                }
            });
        }
    },
    computed: {
        iSLocationTypeSelected() {
            if (this.selected_location_type.length > 0) return true;
            else return false;
        },
        isPrimaryLocationType() {
            if (this.selected_location_type == "Primary residence / house") {
                this.location.name = "";
                this.location.license_number = "";
                this.location.capacity = "";
                return true;
            } else {
                return false;
            }
        }
    }
};
</script>