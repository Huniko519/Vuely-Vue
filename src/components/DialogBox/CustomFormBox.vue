<template>
    <v-container>
        <v-dialog v-model="form_show" fullscreen scrollable class="location-dialog-box">

            <v-card>
                <v-toolbar dark color="primary">
                    <v-toolbar-title>{{form.form_name}} <span v-if="action==='preview'">({{action}})</span>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-icon dark @click.stop="hide_form()">close</v-icon>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text style="flex-grow: 1">
                    <v-form
                            ref="form"
                            lazy-validation
                    >
                        <v-layout row wrap v-for="form in form.structure" :key="form.key">
                            <h4 class="xs12">{{form.section}}</h4>
                            <v-layout row wrap class="w-100 ">
                                <div class="flex" v-for="item in form.elements" :key="item.key" :class="item.class">
                                    <component :is="item.component_type"
                                               :label="item.label+(item.required?'*':'')"
                                               :name="item.key"
                                               :items="item.items?item.items:null"
                                               :type="item.input_type"
                                               v-model="p_form[item.name]"
                                               class="px-1"
                                               :required="item.required"
                                               :rules="item.required?[rules.required]:[]"
                                               :hint="item.required?'Required':''"
                                               v-on:focus="item.slot_type?activePicker(item.slot_type,item.name):null"
                                               :readonly="!!item.slot_type"
                                    ></component>
                                    <div class="pos-absolute zindex-1" v-if="item.slot_type==='calendar'">
                                        <v-date-picker
                                                v-model="p_form[item.name]"
                                                v-show="calendar[item.name]"
                                                no-title
                                                scrollable
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="calendar[item.name] = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="calendar[item.name] = false">OK</v-btn>
                                        </v-date-picker>
                                    </div>
                                    <div class="pos-absolute zindex-1" v-else-if="item.slot_type==='time'">
                                        <v-time-picker
                                                v-model="p_form[item.name]"
                                                v-show="time[item.name]"
                                                class="mt-2"
                                                no-title
                                                scrollable
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="time[item.name] = false">Cancel</v-btn>
                                            <v-btn flat color="primary" @click="time[item.name] = false">OK</v-btn>
                                        </v-time-picker>
                                    </div>

                                </div>
                            </v-layout>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions style="max-height: 4em">
                    <v-layout row wrap>
                        <v-flex xs12 sm12 md2>
                            <v-btn outline
                                   flat
                                   color="success"
                                   @click.native="hide_form()"
                            >Cancel
                            </v-btn>
                        </v-flex>
                        <v-layout row wrap v-if="action!=='preview'">
                            <v-flex xs12 sm12 md2 v-if="open_type=='add'">
                                <v-btn
                                        flat :disabled="change_detected!=2"
                                        color="success"
                                        @click.native="submit_form('draft')"
                                >Save
                                </v-btn>
                            </v-flex>
                            <v-flex xs12 sm12 md2 v-if="open_type=='add'">
                                <v-btn
                                        flat :disabled="change_detected!=2"
                                        color="success"
                                        @click.native="submit_form('save')"
                                >Submit
                                </v-btn>
                            </v-flex>
                            <v-flex xs12 sm12 md2
                                    v-if="['save','draft'].indexOf(p_form.save_type)>=0 && getAuthUser('_id')===p_form.user_id">
                                <v-btn
                                        flat :disabled="change_detected!=2"
                                        color="success" v-if="form.status===1"
                                        @click.native="update_form('draft')"
                                >Update as draft
                                </v-btn>
                            </v-flex>
                            <v-flex xs12 sm12 md2
                                    v-if="['save','draft'].indexOf(p_form.save_type)>=0 && getAuthUser('_id')===p_form.user_id">
                                <v-btn
                                        flat :disabled="change_detected!=2"
                                        color="success" v-if="form.status===1"
                                        @click.native="update_form('save')"
                                >Update Form
                                </v-btn>
                            </v-flex>
                            <v-flex  xs12 sm12 md3 class="align-items-center ml-auto">
                                {{show_last_updated(p_form)}}
                            </v-flex>
                        </v-layout>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
	import ApiService from "@/common/api.service";

	export default {
		props: {extraInfo: Object, action: String},
		data() {
			return {
				open_type: '',
				form_show: false,
				form: {},
				p_form: {},
				tmp_form: {},
				calendar: {},
				time: {},
				valid: true,
				save_type: '',
				change_detected: 0,
				rules: {
					required: v => !!v || 'Required'
				}
			}
		},
		watch: {
			p_form: {
				handler: function (newval, oldval) {
					if (this.change_detected > 0) {
						var flag = 0
						for (let form in this.form.structure) {
							for (let item in this.form.structure[form]['elements']) {
								let term = this.form.structure[form]['elements'][item]['name']
								if (newval[term] != undefined &&
									newval[term] != '' && (this.tmp_form[term] == undefined || this.tmp_form[term] != newval[term])) {

									this.change_detected = 2;
									flag = 1;
								}
							}
						}
						if (flag == 0) {
							this.change_detected = 1

						}
					}
				}, deep: true
			},
			form_show: function (newval, oldval) {
				if (newval == true) {
					this.tmp_form = JSON.parse(JSON.stringify(this.p_form));
					// console.log(this.p_form,this.tmp_form)
					this.change_detected = 1;
				} else {
					this.change_detected = 0;
				}
			}
		},
		methods: {
			openDialog(item, data, type) {
				this.open_type = type;
				this.form = item;
				this.p_form = data || {};
				if (data != undefined) {
					this.save_type = 'update'
				} else if (this.action == 'preview') {

				} else {
					this.p_form.form_name = item.form_name;
					this.p_form.form_icon = item.icon;
					this.p_form.form_id = item._id;
					this.p_form.patient_id = this.extraInfo.id;
				}
				this.form_show = true;
				this.change_detected = 1;
			},
			submit_form(type) {
				this.p_form.save_type = type;
				if (this.$refs.form.validate()) {
					ApiService.post("/store_patient_form", {form: this.p_form})
						.then(
							response => {
								if (response.code == 1) {
									this.p_form = {};
									this.form_show = false
								}
							}
						);
				}
			},
			update_form(save_type) {
				this.p_form.save_type = save_type;
				if (this.$refs.form.validate()) {
					ApiService.put("/update_patient_form", {form: this.p_form})
						.then(
							response => {
								if (response.code == 1) {
									this.p_form = {};
									this.form_show = false
								}
							}
						);
				}
			},
			activePicker(type, key) {
				if (type === 'calendar') {
					if (this.calendar[key] != undefined)
						this.calendar[key] = !this.calendar[key];
					else
						this.$set(this.calendar, key, true);
				} else if (type === 'time') {
					if (this.time[key] != undefined)
						this.time[key] = !this.time[key];
					else
						this.$set(this.time, key, true);
				}
			},
			hide_form() {
				if (this.change_detected == 2) {
					let confirm_choice = confirm("You have unsaved data. Do you want to continue?");
					if (confirm_choice)
						this.form_show = false
				} else
					this.form_show = false
			},
			show_last_updated(form) {
				if (form.updatedAt != undefined)
					return 'Last Updated on: '+moment.utc(form.updatedAt).fromNow()
			}
		}
	};
</script>
