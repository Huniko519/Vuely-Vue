<template>
    <div class="elevation-5">
        <v-container grid-list-md px-0 py-0>
            <v-layout wrap>
                <v-flex xl6 lg6 md6 sm6 xs12>
                    <v-list two-line class="card-list">
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>
                                    <h5 class="fw-bold gray--text">Name</h5>
                                    <span
                                        v-if="isAdmin()"
                                    >{{getAuthUser('prefix')}} {{getAuthUser('first_name')}} {{getAuthUser('middle_name')}} {{getAuthUser('last_name')}} {{getAuthUser('suffix')}} {{getAuthUser('nickname')}}</span>
                                    <span
                                        v-else
                                    >{{getAuthUserProfile('prefix')}} {{getAuthUserProfile('first_name')}} {{getAuthUserProfile('middle_name')}} {{getAuthUserProfile('last_name')}} {{getAuthUserProfile('suffix')}} {{getAuthUserProfile('nickname')}}</span>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon class="small" @click.stop="open_name_dialog()">
                                    <v-icon color="grey">zmdi zmdi-edit</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>
                                    <h5 class="fw-bold gray--text">Gender</h5>
                                    <span>{{getAuthUser('gender')}}</span>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon class="small" @click.stop="open_gender_dialog()">
                                    <v-icon color="grey">zmdi zmdi-edit</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>
                                    <h5 class="fw-bold gray--text">Address</h5>
                                    <span>{{getAuthUser("address", "address")}} {{getAuthUser("unit", "address")}} {{getAuthUser("city", "address")}} {{getAuthUser("state", "address")}} {{getAuthUser("zip", "address")}} {{getAuthUser("po_box", "address")}}</span>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon class="small" @click.stop="open_address_dialog()">
                                    <v-icon color="grey">zmdi zmdi-edit</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-flex>
                <v-flex xl6 lg6 md6 sm6 xs12>
                    <v-list two-line class="card-list">
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>
                                    <h5 class="fw-bold gray--text">Phone</h5>
                                    <span
                                        v-if="contact_info_temp[0].contact"
                                    >{{contact_info_temp[0].contact}} ({{contact_info_temp[0].type}})</span>
                                    <span v-if="contact_info_temp[1].contact">
                                        <br />
                                        {{contact_info_temp[1].contact}} ({{contact_info_temp[1].type}})
                                    </span>
                                    <span v-if="contact_info_temp[2].contact">
                                        <br />
                                        {{contact_info_temp[2].contact}} ({{contact_info_temp[2].type}})
                                    </span>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon class="small" @click.stop="open_contact_info_dialog()">
                                    <v-icon color="grey">zmdi zmdi-edit</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>
                                    <h5 class="fw-bold gray--text">Email</h5>
                                    <span>{{getAuthUser('email')}}</span>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon class="small" @click.stop="open_email_dialog()">
                                    <v-icon color="grey">zmdi zmdi-edit</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>
                                    <h5 class="fw-bold gray--text">Password</h5>
                                    <span>*************</span>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon class="small" @click.stop="open_pass_dialog()">
                                    <v-icon color="grey">zmdi zmdi-edit</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-flex>
            </v-layout>
        </v-container>

        <v-dialog v-model="name_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title>User name</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text class="mb-0 pb-0">
                    <v-form v-model="name_valid" class="mb-4">
                        <v-text-field label="Prefix" v-model="profile.prefix" clearable></v-text-field>
                        <v-text-field
                            class="reqField"
                            label="First Name"
                            v-model="profile.first_name"
                            :rules="nameRules"
                            :counter="20"
                            required
                            clearable
                        ></v-text-field>
                        <v-text-field label="Middle Name" v-model="profile.middle_name" clearable></v-text-field>
                        <v-text-field
                            class="reqField"
                            label="Last Name"
                            v-model="profile.last_name"
                            :counter="20"
                            :rules="nameRules"
                            required
                            clearable
                        ></v-text-field>
                        <v-text-field label="Suffix" v-model="profile.suffix" clearable></v-text-field>
                        <v-text-field label="Nickname" v-model="profile.nickname" clearable></v-text-field>
                        <v-btn
                            class="ml-0"
                            @click="submit('profile');name_dialog = false"
                            :disabled="!changed_name_dialog || !name_valid"
                            large
                            color="primary"
                        >{{$t('message.submit')}}</v-btn>
                        <v-btn
                            class="ml-0"
                            color="error"
                            large
                            @click.native="name_dialog = false"
                        >Cancel</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="gender_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title>Gender</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text class="mb-0 pb-0">
                    <v-form v-model="gender_valid" class="mb-4">
                        <v-radio-group v-model="user.gender" row>
                            <v-radio label="Male" value="Male" color="primary"></v-radio>
                            <v-radio label="Female" value="Female" color="primary"></v-radio>
                            <v-radio label="Other" value="Other" color="primary"></v-radio>
                        </v-radio-group>
                        <v-text-field
                            label="Gender(others)"
                            v-if="user.gender!='Male' && user.gender!='Female'"
                            v-model="user.gender"
                            clearable
                        ></v-text-field>
                        <v-btn
                            class="ml-1"
                            @click="submit('user');gender_dialog = false"
                            :disabled="!changed_gender_dialog"
                            large
                            color="primary"
                        >{{$t('message.submit')}}</v-btn>
                        <v-btn
                            class="ml-0"
                            color="error"
                            large
                            @click.native="gender_dialog = false"
                        >Cancel</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="address_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title>Address</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text class="mb-0 pb-0">
                    <v-form v-model="address_valid" class="mb-4">
                        <v-text-field
                            class="reqField"
                            label="Street address"
                            :rules="addressRules"
                            v-model="address.address"
                            clearable
                        ></v-text-field>
                        <v-text-field label="Unit" v-model="address.unit" clearable></v-text-field>
                        <v-text-field label="Zip" v-model="address.zip" clearable></v-text-field>
                        <v-text-field label="City" v-model="address.city" clearable></v-text-field>
                        <v-text-field label="State" v-model="address.state" clearable></v-text-field>
                        <v-text-field label="PO Box" v-model="address.po_box" clearable></v-text-field>
                        <v-btn
                            class="ml-0"
                            @click="submit('address');address_dialog = false"
                            :disabled="!changed_address_dialog || !address_valid"
                            large
                            color="primary"
                        >{{$t('message.submit')}}</v-btn>
                        <v-btn
                            class="ml-0"
                            color="error"
                            large
                            @click.native="address_dialog = false"
                        >Cancel</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="contact_info_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title>Phone</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text class="mb-0 pb-0">
                    <v-form v-model="contact_info_valid" class="mb-4">
                        <v-layout row wrap>
                            <v-flex xs12 sm6 pr-2>
                                <v-text-field
                                    label="Phone 1"
                                    v-model="contact_info[0]['contact']"
                                    :rules="phoneRulesRequired"
                                    required
                                    :counter="10"
                                    clearable
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                    :items="contact_type"
                                    label="Type"
                                    v-model="contact_info[0]['type']"
                                ></v-select>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 pr-2>
                                <v-text-field
                                    label="Phone 2"
                                    v-model="contact_info[1]['contact']"
                                    :rules="phoneRules"
                                    :counter="10"
                                    clearable
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                    :items="contact_type"
                                    label="Type"
                                    v-model="contact_info[1]['type']"
                                ></v-select>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 pr-2>
                                <v-text-field
                                    label="Phone 3"
                                    v-model="contact_info[2]['contact']"
                                    :rules="phoneRules"
                                    :counter="10"
                                    clearable
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                    :items="contact_type"
                                    label="Type"
                                    v-model="contact_info[2]['type']"
                                ></v-select>
                            </v-flex>
                        </v-layout>

                        <v-btn
                            @click="submit('contact_info');"
                            :disabled="!changed_contact_info_dialog || !contact_info_valid"
                            large
                            color="primary"
                            class="ml-0"
                        >{{$t('message.submit')}}</v-btn>
                        <v-btn
                            class="ml-0"
                            color="error"
                            large
                            @click.native="contact_info_dialog = false"
                        >Cancel</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="email_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title>Email</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text class="mb-0 pb-0">
                    <v-form v-model="email_valid" class="mb-4">
                        <v-text-field label="Current Email" v-model="user.email" disabled></v-text-field>
                        <v-text-field
                            label="New Email"
                            v-model="new_email"
                            :rules="newEmailRules"
                            clearable
                        ></v-text-field>
                        <v-text-field
                            label="Confirm Email"
                            v-model="vemail"
                            :rules="confirmEmailRules"
                            clearable
                        ></v-text-field>
                        <v-btn
                            class="ml-0"
                            @click="submit('user');email_dialog = false"
                            large
                            color="primary"
                            :disabled="!email_valid || new_email!=vemail"
                        >{{$t('message.submit')}}</v-btn>
                        <v-btn
                            class="ml-0"
                            color="error"
                            large
                            @click.native="email_dialog = false"
                        >Cancel</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="pass_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title>Password</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text class="mb-0 pb-0">
                    <v-form v-model="pass_valid" class="mb-4">
                        <v-text-field
                            label="OTP"
                            v-model="password.otp"
                            :rules="[v => !!v || 'OTP is required']"
                            disabled
                        ></v-text-field>
                        <v-text-field
                            label="Current Password"
                            v-model="password.current"
                            :rules="passRules"
                            type="password"
                            clearable
                        ></v-text-field>

                        <v-text-field
                            label="New Password"
                            v-model="password.new"
                            :rules="newPassRules"
                            type="password"
                            clearable
                        ></v-text-field>
                        <a
                            class="font-sm mt-auto"
                            @click="request_otp()"
                        >Request OTP for password change</a>
                        <span
                            v-if="otp_text!=''"
                            class="font-sm text"
                            :class="[otp_error==1?'success--text':'error--text']"
                        >{{otp_text}}</span>
                        <br />
                        <v-btn
                            class="ml-0"
                            @click="submit('password'); pass_dialog = false"
                            :disabled="!pass_valid"
                            large
                            color="primary"
                        >{{$t('message.submit')}}</v-btn>
                        <v-btn
                            class="ml-0"
                            color="error"
                            large
                            @click.native="pass_dialog = false"
                        >Cancel</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import ApiService from "@/common/api.service";

