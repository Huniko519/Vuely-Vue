<template>
    <div class="media pos-relative">
        <div
            v-if="getAuthUser('image') == null"
            @click.stop="profile_picture_dialog = !profile_picture_dialog"
            class="img-responsive rounded-circle mr-4 primary px-4 py-4 font-weight-bold white--text font-lg cursor-pointer text-uppercase"
        >{{getAuthUser('first_name')[0]}}{{getAuthUser('last_name')[0]}}</div>

        <img
            v-else
            :src="getAuthUser('image')"
            @click.stop="profile_picture_dialog = !profile_picture_dialog"
            class="img-responsive rounded-circle mr-4 cursor"
            alt="user profile"
            style="width: 95px; height:95px"
        />

        <div class="media-body">
            <h2 v-if="isAdmin()">
                {{getAuthUser('prefix')}} {{getAuthUser('first_name')}} {{getAuthUser('middle_name')}} {{getAuthUser('last_name')}}
                {{getAuthUser('suffix')}}
            </h2>
            <h2 v-else>
                {{getAuthUserProfile('prefix')}} {{getAuthUserProfile('first_name')}} {{getAuthUserProfile('middle_name')}} {{getAuthUserProfile('last_name')}}
                {{getAuthUserProfile('suffix')}}
            </h2>

            <span v-if="isAdmin()">Super User</span>
            <span v-else>{{getAuthUserGroup('user_title')}}</span>
            <div class="btn-wrapper"></div>
        </div>
        <v-avatar color="warning" class="overlap">
            <v-icon dark>ti-id-badge</v-icon>
        </v-avatar>

        <v-dialog v-model="profile_picture_dialog" scrollable max-width="500px">
            <v-card>
                <v-card-title>Upload Profile Picture</v-card-title>
                <v-divider class="ma-0"></v-divider>
                <v-card-text class="pt-2 pb-2">
                    <v-btn @click="$refs.fileInput.click()">
                        <i class="zmdi zmdi-upload mr-2 fs-20"></i>
                        Upload a picture
                    </v-btn>
                    <input
                        v-show="false"
                        ref="fileInput"
                        type="file"
                        accept="image/x-png, image/gif, image/jpeg"
                        @change="onSelectFile"
                    />
                    <strong>OR</strong>
                    <v-btn @click="takePicture()">
                        <i class="zmdi zmdi-camera mr-2 fs-20"></i>
                        Take a picture
                    </v-btn>

                    <div v-if="take_pickture_using_camera" class="pa-2 pb-0">
                        <vue-web-cam
                            ref="webcam"
                            :device-id="deviceId"
                            width="100%"
                            height="100%"
                            @started="onStarted"
                            @stopped="onStopped"
                            @error="onError"
                            @cameras="onCameras"
                            @camera-change="onCameraChange"
                        />
                        <br />
                        <v-btn class="ma-0 mt-2" @click="onCapture">Capture</v-btn>
                    </div>

                    <figure v-if="img != null" class="figure pa-2">
                        <img :src="img" class="img-responsive" />
                    </figure>
                </v-card-text>
                <v-divider class="ma-0 pa-0"></v-divider>
                <v-card-text class="mt-1 mb-1 pt-0 pb-0">
                    <v-btn
                        wrap
                        @click="upload_user_image"
                        :disabled="img == null"
                        color="primary"
                    >{{$t('message.submit')}}</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import ApiService from "@/common/api.service";
import { WebCam } from "vue-web-cam";

export default {
    components: {
        "vue-web-cam": WebCam
    },
    data() {
        return {
            profile_picture_dialog: false,
            img: null,
            camera: null,
            deviceId: null,
            devices: [],
            take_pickture_using_camera: false
        };
    },
    computed: {
        device: function() {
            return this.devices.find(n => n.deviceId === this.deviceId);
        }
    },
    watch: {
        camera: function(id) {
            this.deviceId = id;
        },
        devices: function() {
            // Once we have a list select the first one
            const [first, ...tail] = this.devices;
            if (first) {
                this.camera = first.deviceId;
                this.deviceId = first.deviceId;
            }
        },
        img() {
            //if (this.img !== null) {
            this.take_pickture_using_camera = false;
            this.camera = null;
            this.deviceId = null;
            this.devices = [];
            //}
        }
    },
    methods: {
        upload_user_image() {
            ApiService.put("/upload_user_image", {
                image: this.img
            }).then(response => {
                this.profile_picture_dialog = false;
                this.$store.dispatch("store_user_image", {
                    key: "userImage",
                    value: { image: response.user_image_url }
                });
            });
        },
        onSelectFile() {
            const input = this.$refs.fileInput;
            const files = input.files;
            if (files && files[0]) {
                const reader = new FileReader();
                reader.onload = e => {
                    this.img = e.target.result;
                };
                reader.readAsDataURL(files[0]);
                this.$emit("input", files[0]);
            }
        },
        takePicture() {
            this.img = null;
            this.take_pickture_using_camera = true;
        },
        onCapture() {
            this.img = this.$refs.webcam.capture();
            // this.take_pickture_using_camera = false;
        },
        selectDevices: function() {
            // Once we have a list select the first one
            console.log("selecting devices");

            const [first, ...tail] = this.devices;
            if (first) {
                this.camera = first.deviceId;
                this.deviceId = first.deviceId;
            }
        },
        onStarted(stream) {
            console.log("On Started Event", stream);
        },
        onStopped(stream) {
            console.log("On Stopped Event", stream);
        },
        onStop() {
            this.$refs.webcam.stop();
        },
        onStart() {
            this.$refs.webcam.start();
        },
        onError(error) {
            console.log("On Error Event", error);
        },
        onCameras(cameras) {
            this.devices = cameras;
            console.log("On Cameras Event", cameras);
        },
        onCameraChange(deviceId) {
            this.deviceId = deviceId;
            this.camera = deviceId;
            console.log("On Camera Change Event", deviceId);
        }
    }
};
</script>
