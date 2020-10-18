<template>
    <div>
        <vue-good-table
            :columns="columns"
            :rows="getRows"
            styleClass="vgt-table striped pa-5 v-datatable v-table cursor-pointer"
            :sort-options="{ enabled: true }"
            @on-cell-click="onRowClick"
            :pagination-options="{
                enabled: pagination_enabled,
                mode: 'records',
                perPage: 8,
                position: 'top',
                perPageDropdown: [5, 10, 15],
                dropdownAllowAll: true,
                setCurrentPage: 1,
                nextLabel: '',
                prevLabel: '',
                rowsPerPageLabel: 'Show',
                ofLabel: 'of',
                pageLabel: 'page', // for 'pages' mode
                allLabel: 'All'
            }"
        >
            <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field == 'icon'">
                    <i :class="[{ zmdi: true }, 'zmdi-' + props.row.icon]"></i>
                </span>
                <span v-else-if="props.column.field == 'signup'">
                    <i style="color:green;" v-if="props.row.signup" class="material-icons">check</i>
                </span>
                <span
                    v-else-if="props.column.field == 'status'"
                    :class="(props.row.status ? 'green--text': 'red--text') + ' font-weight-bold'"
                >{{ props.row.status ? 'Active' : 'Inactive' }}</span>
                <span v-else-if="typeof props.column.field === 'function'">
                    {{
                    props.column.field(rows[props.row.originalIndex])
                    }}
                </span>
                <span v-else>{{ props.formattedRow[props.column.field] }}</span>
            </template>
        </vue-good-table>

        <!-- Client Group Dialog -->
        <div v-if="type=='client_groups'">
            <ClientGroupDialogBox ref="ClientGroupDialog" />
        </div>

        <!-- User Group Dialog -->
        <div v-if="type=='user_groups'">
            <UserGroupDialogBox ref="UserGroupDialog" />
        </div>

        <!-- Dialog Model For Patient -->
        <ContactShowBox ref="ContactShow" :info="info"></ContactShowBox>

        <!-- Dialog Model For Patient -->
        <LocationTypeDialogBox ref="LocationTypeDialogBoxRef"></LocationTypeDialogBox>
    </div>
</template>

<script>
import Vue from "vue";
import { vm } from "../../main";
import { mapActions } from "vuex";

import ApiService from "@/common/api.service";
import ContactShowBox from "../../components/DialogBox/ContactShowBox";
import LocationTypeDialogBox from "@/components/DialogBox/LocationTypeDialogBox";

const ClientGroupDialogBox = () =>
    import("@/components/DialogBox/ClientGroupDialogBox");
const UserGroupDialogBox = () =>
    import("@/components/DialogBox/UserGroupDialogBox");

export default {
    name: "standardTable",
    props: ["columns", "rows", "type", "pagination", "user_groups"],
    components: {
        ContactShowBox,
        ClientGroupDialogBox,
        UserGroupDialogBox,
        LocationTypeDialogBox
    },
    data() {
        return {
            group: {},
            location_type: {},
            selectedIndex: null,
            info: []
        };
    },
    computed: {
        pagination_enabled() {
            if (
                this.type === "client_groups" ||
                this.type === "user_groups" ||
                this.type === "location_types"
            ) {
                return false;
            }
            if (this.pagination != undefined) return this.pagination;
            else return true;
        },
        getRows() {
            return this.$props.rows;
        }
    },
    methods: {
        ...mapActions(["getUrl"]),
        onRowClick(params) {
            if (params.column.field === "contact_user_name") {
                this.getUrl({
                    type: params.row.entity_type,
                    id: params.row.entity_id
                });
                return;
            }
            this.selectedIndex = params.pageIndex;
            if (this.type === "client_groups") {
                this.$refs.ClientGroupDialog.user_groups = this.user_groups;
                this.$refs.ClientGroupDialog.group = JSON.parse(
                    JSON.stringify(params.row)
                );
                this.$refs.ClientGroupDialog.openDialog();
                return false;
            } else if (this.type === "user_groups") {
                if (
                    params.row.acronym === "super-user" ||
                    params.row.acronym === "client-super-user"
                )
                    return false;
                this.$refs.UserGroupDialog.group = JSON.parse(
                    JSON.stringify(params.row)
                );
                this.$refs.UserGroupDialog.openDialog();
                return false;
            } else if (this.type === "location_types") {
                //this.location_type = JSON.parse(JSON.stringify(params.row));
                this.$refs.LocationTypeDialogBoxRef.location_type = JSON.parse(
                    JSON.stringify(params.row)
                );

                this.$refs.LocationTypeDialogBoxRef.formType = "updated";
                this.$refs.LocationTypeDialogBoxRef.location_type_info_dialog = true;
                // this.location_type_info_dialog = true;
                return false;
            } else if (
                this.type === "contacts" &&
                params.row.entity_type !== "client"
            ) {
                this.info = params.row;
                this.$refs.ContactShow.openDialog();
                return false;
            }
            this.$router.push("/" + this.type + "/" + params.row._id);
        },
        formatFn: function(value) {
            return "$" + value;
        },
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
        }
    }
};
</script>

<style>
@import "./standard.css";
</style>
