import * as Crypto from "../Utils/Crypto";
import qs from 'qs'
import {parseJson} from "../Utils/Utils";
import Axios from 'axios';

class Wrapper{

	axios;
	refreshSubscribers = [];
	config = {}

	getRefreshToken() {
		let self = this;
		let token = Crypto.get(this.config.refreshToken);
		if (!token) {
			localStorage.clear()
			window.location.reload();
		}
		return self.axios.post(`${self.getUrl()}/auth/token/refresh`, {
			token
		});
	}


	onRefreshed (token) {
		let self = this;
		self.setTokens(token);
		self.isRefreshing = false;
		self.refreshSubscribers = self.refreshSubscribers.filter(cb => {
			cb(token);
			return false;
		});
		self.refreshSubscribers = [];
	}


	subscribeTokenRefresh (cb){
		let self = this;
		self.refreshSubscribers.push(cb);
	}

	setTokens(token) {
		Crypto.set(this.config.tokenName, token);
	}

	constructor(config) {
		let self = this;
		self.axios = Axios.create({
			timeout : 62500 * 3
		});
		self.config = config;
		self.isRefreshing = false;
		self.axios.interceptors.response.use(response => {
			return response;
		}, function (error) {
			if(error.response.config.url==='auth/token/refresh'){
				localStorage.clear()
				window.location.reload();
			}
			const err = error.response;
			if (err && err.status === 401 && err.config) {
				const originalRequest = err.config;
				if (!self.isRefreshing) {
					self.isRefreshing = true;
					self.getRefreshToken()
						.then(function (success) {
							self.onRefreshed(success.data.access_token)
						}).catch(err => {
						localStorage.clear()
						window.location.reload();
					});
				}
				return new Promise((resolve, reject) => {
					self.subscribeTokenRefresh(token => {
						originalRequest.headers['Authorization'] = 'Bearer ' + token;
						resolve(Axios(originalRequest));
					});
				});
			} else {
				if (err)
					return Promise.reject(err);
			}
		});

		self.axios.interceptors.request.use(async function (config) {
			const token = Crypto.get(self.config.tokenName);
			if (token !== null && token !== "") {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		}, function (err) {
			return Promise.reject(err);
		});
	}

	getUrl = () => {
		const token = Crypto.get(this.config.tokenName);
		if(!token)
			return "https://example.com/";
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
		let json = JSON.parse(jsonPayload);
		if(!json.origin){
			return "https://example.com/";
		}
		return json.origin + this.config.basePath;
	}

	get=(url, cb, data = {})=>{
		if(url.startsWith("/")){
			url = url.substr(1,url.length)
		}
		let self = this;
		let base = self.getUrl()
		if(url.startsWith('https://'))
			base=''
		self.axios.get(`${base}${url}`, {
			params: data,
			paramsSerializer: params => {
				return qs.stringify(params, { arrayFormat: 'repeat' })
			},
		}).then(res => {
			if (url.includes(".csv")) {
				cb(null, parseJson(res.data))
			} else {
				cb(null, res.data)
			}
		}).catch(err => {
			cb(err)
		});
	}


	delete = (url, cb,data={}) => {
		if(url.startsWith("/")){
			url = url.substr(1,url.length)
		}
		let self = this;
		let base = self.getUrl()
		if(url.startsWith('https://'))
			base=''
		self.axios.delete(`${base}${url}`, {
			data
		}).then(res => {
			cb(null, res.data)
		}).catch(err => {
			cb(err)
		});
	}

	post=(url, data, cb)=>{
		if(url.startsWith("/")){
			url = url.substr(1,url.length)
		}
		let self = this;
		let base = self.getUrl()
		if(url.startsWith('https://'))
			base=''
		self.axios.post(`${base}${url}`, data, {
			headers: {
				'Content-Type': 'application/json',
			}
		}).then(res => {
			cb(null, res.data)
		}).catch(err => {
			cb(err)
		});
	}

	patch = (url, data, cb) => {
		if(url.startsWith("/")){
			url = url.substr(1,url.length)
		}
		let self = this;
		let base = self.getUrl()
		if(url.startsWith('https://'))
			base=''
		self.axios.patch(`${base}${url}`, data).then(res => {
			cb(null, res.data)
		}).catch(err => {
			if (err && !err.isCanceled) {
				cb(err)
			}
		});
	}

}

const getToken = () => {
	return Crypto.get('dice-emp-token');
}

const getUploadUrl = () => {
	const token = Crypto.get('dice-emp-token');
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	let json = JSON.parse(jsonPayload);
	if(json.upload){
		return json.upload + "dice/employee/upload";
	}else{
		return 'https://hive.eka.io/dice/employee/upload'
	}
}

export {
	Wrapper,getToken,getUploadUrl
}
