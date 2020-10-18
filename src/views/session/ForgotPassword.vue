<template>
    <div class="session-wrapper">
        <Snackbar />
        <div class="session-right text-xs-center ml-0">
            <div class="session-table-cell">
                <div class="session-content">
                    <h1>{{getAppInfo('brand_name')}}</h1>
                    <h2 class="mb-3">{{$t('message.forgotPassword')}}</h2>
                    <p class="fs-14">{{$t('message.enterYourEmailToSendYouAResetLink')}}.</p>
                    <v-form v-model="valid" class="mb-4">
                        <v-text-field
                            class="reqField"
                            label="E-mail ID"
                            v-model="email"
                            :rules="emailRules"
                            required
                            clearable
                        ></v-text-field>
                        <v-btn
                            large
                            @click="submit"
                            :disabled="!valid"
                            block
                            color="primary"
                            class="mb-3"
                        >Send Email</v-btn>
                        <!-- <v-btn color="primary" block @click="" to="/session/reset-password"	>Send Email</v-btn> -->
                    </v-form>
                    <div>
                        <router-link to="/session/login">{{$t('message.backToSignIn')}}</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import Snackbar from "Components/Snackbar/Snackbar.vue";
import AppConfig from "Constants/AppConfig";

export default {
    components: {
        Snackbar
    },
    data() {
        return {
            email: "",
            valid: false,
            emailRules: [
                v => !!v || "E-mail is required",
                v =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "E-mail must be valid"
            ]
        };
    },
    methods: {
        submit() {
            if (this.valid) {
                this.valid = false;
                let userEmail = { user: this.email };
                this.$store.dispatch("forgotPassword", {
                    userEmail,
                    router: this.$router
                });
            }
        },
        checkEmailExists() {
            if (this.valid) {
                this.valid = false;
                let userEmail = { user: this.email };
                this.$store.dispatch("checkEmailExists", {
                    userEmail,
                    router: this.$router
                });
            }
        }
    }
};
</script>
