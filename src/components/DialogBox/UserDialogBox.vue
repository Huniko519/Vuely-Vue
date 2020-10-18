<template>
    <!-- Dialog Model For Location -->
    <v-dialog v-model="adduser" scrollable max-width="500px" class="dialog-box">
        <v-form v-on:submit.prevent="create_user" v-model="valid">
            <v-card>
                <v-card-title class="card-header">
                    <h2 class="px-3 mb-0">Add User</h2>
                    <span class="close-model text-right">
                        <v-icon dark @click.stop="adduser = false">close</v-icon>
                    </span>
                </v-card-title>
                <v-divider class="mt-0"></v-divider>
                <v-card-text class="pt-0">
                    <v-container grid-list-md pt-0 pb-0>
                        <v-layout wrap>
                            <v-flex xs12 sm12 xl12 lg12 md12 class="col-height-auto">
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field
                                            prepend-icon="zmdi-assignment-account"
                                            label="First Name"
                                            v-model="user.first_name"
                                            :rules="nameRules"
                                            :counter="20"
                                            v-on:change="saveValidation"
                                            required
                                            @keypress="isText($event)"
                                        >
                                            <template slot="label">
                                                First Name
                                                <span class="required">*</span>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md6>
                                        <v-text-field
                                            prepend-icon="zmdi-assignment-account"
                                            label="Last Name"
                                            v-model="user.last_name"
                                            :rules="nameRules"
                                            :counter="20"
                                            @keypress="isText($event)"
                                        >
                                            <template slot="label">
                                                Last Name
                                                <span class="required">*</span>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field
                                            prepend-icon="ti-map"
                                            v-model="user.email"
                                            type="email"
                                            v-on:change="saveValidation"
                                            :rules="emailRules"
                                            required
                                        >
                                            <template slot="label">
                                                Email
                                                <span class="required">*</span>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap v-show="user_groups.length > 1">
                                    <v-flex xs12 sm12 md12>
                                        <v-select
                                            prepend-icon="supervisor_account"
                                            v-model="user.user_group"
                                            :items="user_groups"
                                            item-value="_id"
                                            item-text="name"
                                            required
                                        >
                                            <template slot="label">
                                                User Group
                                                <span class="required">*</span>
                                            </template>
                                        </v-select>
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
                            :disabled="!valid"
                            @click.native="create_user"
                        >{{$t('save')}}</v-btn>
                        <v-btn flat @click.stop="resetForm();">Reset</v-btn>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script>
import ApiService from "@/common/api.service";
import { vm } from "../../main";

export default {
    data() {
        return {
            adduser: false,
            valid: true,
            user: {
                first_name: "",
                last_name: "",
                email: "",
                user_group: ""
            },
            user_groups: [],
            nameRules: [
                v => !!v || "Name is required",
                v =>
                    (v && v.length <= 20) ||
                    "Name must be less than 20 characters",
                v => /^[A-Za-z]+$/.test(v) || "Name must be alphabet"
            ],
            emailRules: [
                v =>
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
                        v
                    ) || "E-mail must be valid"
            ]
        };
    },
    mounted() {
        ApiService.get("/user_groups").then(data => {
            this.user_groups = [];
            let allowed_groups = this.getAuthClient(
                "user_groups",
                "client_group"
            );

            data.user_groups.forEach(element => {
                if (allowed_groups.indexOf(element._id) !== -1) {
                    this.user_groups.push(element);
                }
            });

            if (this.user_groups.length) {
                this.user.user_group = this.getAuthClient(
                    "default_user_group",
                    "client_group"
                );
            }
        });
    },
    methods: {
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
        openDialog() {
            this.resetForm();
            this.adduser = true;
        },
        resetForm() {
            this.user = {
                first_name: "",
                last_name: "",
                email: "",
                user_group: ""
            };
            if (this.user_groups.length) {
                this.user.user_group = this.getAuthClient(
                    "default_user_group",
                    "client_group"
                );
            }
        },
        create_user(type) {
            ApiService.post("/create_user", {
                user: this.user
            }).then(response => {
                this.adduser = false;
                vm.$emit("FetchPageData");
            });
        }
    }
};
</script>