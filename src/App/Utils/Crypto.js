import Store from 'store';
import {v4} from 'uuid';
import Crypto from 'crypto-js';

function getKey(item) {
	return item;
}

const getTokens = (key) => {
	let value = Store.get(getKey(alias(key)));
	if (!value)
		return null;
	let secret = getSecret();
	if (value) {
		let bs = Crypto.AES.decrypt(value, secret);
		try {
			value = bs.toString(Crypto.enc.Utf8);
		} catch (e) {
			console.log(e)
		}
		return value
	} else {
		return null;
	}
}

const encryptPassword = (key,value) => {
	var encrypted = Crypto.AES.encrypt(value, key.slice(0,16));
	encrypted = encrypted.toString();
	return encrypted;
}

const setTokens = (key, value) => {
	let secret = getSecret();
	value = Crypto.AES.encrypt(value, secret);
	value = value.toString();
	Store.set(getKey(alias(key)), value);
}


const get = (key) => {
	if (key === "token" || key === "access_token" || key === "refresh_token") {
		return getTokens(key);
	}
	return Store.get(getKey(key));
}

const set = (key, value) => {
	if (key === "token" || key === "access_token" || key === "refresh_token") {
		setTokens(key, value);
		return;
	}
	Store.set(getKey(key), value);
}

const getSecret = () => {
	var key = getKey("f");
	let value = Store.get(key);
	if (value) {
		let bytes = Crypto.AES.decrypt(value, '3)fvkaf?Z#%rH]t%{q(Y');
		value = bytes.toString(Crypto.enc.Utf8);
		return value;
	}
	else {
		value = v4()
		saveKey(value);
		return value;
	}
}

const saveKey = async value => {
	var key = getKey("f");
	value = Crypto.AES.encrypt(value, '3)fvkaf?Z#%rH]t%{q(Y')
	value = value.toString();
	Store.set(key, value);
}

const alias = key => {
	if (key === "access_token" || key === "token") {
		return "t";
	} else if (key === "refresh_token") {
		return "s";
	}
	else
		return key;
}

export {get, set,encryptPassword}
