import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import 'firebase/compat/database';
import 'firebase/compat/messaging';
import {get} from "../Network/Axios";

class config {

	callbacks = [];
	isInit = false;
	config = undefined;

	init() {
		this.isInit = true;
		get(`/config/config`, (e, r) => {
			if(r){
				this.config = r;
				this.onConfigAdded()
			}
		})
	}

	onConfigAdded() {
		let data = this.config;
		this.callbacks.forEach(cb => {
			cb(data);
		});
		this.callbacks = [];
	}

	fetchConfig(cb) {

		if (this.config) {
			cb(this.config);
		} else {
			if (!this.isInit) {
				this.init();
			}
			this.callbacks.push(cb);
		}
	}
}

let Config = new config();

export { Config };
