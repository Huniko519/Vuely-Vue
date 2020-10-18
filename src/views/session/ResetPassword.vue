<template>
    <div class="session-wrapper">
        <Snackbar />
        <div class="session-right text-xs-center ml-0">
            <div class="session-table-cell">
                <div class="session-content">
                    <h1>{{getAppInfo('brand_name')}}</h1>
                    <h2 class="mb-3">{{$t('message.resetPassword')}}</h2>
                    <p class="fs-14">{{$t('message.pleaseEnterYourPasswordToReset')}}.</p>
                    <v-form v-model="valid" class="mb-4">
                        <v-text-field
                            class="reqField"
                            v-model="resetPasswordDetails.newPassword"
                            label="Password"
                            type="password"
                            :rules="passRules"
                            required
                            clearable
                        ></v-text-field>
                        <v-text-field
                            class="reqField"
                            v-model="resetPasswordDetails.confirmPassword"
                            label="Verify Password"
                            type="password"
                            :rules="confirmPasswordRules"
                            required
                            clearable
                        ></v-text-field>
                        <v-btn
                            large
                            @click="submit"
                            :disabled="!valid"
                            block
                            color="primary"
                        >{{$t('message.resetPassword')}}</v-btn>
                    </v-form>
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
            valid: false,
            resetPasswordDetails: {
                newPassword: "",
                confirmPassword: "",
                otp: this.$route.params.otp
            },

            passRules: [
                v =>
                    (v && v.length > 5) ||
                    "Password must be longer than 5 characters",
                v =>
                    this.resetPasswordDetails.confirmPassword.length === 0 ||
                    this.resetPasswordDetails.newPassword ===
                        this.resetPasswordDetails.confirmPassword ||
                    "Password must match."
            ]
        };
    },
    computed: {
        confirmPasswordRules() {
            return [
                () =>
                    this.resetPasswordDetails.newPassword ===
                        this.resetPasswordDetails.confirmPassword ||
                    "Password must match",
                v => !!v || "Confirmation password is required"
            ];
        }
    },
    mounted() {
        this.getPasswordVerifyLinkDetails();
    },
    methods: {
        getPasswordVerifyLinkDetails() {
            let linkDetail = this.resetPasswordDetails;

            linkDetail.otp = this.$route.params.otp;
            this.$store.dispatch("getPasswordVerifyLinkDetails", {
                linkDetail,
                router: this.$router
            });
        },
        submit() {
            if (this.valid) {
                let resetPasswordDetails = this.resetPasswordDetails;
                this.$store.dispatch("resetPassword", {
                    user: this.$route.params.email_hashed_id,
                    key: "reset-password",
                    value: resetPasswordDetails
                });
            }
        }
    }
};
</script>
