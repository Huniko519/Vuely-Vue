<template>
    <div>
        <v-container fluid grid-list-xl pt-4>
            <v-layout row wrap>
                <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                    <h2>App Information</h2>
                    <span class="subheading">Update app information</span>
                    <br />
                    <hr />
                    <v-form v-model="validForm" class="mb-4">
                        <v-text-field
                            class="reqField"
                            label="Brand name"
                            v-model="brand_name"
                            :rules="[v => !!v || 'Brand name is required']"
                            required
                            @keypress="isText($event)"
                        ></v-text-field>

                        <v-btn
                            class="ml-0"
                            :disabled="!validForm"
                            @click="updateAppInfo()"
                            color="primary"
                        >Update</v-btn>
                    </v-form>
                </app-card>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import moment from "moment";
import { vm } from "@/main";
import ApiService from "@/common/api.service";

export default {
    name: "Alerts",
    data: function() {
        return {
            validForm: false,
            brand_name: this.getAppInfo("brand_name")
        };
    },
    methods: {
        updateAppInfo() {
            ApiService.put("app_info", {
                brand_name: this.brand_name
            }).then(() => {
                this.$store.dispatch("getAppInfo");
            });
        },
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
        }
    }
};
</script>
