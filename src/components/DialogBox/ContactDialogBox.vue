<template>
    <!-- Dialog Model For Contact -->
    <v-dialog v-model="addcontact" scrollable max-width="700px" class="contact-dialog-box">
        <v-card>
            <v-card-title class="contact-card-header dialog-header">
                <h2 class="px-3 mb-0">Add a contact for {{extraInfo.name}}</h2>
                <span class="close-model text-right">
                    <v-icon dark @click.stop="addcontact = false">close</v-icon>
                </span>
            </v-card-title>
            <v-divider class="ma-0 pa-0"></v-divider>
            <v-card-text class="pb-0">
                <v-container grid-list-md pt-0 pb-0>
                    <v-tabs v-model="tab" class="mb-4">
                        <v-tab key="#tab-general" href="#tab-general">General</v-tab>
                        <v-tab key="#tab-provider" href="#tab-provider"
                               v-if="extraInfo.type!=='patient' && hasAccess('contact', 'add_new_provider')">Provider
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
                                                    <v-flex v-if="extraInfo.type!=='client'">
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
                                                <v-layout row wrap v-if="extraInfo.type!=='client'">
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
                                        <v-layout row wrap v-if="extraInfo.type==='patient'">
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
                                                    of the {{extraInfo.name}}
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
                                            <v-flex xs12 md4 sm4 v-if="extraInfo.type==='patient'">
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
                                            <v-flex xs12 md4 sm4 v-if="extraInfo.type==='patient'">
                                                <v-text-field label="Company" v-model="contact.company"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm12 md12>
                                                <v-text-field
                                                        prepend-icon="zmdi-file"
                                                        label="Note"
                                                        v-model="contact.notes[0]"
                                                ></v-text-field>
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
                                                <v-layout row wrap>
                                                    <v-flex xs12 sm12>
                                                        <v-autocomplete
                                                                v-model="provider.npi"
                                                                :items="entries"
                                                                :loading="npiLoading"
                                                                append-icon=""
                                                                :search-input.sync="npiSearch"
                                                                label="NPI Number or Name"
                                                                loader-height="10"
                                                                no-filter
                                                                hide-no-data
                                                                hide-selected
                                                                dense
                                                                :menu-props="{ auto: true,  width: 100  }"
                                                                clearable
                                                                :rules="[v => !!v || 'NPI Number or Name is required']"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                        v-bind="data.attrs"
                                                                        :input-value="data.selected"
                                                                        color="primary"
                                                                        text-color="white"
                                                                >
                                                                    {{ data.item.value }}
                                                                </v-chip>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout wrap>
                                                    <v-flex>
                                                        <v-text-field v-model="provider.first_name"
                                                                      :rules="[v => !!v || 'Name is required']"
                                                                      required>
                                                            <template slot="label">First Name <span
                                                                    class="required">*</span>
                                                            </template>
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex>
                                                        <v-text-field v-model="provider.last_name"
                                                                      :rules="[v => !!v || 'Name is required']"
                                                                      required>
                                                            <template slot="label">Last Name <span
                                                                    class="required">*</span>
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
                                                        v-model="contact.contact_type"
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
                <v-btn class="float-right" flat @click.native="addcontact = false">CANCEL</v-btn>
                <v-btn flat color="success" :disabled="!(valid||valid_provider)" @click.native="store_contact()">Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import ApiService from "@/common/api.service";
    import {vm} from "../../main";

    export default {
        props: {
            action: String,
            extraInfo: Object
        },
        data() {
            return {
                npi_records: [],
                tab: null,
                entries: [],
                npiLoading: false,
                addcontact: false,
                npiSearch: null,
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
                contact: {
                    notes: []
                },
                provider: {}
            };
        },
        computed: {
            items() {
                return this.entries.map(entry => {
                    let Description = entry.join(',')
                    return Object.assign({}, {NPI: entry[1]}, {id: entry[1], Description})
                })
            },
        },
        watch: {
            npiSearch(val) {
                val && val !== this.select && this.querySelections(val)
            },
            'provider.npi': function (val) {
                let npi_item = this.npi_records.filter(item => item[1] == val)
                if (npi_item.length > 0) {
                    this.provider.first_name = npi_item[0][0].split(', ')[1]
                    this.provider.last_name = npi_item[0][0].split(', ')[0]
                    this.provider.address = npi_item[0][3]
                    this.provider.primary_taxonomy = npi_item[0][2]
                }
            }
        },
        methods: {
            querySelections(val) {
                this.isLoading = true
                // Lazily load input items
                fetch('https://clinicaltables.nlm.nih.gov/api/npi_idv/v3/search?terms='+val)
                    .then(res => res.json())
                    .then(res => {
                        let result = res
                        this.npi_records = result[3]
                        this.entries = result[3].map(entry => {
                            let Description = entry.join(',')
                            return  {'text': Description, 'value':entry[1]}
                        });
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.isLoading = false))
            },
            openDialog() {
                this.addcontact = true;
            },
            activeDatepicker() {
                this.calendar = !this.calendar;
            },
            store_contact() {
                if (this.valid || this.valid_provider) {
                    ApiService.post("store_contact", {
                        contact: this.contact,
                        provider: this.provider,
                        type: this.tab,
                        extraInfo: {
                            type: this.extraInfo.type,
                            id: this.extraInfo.id
                        }
                    }).then(response => {
                        vm.$emit("FetchPageData");
                        this.$refs.contact_form.reset();
                        this.addcontact = false;
                    });
                }
            }
        }
    };
</script>
<style>
    .v-select__slot:nth-child(1) .v-input__append-inner.v-input__icon--clear  i
    {
        cursor: pointer;
    }
</style>