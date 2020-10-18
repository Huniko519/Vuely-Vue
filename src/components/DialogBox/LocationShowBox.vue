<template>
    <v-dialog v-model="location_show" max-width="700" v-if="patient.location">
        <v-card>
            <v-card-title class="headline font-weight-bold">
                <router-link :to="'/locations/' + patient.location._id">
                    <i
                            :class="[
                            { zmdi: true },
                            'zmdi-' + patient.location.type.icon
                        ]"
                    ></i>
                    {{ patient.location.type.acronym }}:
                    {{ patient.location.name || patient.location.address }}
                </router-link>
            </v-card-title>
            <hr class="pt-0 mt-0" />
            <v-card-text class="pt-0">
                <div>
                    <v-layout mb-1>
                        <b>Address:&nbsp;</b>
                        {{ patient.location.address }}
                    </v-layout>
                </div>
                <div>
                    <v-layout mb-1>
                        <b>Phone:&nbsp;</b>
                        {{ patient.location.phone }}
                    </v-layout>
                </div>
            </v-card-text>
            <hr class="pa-0 ma-0" />
            <v-card-actions>
                <v-btn
                        v-if="hasAccess('patient', 'update_patient_info')"
                        class="ml-2"
                        color="error"
                        @click="removePatientLocation()"
                >Remove</v-btn>
                <div v-if="hasAccess('patient', 'update_patient_info')" class="ml-2">
                    <v-menu offset-y ma-0 pa-0 style="max-height:300px;">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" v-on="on">Change</v-btn>
                            <!--
                            <v-btn
                                style="text-transform: none; height: unset"
                                class="ma-0 pa-0"
                                flat
                                color="primary link"
                                v-on="on"
                                >Add / Set a location</v-btn
                            >
                            -->
                        </template>
                        <v-list style="max-height:300px;" color="primary">
                            <v-list-tile
                                    v-if="hasAccess('location', 'add_new_location')"
                                    @click="
                                    location_show = false;
                                    update_patient_location();
                                "
                                    class="v-list__tile_location_dropdown"
                            >
                                <v-list-tile-title>
                                    <strong>
                                        Add a new location
                                        <v-icon class="pl-0 ml-0" dark>add</v-icon>
                                    </strong>
                                </v-list-tile-title>
                            </v-list-tile>
                            <v-divider class="ma-0 pa-0"></v-divider>
                            <v-list-tile
                                    @click="
                                    location_show = false;
                                    update_patient_location(location._id);
                                "
                                    class="v-list__tile_location_dropdown"
                                    v-for="(location, index) in locations"
                                    :key="index"
                            >
                                <v-list-tile-title>
                                    {{
                                    location.name
                                    ? location.name
                                    : location.address
                                    }}
                                </v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </div>
                <v-btn class="ml-2" color="primary" @click="location_show = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
	import Vue from "vue";
	import Timeline from "../timeline/timeline";
	import ApiService from "@/common/api.service";
	import { vm } from "../../main";
	import moment from "moment";

	export default {
		props: {
			info: { type: Object },
			locations: { type: Array },
			update_patient_location: { type: Function }
		},
		components: {
			Timeline: Timeline
		},
		data() {
			return {
				location_show: false,
				patient: this.info
			};
		},
		watch: {
			info: {
				handler: function(val, oldVal) {
					this.patient = val;
				},
				deep: true
			}
		},
		methods: {
			openDialog() {
				this.location_show = true;
			},
			removePatientLocation() {
				if (confirm("Are you sure you want to remove this location?")) {
					ApiService.put("remove_patient_locaton", {
						patient_id: this.patient._id,
						location_id: this.patient.location._id
					}).then(response => {
						this.location_show = false;
						vm.$emit("FetchPageData");
					});
				}
			}
		}
	};
</script>
