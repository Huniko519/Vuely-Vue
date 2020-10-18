<template>
    <!-- Dialog Model For Location -->
    <v-dialog v-model="addloc" scrollable max-width="700px" class="location-dialog-box">
        <v-card>
            <v-card-title class="location-card-header">
                <h2 class="px-3 mb-0">Edit Location</h2>
                <span class="close-model text-right">
                    <v-icon dark @click.stop="addloc = false">close</v-icon>
                </span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-0">
                <v-container grid-list-md pt-0>
                    <v-layout wrap>
                        <v-flex xs12 sm12 xl12 lg12 md12 class="col-height-auto">
                            <v-radio-group v-model="location.type">
                                <v-radio
                                    v-for="location_type in location_types"
                                    :key="location_type._id"
                                    :label="location_type.name"
                                    :value="location_type._id"
                                    @change="set_location_type_name(location_type.name)"
                                ></v-radio>
                            </v-radio-group>
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
                                        v-on:change="saveValidation()"
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
                                    <v-text-field
                                        label="Suite,#,Unit"
                                        v-model="location.unit"
                                        v-on:change="saveValidation"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                                <v-flex xs12 sm12 md4>
                                    <v-text-field
                                        prepend-icon="ti-map"
                                        v-model="location.city"
                                        :rules="location.cityRules"
                                        v-on:change="saveValidation"
                                        required
                                    >
                                        <template slot="label">City</template>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                        v-model="location.state"
                                        :rules="location.stateRules"
                                        v-on:change="saveValidation"
                                    >
                                        <template slot="label">State</template>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                        type="number"
                                        v-model="location.zip"
                                        v-on:change="saveValidation"
                                    >
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
                                        v-on:change="saveValidation"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout
                                row
                                wrap
                                v-for="items in location.contact_info"
                                :key="items._id"
                            >
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                        prepend-icon="phone"
                                        type="number"
                                        :rules="location.phoneRules"
                                        v-model="items.contact"
                                    >
                                        <template slot="label">Phone</template>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-select
                                        :items="['Mobile', 'Work', 'Home']"
                                        label="Phone type"
                                        v-model="options[items.type]"
                                        v-on:change="saveValidation"
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
                                        v-on:change="saveValidation"
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
                                        v-on:change="saveValidation"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-layout row wrap>
                    <v-btn
                        flat
                        color="success"
                        v-bind:disabled="btnSaveDisable"
                        @click.native="edit_location('close')"
                    >{{$t('update')}}</v-btn>
                    <v-btn flat @click.stop="addloc = false">Cancel</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Vue from "vue";
import ApiService from "@/common/api.service";
import { vm } from "../../main";

export default {
    data() {
        return {
            e1: 0,
            addloc: false,
            btnSaveDisable: true,
            options: ["Mobile", "Work", "Home"],
            location_types: [],
            selected_location_type: "",
            location: {
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
                note: ""
            }
        };
    },
    mounted() {
        this.get_location_types();
    },
    methods: {
        openDialog(location_id, locations) {
            this.location = locations;
            this.selected_location_type = locations.type_name;
            this.addloc = true;
        },
        set_location_type_name(name) {
            this.selected_location_type = name;
        },
        get_location_types() {
            ApiService.get("/location_types").then(response => {
                this.location_types = response.location_types;
            });
        },
        saveValidation() {
            if (this.location.address.length > 0) {
                this.btnSaveDisable = false;
            } else {
                this.btnSaveDisable = true;
            }
        },
        edit_location(type) {
            ApiService.put("/edit_location", {
                location: this.location
            }).then(response => {
                this.addloc = false;
                vm.$emit("FetchPageData");
            });
        }
    },
    computed: {
        isPrimaryLocationType() {
            if (this.selected_location_type == "Primary residence / house") {
                this.location.name = "";
                this.location.license_number = "";
                return true;
            } else {
                return false;
            }
        }
    }
};
</script>