// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
import { getUserByOpenId, getOpenId } from '@/api/userApi';
Vue.use(Vuex)
const store = new Vuex.Store({
// #endif

// #ifdef VUE3
import { createStore } from 'vuex';

const store = createStore({
// #endif
	state: {
		hasLogin: false,
		isUniverifyLogin: false,
		loginProvider: "",
		openId: null,
		testvuex: false,
		colorIndex: 0,
		colorList: ['#FF0000', '#00FF00', '#0000FF'],
		noMatchLeftWindow: true,
		active: 'componentPage',
		leftWinActive: '/pages/component/view/view',
		activeOpen: '',
		menu: [],
		univerifyErrorMsg: '',
		currentUserInfo: {}
	},
	mutations: {
		setUserInfo(state, userInfo){
			state.currentUserInfo = userInfo;
		},
		login(state, provider) {
			state.hasLogin = true;
			state.loginProvider = provider;
		},
		logout(state) {
			state.hasLogin = false
			state.openId = null
		},
		setopenId(state, openId) {
			state.openId = openId
			console.log('sssss', state.openId);
		},
		setTestTrue(state) {
			state.testvuex = true
		},
		setTestFalse(state) {
			state.testvuex = false
		},
		setColorIndex(state, index) {
			state.colorIndex = index
		},
		setMatchLeftWindow(state, matchLeftWindow) {
			state.noMatchLeftWindow = !matchLeftWindow
		},
		setActive(state, tabPage) {
			state.active = tabPage
		},
		setLeftWinActive(state, leftWinActive) {
			state.leftWinActive = leftWinActive
		},
		setActiveOpen(state, activeOpen) {
			state.activeOpen = activeOpen
		},
		setMenu(state, menu) {
			state.menu = menu
		},
		setUniverifyLogin(state, payload) {
			typeof payload !== 'boolean' ? payload = !!payload : '';
			state.isUniverifyLogin = payload;
		},
		setUniverifyErrorMsg(state,payload = ''){
			state.univerifyErrorMsg = payload
		}
	},
	getters: {
		currentColor(state) {
			return state.colorList[state.colorIndex]
		}
	},
	actions: {
		// lazy loading openId
		getUserOpenId: async function({
			commit,
			state,
			dispatch
		}) {
			return await new Promise(async(resolve, reject) => {
				if (state.openId) {
					var resData = await dispatch('getUserInfo', state.openId)
					// var resData = await this.getUserInfo(state.openId);
					resolve({openId: state.openId, userCode: resData.code, userMsg: resData.msg});
				} else {
					uni.login({
						provider: "weixin",
						success: (data) => {
							commit('login')
							getOpenId({userCode: data.code}).then(async(data) => {
								if(data.data.code == 0){
									commit('setopenId', data.data.openId);
									var resData = await dispatch('getUserInfo', state.openId)
									resolve({openId: state.openId, userCode: resData.code, userMsg: resData.msg});
								}else{
									reject(data);
								}
							}).catch(err => {
								reject(err);
							})
						},
						fail: (err) => {
							console.log('uni.login ???????????????????????????????????????????????????????????????', err)
							reject(err)
						}
					})
				}
			})
		},
		getUserInfo({commit}, openId){
			return new Promise((resolve, reject) => {
				getUserByOpenId({openId: openId}).then(data => {
					var resData = data.data;
					if(resData.code == 0){
						commit('setUserInfo', resData.userInfo);
						resolve({ code: 0, msg: "????????????"})
					}else if(resData.code == -2){
						//?????????????????????????????? ?????????
						// this.getWXUserInfo();
						resolve({ code: -2, msg: "??????????????????????????????" })
					}
				}).catch(err => {
					resolve({ code: -1, msg: "?????????????????????????????????????????????" });
				})
			})
		},
		createUser({commit, dispatch}, openId, parentOpenId){
			return new Promise((resolve, reject) => {
				var params = {
					openId: openId,
					wxNick: "????????????",
					wxAvatar: "",
					parentOpenId: parentOpenId,
					isAuthorization: 0
				}
				createUser(params).then(async(data) => {
					var resData = data.data;
					if(resData.code == 0){
						var resData = await dispatch('getUserInfo', state.openId);
						resolve({ code: 0 })
					}else{
						resolve({ code: -1 })
					}
				}).catch(err => {
					resolve({ code: -2 })
				})
			})
		},
		getPhoneNumber: function({
			commit
		}, univerifyInfo) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/univerify-login',
					method: 'POST',
					data: univerifyInfo,
					success: (res) => {
						const data = res.data
						if (data.success) {
							resolve(data.phoneNumber)
						} else {
							reject(res)
						}

					},
					fail: (err) => {
						reject(res)
					}
				})
			})
		}
	}
})

export default store
