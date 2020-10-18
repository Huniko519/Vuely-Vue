<template>
    <div>
        <v-container fluid grid-list-xl class="client-section">
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <div class="pa-3 text-right">
                    <v-btn class="client-btn" fab small color="primary" @click="onClientDialog()">
                        <v-icon dark>add</v-icon>
                    </v-btn>
                    <!-- Dialog Model For Client -->
                    <client-dialogBox ref="ClientDialog"></client-dialogBox>
                </div>

                <standard-table :columns="columns" :rows="clients"></standard-table>
            </app-card>
        </v-container>
    </div>
</template>

<script>
	import Vue from "vue";
	import ApiService from "@/common/api.service";
	import standardTable from "../../components/table/standard";
	import clientDialogBox from "../../components/DialogBox/ClientDialogBox";

	export default {
		data() {
			return {
				addcli: false,
				clients: [],
				columns: [
					{
						label: "Name",
						field: "name"
					},
					{
						label: "Contact",
						field: "contact"
					}
				]
			};
		},
		components: {
			"standard-table": standardTable,
			"client-dialogBox": clientDialogBox
		},
		mounted() {
			let message = {
				message: { clients: "asd" }
			};
			this.getClientsData();
		},
		methods: {
			getClientsData() {
				const self = this;
				ApiService.post("/getClientsData").then(response => {
					var cliData = [];
					response.map(function(item) {
						var temp_data = {
							name: item.name,
							contact: item.contact_info[0].contact
						};
						cliData.push(temp_data);
					});
					self.clients = cliData;
				});
			},
			onClientDialog() {
				this.$refs.ClientDialog.openDialog();
			}
		}
	};
</script>

<style>
    @import "./Clients.css";
</style>