export default {
    data() {
        return {
            otp_text: "",
            otp_error: 0,
            dialog: false,
            name_valid: false,
            name_dialog: false,
            gender_valid: false,
            gender_dialog: false,
            address_valid: false,
            address_dialog: false,
            contact_info_valid: false,
            contact_info_dialog: false,
            email_valid: false,
            email_dialog: false,
            pass_dialog: false,
            pass_valid: false,
            password: {
                otp: "",
                current: "",
                new: ""
            },
            profile: {
                prefix: this.isAdmin()
                    ? this.getAuthUser("prefix")
                    : this.getAuthUserProfile("prefix"),
                first_name: this.isAdmin()
                    ? this.getAuthUser("first_name")
                    : this.getAuthUserProfile("first_name"),
                middle_name: this.isAdmin()
                    ? this.getAuthUser("middle_name")
                    : this.getAuthUserProfile("middle_name"),
                last_name: this.isAdmin()
                    ? this.getAuthUser("last_name")
                    : this.getAuthUserProfile("last_name"),
                suffix: this.isAdmin()
                    ? this.getAuthUser("suffix")
                    : this.getAuthUserProfile("suffix"),
                nickname: this.isAdmin()
                    ? this.getAuthUser("nickname")
                    : this.getAuthUserProfile("nickname")
            },
            user: {
                /*
                prefix: this.getAuthUser("prefix"),
                first_name: this.getAuthUser("first_name"),
                middle_name: this.getAuthUser("middle_name"),
                last_name: this.getAuthUser("last_name"),
                suffix: this.getAuthUser("suffix"),
                nickname: this.getAuthUser("nickname"),
                */
                gender: this.getAuthUser("gender"),
                email: this.getAuthUser("email")
            },
            new_email: "",
            vemail: "",
            contact_type: ["Mobile", "Work", "Home"],
            address: {
                address: this.getAuthUser("address", "address"),
                unit: this.getAuthUser("unit", "address"),
                city: this.getAuthUser("city", "address"),
                state: this.getAuthUser("state", "address"),
                zip: this.getAuthUser("zip", "address"),
                po_box: this.getAuthUser("po_box", "address")
            },
            contact_info: [
                { contact: "", type: "Mobile" },
                { contact: "", type: "Mobile" },
                { contact: "", type: "Mobile" }
            ],
            //changed_contact_info_dialog: false,
            passRules: [
                v =>
                    (v && v.length > 5) ||
                    "Password must be longer than 5 characters"
            ],
            newPassRules: [
                v =>
                    (v && v.length > 5) ||
                    "Password must be longer than 5 characters",

                v =>
                    this.password.new.length === 0 ||
                    this.password.current !== this.password.new ||
                    "New password should be diffrent."
            ],
            newEmailRules: [
                v => !!v || "Email is required",
                v =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "E-mail must be valid",
                v =>
                    this.new_email.length === 0 ||
                    this.new_email !== this.user.email ||
                    "New eamil should be diffrent."
            ],
            confirmEmailRules: [
                v =>
                    this.vemail.length === 0 ||
                    this.new_email === this.vemail ||
                    "Confirm email doesn't match."
            ],
            emailRules: [
                // v => !!v || "E-mail is required",
                v =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "E-mail must be valid"
            ],

            nameRules: [
                v => !!v || "Name is required",
                v =>
                    (v && v.length <= 20) ||
                    "Name must be less than 20 characters",
                v => /^[A-Za-z]+$/.test(v) || "Name must be alphabet"
            ],
            addressRules: [v => !!v || "Address is required"],
            phoneRulesRequired: [
                v => !!v || "Phone number is required",
                v => (v && /^\d+$/.test(v)) || "Phone number must be numeric",
                v => (v && v.length <= 10) || "Phone number must be 10 digits"
            ],
            phoneRules: [
                //v => !!v || "Phone number is required",
                v =>
                    !v ||
                    (v && /^\d+$/.test(v)) ||
                    "Phone number must be numeric",
                v =>
                    !v ||
                    (v && v.length <= 10) ||
                    "Phone number must be 10 digits"
            ]
        };
    },

    computed: {
        contact_info_temp() {
            let contact_info = this.getAuthUser("contact_info")
                ? this.getAuthUser("contact_info")
                : [];
            let len = this.getAuthUser("contact_info").length;
            for (let i = 3; i > len; i--) {
                contact_info.push({ contact: "", type: "Mobile" });
            }
            return contact_info;
        },
        changed_name_dialog() {
            if (
                this.profile.prefix !==
                    (this.isAdmin()
                        ? this.getAuthUser("prefix")
                        : this.getAuthUserProfile("prefix")) ||
                this.profile.first_name !==
                    (this.isAdmin()
                        ? this.getAuthUser("first_name")
                        : this.getAuthUserProfile("first_name")) ||
                this.profile.middle_name !==
                    (this.isAdmin()
                        ? this.getAuthUser("middle_name")
                        : this.getAuthUserProfile("middle_name")) ||
                this.profile.last_name !==
                    (this.isAdmin()
                        ? this.getAuthUser("last_name")
                        : this.getAuthUserProfile("last_name")) ||
                this.profile.suffix !==
                    (this.isAdmin()
                        ? this.getAuthUser("suffix")
                        : this.getAuthUserProfile("suffix")) ||
                this.profile.nickname !==
                    (this.isAdmin()
                        ? this.getAuthUser("nickname")
                        : this.getAuthUserProfile("nickname"))
            ) {
                return true;
            }
            return false;
        },
        changed_gender_dialog() {
            if (this.getAuthUser("gender") !== this.user.gender) {
                return true;
            }
            return false;
        },
        changed_address_dialog() {
            if (
                this.address.address !==
                    this.getAuthUser("address", "address") ||
                this.address.unit !== this.getAuthUser("unit", "address") ||
                this.address.city !== this.getAuthUser("city", "address") ||
                this.address.state !== this.getAuthUser("state", "address") ||
                this.address.zip !== this.getAuthUser("zip", "address") ||
                this.address.po_box !== this.getAuthUser("po_box", "address")
            ) {
                return true;
            }
            return false;
        },
        changed_contact_info_dialog() {
            for (let i = 0; i < 3; i++) {
                if (
                    this.contact_info[i].contact !==
                        this.contact_info_temp[i].contact ||
                    this.contact_info[i].type !== this.contact_info_temp[i].type
                ) {
                    return true;
                }
            }
            return false;
        }
    },
    methods: {
        request_otp() {
            ApiService.post("/requestotp", {
                errorHandle: false,
                user: this.getAuthUser("email")
            }).then(
                response => {
                    this.password.otp = response.otp;
                },
                error => {
                    this.otp_error = response.code;
                    this.otp_text = response.message;
                }
            );
        },
        submit(data_type) {
            let data = eval("this." + data_type);
            if (data != undefined) {
                if (
                    this.new_email != undefined &&
                    this.new_email === this.vemail &&
                    this.vemail.trim() !== ""
                ) {
                    data_type = "email";
                    data.email = this.new_email;
                    this.new_email = "";
                    this.vemail = "";
                }

                if (this.isAdmin() && data_type == "profile") {
                    data_type = "user";
                }

                this.$store
                    .dispatch("store_user_details", {
                        key: data_type,
                        value: data
                    })
                    .then(res => {
                        if (res.code == 1 && data_type != "password") {
                            if (data_type == "profile") {
                                data_type = "user";
                            }
                            this[data_type + "_dialog"] = false;
                            // this.$i18n.mergeLocaleMessage('en', {message: data});
                            return true;
                        } else {
                            return false;
                        }
                    });
            }
        },
        open_name_dialog() {
            this.profile = {
                prefix: this.isAdmin()
                    ? this.getAuthUser("prefix")
                    : this.getAuthUserProfile("prefix"),
                first_name: this.isAdmin()
                    ? this.getAuthUser("first_name")
                    : this.getAuthUserProfile("first_name"),
                middle_name: this.isAdmin()
                    ? this.getAuthUser("middle_name")
                    : this.getAuthUserProfile("middle_name"),
                last_name: this.isAdmin()
                    ? this.getAuthUser("last_name")
                    : this.getAuthUserProfile("last_name"),
                suffix: this.isAdmin()
                    ? this.getAuthUser("suffix")
                    : this.getAuthUserProfile("suffix"),
                nickname: this.isAdmin()
                    ? this.getAuthUser("nickname")
                    : this.getAuthUserProfile("nickname")
            };
            /*
            this.user = {
                prefix: this.getAuthUser("prefix"),
                first_name: this.getAuthUser("first_name"),
                middle_name: this.getAuthUser("middle_name"),
                last_name: this.getAuthUser("last_name"),
                suffix: this.getAuthUser("suffix"),
                nickname: this.getAuthUser("nickname"),
                gender: this.getAuthUser("gender"),
                email: this.getAuthUser("email")
            };
            */
            this.name_dialog = !this.name_dialog;
        },
        open_gender_dialog() {
            this.user.gender = this.getAuthUser("gender");
            this.gender_dialog = !this.gender_dialog;
        },
        open_address_dialog() {
            this.address = {
                address: this.getAuthUser("address", "address"),
                unit: this.getAuthUser("unit", "address"),
                city: this.getAuthUser("city", "address"),
                state: this.getAuthUser("state", "address"),
                zip: this.getAuthUser("zip", "address"),
                po_box: this.getAuthUser("po_box", "address")
            };
            this.address_dialog = !this.address_dialog;
        },
        open_contact_info_dialog() {
            this.contact_info = this.getAuthUser("contact_info")
                ? JSON.parse(JSON.stringify(this.getAuthUser("contact_info")))
                : [];
            let len = this.getAuthUser("contact_info").length;
            for (let i = 3; i > len; i--) {
                this.contact_info.push({ contact: "", type: "Mobile" });
            }
            this.contact_info_dialog = !this.contact_info_dialog;
        },
        open_email_dialog() {
            this.user.email = this.getAuthUser("email");
            this.new_email = "";
            this.vemail = "";
            this.email_dialog = !this.email_dialog;
        },
        open_pass_dialog() {
            this.password = {
                otp: "",
                current: "",
                new: ""
            };
            this.pass_dialog = !this.pass_dialog;
        }
    }
};
</script>