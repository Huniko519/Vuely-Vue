<template>
    <div class="session-wrapper">
        <Snackbar/>
        <app-section-loader :status="loading"></app-section-loader>
        <div class="session-right text-xs-center ml-0">
            <div class="session-table-cell">
                <div class="session-content">
                    <h2 class="mb-3">{{ $t('message.signUp') }}</h2>
                    <p class="fs-14">
                        {{ $t('message.havingAnAccount') }}
                        <router-link to="/session/login">{{$t('message.login')}}</router-link>
                    </p>
                    <v-form ref="form" v-model="valid" class="mb-4">
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
                        <v-radio-group v-model="signup.client_group" column>
                            <v-radio
                                    v-for="client_group in client_groups"
                                    :key="client_group._id"
                                    :label="client_group.name"
                                    :value="client_group._id"
                                    color="primary"
                            ></v-radio>
                        </v-radio-group>
                        <vue-hcaptcha sitekey="770a36ed-2c7b-4f41-bdd5-1a9b0c52a2ee" @verify="onVerify"></vue-hcaptcha>
                        <v-checkbox
                                class="mt-0 pt-0"
                                v-model="signup.tnc"
                                :rules="[ v => !!v || 'T&C is required']"
                        >
                            <div slot='label'>{{$t('message.bySigningUpYouAgreeTo')}} {{getAppInfo('brand_name')}}'s
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <a href="javascipt:void(0)" @click.stop="tncdialog=true" class="font-weight-bold">
                                            {{tnc_header}}
                                        </a>
                                    </template>
                                    Read T&C
                                </v-tooltip>
                            </div>
                        </v-checkbox>
                        <v-btn

                                @click="submit"
                                :disabled="!(valid && signup.captcha_code)"

                                color="primary"
                        >{{$t('message.continue')}}
                        </v-btn>
                        <v-btn
                                color="error"
                                class="mr-4"
                                @click="reset"
                        >
                            {{$t('message.reset')}}
                        </v-btn>
                    </v-form>
                </div>
            </div>
        </div>
        <v-dialog
                v-model="tncdialog" scrollable
                max-width="500"
        >
            <v-card>
                <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                >
                    {{tnc_header}}
                </v-card-title>

                <v-card-text v-html="tnc_content">
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="primary"
                            text
                            @click="tncdialog = false;signup.tnc=true"
                    >
                        I accept
                    </v-btn>
                    <v-btn
                            color="red"
                            class="white--text"
                            @click="tncdialog = false;signup.tnc=false"
                    >
                       Decline
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
  import { vm } from "@/main";
  import ApiService from "@/common/api.service";
  import Snackbar from "Components/Snackbar/Snackbar.vue";
  import moment from "moment";
  import VueHcaptcha from '@hcaptcha/vue-hcaptcha';

  export default {
    components : {
      Snackbar,
      VueHcaptcha
    },
    data() {
      return {
        valid : false,
        tncdialog : false,
        tnc_content : '',
        tnc_header : 'Terms & Conditions',
        nameRules : [
          v => !!v || "Name is required",
          v =>
            ( v && v.length <= 20 ) ||
            "Name must be less than 20 characters",
          v => /^[A-Za-z]+$/.test( v ) || "Name must be alphabet"
        ],
        emailRules : [
          v => !!v || "E-mail is required",
          v =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test( v ) ||
            "E-mail must be valid"
        ],
        phType : [ "Mobile", "Work", "Home" ],
        ClientPref : [ "Guests", "Residents", "Patients", "Others" ],
        signup : {
          first_name : "",
          last_name : "",
          email : "",
          vemail : "",
          client_group : "",
          captcha_code : false,
          timezone : ""
        },
        client_groups : []
      };
    },
    mounted() {
      ApiService.get( "client_groups" ).then( response => {
        this.client_groups = response.client_groups;
        this.signup.client_group = this.client_groups[ 0 ]._id;
      } );
      window.moment = require( "moment-timezone" );
      let tz = moment.tz.guess();
      this.signup.timezone = tz;
      ApiService.get( "tnc_content" ).then( response => {
        this.tnc_content = response.tnc_content[ 0 ].content;
        this.tnc_header = response.tnc_content[ 0 ].header;
      } );
        },
        computed: {
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
            isText: function (evt) {
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
            isNumber: function (evt) {
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
            submit() {
                if (this.valid) {
                    let userDetail = this.signup;
                    this.$store.dispatch("signupNewUser", {
                        userDetail,
                        router: this.$router
                    });
                }
            },
            onVerify(res) {
                this.signup.captcha_code = true
            },
            reset () {
                this.$refs.form.reset();
                this.valid = false
            }
        }
    };
</script>
