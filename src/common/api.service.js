import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/common/jwt.service";
import ApiUrl from "@/config";
import { store } from "@/store/store";
import { vm } from "@/main";

let client = null;
let user_group = null;

const ApiService = {
    init() {
        Vue.use(VueAxios, axios);
        Vue.axios.defaults.baseURL = ApiUrl;

        Vue.axios.interceptors.request.use(
            config => {
                if (config.method == 'get' && config.params && config.params.loadingPartial === true) {
                    vm.loadingPartial = true
                } else {
                    vm.loading = true;
                }

                // Timeout - Will wait 120 secs for response
                // Then it will terminate automatically
                config.timeout = 120 * 1000;
                return config;
            },
            error => {
                vm.loading = false;
                vm.loadingPartial = false;
                return Promise.reject(error);
            }
        );

        Vue.axios.interceptors.response.use(
            response => {
                vm.loading = false;
                vm.loadingPartial = false;

                // console.log("Interceptor: Received Response");
                // console.log('HTTP Response:);
                // console.log(response);

                const { config, data } = response;

                const configData = config.data
                    ? JSON.parse(config.data)
                    : {
                        errorHandle: true,
                        hideSnackbar: false
                    };

                // console.log("Config");
                // console.log(config);

                if (data && data.code == 2) {
                    store.dispatch("forceLogout");
                } else if (data && data.code == 0) {
                    if (
                        !configData.hasOwnProperty("errorHandle") ||
                        (configData.hasOwnProperty("errorHandle") &&
                            configData.errorHandle !== false)
                    ) {
                        vm.snackbar = true;
                        vm.snackbarText = data.message;
                        vm.snackbarColor = "error";
                    }
                    return Promise.reject(data);
                } else {
                    if (config.method != "get" && (configData.hasOwnProperty("hideSnackbar") && configData.hideSnackbar !== true)) {
                        vm.snackbar = true;
                        vm.snackbarText = data.message;
                        vm.snackbarColor = "success";
                    }
                    else if(data.snackbar==true)
                    {
                        vm.snackbar = true;
                        vm.snackbarText = data.message;
                        vm.snackbarColor = "success";
                    }
                    
                    return data;
                }
            },
            error => {
                vm.loading = false;
                vm.loadingPartial = false;
                //console.log("Interceptor: Error Response");
                //console.log("Error: ");
                //console.log(error);

                vm.snackbar = true;
                vm.snackbarText = data.message;
                vm.snackbarColor = "error";
                return Promise.reject(error);
            }
        );
    },

    setHeader() {
        Vue.axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${JwtService.getToken()}`;
    },

    setClient(client_id, user_group_id) {
        client = client_id;
        user_group = user_group_id;
    },

    unsetClient() {
        client = null;
        user_group = null;
    },

    query(resource, params) {
        resource = setClientInUrl(resource);
        return Vue.axios.get(resource, {
            params
        });
    },

    get(resource, params) {
        this.setHeader();
        resource = setClientInUrl(resource);
        return Vue.axios.get(resource, { params });
    },

    post(resource, params) {
        this.setHeader();
        resource = setClientInUrl(resource);
        return Vue.axios.post(`${resource}`, params);
    },

    update(resource, slug, params) {
        this.setHeader();
        resource = setClientInUrl(resource);
        return Vue.axios.put(`${resource}/${slug}`, params);
    },

    put(resource, params) {
        this.setHeader();
        resource = setClientInUrl(resource);
        return Vue.axios.put(`${resource}`, params);
    },

    getWether(resource) {
        this.setHeader();
        resource = setClientInUrl(resource);
        return Vue.axios.get(resource);
    },

    delete(resource) {
        this.setHeader();
        resource = setClientInUrl(resource);
        return Vue.axios.delete(resource);
    }
};

const setClientInUrl = resource => {
    if (client != null && user_group !== null) return resource + "?client=" + client + '&user_group=' + user_group;
    else return resource;
};

export default ApiService;
