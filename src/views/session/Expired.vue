<template>
    <div class="session-wrapper">
        <Snackbar />
        <div class="session-right text-xs-center ml-0">
            <div class="session-table-cell">
                <h1>{{getAppInfo('brand_name')}}</h1>
                <div class="ma-5">
                    The link you were trying to reach has
                    <b>{{$t('message.expired')}}</b>. Please contact
                    the administrator for further queries.
                </div>
                <div class="mt-5">
                    Go back to
                    <a @click="goToHome()">Home Page</a>
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
            brand: this.getAppInfo("brand_name")
        };
    },
    methods: {
        goToHome() {
            this.$router.push("session/login");
        }
    }
};
</script>
