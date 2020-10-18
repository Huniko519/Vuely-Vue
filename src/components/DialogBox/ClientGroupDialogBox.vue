<template>
    <v-dialog v-model="dialog" scrollable max-width="600">
        <v-card>
            <v-card-title>
                <h4 class="pa-0 ma-0 w-100">
                    Client Group Information
                    <span class="close-model">
                        <v-icon dark @click.stop="dialog = false">close</v-icon>
                    </span>
                </h4>
            </v-card-title>

            <v-divider class="ma-0"></v-divider>
            <v-card-text>
                <v-form v-model="valid" class="mb-4">
                    <v-text-field
                            class="reqField"
                            label="Name"
                            v-model="group.name"
                            :rules="[v => !!v || 'Name is required']"
                            required
                    ></v-text-field>

                    <v-layout>
                        <v-flex xs12 md6 mr-1>
                            <v-text-field
                                    class="reqField"
                                    label="Acronym"
                                    v-model="group.acronym"
                                    :rules="[v => !!v || 'Acronym is required']"
                                    required
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs12 md6>
                            <v-text-field
                                    class="reqField"
                                    label="Timeout"
                                    v-model="group.timeout"
                                    @keypress="isNumber"
                                    :rules="[v => !!v || 'Timeout is required']"
                                    required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-checkbox class="pr-3" v-model="group.signup" label="Sign Up"></v-checkbox>
                        <v-checkbox v-model="group.status" label="Status"></v-checkbox>
                    </v-layout>

                    <span>User Groups</span>
                    <v-layout row wrap>
                        <span class="pr-3" v-for="(value, key) in user_groups" :key="key">
                            <v-checkbox
                                    v-model="group.user_groups"
                                    :label="value.name"
                                    :value="value._id"
                            ></v-checkbox>
                        </span>
                    </v-layout>

                    <div v-if="group.signup && group.user_groups.length">
                        <span>Default User Group</span>
                        <v-radio-group v-model="group.default_user_group">
                            <v-layout row wrap>
                                <span v-for="(value, key) in user_groups" :key="key">
                                    <v-radio
                                            class="pr-3"
                                            v-if="group.user_groups.indexOf(value._id) !== -1"
                                            :label="value.name"
                                            :value="value._id"
                                    ></v-radio>
                                </span>
                            </v-layout>
                        </v-radio-group>
                    </div>

                    <v-divider></v-divider>

                    <v-btn
                            class="ml-0"
                            @click="update_client_group()"
                            :disabled="!valid"
                            color="primary"
                    >{{group._id ? 'Update' : 'Add'}}</v-btn>

                    <v-btn @click="dialog = false" color="error">Cancel</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
	import Vue from "vue";
	import { vm } from "@/main";

	import ApiService from "@/common/api.service";

	export default {
		data() {
			return {
				valid: false,
				dialog: false,
				user_groups: [],
				group: {
					name: "",
					acronym: "",
					timeout: 60,
					user_groups: [],
					default_user_group: null,
					signup: true, // 1 - Show in Signup page, 0 - Hide
					status: true // 1 - Active, 0 - Inactive
				}
			};
		},
		watch: {
			"group.user_groups": function(val) {
				if (val.indexOf(this.group.default_user_group) === -1) {
					this.group.default_user_group = val[0];
				}
			}
		},
		methods: {
			isNumber: function(evt) {
				evt = evt ? evt : window.event;
				var charCode = evt.which ? evt.which : evt.keyCode;
				if (
					charCode > 31 &&
					(charCode < 48 || charCode > 57) &&
					charCode != 9
				) {
					evt.preventDefault();
				} else {
					return true;
				}
			},
			openDialog() {
				this.dialog = true;
			},
			update_client_group() {
				if (this.valid) {
					this.dialog = false;
					if (this.group._id) {
						ApiService.put("client_group", {
							...this.group
						}).then(response => {
							vm.$emit("FetchPageData");
						});
					} else {
						ApiService.post("client_group", {
							...this.group
						}).then(response => {
							vm.$emit("FetchPageData");
						});
					}
					this.reset_group_data();
				}
			},
			reset_group_data() {
				this.group = {
					name: "",
					acronym: "",
					timeout: 60,
					user_groups: [],
					default_user_group: null,
					signup: true, // 1 - Active, 0 - Inactive
					status: true // 1 - Active, 0 - Inactive
				};
			}
		}
	};
</script>


<style>
    @import "./UserGroupDialogBox.css";
</style>
