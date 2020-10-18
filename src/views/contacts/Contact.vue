<template>
    <div>
        <v-container fluid grid-list-xl class="contact-section">
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <!--
                <div class="pa-3 text-right">
                   
                    <v-btn
                        v-if="hasAccess('contact', 'add_new_contact')"
                        class="contact-btn"
                        fab
                        small
                        color="primary"
                        @click.native="add_contact"
                    >
                        <v-icon dark>add</v-icon>
                    </v-btn>
                   
                </div>
                -->

                <standard-table class="mt-5" :columns="columns" :rows="contacts" type="contacts"></standard-table>
                <v-btn
                    v-if="!isAdmin() && hasAccess('contact', 'add_new_contact')"
                    fab
                    fixed
                    bottom
                    right
                    color="primary"
                    @click="add_contact()"
                >
                    <v-icon dark>add</v-icon>
                </v-btn>
            </app-card>
        </v-container>
        <div v-if="!isAdmin()">
            <contact-dialogBox ref="ContactDialog" action="add" :extraInfo="selectedUser"></contact-dialogBox>
        </div>
    </div>
</template>

<script>
import ApiService from "@/common/api.service";
import standardTable from "../../components/table/standard";
import Vue from "vue";
import { vm } from "../../main";
import contactDialogBox from "../../components/DialogBox/ContactDialogBox";

export default {
    data() {
        return {
            contacts: [],
            columns: [
                {
                    label: "Name",
                    field: this.fullname
                },
                {
                    label: "Phone",
                    field: "contact"
                },
                {
                    label: "Reference",
                    field: this.contact_name,
                    tdClass: "cursor-pointer"
                },
                {
                    label: "Rel / Title",
                    field: this.relOrtitle
                },
	            {
		            label: "Type",
		            field: "type"
	            }
            ],
            selectedUser: {
                type: "client",
                id: this.getAuthClient("_id"),
                name: this.getAuthClient("name")
            }
        };
    },
    components: {
        "standard-table": standardTable,
        "contact-dialogBox": contactDialogBox
    },
    created() {
        vm.$on("FetchPageData", this.getContactData);
    },
    beforeDestroy() {
        vm.$off("FetchPageData", this.getContactData);
    },
    mounted() {
        this.getContactData();
    },
    methods: {
        contact_name(rowwObj) {
            if (rowwObj.entity_type !== "client")
                return rowwObj.contact_user_name;
            else return "";
        },
        fullname(rowObj) {
            return rowObj.first_name + " " + rowObj.last_name;
        },
        relOrtitle(rowObj) {
            return rowObj.relationship || rowObj.title;
        },
        add_contact() {
            this.$refs.ContactDialog.openDialog();
        },
        getContactData() {
            ApiService.get("fetch_contacts").then(response => {
                this.contacts = response.contacts;
            });
        }
    }
};
</script>

<style>
@import "./Contact.css";
</style>

