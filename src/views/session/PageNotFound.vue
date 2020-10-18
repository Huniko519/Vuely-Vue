<template>
    <div class="session-wrapper">
        <div class="session-right text-xs-center ml-0">
            <div class="session-table-cell">
                <div class="session-content">
                    <h1 class="mb-3">404: PAGE NOT FOUND</h1>
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
export default {
    name: "PageNotFound",
    data() {
        return {
            time: 10,
            interval: null
        };
    },
    mounted() {
        this.interval = setInterval(this.decreaseTime, 1000);
        setTimeout(() => {
            this.$router.push("/session/login");
        }, this.time * 1000);
    },
    computed: {
        loading() {
            return vm.loading;
        }
    },
    methods: {
        decreaseTime() {
            this.time = parseInt(this.time) - 1;
        }
    }
};
</script>
