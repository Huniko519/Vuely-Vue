import ApiService from "@/common/api.service";
import {vm} from "@/main";
import router from "../../../router";

const state = {};
const getters = {};

const actions = {
	getUrl(context, payload) {
		let type = payload.type;
		let id = payload.id;
		switch (type) {
			case "location": {
				router.push("/locations/" + id).catch(err => {
				});
				break;
			}
			case "patient": {
				router.push("/patients/" + id).catch(err => {
				});
				break;
			}
			case "client": {
				router.push("/clients/" + id).catch(err => {
				});
				break;
			}
			case "user": {
				router.push("/users/" + id).catch(err => {
				});
				break;
			}
			case "patient_form": {
				if (payload.path.includes('patient')) {
					vm.$emit("FetchFormData", id);
				} else {
					router.push("/patients/" + payload.patient_id).catch(err => {
					});
				}
				break;
			}
		}
	},
	STORE_PATIENT(context, payload) {
		ApiService.post("store_patient", payload).then(response => {
			if (payload.action !== "update") {
				router.push("/patients/" + response.patient._id);
			} else {
				vm.$emit("FetchPageData");
			}
		});
	}
};

export default {
	state,
	getters,
	actions
};
