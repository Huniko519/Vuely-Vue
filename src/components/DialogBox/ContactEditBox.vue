<template>
    <!-- Dialog Model For Contact -->
    <v-dialog v-model="editcontact" scrollable max-width="700px" class="contact-dialog-box">
        <v-card>
            <v-card-title class="contact-card-header dialog-header">
                <h2 class="px-3 mb-0">Edit {{contact.first_name||provider.first_name}} contact</h2>
                <span class="close-model text-right">
                    <v-icon dark @click.stop="editcontact = false">close</v-icon>
                </span>
            </v-card-title>
            <v-divider class="ma-0 pa-0"></v-divider>
            <v-card-text class="pb-0">
                <v-container grid-list-md pt-0 pb-0>
                    <v-tabs v-model="tab" class="mb-4">
                        <v-tab key="#tab-provider" href="#tab-provider" v-if="toShow">
                            Provider
                        </v-tab>
                        <v-tab key="#tab-general" href="#tab-general" v-else>General
                        </v-tab>
                        <v-tab-item key="tab-general" value="tab-general">
                            <v-card flat tile>
                                <v-card-text>
                                    <v-form v-model="valid" class="pb-0 mb-0" ref="contact_form">
                                        <v-layout wrap>
                                            <v-flex xs12 sm12 xl12 lg12 md12 class="col-height-auto pb-0">
                                                <v-layout wrap>
                                                    <v-flex>
                                                        <v-text-field
                                                                prepend-icon="zmdi-account"
                                                                v-model="contact.first_name"
                                                                :rules="[v => !!v || 'First name is required']"
                                                                required
                                                        >
                                                            <template slot="label">
                                                                First name
                                                                <span class="required">*</span>
                                                            </template>
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex v-if="contact.type!=='client'">
                                                        <v-text-field
                                                                label="Middle name"
                                                                v-model="contact.middle_name"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex>
                                                        <v-text-field v-model="contact.last_name">
                                                            <template slot="label">Last name</template>
                                                        </v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row wrap v-if="contact.type!=='client'">
                                                    <v-flex xs12 sm6 md6>
                                                        <v-text-field
                                                                prepend-icon="zmdi-assignment-account"
                                                                v-model="contact.prefix"
                                                                label="Prefix"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6 md6>
                                                        <v-text-field label="Suffix"
                                                                      v-model="contact.suffix"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap v-if="contact.type==='patient'">
                                            <v-flex xs12>
                                                <div>
                                                    <v-icon
                                                            dark
                                                            class="v-input__prepend-outer v-input__icon v-input__icon--prepend"
                                                    >
                                                        zmdi
                                                        zmdi-male-female
                                                    </v-icon>
                                                    This person is a/the
                                                    <v-select
                                                            class="d-inline-block pt-2"
                                                            :items="relationship"
                                                            label="Relationship"
                                                            single-line
                                                            v-model="contact.relationship"
                                                            :rules="[(v) => !!v || 'Relationship is required']"
                                                            required
                                                    ></v-select>
                                                    of the {{contact.name}}
                                                    <span class="required">*</span>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap pos-relative>
                                            <v-flex xs12 sm6 md6>
                                                <v-text-field
                                                        slot="activator"
                                                        v-model="contact.date_of_birth"
                                                        label="Date of birth"
                                                        prepend-icon="event"
                                                        v-on:focus="activeDatepicker()"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md6>
                                                <v-select
                                                        :items="['Male', 'Female']"
                                                        label="Gender"
                                                        v-model="contact.gender"
                                                ></v-select>
                                            </v-flex>
                                            <v-date-picker
                                                    v-model="contact.date_of_birth"
                                                    v-show="calendar"
                                                    no-title
                                                    scrollable
                                                    class="pos-absolute zindex-1 top-5"
                                            >
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="calendar = false">Cancel</v-btn>
                                                <v-btn flat color="primary" @click="calendar = false">OK</v-btn>
                                            </v-date-picker>
                                        </v-layout>

                                        <v-layout row wrap>
                                            <v-flex xs12 sm6 md6>
                                                <v-text-field
                                                        class="pa-0"
                                                        prepend-icon="phone"
                                                        label="Phone"
                                                        v-model="contact.contact"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md6>
                                                <v-select
                                                        class="pa-0"
                                                        :items="['Mobile', 'Work','Home']"
                                                        label="Phone type"
                                                        v-model="contact.contact_type"
                                                        persistent-hint
                                                ></v-select>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap>
                                            <v-flex>
                                                <v-text-field
                                                        prepend-icon="email"
                                                        type="email"
                                                        :rules="emailRules"
                                                        label="Email address"
                                                        v-model="contact.email"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 md4 sm4 v-if="contact.type==='patient'">
                                                <v-text-field label="Priority"
                                                              v-model="contact.priority"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap>
                                            <v-flex>
                                                <v-text-field
                                                        prepend-icon="zmdi zmdi-accounts-list-alt"
                                                        label="Title"
                                                        v-model="contact.title"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 md4 sm4 v-if="contact.type==='patient'">
                                                <v-text-field label="Company" v-model="contact.company"></v-text-field>
                                            </v-flex>
                                        </v-layout>

                                    </v-form>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="tab-provider" value="tab-provider">
                            <v-card flat tile>
                                <v-card-text>
                                    <v-form v-model="valid_provider" class="pb-0 mb-0" ref="contact_form">
                                        <v-layout wrap>
                                            <v-flex xs12 sm12 xl12 lg12 md12 class="col-height-auto pb-0">
                                                <v-layout wrap>
                                                    <v-flex>
                                                        <v-text-field
                                                                prepend-icon="zmdi-account"
                                                                v-model="provider.npi"
                                                                :rules="[v => !!v || 'NPI is required']"
                                                                required
                                                                disabled
                                                        >
                                                            <template slot="label">
                                                                NPI
                                                                <span class="required">*</span>
                                                            </template>
                                                        </v-text-field>
                                                    </v-flex>

                                                    <v-flex>
                                                        <v-text-field v-model="provider.first_name"
                                                                      :rules="[v => !!v || 'Name is required']"
                                                                      required>
                                                            <template slot="label">First Name <span class="required">*</span>
                                                            </template>
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex>
                                                        <v-text-field v-model="provider.last_name"
                                                                      :rules="[v => !!v || 'Name is required']"
                                                                      required>
                                                            <template slot="label">Last Name <span class="required">*</span>
                                                            </template>
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex>
                                                        <v-text-field v-model="provider.npi_type">
                                                            <template slot="label">NPI Type</template>
                                                        </v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap>
                                            <v-flex>
                                                <v-text-field
                                                        prepend-icon="zmdi zmdi-accounts-list-alt"
                                                        label="Primary Practise Address"
                                                        v-model="provider.address"
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm6 md6>
                                                <v-text-field
                                                        class="pa-0"
                                                        prepend-icon="phone"
                                                        label="Phone"
                                                        v-model.number="provider.contact"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md6>
                                                <v-select
                                                        class="pa-0"
                                                        :items="['Mobile', 'Work','Home']"
                                                        label="Phone type"
                                                        v-model="provider.contact_type"
                                                        persistent-hint
                                                ></v-select>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap>
                                            <v-flex>
                                                <v-text-field
                                                        prepend-icon="zmdi zmdi-accounts-list-alt"
                                                        label="Primary Taxonomy"
                                                        v-model="provider.primary_taxonomy"
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-form>

                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>

                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="text-md-right">
                <v-btn class="float-right" flat @click.native="editcontact = false">CANCEL</v-btn>
                <v-btn flat color="success" :disabled="!(valid||valid_provider)" @click.native="edit_contact()">Save
                </v-btn>
                <v-btn flat color="warning" @click="removeContact(contact._id||provider._id)">Remove</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
	import ApiService from "@/common/api.service";
	import {vm} from "../../main";
	
	export default {
		data() {
			return {
				tab: null,
				editcontact: false,
				valid: false,
				valid_provider: false,
				calendar: false,
				btnSaveDisable: true,
				nameLastRules: [v => !!v || "Last Name is required"],
				emailRules: [
					v =>
						!v ||
						/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
							v
						) ||
						"E-mail must be valid"
				],
				nameFirstRules: [v => !!v || "First Name is required"],
				relationship: [
					"Grandfather",
					"Grandmother",
					"Father",
					"Mother",
					"Brother",
					"Sister",
					"Son",
					"Daughter",
					"Aunt",
					"Uncle",
					"Cousin",
					"Friend"
				],
				contact: {contact_class: 'general'},
				provider: {},
				toShow: false

			};
		},
		methods: {
			openDialog(contact) {
				this.toShow = (contact.contact_class == 'provider')
				contact.contact_type = ['Mobile', 'Work', 'Home'][contact.contact_type];
				if (contact.contact_class !== 'provider')
					this.contact = contact
				else
					this.provider = contact
				this.editcontact = true;
			},
			activeDatepicker() {
				this.calendar = !this.calendar;
			},
			edit_contact() {
				if (this.valid || this.valid_provider) {
					ApiService.post("edit_contact", {
						contact: this.contact,
						provider: this.provider,
						type: this.tab,
					}).then(response => {
						vm.$emit("FetchPageData");
						this.editcontact = false;
						this.$emit('closeDialog');

					});
				}
			},
			removeContact(contact_id) {
				if (confirm("Are you sure you want to remove this contact?")) {
					ApiService.post("remove_contact", {
						contact_id: contact_id
					}).then(response => {
						this.editcontact = false;
						this.$emit('closeDialog');
						vm.$emit("FetchPageData");
					});
				}
			}
		}
	};
</script>