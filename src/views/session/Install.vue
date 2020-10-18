<template>
    <div class="session-wrapper">
        <Snackbar />
        <app-section-loader :status="loading"></app-section-loader>
        <div class="session-right text-xs-center ml-0">
            <div class="session-table-cell">
                <div v-if="pageReady && validPageAccess" class="session-content">
                    <h2 class="mb-3">Initial setup of your app!</h2>
                    <p class="fs-14">Provide all information to setup your app properly.</p>
                    <v-form v-model="valid" class="mb-4">
                        <v-text-field
                            class="reqField"
                            label="Brand Name"
                            v-model="signup.brand_name"
                            :rules="nameRules"
                            :counter="20"
                            required
                            clearable
                            @keypress="isText($event)"
                        ></v-text-field>
                        <v-text-field
                            class="reqField"
                            label="First Name"
                            v-model="signup.first_name"
                            :rules="nameRules"
                            :counter="20"
                            required
                            clearable
                            @keypress="isText($event)"
                        ></v-text-field>

                        <v-text-field
                            class="reqField"
                            label="Last Name"
                            v-model="signup.last_name"
                            :rules="nameRules"
                            :counter="20"
                            required
                            clearable
                            @keypress="isText($event)"
                        ></v-text-field>
                        <v-text-field
                            class="reqField"
                            label="Phone number"
                            v-model="signup.phone"
                            :rules="phoneRules"
                            :counter="10"
                            required
                            clearable
                            @keypress="isNumber"
                        ></v-text-field>
                        <v-select
                            label="Phone Type"
                            v-model="signup.phone_type"
                            :options="phType"
                            :rules="[v => !!v || 'Phone type is required']"
                            required
                        ></v-select>
                        <v-text-field
                            class="reqField"
                            label="E-mail ID"
                            v-model="signup.email"
                            :rules="emailRules"
                            required
                            clearable
                        ></v-text-field>
                        <v-text-field
                            class="reqField"
                            label="Verify E-mail ID"
                            v-model="signup.vemail"
                            :rules="confirmEmailRules"
                            clearable
                        ></v-text-field>

                        <v-btn
                            large
                            @click="submit"
                            :disabled="!valid"
                            block
                            color="primary"
                            class="mb-3"
                        >Submit</v-btn>
                    </v-form>
                </div>
                <div v-else-if="!pageReady && validPageAccess" class="session-content">
                    <h1>Please wait ...</h1>
                </div>
                <div v-else class="session-content">
                    <h1 class="mb-3">App is already installed.</h1>
                    <h3>
                        Redirecting to
                        <router-link to="/session/login">{{$t('message.login')}}</router-link>
                        &nbsp;page ... {{time}}
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { vm } from "@/main";
import ApiService from "@/common/api.service";
import Snackbar from "Components/Snackbar/Snackbar.vue";
import AppConfig from "Constants/AppConfig";
import moment from "moment";

export default {
    components: {
        Snackbar
    },
    data() {
        return {
            pageReady: false,
            validPageAccess: true,
            time: 10,
            interval: null,
            valid: false,
            emailRules: [
                v => !!v || "E-mail is required",
                v =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "E-mail must be valid"
            ],
            phoneRules: [
                v => !!v || "Phone number is required",
                v => (v && /^\d+$/.test(v)) || "Phone number must be numeric",
                v => (v && v.length <= 10) || "Phone number must be 10 digits"
            ],
            phType: ["Mobile", "Work", "Home"],
            signup: {
                brand_name: "",
                first_name: "",
                last_name: "",
                email: "",
                vemail: "",
                phone: "",
                phone_type: "Mobile",
                timezone: ""
            }
        };
    },
    mounted() {
        ApiService.get("is_installed").then(response => {
            if (response.is_installed) {
                this.pageReady = true;
                this.validPageAccess = false;
                this.interval = setInterval(this.decreaseTime, 1000);
                setTimeout(() => {
                    this.$router.push("/session/login");
                }, this.time * 1000);
            } else {
                this.pageReady = true;
            }
        });
        window.moment = require("moment-timezone");
        let tz = moment.tz.guess();
        this.signup.timezone = tz;
    },
    computed: {
        nameRules() {
            return [
                v => !!v || "This field is required",
                v =>
                    (v && v.length <= 20) ||
                    "This field must be less than 20 characters",
                v => /^[A-Za-z]+$/.test(v) || "Name must be alphabet"
            ];
        },
        confirmEmailRules() {
            return [
                () =>
                    this.signup.email === this.signup.vemail ||
                    "E-mail must match",
                v => !!v || "Confirmation E-mail is required"
            ];
        },
        loading() {
            return vm.loading;
        }
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
        decreaseTime() {
            this.time = parseInt(this.time) - 1;
        },
        submit() {
            if (this.valid) {
                ApiService.post("install", this.signup).then(response => {
                    console.log(response);
                    if (response.code) {
                    } else {
                    }
                });
            }
        }
    }
};
</script>
