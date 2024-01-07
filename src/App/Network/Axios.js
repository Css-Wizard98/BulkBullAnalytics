import {getToken, Wrapper as DecentralizeWrapper} from './DecentralizeWrapper'

const MainApis = new DecentralizeWrapper({
	basePath:"employee/",
	tokenName:'dice-emp-token',
	refreshToken:"dice-emp-refresh_token"
})
const get = MainApis.get;
const patch = MainApis.patch;
const post = MainApis.post;
const deleteAPI = MainApis.delete;
const axios = MainApis.axios;

export {
	axios,
	get,
	post,
	getToken,
	patch,
	deleteAPI
}
