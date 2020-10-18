<template>
    <v-container fluid>
        <div>
            <v-layout class="form_builder" row wrap>
                <app-card class="form-holder" colClasses="xl8 lg8 md8 sm8 xs8 mb-2 elevation-2">
                    <div class="d-flex align-items-center">
                        <v-text-field
                          :rules="[v => !!v || 'Name is required']"
                          class=""
                          hint="Name is required"
                          label="Component name"
                          required
                          v-model="form_name"
                        ></v-text-field>
                    </div>
                    <v-textarea
                      auto-grow
                      class="w-100"
                      placeholder="Description"
                      row-height="2"
                      rows="1"
                      style="min-height:60px"
                      v-model="form_desc"
                    ></v-textarea>
                    <div class="ml-auto text-left">
                        <v-btn
                          :disabled="Boolean(form_name==='')"
                          @click="save_form()"
                          class="primary ml-0"
                        >Save
                        </v-btn>
                    </div>
                </app-card>

                <app-card
                  class="form-holder"
                  colClasses="xl8 lg8 md8 sm8 xs8 mt-2"
                  v-show="(custom && main_info.length) || !custom"
                >
                    <div class="d-flex align-items-center">
                        <h5 class>{{custom ? 'Component' : 'Form Builder'}}</h5>
                    </div>
                    <draggable
                      @change="checkData"
                      class="h-100"
                      group="sections"
                      v-model="main_info"
                    >
                        <transition-group name="fade" tag="div">
                            <div
                              :key="row_item.key"
                              class="form-holder-row"
                              v-for="row_item in main_info"
                            >

                                <draggable
                                  class="w-100"
                                  group="people"
                                  v-if="row_item.elements"
                                  v-model="row_item.elements"
                                >
                                    <transition-group
                                      class="main_holder pb-2"
                                      name="fade"
                                      tag="div"
                                    >
                                        <div
                                          :class="item.class"
                                          :key="item.key"
                                          @click="edit_info(item)"
                                          class="item flex"
                                          v-for="item in row_item.elements"
                                        >
                                            <div class="item-name">{{item.label}}</div>
                                            <v-text-field
                                              :is="item.component_type"
                                              :label="item.label"
                                              :name="item.key"
                                              :required="item.required"
                                              :slot="item.slot"
                                              :type="item.input_type"
                                              class="item-elem"
                                              dense
                                              disabled
                                              hide-details
                                            ></v-text-field>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </div>
                        </transition-group>
                    </draggable>
                </app-card>
                <app-card
                  colClasses="xl4 lg4 md4 sm4 xs4 side_holder"
                  heading="Supported Controls (1 item restriction)"
                  v-if="show_edit_attr"
                >
                    <draggable
                      :clone="cloneElement"
                      :group="{ name: 'people', pull: 'clone', put: false }"
                      :list="controls"
                      class="height-auto w-100"
                      draggable=".item"
                      :disabled="main_info[0].elements.length==1"
                    >
                        <div
                          :class="item.class"
                          :key="item.key"
                          class="item"
                          v-for="item in controls"
                        >
                            <div class="item-name">{{item.label}}</div>
                            <v-text-field
                              :is="item.component_type"
                              :label="item.label"
                              :name="item.key"
                              :required="item.required"
                              :slot="item.slot"
                              :type="item.input_type"
                              class="item-elem"
                              dense
                              disabled
                              hide-details
                            ></v-text-field>
                        </div>
                    </draggable>

                </app-card>
                <app-card
                  colClasses="xl4 lg4 md4 sm4 xs4 side_holder"
                  heading="Edit Attributes"
                  v-else-if="!show_edit_attr"
                >
                    <v-text-field
                      @keydown.space.prevent
                      hint="lowercase, no space, should start with letter"
                      label="Name with which the information will be stored"
                      persistent-hint
                      v-model="edit.name"
                    ></v-text-field>
                    <v-text-field disabled label="unique key to distinguish" v-model="edit.key"></v-text-field>
                    <v-text-field label="Label name for field" v-model="edit.label"></v-text-field>
                    <v-select
                      :items="['xs4','xs6','xs12']"
                      label="Class to add"
                      v-model="edit.class"
                    ></v-select>
                    <v-checkbox label="Required Field" v-model="edit.required"></v-checkbox>
                    <div v-if="edit.items">
                        <h6>Dropdown Options</h6>
                        <div
                          :key="opt"
                          class="pl-2 d-custom-flex align-items-center"
                          v-for="(opt,index) in edit.items"
                          v-if="edit.items"
                        >
                            <v-text-field :label="'Option '+(index+1)" v-model="edit.items[index]"></v-text-field>
                            <v-icon @click="remove_option(index)" color="red" small>close</v-icon>
                            <v-icon @click="add_option(index)" color="primary" small>add</v-icon>
                        </div>
                    </div>

                    <v-btn @click="show_edit_attr=!show_edit_attr" class="info">close</v-btn>
                    <v-btn
                      :disabled="Boolean(edit.saved)"
                      @click="remove_item(edit.key)"
                      class="btn-danger"
                    >Delete
                    </v-btn>
                </app-card>
            </v-layout>
        </div>

        <!-- custom form for preview-->
        <CustomFormBox action="preview" ref="CustomForm"></CustomFormBox>
    </v-container>

