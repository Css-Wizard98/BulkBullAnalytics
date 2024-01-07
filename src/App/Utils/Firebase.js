import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import 'firebase/compat/database';
import 'firebase/compat/messaging';
import {get} from "../Network/Axios";

class Firebase{
	firebaseConfig = {
		apiKey: "AIzaSyBsy8egl_xrhbj7ZFHS52kc1cO5zED58eQ",
		authDomain: "fintrip-47824.firebaseapp.com",
		databaseURL: "https://fintrip-47824.firebaseio.com",
		projectId: "fintrip-47824",
		storageBucket: "fintrip-47824.appspot.com",
		messagingSenderId: "462305025824",
		appId: "1:462305025824:web:75b1b299f9191e776ac145",
		measurementId: "G-T1X9BD0SZ2"
	}
	authenticated = false;
	cb = undefined;
	inited = false;
	lunaCb = [];
	databaseCb = [];
	init() {
		if (this.inited) {
			return;
		}
		this.inited = true;
		firebase.initializeApp(this.firebaseConfig);
	}
	fetchDb(cb) {
		if (this.database) {
			cb(this.database)
		} else {
			this.databaseCb.push(cb);
		}
	}
	addCallback(key, listener) {
		this.lunaCb.push({
			listener,
			key
		})
		if (this._data) {
			listener(this._data)
		} else if (!this._data) {
			listener(null)
		}
	}
	removeCallback(key) {
		this.lunaCb = this.lunaCb.filter(value => value.key !== key);
	}
	signout() {
		firebase.auth().signOut();
		this.cb = undefined;
	}

	initializeApp() {
		let self = this;
		if (!self.authenticated) {
			self.authenticated = true;
			self.cb = function (user) {
				if (user) {
					get(`/config/config`, (e, cb) => {
						if(cb){
							let url = `luna/${cb.tenant}/users/${cb.claim}`
							self.database = firebase.database();
							self.databaseCb.forEach(cb => {
								cb(self.database)
							})
							self.databaseCb = [];
							self.database.ref(url).on('value', function (snapshot) {
								console.log(snapshot)
								if (snapshot) {
									self._data = snapshot.val();
									self.lunaCb.forEach(value => {
										value.listener(self._data)
									})
									self.__support = snapshot.val();
								}
							})
						}
					})
				} else {
					get(`/auth/firebase`, (e, r) => {
						if (r) {
							firebase.auth().signInWithCustomToken(r.token).then(succes => {
								user = firebase.auth().currentUser;
							}).catch(console.log)
						}
					})
				}
			}
			firebase.auth().onAuthStateChanged(function (user) {
				if (self.cb != null) {
					self.cb(user)
				}
			});
		}
	}
}

let FireUtils = new Firebase()

export {
	FireUtils
}
