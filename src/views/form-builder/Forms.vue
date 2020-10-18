<template>
    <v-container fluid>
        <div v-if="!form_builder">
            <app-card class="mb-4" colClasses="xl12 mb-0" content-custom-class="py-0" heading="Components">
                <DataTable
                  :columns="component_columns"
                  :rows="custom_elements"
                  @form_fx="form_fx"
                  type="components"
                ></DataTable>
            </app-card>
            <app-card colClasses="xl12 mb-4" heading="Forms" content-custom-class="py-0">
                <DataTable :columns="columns" :rows="form_data" @form_fx="form_fx" type="forms"></DataTable>
            </app-card>

            <v-speed-dial
                class="patient-overview-v-speed-dial"
                bottom
                v-model="fab"
                right
                direction="top"
                transition="slide-y-reverse-transition"
            >
                <template v-slot:activator>
                    <v-btn v-model="fab" color="primary" fab>
                        <v-icon v-if="fab">close</v-icon>
                        <v-icon v-else>add</v-icon>
                    </v-btn>
                </template>
                <v-btn
                    @click="$router.push('form-builder')"
                    style="right:20px;"
                    class="pl-2 pr-2"
                    dark
                    color="primary"
                >
                    <strong>Form</strong>
                </v-btn>
                <v-btn
                  @click="$router.push('component-builder')"
                  class="pl-2 pr-2"
                  color="primary"
                  dark
                  style="right:30px;"
                >
                    <strong>Components</strong>
                </v-btn>
            </v-speed-dial>
        </div>
        <!-- custom form for preview-->
        <CustomFormBox ref="CustomForm" action="preview"></CustomFormBox>
    </v-container>
</template>

