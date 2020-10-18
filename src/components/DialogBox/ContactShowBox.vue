<template>
    <div>
        <v-dialog v-model="contact_show" max-width="700">
            <v-card>
                <v-card-title
                        class="headline font-weight-bold"
                >{{contact.first_name}} {{contact.last_name}}
                </v-card-title>
                <v-card-text class="pt-0">
                    <p v-if="contact.relationship && contact.entity_type==='patient'">
                        <router-link
                                :to="'/'+contact.entity_type+'s/'+contact.entity_id"
                        >{{contact.contact_user_name}}
                        </router-link>
                        's
                        {{contact.relationship}}
                    </p>
                    <p v-if="contact.entity_type==='location'">
                        <router-link
                                :to="'/'+contact.entity_type+'s/'+contact.entity_id"
                        >{{contact.contact_user_name}}
                        </router-link>
                    </p>
                    <div>
                        <v-layout mb-1>
                            <b>Name:&nbsp;</b>
                            <span v-if="contact.prefix">{{contact.prefix}}</span>
                            <span v-if="contact.first_name">&nbsp;{{contact.first_name}}</span>
                            <span v-if="contact.middle_name">&nbsp;{{contact.middle_name}}</span>
                            <span v-if="contact.last_name">&nbsp;{{contact.last_name}}</span>
                            <span v-if="contact.suffix">&nbsp;{{contact.suffix}}</span>
                        </v-layout>
                        <v-layout row wrap mb-1>
                            <div class="w-50" v-if="contact.npi">
                                <b>NPI:</b>
                                {{contact.npi}}
                            </div>
                            <div class="w-50" v-if="contact.npi_type">
                                <b>NPI Type:&nbsp;</b>
                                {{contact.npi_type}}
                            </div>
                        </v-layout>
                        <v-layout row wrap mb-1>
                            <div class="w-50" v-if="contact.address">
                                <b>Primary Practise Address:</b>
                                {{contact.address}}
                            </div>
                        </v-layout>
                        <v-layout row wrap mb-1>
                            <div class="w-50" v-if="contact.primary_taxonomy">
                                <b>Primary Taxonomy:</b>
                                {{contact.primary_taxonomy}}
                            </div>
                        </v-layout>
                        <v-layout row wrap mb-1>
                            <div class="w-50" v-if="contact.date_of_birth">
                                <b>DoB:</b>
                                {{contact.date_of_birth}}
                            </div>
                            <div class="w-50" v-if="contact.gender">
                                <b>Gender:&nbsp;</b>
                                {{contact.gender}}
                            </div>
                        </v-layout>
                        <v-layout row wrap mb-1>
                            <div class="w-50" v-if="contact.contact">
                                <b>Contact:&nbsp;</b>
                                {{contact.contact}}
                            </div>
                            <div class="w-50" v-if="contact.contact_type">
                                <b>Contact Type:&nbsp;</b>
                                {{phone_type[contact.contact_type]}}
                            </div>
                        </v-layout>
                        <v-layout row wrap mb-1>
                            <div class="w-50" v-if="contact.email">
                                <b>Email:&nbsp;</b>
                                {{contact.email}}
                            </div>
                            <div class="w-50" v-if="contact.priority">
                                <b>Priority:&nbsp;</b>
                                {{contact.priority}}
                            </div>
                        </v-layout>
                        <v-layout row wrap mb-1>
                            <div class="w-50" v-if="contact.title">
                                <b>Title:&nbsp;</b>
                                {{contact.title}}
                            </div>
                            <div class="w-50" v-if="contact.company">
                                <b>Company:&nbsp;</b>
                                {{contact.company}}
                            </div>
                        </v-layout>
                        <v-layout row wrap mb-1 v-if="contact.note">
                            <div class="w-100 d-custom-flex">
                                <b>Note:&nbsp;</b>
                                <ol class="d-inline-block">
                                    <li v-for="item in contact.notes">{{item}}</li>
                                </ol>
                            </div>
                        </v-layout>
                        <v-layout row wrap mb-1>
                            <div class="w-50" v-if="contact.createdAt">
                                <b>Created:&nbsp;</b>
                                {{dateOutputFormat(contact.createdAt)}}
                            </div>
                            <div class="w-50" v-if="contact.updatedAt">
                                <b>Updated:&nbsp;</b>
                                {{dateOutputFormat(contact.updatedAt)}}
                            </div>
                        </v-layout>
                    </div>
                    <div v-if="contact.activity!=undefined && contact.activity.length>0">
                        <p class="font-weight-bold">Activity Log:</p>
                        <Timeline :items="contact.activity" :entityId="contact._id" :noComment="1"></Timeline>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="contact_show = false">Close</v-btn>
                    <v-btn
                            v-if="!isAdmin() && hasAccess('contact', 'update_contact_info')"
                            color="error"
                            @click="editContact(contact._id)"
                    >Edit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <contactEditBox ref="contactEdit" @closeDialog="closeDialog"></contactEditBox>
    </div>
</template>
<script>
	import Timeline from "../timeline/timeline";
	import moment from "moment";
	import contactEditBox from "@/components/DialogBox/ContactEditBox";

	export default {
		props: ["info"],
		components: {
			Timeline: Timeline,
			contactEditBox: contactEditBox
		},
		data() {
			return {
				contact_show: false,
				contact: [],
				phone_type: ["Mobile", "Work", "Home"]
			};
		},
		watch: {
			info: {
				handler: function (val, oldVal) {
					this.contact = val;
				},
				deep: true
			}
		},
		methods: {
			openDialog() {
				this.contact_show = true;
			},
			closeDialog() {
				this.contact_show = false
			},
			dateOutputFormat: function (value) {
				return moment.utc(value).fromNow();
			},
			editContact(contact_id) {
				this.$refs.contactEdit.openDialog(this.contact);
			},

		}
	};
</script>