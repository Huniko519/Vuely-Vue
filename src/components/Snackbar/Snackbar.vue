<!-- Side Structure -->
<template>
    <div>
        <v-snackbar
            class="mt-2"
            v-model="snackbar"
            :color="snackbarColor"
            :timeout="snackbarTimeout"
            top
        >
            {{ snackbarText }}
            <v-btn dark flat @click="closeSnackbar()">Close</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import { vm } from "@/main";

export default {
    data() {
        return {
            snackbar: false,
            snackbarTimeout: 6000
        };
    },
    watch: {
        snackbarLatest: function(value) {
            if (value) {
                this.snackbar = true;
                setTimeout(() => {
                    this.closeSnackbar();
                }, this.snackbarTimeout);
            } else this.snackbar = false;
        }
    },

    computed: {
        snackbarLatest() {
            return vm.snackbar;
        },
        snackbarText() {
            return vm.snackbarText;
        },
        snackbarColor() {
            return vm.snackbarColor;
        }
    },

    methods: {
        closeSnackbar() {
            vm.snackbar = false;
        }
    }
};
</script>
