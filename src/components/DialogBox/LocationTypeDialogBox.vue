<template>
    <div>
        <v-dialog v-model="location_type_info_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title class="text-capitalize">Location Type Information</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text>
                    <v-form v-model="location_type_info_valid" class="mb-4">
                        <span class="cursor-pointer" @click="iconsDialog=true;">
                            Icon
                            <i :class="[{ zmdi: true }, 'zmdi-' + location_type.icon]"></i>
                        </span>

                        <v-text-field
                            class="reqField"
                            label="Name"
                            v-model="location_type.name"
                            :rules="[v => !!v || 'Name is required']"
                            required
                            clearable
                            @keypress="isText($event)"
                        ></v-text-field>

                        <v-text-field
                            class="reqField"
                            label="Acronym"
                            v-model="location_type.acronym"
                            :rules="[v => !!v || 'Acronym is required']"
                            required
                            clearable
                            @keypress="isAlphaNumeric"
                        ></v-text-field>

                        <v-btn
                            class="ml-0"
                            @click="update_location_type_info()"
                            :disabled="!location_type_info_valid"
                            color="primary"
                        >{{formType=='add' ? 'Save' : 'Update'}}</v-btn>

                        <v-btn
                            v-if="formType=='add'"
                            class="ml-0"
                            @click="reset()"
                            color="success"
                        >Reset</v-btn>

                        <v-btn @click="location_type_info_dialog = false" color="error">Cancel</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="iconsDialog" scrollable>
            <v-card>
                <v-card-title class="text-capitalize">
                    <b>Select an icon</b>
                </v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex
                            class="text-center"
                            v-for="icon in filteredZmdiIcons"
                            :key="icon"
                            xs2
                            md1
                            lg1
                        >
                            <v-btn
                                style="margin:auto;"
                                flat
                                icon
                                @click="location_type.icon=icon;iconsDialog=false;"
                            >
                                <i :class="[{ zmdi: true }, 'zmdi-hc-lg zmdi-' + icon]"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import ApiService from "@/common/api.service";
import zmdiIcons from "@/data/zmdi-icons.json";
import { vm } from "@/main";

export default {
    name: "LocationTypeDialogBox",
    data() {
        return {
            formType: "add",
            location_type: {
                icon: "home",
                name: "",
                acronym: ""
            },

            location_type_info_dialog: false,
            location_type_info_valid: false,
            iconsDialog: false,
            zmdiIcons,
            filteredZmdiIcons: zmdiIcons
        };
    },
    methods: {
        update_location_type_info() {
            if (this.location_type_info_valid) {
                this.location_type_info_dialog = false;
                if (this.formType == "add") {
                    ApiService.post("location_type", {
                        icon: this.location_type.icon,
                        name: this.location_type.name,
                        acronym: this.location_type.acronym
                    }).then(response => {
                        vm.$emit("FetchPageData");
                        this.reset();
                    });
                } else {
                    ApiService.put("update_location_type_info", {
                        _id: this.location_type._id,
                        icon: this.location_type.icon,
                        name: this.location_type.name,
                        acronym: this.location_type.acronym
                    }).then(response => {
                        vm.$emit("FetchPageData");
                    });
                }
            }
        },
        isText: function(evt) {
            evt = evt ? evt : window.event;
            var charCode = evt.which ? evt.which : evt.keyCode;
            if (
                charCode > 31 &&
                (charCode < 65 || charCode > 90) &&
                (charCode < 97 || charCode > 122) &&
                charCode != 32
            ) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        isNumber: function(evt) {
            evt = evt ? evt : window.event;
            var charCode = evt.which ? evt.which : evt.keyCode;
            if (
                charCode > 31 &&
                (charCode < 48 || charCode > 57) &&
                charCode != 9
            ) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        isAlphaNumeric: function(evt) {
            evt = evt ? evt : window.event;
            var charCode = evt.which ? evt.which : evt.keyCode;
            if (
                !(
                    charCode > 31 &&
                    (charCode < 65 || charCode > 90) &&
                    (charCode < 97 || charCode > 122) &&
                    charCode != 32
                ) ||
                !(
                    charCode > 31 &&
                    (charCode < 48 || charCode > 57) &&
                    charCode != 9
                )
            ) {
                return true;
            } else {
                evt.preventDefault();
            }
        },
        reset() {
            this.location_type = {
                icon: "home",
                name: "",
                acronym: ""
            };
        }
    }
};
</script>