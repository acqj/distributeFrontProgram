// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
import { getUserByOpenId } from '@/api/userApi';
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
							let appid = "wx0724a71a0913f7ae";
							let secret = "33213cffc09e57eaf7d946f8c30d7788";
							let url =
								"https://api.weixin.qq.com/sns/jscode2session?appid=" +
								appid +
								"&secret=" +
								secret +
								"&js_code=" +
								data.code +
								"&grant_type=authorization_code";
							uni.request({
								url: url, // 请求路径
								success: async(r) => {
								  console.log("r", r);
								  console.info("用户的openId", r.data.openid);
								  commit('setopenId', r.data.openid)
								 // var resData = await this.getUserInfo(r.data.openid);
								 var resData = await dispatch('getUserInfo', state.openId)
								 resolve({openId: state.openId, userCode: resData.code, userMsg: resData.msg});
								},
							  });
							// commit('setopenId', openId)
							
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
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
						resolve({ code: 0, msg: "获取成功"})
					}else if(resData.code == -2){
						//当前用户不存在用户表 需新增
						// this.getWXUserInfo();
						resolve({ code: -2, msg: "当前用户不存在用户表" })
					}
				}).catch(err => {
					resolve({ code: -1, msg: "获取当前用户信息失败，网络错误" });
				})
			})
		},
		createUser({commit, dispatch}, openId, parentOpenId){
			return new Promise((resolve, reject) => {
				var params = {
					openId: openId,
					wxNick: "微信用户",
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