</template>
<script>
  import DataTable from "@/components/table/datatable";
  import draggable from "vuedraggable";
  import ApiService from "@/common/api.service";
  import { vm } from "../../main";
  import moment from "moment";
  import AppCardContent from "../../components/AppCard/AppCardContent";

  const CustomFormBox = () => import("@/components/DialogBox/CustomFormBox");
  export default {
    data() {
      return {
        custom : true,
        fab : false,
        form_id : "",
        form_name : "Comp 1",
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
        main_info : [ { key : 1, elements : [] } ],
        show_edit_attr : true,
        form_data : [],
        custom_elements : [],
        edit : {},
        status_types : [
          { key : "Draft", value : 2 },
          { key : "Active", value : 1 },
          { key : "Deactivated", value : 0 }
        ],
        custom_controls : []
      };
    },
    components : {
      AppCardContent,
      DataTable,
      draggable,
      CustomFormBox
    },
    created() {
      vm.$on( "FetchPageData", this.getCustomForm );
    },
    beforeDestroy() {
      vm.$off( "FetchPageData", this.getCustomForm );
    },
    mounted() {
      this.getCustomForm();
    },
    methods : {
      edit_info( item ) {
        this.edit = item;
        this.show_edit_attr = false;
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
                .toString( 36 )
                .substr( 2, 5 );
          } );
          tmp_data = [
            ...tmp_data.slice( 0, index ),
            ...item.added.element.structure,
            ...tmp_data.slice( index )
          ];
          this.main_info = tmp_data;
        }
      },
      save_form() {
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
          ApiService.post( "store_component", {
            form_name : this.form_name,
            form : this.main_info[ 0 ].elements,
            status : this.status,
            icon : this.icon,
            form_desc : this.form_desc,
            custom : this.custom
          } ).then( response => {
            this.form_id = response.form_id;
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
          ApiService.post( "update_component", {
            form_id : this.form_id,
            form_name : this.form_name,
            form : this.main_info[ 0 ].elements,
            form_desc : this.form_desc,
            custom : this.custom
          } ).then( response => {
            this.getCustomForm();
          } );
        }
      },
      getCustomForm() {
        let form_id = this.$route.params.id
        if(form_id!=undefined)
        {
          ApiService.get( "form", { 'form_id' : form_id,custom:true } ).then( response => {
            if(response.form!=undefined)
            {
              let data = response.form
              this.custom = data.custom === 1;
              this.form_builder = true;
              this.form_name = data.form_name;
              this.main_info[ 0 ].elements = data.structure;
              this.form_id = data._id;
              this.form_desc = data.form_desc;
              this.$emit(
                "emitselectedUserInfoFromOverview",
                { name : data.form_name }
              );
            }

          } );
        }
      },
      dateOutputFormat : function ( data, key ) {
        return moment.utc( data[ key ] ).fromNow();
      },
      formatStatus : function ( data, key ) {
        return [ "Deactivated", "Active", "Draft" ][ data[ key ] ];
      },
      preview_form() {
        let form = {
          form_name : this.form_name,
          structure : this.main_info[ 0 ].elements,
          status : this.status,
          icon : this.icon,
          form_desc : this.form_desc,
          version : this.version
        };
        this.$refs.CustomForm.openDialog( form, undefined, "preview" );
      }
    }
  };
</script>
<style>
    @import "form-builder.css";
</style>