<script>
  import DataTable from "@/components/table/datatable";
  import draggable from "vuedraggable";
  import ApiService from "@/common/api.service";
  import { vm } from "../../main";
  import moment from "moment";
  import { icons } from "./icons";
  import AppCardContent from "../../components/AppCard/AppCardContent";

  const CustomFormBox = () => import("@/components/DialogBox/CustomFormBox");

  export default {
    data() {
      return {
        custom : false,
        add_icon : false,
        fab : false,
        form_id : "",
        form_custom_id : "Form",
        form_name : "Form 1",
        status : true,
        version : 0.1,
        form_desc : "",
        icon : "zmdi zmdi-collection-item-1",
        form_builder : false,
        controls : [
          {
            component_type : "v-text-field",
            name : "text_input",
            key : "t_inp",
            label : "Text input",
            class : "xs4",
            input_type : "text",
            required : true
          },
          {
            component_type : "v-text-field",
            name : "num_input",
            key : "n_inp",
            label : "Number input",
            class : "xs4",
            input_type : "number",
            required : false
          },
          {
            component_type : "v-text-field",
            name : "email_input",
            key : "e_inp",
            label : "Email input",
            class : "xs4",
            input_type : "email",
            required : false
          },
          {
            component_type : "v-text-field",
            slot_type : "calendar",
            name : "date_inp",
            key : "d_inp",
            label : "Date Picker",
            class : "xs4",
            required : false
          },
          {
            component_type : "v-text-field",
            slot_type : "time",
            name : "time_inp",
            key : "time_inp",
            label : "Time Picker",
            class : "xs4",
            required : false
          },
          {
            component_type : "v-select",
            name : "s_inp",
            key : "s_inp",
            label : "Option",
            class : "xs4",
            items : [ "Option 1" ],
            required : false
          },
          {
            component_type : "v-checkbox",
            name : "check_inp",
            key : "ch_inp",
            label : "CheckBox",
            class : "xs4",
            required : false
          }
        ],
        main_info : [],
        component_columns : [
          {
            text : "Component",
            value : "form_name"
          },
          {
            text : "Actions",
            value : "form-button"
          }
        ],
        columns : [
          {
            text : "Form ID",
            value : "form_custom_id"
          },
          {
            text : "Form Name",
            value : "form_name"
          },
          {
            text : "Version Number",
            value : "version"
          },
          {
            text : "Last modified",
            value : "updatedAt",
            formatFn : this.dateOutputFormat
          },
          {
            text : "Status",
            value : "status",
            formatFn : this.formatStatus
          },
          {
            text : "Actions",
            value : "form-button"
          }
        ],
        show_edit_attr : true,
        form_data : [],
        custom_elements : [],
        edit : {},
        icons : icons,
        status_types : [
          { key : "Draft", value : 2 },
          { key : "Active", value : 1 },
          { key : "Deactivated", value : 0 }
        ],
        custom_controls : []
      };
    },
    components: {
        AppCardContent,
        DataTable,
        draggable,
        CustomFormBox
    },
    created() {
      vm.$on( "FetchPageData", this.getCreatedForms );
    },
    beforeDestroy() {
      vm.$off( "FetchPageData", this.getCreatedForms );
    },
    mounted() {
      this.getCreatedForms();
    },
    methods: {
      empty_form( type ) {
        this.show_edit_attr = true;
        this.custom = type === "custom";
        this.form_builder = true;
        this.form_name = "";
        this.main_info = [];
        this.form_id = "";
        this.form_custom_id = "";
        this.status = this.custom ? 1: 2;
        this.icon = "zmdi zmdi-collection-item-1";
        this.form_desc = "";
        this.version = "0.1";
      },
      form_fx( params, data ) {
        if ( data.custom && params === "edit" )
          this.$router.push( "/component-builder/" + data._id );
        else if ( !data.custom && params === "edit" )
          this.$router.push( "/form-builder/" + data._id );

        this.show_edit_attr = true;
        if ( params === "edit" ) {
          this.custom = data.custom === 1;
          this.form_builder = true;
          this.form_name = data.form_name;
          this.main_info = data.structure;
          this.form_id = data._id;
          this.form_custom_id = data.form_custom_id;
          this.status = data.status;
          this.icon = data.icon;
          this.form_desc = data.form_desc;
          this.version = data.version;
        } else {
          ApiService.post( "custom_form_update", {
            form : data,
            edit_type : params
          } ).then( response => {
            if ( response.code === 1 ) {
              if ( params === "copy" ) {
                if ( data.custom == 1 )
                  this.custom_elements.push( response.form );
                else
                  this.form_data.push( response.form );
              } else {
                if ( data.custom == 1 )
                  this.custom_elements = this.custom_elements.filter(
                    i => i._id !== data._id
                  );
                else
                  this.form_data = this.form_data.filter(
                    i => i._id !== data._id
                  );
              }
            }
          } );
        }
      },
      edit_info( item ) {
        this.edit = item;
        this.show_edit_attr = false;
      },
      add_section() {
        let tmp = {
          key : "sec" + this.main_info.length + 1,
          section : "Section " + ( this.main_info.length + 1 ),
          elements : []
        };
        this.main_info.push( tmp );
      },
      remove_section( key ) {
        this.main_info = this.main_info.filter( i => i.key !== key );
      },
      remove_item( key ) {
        this.show_edit_attr = !this.show_edit_attr;
        for ( let index = 0 ; index <= this.main_info.length ; index++ ) {
          if ( this.main_info[ index ] !== undefined )
            this.main_info[ index ][ "elements" ] = this.main_info[ index ][
              "elements"
              ].filter( i => i.key !== key );
        }
      },
      remove_option( index ) {
        this.$delete( this.edit.items, index );
      },
      add_option( index ) {
        this.edit.items.push( "Option" );
      },
      cloneElement( item ) {
        let tmp_item = JSON.parse( JSON.stringify( item ) );
        let val = Math.random()
          .toString( 36 )
          .substr( 2, 5 );
        tmp_item.key = item.key + val;
        tmp_item.name = item.name + val;
        tmp_item.label = item.label;
        tmp_item.saved = 0;
        return tmp_item;
      },
      cloneCustom( item ) {
        let tmp_item = JSON.parse( JSON.stringify( item ) );
        let val = Math.random()
          .toString( 36 )
          .substr( 2, 5 );

        tmp_item.key = item.key + val;
        tmp_item.name = item.name + val;
        tmp_item.label = item.label + val;
        return tmp_item;
      },
      checkData( item ) {
        if ( item.added.element.structure !== undefined ) {
          let index = this.main_info.findIndex(
            x => x.key === item.added.element.key
          );
          this.remove_section( item.added.element.key );
          let tmp_data = Object.values( this.main_info );
          // updata data
          item.added.element.structure.forEach( element => {
            element[ "key" ] =
              "sec" +
              Math.random()
                            .toString(36)
                            .substr(2, 5);
                });
                tmp_data = [
                    ...tmp_data.slice(0, index),
                    ...item.added.element.structure,
                    ...tmp_data.slice(index)
                ];
                this.main_info = tmp_data;
            }
        },
        save_form() {
          if (
            document.getElementById( "form_custom_id" ).checkValidity() ===
            false
          ) {
            let tmp = document.getElementById( "form_custom_id" ).value;
            document.getElementById( "form_custom_id" ).value = tmp.match(
              /[A-Za-z0-9\-\.]*/
            )[ 0 ];
            return;
          }
          if ( this.form_id == "" ) {
            for ( let index = 0 ; index <= this.main_info.length ; index++ ) {
              if ( this.main_info[ index ] !== undefined ) {
                this.main_info[ index ][ "saved" ] = 1;
                for (
                  let inner_index = 0 ;
                  inner_index <
                  this.main_info[ index ][ "elements" ].length ;
                  inner_index++
                ) {
                  this.main_info[ index ][ "elements" ][ inner_index ][
                    "saved"
                    ] = 1;
                }
              }
            }
            ApiService.post( "store_form", {
              form_name : this.form_name,
              form_custom_id : this.form_custom_id,
              form : this.main_info,
              status : this.status,
              icon : this.icon,
              form_desc : this.form_desc,
              version : this.version,
              custom : this.custom
            } ).then( response => {
              this.form_id = response.form_id;
              this.getCreatedForms();
            } );
          } else {
            for ( let index = 0 ; index <= this.main_info.length ; index++ ) {
              if ( this.main_info[ index ] !== undefined ) {
                this.main_info[ index ][ "saved" ] = 1;
                for (
                  let inner_index = 0 ;
                  inner_index <
                  this.main_info[ index ][ "elements" ].length ;
                  inner_index++
                ) {
                  this.main_info[ index ][ "elements" ][ inner_index ][
                    "saved"
                    ] = 1;
                }
              }
            }
            ApiService.post( "update_form", {
              form_id : this.form_id,
              form_custom_id : this.form_custom_id,
              form_name : this.form_name,
              form : this.main_info,
              status : this.status,
              icon : this.icon,
                    form_desc: this.form_desc,
                    version: this.version,
                    custom: this.custom
                }).then(response => {
                    this.getCreatedForms();
                });
            }
        },
        getCreatedForms() {
          ApiService.get( "get_forms" ).then( response => {
            this.form_data = response.forms;
            this.custom_elements = response.custom_elements;
            this.custom_controls = [];
            response.custom_elements.forEach( element => {
              element.key = element.form_custom_id;
              if ( element.status === 1 )
                this.custom_controls.push( element );
            } );
          } );
        },
        dateOutputFormat: function(data, key) {
          return moment.utc(data[key]).fromNow();
        },
        formatStatus: function(data, key) {
          return ["Deactivated", "Active", "Draft"][data[key]];
        },
        preview_form() {
          let form = {
            form_name : this.form_name,
            structure : this.main_info,
            status : this.status,
            icon : this.icon,
            form_desc : this.form_desc,
            version : this.version
          };
          this.$refs.CustomForm.openDialog(form, undefined, "preview");
        }
    }
};
</script>
<style>
@import "form-builder.css";
</style>