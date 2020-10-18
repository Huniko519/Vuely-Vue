<template>
    <v-dialog v-model="dialog" scrollable max-width="800">
        <v-card>
            <v-card-title>
                <h4 class="pa-0 ma-0 w-100">
                    User Group Information
                    <span class="close-model">
                        <v-icon dark @click.stop="dialog = false">close</v-icon>
                    </span>
                </h4>
            </v-card-title>

            <v-divider class="ma-0"></v-divider>

            <v-card-text>
                <v-form v-model="valid" class="mb-4 mt-0">
                    <h4 class="mt-1 pb-0 mb-0">Admin</h4>
                    <v-layout>
                        <v-flex xs12 md4 mr-1>
                            <v-text-field
                                class="reqField"
                                label="Name"
                                v-model="group.name"
                                :rules="[v => !!v || 'Name is required']"
                                required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4 mr-1>
                            <v-text-field
                                class="reqField"
                                label="Acronym"
                                v-model="group.acronym"
                                :rules="[v => !!v || 'Acronym is required']"
                                required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4>
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

                    <v-checkbox v-model="group.status" label="Status"></v-checkbox>

                    <h4 class="mt-1 pb-0 mb-0">User View</h4>
                    <v-layout>
                        <v-flex xs12 md4 mr-1>
                            <v-text-field
                                class="reqField"
                                label="Title"
                                v-model="group.user_title"
                                :rules="[v => !!v || 'Title is required']"
                                required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4 mr-1>
                            <v-text-field
                                class="reqField"
                                label="Acronym"
                                v-model="group.user_acronym"
                                :rules="[v => !!v || 'Acronym is required']"
                                required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                    <h4 class="mt-1 pb-1">Modules Access</h4>

                    <v-tabs class="mb-3" v-model="activeTab" color="#dedede">
                        <v-tab key="main" ripple>Main</v-tab>
                        <v-tab key="patient" ripple>Patient</v-tab>

                        <v-tab-item class="custom-v-tab" key="general">
                            <v-card flat>
                                <v-card-text>
                                    <div v-for="item in items" :key="item.name">
                                        <h4 class="pl-1 mb-0">
                                            <i :class="[{ zmdi: true }, 'zmdi-' + item.icon]"></i>
                                            {{$t(item.name)}}
                                        </h4>

                                        <v-layout row wrap>
                                            <v-flex
                                                ml-0
                                                pl-0
                                                xs12
                                                md4
                                                v-for="children in item.children"
                                                :key="children.key"
                                            >
                                                <v-checkbox
                                                    v-model="group.modules_access[children.module][children.key]"
                                                    :label="$t('message[\'' + children.key + '\']')"
                                                ></v-checkbox>
                                            </v-flex>
                                        </v-layout>
                                        <hr />
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item class="custom-v-tab" key="patient-forms">
                            <v-card flat>
                                <v-card-text>
                                    <v-checkbox
                                        v-for="(form,key) in group.patient"
                                        v-if="form.build_status===1"
                                        :label="form.form_custom_id+': '+form.form_name"
                                        :key="key"
                                        v-model="group.patient[key]['status']"
                                    ></v-checkbox>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>

                    <v-btn
                        class="ml-0"
                        @click="update_user_group()"
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
import { vm } from "@/main";

import ApiService from "@/common/api.service";

export default {
    data() {
        return {
            activeTab: 0,
            valid: false,
            dialog: false,
            tree: [],
            open: ["public"],
            icons: {
                client: "accounts",
                user: "accounts-list",
                location: "pin",
                patient: "mood-bad",
                contact: "account",
                vendor: "case"
            },
            group: {
                name: "",
                user_title: "",
                user_acronym: "",
                acronym: "",
                timeout: 60,
                status: true, // 1 - Active, 0 - Inactive
                modules_access: {
                    client: {
                        update_client_info: false
                    },
                    user: {
                        view: true,
                        add_new_user: false,
                        update_user_info: false,
                        delete_user: false,
                        change_user_status: false
                    },
                    location: {
                        view: true,
                        add_new_location: false,
                        update_location_info: false,
                        add_comment: false,
                        delete_location: false
                    },
                    contact: {
                        view: true,
                        add_new_contact: false,
                        add_new_provider: false,
                        update_contact_info: false,
                        add_comment: false,
                        delete_contact: false
                    },
                    vendor: {
                        view: true,
                        add_new_vendor: false,
                        update_vendor_info: false,
                        add_comment: false,
                        delete_vendor: false
                    },
                    patient: {
                        view: true,
                        add_new_patient: false,
                        update_patient_info: false,
                        add_comment: false,
                        delete_patient: false,
                        co_field: false
                    }
                },
                patient: {}
            }
        };
    },
    computed: {
        items() {
            let items = [];
            for (const key of Object.keys(this.group.modules_access)) {
                let item = {
                    name: this.$t("message['" + key + "']"),
                    type: "module",
                    icon: this.icons[key]
                };
                items.push(item);
                item.children = [];
                for (const key2 of Object.keys(
                    this.group.modules_access[key]
                )) {
                    item.children.push({
                        key: key2,
                        name: this.$t("message['" + key2 + "']"),
                        value: this.group.modules_access[key][key2],
                        type: "feature",
                        module: key
                    });
                }
            }
            return items;
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
        update_user_group() {
            if (this.valid) {
                this.dialog = false;
                if (this.group._id) {
                    ApiService.put("user_group", {
                        ...this.group
                    }).then(response => {
                        vm.$emit("FetchPageData");
                    });
                } else {
                    ApiService.post("user_group", {
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
                status: true, // 1 - Active, 0 - Inactive
                modules_access: {
                    client: {
                        update_client_info: false
                    },
                    user: {
                        view: true,
                        add_new_user: false,
                        update_user_info: false,
                        delete_user: false,
                        change_user_status: false
                    },
                    location: {
                        view: true,
                        add_new_location: false,
                        update_location_info: false,
                        add_comment: false,
                        delete_location: false
                    },
                    contact: {
                        view: true,
                        add_new_contact: false,
                        add_new_provider: true,
                        update_contact_info: false,
                        add_comment: false,
                        delete_contact: false
                    },
                    vendor: {
                        view: true,
                        add_new_vendor: false,
                        update_vendor_info: false,
                        add_comment: false,
                        delete_vendor: false
                    },
                    patient: {
                        view: true,
                        add_new_patient: false,
                        update_patient_info: false,
                        add_comment: false,
                        delete_patient: false
                    }
                },
                patient: {
                    rcfe: false
                }
            };
        }
    }
};
</script>


<style scoped>
@import "./UserGroupDialogBox.css";
</style>
