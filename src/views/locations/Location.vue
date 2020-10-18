<template>
    <div>
        <v-container fluid grid-list-xl class="location-section">
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <!-- Dialog Model For Location -->
                <location-dialogBox ref="LocationDialog"></location-dialogBox>
                <DataTable :columns="columns" :rows="locations" type="locations"></DataTable>
            </app-card>
            <!-- User Group : Bottom Right Button-->

            <v-btn
                v-if="!isAdmin() && hasAccess('location', 'add_new_location')"
                fab
                fixed
                bottom
                right
                color="primary"
                @click="onLocationDialog()"
            >
                <v-icon dark>add</v-icon>
            </v-btn>

            <LocationTypeDialogBox ref="LocationTypeDialogBoxRef"></LocationTypeDialogBox>
            <v-btn
                v-if="isAdmin()"
                fab
                fixed
                bottom
                right
                color="primary"
                @click="$refs.LocationTypeDialogBoxRef.location_type_info_dialog = true;"
            >
                <v-icon dark>add</v-icon>
            </v-btn>
        </v-container>
        <v-container v-if="isAdmin()" fluid grid-list-xl class="location-section pt-0">
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <h5>Types</h5>
                <standard-table
                    :columns="locationTypesColumns"
                    :rows="location_types"
                    type="location_types"
                ></standard-table>
            </app-card>
        </v-container>
    </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { mapState } from "vuex";

import { vm } from "@/main";
import ApiService from "@/common/api.service";
import standardTable from "@/components/table/standard";
import DataTable from "@/components/table/datatable";
import locationDialogBox from "@/components/DialogBox/LocationDialogBox";
import LocationTypeDialogBox from "@/components/DialogBox/LocationTypeDialogBox";

export default {
    components: {
        "standard-table": standardTable,
        "location-dialogBox": locationDialogBox,
        DataTable,
        LocationTypeDialogBox
    },
    data() {
        return {
            addloc: false,
            locations: [],
            location_types: [],
            columns: [
                {
                    text: "Name",
                    value: "name"
                },
                {
                    text: "Address",
                    value: "address"
                },
                {
                    text: "Type",
                    value: "type"
                },
                {
                    text: "Residents",
                    value: "residents",
                    class: "text-center"
                },
                {
                    text: "Status",
                    value: "status",
                    class: this.isAdmin() ? "" : "d-none",
                    formatFn: this.statusType
                },
                {
                    text: "Created",
                    value: "createdAt",
                    formatFn: this.dateOutputFormat
                }
            ],
            locationTypesColumns: [
                /*{
                    label: "Id",
                    field: "_id",
                    type: "number",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align"
                },
                */
                {
                    label: "Icon",
                    field: "icon"
                },
                {
                    label: "Name",
                    field: "name"
                },
                {
                    label: "Acronym",
                    field: "acronym"
                },
                {
                    label: "Total",
                    field: "total",
                    type: "number",
                    thClass: "vgt-center-align",
                    tdClass: "vgt-center-align"
                }
            ]
        };
    },
    created() {
        vm.$on("FetchPageData", this.getLocationData);
    },
    beforeDestroy() {
        vm.$off("FetchPageData", this.getLocationData);
    },
    mounted() {
        this.getLocationData();
    },
    methods: {
        getLocationData() {
            ApiService.get("locations").then(response => {
                this.locations = response.locations;
                this.location_types = response.location_types;
            });
        },
        onLocationDialog() {
            this.$refs.LocationDialog.openDialog();
        },
        dateOutputFormat: function(data, key) {
            return moment.utc(data[key]).fromNow();
        },
        statusType: function(data, key) {
            let status = ["Deleted", "Active"];
            return status[data[key]];
        }
    }
};
</script>

<style>
@import "./Location.css";
</style>