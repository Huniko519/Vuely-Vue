<template>
    <div class="session-wrapper">
        <Snackbar/>
        <app-section-loader :status="loading"></app-section-loader>
        <div class="session-right text-xs-center ml-0">
            <div class="session-table-cell">
                <div class="session-content">
                    <h2 class="mb-3">{{$t('message.loginToAdmin')}} {{getAppInfo('brand_name')}}</h2>
                    <p
                            class="fs-14"
                    >{{$t('message.enterUsernameAndPasswordToAccessControlPanelOf')}} {{getAppInfo('brand_name')}}.</p>
                    <v-form v-on:submit.prevent="submit" v-model="valid" class="mb-4">
                        <v-text-field
                                label="E-mail ID"
                                v-model="email"
                                :rules="emailRules"
                                autocomplete="on"
                                required
                                @keyup.enter="$refs.password.focus"
                        ></v-text-field>
                        <v-text-field
                                label="Password"
                                v-model="password"
                                type="password"
                                :rules="passwordRules"
                                required
                                ref="password"
                                @keyup.enter="submit"
                        ></v-text-field>
                        <v-checkbox color="primary" label="Remember me" v-model="checkbox"></v-checkbox>
                        <router-link
                                class="mb-1"
                                to="/session/forgot-password"
                        >{{$t('message.forgotPassword')}}?
                        </router-link>
                        <div>
                            <v-btn
                                    large
                                    @click="submit"
                                    block
                                    color="primary"
                                    :disabled="!valid"
                            >{{$t('message.loginNow')}}
                            </v-btn>
                            <v-btn
                                    large
                                    @click="onCreateAccount"
                                    block
                                    color="warning"
                            >{{$t('message.createAccount')}}
                            </v-btn>
                        </div>
                        <p>{{$t('message.bySigningUpYouAgreeTo')}} {{getAppInfo('brand_name')}}</p>
                        <a href="#" @click.stop="tncdialog=true" class="font-weight-bold">
                            {{tnc_header}}
                        </a>
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
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
  import { vm } from "@/main";
  import Snackbar from "Components/Snackbar/Snackbar.vue";
  import ApiService from "@/common/api.service";

  export default {
    components : {
      Snackbar
    },
    data() {
      return {
        checkbox : false,
        valid : false,
        tncdialog : false,
        tnc_content : '',
        tnc_header : 'Terms & Conditions',
        email : "",
        emailRules : [
          v => !!v || "E-mail is required",
          v =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test( v ) ||
            "E-mail must be valid"
        ],
        password : "",
        passwordRules : [ v => !!v || "Password is required" ]
      };
    },
    mounted() {
      ApiService.get( "tnc_content" ).then( response => {
        this.tnc_content = response.tnc_content[ 0 ].content;
        this.tnc_header = response.tnc_content[ 0 ].header;
      } );
    },
    computed : {
      loading() {
        return vm.loading;
      }
    },
    methods : {
      submit( event ) {
        if ( this.valid ) {
          const user = {
            email : this.email,
            password : this.password
          };
          this.$store.dispatch( "signinUser", {
            user
          } );
        }
      },
      onCreateAccount() {
        this.$router.push( "/session/sign-up" );
      }
    }
  };
</script>
