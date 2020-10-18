<template>
    <div>
        <v-card-title class="pl-0 pt-0" v-if="searchEnable !== false">
            <v-text-field
                    append-icon="search"
                    hide-details
                    label="Search"
                    single-line
                    v-model="search"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
                disable-initial-sort
                v-bind:headers="columns"
                v-bind:items="rows"
                v-bind:search="search"
        >
            <v-progress-linear color="primary" indeterminate v-slot:progress></v-progress-linear>
            <template slot="items" slot-scope="props">
                <td
                        :class="column.class + ' cursor-pointer'"
                        :key="index"
                        @click="onRowClick(props.item,column.value)"
                        v-for="(column, index) in columns"
                >
                    <!-- Start: This section is added for : User Over View | User Groups -->
                    <span
                            v-if="column.value === 'status' &&
                        type == 'clients' &&
                        props.item.activator &&
                        props.item.activator.status
                        "
                    >Pending</span>
                    <span
                            v-else-if="
                            column.value === 'status' &&
                            type == 'clients' && !isAdmin() &&
                            hasAccess('user', 'change_user_status') &&
                            !(getAuthUserGroup('_id') === props.item.user_group_id && getAuthUser('_id') === props.item.user_id)"
                    >
                        <v-switch
                                @change="change_user_group_access_status(props.item)"
                                color="primary"
                                v-model="props.item[column.value]"
                        ></v-switch>
                    </span>
                    <span
                            v-else-if="(column.value === 'status' &&
                        type == 'clients' && !isAdmin()) || (props.item[column.value] === true || props.item[column.value] === false)"
                    >{{props.item[column.value] ? 'Active' : 'Inactive'}}</span>
                    <!-- END: This section is added for : User Over View | User Groups -->
                    <span v-else-if="(column.value === 'form-button' && isAdmin())">
                         <v-menu ma-0 offset-y pa-0 style="max-height:300px;">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                      icon v-on="on"
                              >
                                <v-icon>zmdi zmdi-more-vert</v-icon>
                              </v-btn>
                            </template>

                            <v-list color="primary" style="max-height:300px;">
                              <v-list-tile
                                      :key="i"
                                      v-for="(item, i) in menu_actions"
                              >
                                <v-list-tile-title @click="form_fx(item.key,props.item)" class="cursor-pointer">{{ item.value }}</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                    </span>
                    <span
                            v-else
                    >{{ column.formatFn ? column.formatFn(props.item, column.value): props.item[column.value] }}</span>
                </td>
            </template>
        </v-data-table>

        <!-- Contact : Dialog Model -->
        <ContactShowBox :info="info" ref="ContactShow"/>
        <!-- custom form for preview-->
        <CustomFormBox action="preview" ref="CustomForm"></CustomFormBox>
    </div>
</template>

<script>
	import ApiService from "@/common/api.service";
	import ContactShowBox from "@/components/DialogBox/ContactShowBox";

	const CustomFormBox = () =>
		import("@/components/DialogBox/CustomFormBox");
	export default {
		name: "DataTable",
		props: {
			columns: Array,
			rows: Array,
			type: String,
			searchEnable: { Type: Boolean, default: true }
		},
		components: {
			ContactShowBox,
			CustomFormBox
		},
		data() {
			return {
				search: "",
				info: [],
				menu_actions: [
					{ key: 'edit', value: 'Edit' },
					{ key: 'copy', value: 'Duplicate' }
				]
			};
		},
		mounted() {
		},
		methods: {
			change_user_group_access_status( data ) {
				ApiService.put( "change_user_group_access_status", {
					client: data.client_id,
					user: data.user_id,
					user_group: data.user_group_id
				} );
			},
			onRowClick( params, column ) {
				if ( this.type === "contacts" && params.entity_type !== "client" ) {
					this.info = params;
					this.$refs.ContactShow.openDialog();
					return false;
				}
				if ( this.type == "clients" && !this.isAdmin() ) return false;

				if ( this.type == 'forms' ) {
					if ( [ 'form_name', 'form_custom_id', 'version', 'updatedAt', 'status' ].indexOf( column ) != -1 ) {
						this.$refs.CustomForm.openDialog( params, undefined, 'preview' )
					}
					return false;
				}
				if ( ['preview','components'].includes(this.type) )
					return false
				this.$router.push( "/" + this.type + "/" + params._id );
			},
			form_fx( params, item ) {
				this.$emit( 'form_fx', params, item );
			}
		}
	};
</script>
