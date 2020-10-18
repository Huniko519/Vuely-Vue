<template>
    <!-- Dialog Model For Patinent -->
    <v-dialog v-model="addcli" scrollable max-width="700px" class="Client-dialog-box">
        <v-card>
            <v-card-title class="Client-card-header">
                <h2 class="px-3 mb-0">Add New Client</h2>
                <span class="close-model text-right">
                    <v-icon dark @click.stop="addcli = false">close</v-icon>
                </span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12 sm12 xl12 lg12 md12 class="col-height-auto">
                            <div>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12 xl12 lg12 mb-4 class="col-height-auto">
                                        <span
                                            class="error--text fs-12 d-block"
                                        >All fields marked with an asterisk (*) are required</span>
                                    </v-flex>
                                </v-layout>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md4>
                                        <v-text-field
                                            prepend-icon="zmdi-account"
                                            v-on:blur="saveValidation()"
                                            v-model="name"
                                            :rules="nameFirstRules"
                                            required
                                        >
                                            <template slot="label">
                                                First name
                                                <span class="required">*</span>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4>
                                        <v-text-field label="Middle name"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md4>
                                        <v-text-field
                                            v-on:blur="saveValidation()"
                                            v-model="last_name"
                                            :rules="nameLastRules"
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
                                            label="Prefix"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field label="Suffix"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm4 md4>
                                        <v-text-field
                                            slot="activator"
                                            v-model="date"
                                            label="Date of birth"
                                            prepend-icon="event"
                                            v-on:focus="activeDatepicker()"
                                            readonly
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm4 md4>
                                        <v-text-field label="Social Security Number"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm4 md4>
                                        <v-autocomplete
                                            :items="['Male', 'Female']"
                                            label="Gender"
                                            v-model="selectGender"
                                        ></v-autocomplete>
                                    </v-flex>
                                    <v-date-picker
                                        v-model="date"
                                        v-show="calendar"
                                        no-title
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="calendar = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="calendar = false">OK</v-btn>
                                    </v-date-picker>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field prepend-icon="phone" label="Phone" required></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-autocomplete
                                            :items="['Main', 'Fax']"
                                            label="Phone type"
                                            v-model="selectPhoneType"
                                        ></v-autocomplete>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 md12 sm12>
                                        <v-text-field
                                            prepend-icon="email"
                                            type="email"
                                            :rules="emailRules"
                                            label="Email address"
                                            required
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 md12 sm12>
                                        <v-autocomplete
                                            :items="['29387 b st', 'Kaiser']"
                                            label="Location"
                                            prepend-icon="zmdi-pin"
                                            v-model="selectLocation"
                                        ></v-autocomplete>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field
                                            prepend-icon="zmdi-file"
                                            label="Note"
                                            required
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md6></v-flex>
                    <v-flex xs12 sm12 md2>
                        <v-btn flat @click.native="addcli = false">CANCEL</v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 md2>
                        <v-btn
                            flat
                            color="success"
                            v-bind:disabled="btnSaveDisable"
                            @click.native="addcli = false"
                        >Save & Close</v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 md2>
                        <v-btn
                            flat
                            color="success"
                            v-bind:disabled="btnSaveDisable"
                            @click.native="addcli = false"
                        >Save & Add</v-btn>
                    </v-flex>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            addcli: false,
            btnSaveDisable: true,
            name: "",
            nameFirstRules: [v => !!v || "First Name is required"],
            last_name: "",
            nameLastRules: [v => !!v || "Last Name is required"],
            email: "",
            emailRules: [
                v =>
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
                        v
                    ) || "E-mail must be valid"
            ],
            date: new Date().toISOString().substr(0, 10),
            calendar: false,
            selectLocation: "",
            selectPhoneType: "",
            selectGender: ""
        };
    },
    methods: {
        openDialog() {
            this.addcli = true;
        },
        saveValidation() {
            if (this.name.length > 0 && this.last_name.length > 0) {
                this.btnSaveDisable = false;
            } else {
                this.btnSaveDisable = true;
            }
        },
        activeDatepicker() {
            this.calendar = !this.calendar;
        }
    }
};
</script>

