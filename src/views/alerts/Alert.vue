<template>
    <div>
        <v-container fluid grid-list-xl pt-4>
            <v-layout row wrap>
                <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                    <h2>Emails</h2>
                    <span class="subheading">
                        You can use these keys for dynamic population:
                        <b>_PROJECT_NAME_</b> &nbsp;
                        <b>_FIRST_NAME_</b> &nbsp;
                        <b>_LAST_NAME_</b> &nbsp;
                        <b>_EMAIL_</b> &nbsp;
                        <b>_LINK_</b> &nbsp;
                        <b>_CLIENT_</b> &nbsp;
                        <b>_USER_GROUP_</b> &nbsp;
                    </span>
                    <v-expansion-panel class="mt-2">
                        <v-expansion-panel-content v-for="value in email_content" :key="value.key">
                            <template v-slot:header>
                                <div>{{$t("message['" + value.key + "']")}}</div>
                            </template>
                            <hr class="ma-0" />
                            <v-card>
                                <v-card-text class="pa-4">
                                    <v-text-field label="Subject" v-model="value.subject" required></v-text-field>
                                    <quill-editor v-model="value.body" ref="myQuillEditor"></quill-editor>
                                </v-card-text>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-btn class="ml-0" @click="updated_email_content()" color="primary">Update</v-btn>
                </app-card>

                <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                    <h2>Terms & Conditions</h2>
                    <v-text-field v-model="tnc_header" label="Title text"></v-text-field>
                    <quill-editor v-model="tnc_content" ref="myQuillEditor"></quill-editor>
                    <v-btn class="ml-0" @click="updated_tnc_content()" color="primary">Update T&C</v-btn>
                    <span>Last updated: {{tnc_lastUpdated}}</span>
                </app-card>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
  import moment from "moment";
  import ApiService from "@/common/api.service";

  export default {
    name : "Alerts",
    data : function () {
      return {
        email_content : [],
        tnc_header : 'Terms & Conditions',
        tnc_content : '',
        tnc_lastUpdated : ''
      };
    },
    methods : {
      updated_email_content() {
        ApiService.put( "update_email_content", {
          email_content : this.email_content
        } );
      },
      updated_tnc_content() {
        ApiService.put( "update_tnc_content", {
          tnc_content : this.tnc_content,
          tnc_header : this.tnc_header
        } ).then( () => {
          this.tnc_data();
            });
        },
        tnc_data(){
            ApiService.get("tnc_content").then(response => {
              this.tnc_content = response.tnc_content[ 0 ].content;
              this.tnc_header = response.tnc_content[ 0 ].header;
              this.tnc_lastUpdated = moment.utc( response.tnc_content[ 0 ].createdAt );
            });
        }
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        }
    },
    mounted() {
        ApiService.get("email_content").then(response => {
            this.email_content = response.email_content;
        });
        this.tnc_data()
    }
};
</script>
