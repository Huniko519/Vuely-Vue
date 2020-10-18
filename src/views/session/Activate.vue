<template>
    <div class="session-wrapper">
        <Snackbar />
        <app-section-loader :status="loading"></app-section-loader>
        <div class="session-right text-xs-center ml-0">
            <div class="session-table-cell">
                <div class="session-content">
                    <h2 class="mb-3">{{$t('message.activate')}} Account</h2>
                    <p class="fs-14">
                        {{$t('message.havingAnAccount')}}
                        <router-link to="/session/login">{{$t('message.login')}}</router-link>
                    </p>
                    <v-form v-model="formvalid" class="mb-4" ref="form">
                        <v-text-field
                            class="reqField"
                            label="E-mail ID"
                            v-model="activate.email"
                            :rules="emailRules"
                            required
                            clearable
                        ></v-text-field>
                        <v-text-field
                            class="reqField"
                            v-model="activate.pass"
                            label="Password"
                            type="password"
                            :rules="passRules"
                            required
                            clearable
                        ></v-text-field>
                        <v-text-field
                            class="reqField"
                            v-model="activate.passconf"
                            label="Verify Password"
                            type="password"
                            :rules="confirmPasswordRules"
                            required
                            clearable
                        ></v-text-field>
                        <sup v-if="errors.length" class="error--text">{{errors}}</sup>
                        <v-btn
                            @click="submit"
                            large
                            :disabled="!formvalid"
                            color="primary"
                        >{{$t('message.submit')}}</v-btn>
                        <v-btn @click="clear" large color="primary">{{$t("message.clear")}}</v-btn>
                    </v-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { vm } from "@/main";
import Snackbar from "Components/Snackbar/Snackbar.vue";
import AppConfig from "Constants/AppConfig";
import router from "../../router";
import ApiService from "@/common/api.service";

export default {
    components: {
        Snackbar
    },
    data() {
        return {
            formvalid: false,
            emailRules: [
                v => !!v || "E-mail is required",
                v =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "E-mail must be valid"
            ],
            passRules: [
                v =>
                    (v && v.length > 5) ||
                    "Password must be longer than 5 characters",
                v =>
                    this.activate.passconf.length === 0 ||
                    this.activate.pass === this.activate.passconf ||
                    "Password must match."
            ],
            errors: "",
            activate: {
                key: "",
                email: "",
                pass: "",
                passconf: ""
            },
            is_admin: false
        };
    },
    computed: {
        confirmPasswordRules() {
            return [
                () =>
                    this.activate.pass === this.activate.passconf ||
                    "Password must match",
                v => !!v || "Confirmation password is required"
            ];
        },
        loading() {
            return vm.loading;
        }
    },
    mounted() {
        this.getLinkDetails();
    },
    methods: {
        clear() {
            this.$refs.form.reset();
        },
        getLinkDetails() {
            let linkDetail = this.activate;

            linkDetail.key = this.$route.params.key;

            ApiService.post("/linkdetails", linkDetail).then(
                response => {
                    if (response.user.status == 2) {
                        this.$router.push("/session/login");
                    }
                    this.is_admin = response.user.is_admin;
                },
                error => {
                    this.$router.push("/expired");
                }
            );
            /*
            this.$store.dispatch("getLinkDetails", {
                linkDetail,
                router: this.$router
            });
            */
        },
        submit() {
            let passDetail = this.activate;
            passDetail.key = this.$route.params.key;

            if (this.formvalid) {
                this.errors = "";

                if (this.is_admin) {
                    this.$store.dispatch("activateSuperAdmin", {
                        passDetail,
                        router: this.$router
                    });
                } else {
                    this.$store.dispatch("activateUser", {
                        passDetail,
                        router: this.$router
                    });
                }
            }
        },
        signInWithFacebook() {
            this.$store.dispatch("signinUserWithFacebook", {
                router: this.$router
            });
        },
        signInWithGoogle() {
            this.$store.dispatch("signinUserWithGoogle", {
                router: this.$router
            });
        },
        signInWithTwitter() {
            this.$store.dispatch("signinUserWithTwitter", {
                router: this.$router
            });
        },
        signInWithGithub() {
            this.$store.dispatch("signinUserWithGithub", {
                router: this.$router
            });
        }
    }
};
</script>
