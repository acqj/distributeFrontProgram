<template>
	<div class="flexColAllWidthCls" style="justify-content: flex-start;">
		<div style="position: relative;">
			<image :src="avatar" style="height: 80px;width: 80px;border-radius: 40px;"></image>
			<div v-if="!isAuth" @click="getAuthClick" size="mini" style="text-align: center;width: 80px;position: absolute;top: 35%;background-color: limegreen;color: #fff;">点击授权</div>
		</div>
		<div style="margin-top: 10px;color: #3d3d3d;font-size: 14px;">
			{{nickName}}
		</div>
		<div class="flexRowAllWidthCls" style="margin-top: 10px;">
			<div class="flexRowCls" style="color: #FF8F1F;">
				<uni-icons type="star-filled" size="15" color="#FF8F1F"></uni-icons>
				<div style="margin-left: 2px;">一级代理</div>
			</div>
			<div class="flexRowCls" style="margin-left: 10px;" v-if="currentUserInfo.parent_openid != null && currentUserInfo.parent_openid != ''">
				<uni-icons type="star-filled" size="15" color="silver"></uni-icons>
				<div style="margin-left: 2px;color:silver;">二级代理</div>
			</div>
		</div>
		<div class="flexRowCls" style="background-color: #fff;border-radius: 10px;width: 80%;margin-top: 20px;">
			<div class="flexRowCls" style="width: 85%;margin: 10px 0;" @click="gotoRelation">
				<div style="color: #3d3d3d;font-size: 14px;flex: 1;">
					我的销售体系
				</div>
				<div>
					<uni-icons type="right" size="20"></uni-icons>
				</div>
			</div>
			
		</div>
		<div class="flexRowAllWidthCls" style="margin-top: 20px;">
			<button type="warn" style="width: 80%;" data-name="shareBtn" open-type="share">发展销售队伍</button>
		</div>
		<div class="flexRowCls" style="background-color: #fff;border-radius: 10px;width: 80%;margin-top: 200px;">
			<div class="flexRowCls" style="width: 85%;margin: 10px 0;" @click="gotoBankCardInfo">
				<div style="color: #3d3d3d;font-size: 14px;flex: 1;">
					银行卡信息
				</div>
				<div>
					<uni-icons type="right" size="20"></uni-icons>
				</div>
			</div>
		</div>
		<div class="flexRowCls" style="background-color: #fff;border-radius: 10px;width: 80%;margin-top: 10px;">
			<div class="flexRowCls" style="width: 85%;margin: 10px 0;" @click="gotoFeedback">
				<div style="color: #3d3d3d;font-size: 14px;flex: 1;">
					意见反馈
				</div>
				<div>
					<uni-icons type="right" size="20"></uni-icons>
				</div>
			</div>
		</div>
		<div class="flexRowCls" style="background-color: #fff;border-radius: 10px;width: 80%;margin-top: 10px;">
			<div class="flexRowCls" style="width: 85%;margin: 10px 0;" @click="gotoHandbook">
				<div style="color: #3d3d3d;font-size: 14px;flex: 1;">
					使用说明
				</div>
				<div>
					<uni-icons type="right" size="20"></uni-icons>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { getUserByOpenId, updateUserInfo } from '@/api/userApi';
	import { mapActions } from 'vuex';
	export default{
		name: "PersonalIndex",
		data(){
			return{
				isAuth: false,
				nickName: "",
				avatar: "",
				currentOpenId: this.$store.state.openId,
				currentUserInfo: this.$store.state.currentUserInfo,
				parentOpenId: ""
			}
		},
		onLoad(e) {
			console.log("currentUserInfocurrentUserInfocurrentUserInfo");
			console.log(this.currentUserInfo);
			
			if(e.shareFromOpenId){
				//标识带有分享自某个openId 需记录上一级
				this.parentOpenId = e.shareFromOpenId;
			}
			this.getCurrentUserInfo();
		},
		onShareAppMessage(e) {
			return {
				title: "分享邀请",
				path: 'pages/home/index?shareFromOpenId=' + this.$store.state.openId
			}
		},
		onShow() {
			console.log('oooooooooooooooshow');
			if(!this.$store.state.openId){
				this.getCurrentUserInfo();
			}else{
				this.currentOpenId = this.$store.state.openId;
				this.updateLocalUserInfo();
			}
		},
		methods: {
			...mapActions(['getUserOpenId', 'createUser', 'getUserInfo']),
			gotoBankCardInfo(){
				uni.navigateTo({
					url:"/pages/bankCard_info/index"
				})
			},
			updateLocalUserInfo(){
				this.getUserInfo(this.$store.state.openId).then(async(data) => {
					if(data.code == 0){
						if(this.$store.state.currentUserInfo.id){
							this.currentUserInfo = this.$store.state.currentUserInfo;
							this.nickName = this.currentUserInfo.wx_nick;
							this.avatar = this.currentUserInfo.wx_avatar;
							if(this.currentUserInfo.is_wx_authorization != 1){
								this.isAuth = false;
							}else{
								this.isAuth = true;
							}
						}
					}else if(data.code == -2){
						//当前用户表不存在该用户 自动注册
						if(this.parentOpenId == this.$store.state.openId){
							this.parentOpenId = "";
						}
						var resUserData = await this.createUser(this.$store.state.openId, this.parentOpenId);
						if(resUserData.code == 0){
							if(this.currentUserInfo.is_wx_authorization && this.currentUserInfo.is_wx_authorization != 0){
								//已授权获取用户名以及头像等详细信息
								this.nickName = this.currentUserInfo.wx_nick;
								this.avatar = this.currentUserInfo.wx_avatar;
							}else{
								if(!this.currentUserInfo.wx_nick)
								{
									this.nickName = "微信用户";
								}
								if(!this.currentUserInfo.wx_avatar){
									this.avatar = "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132";
								}
							}
							if(this.currentUserInfo.is_wx_authorization != 1){
								this.isAuth = false;
							}else{
								this.isAuth = true;
							}
						}else{
							wx.showToast({
								title: "获取用户信息失败",
								icon: "none",
								duration: 2000
							})
						}
					}
				}).catch(err => {
					wx.showToast({
						title: "获取用户信息失败，网络错误",
						icon: "error",
						duration: 2000,
					})
				})
			},
			async getAuthClick(){
				if(!this.currentOpenId){
					var res = await this.getUserOpenId();
					if(res.openId){
						this.currentOpenId = res.openId;
					}
				}
				uni.showModal({
					title:'授权',
					content:"是否授权",
					success: (resData) => {
						if(resData.confirm){
							wx.getSetting({
								success:(res) => {
									if (res.authSetting['scope.userInfo']) {
										wx.getUserProfile({
											desc: "获取你的昵称、头像信息",//必填项，声明获取用户个人信息后的用途，不超过30个字符
											success: (res) => {
											  const userInfo = res.userInfo;
											  this.nickName = userInfo.nickName;
											  this.avatar = userInfo.avatarUrl;
											  this.updateUser();//授权成功更新用户表
											},
											fail: (res) => {
											  //拒绝授权
											  wx.showToast({
												title: "获取失败",
												icon: "error",
												duration: 2000,
												});
											},
										});
									}
								}
							})
						}else{
							// this.nickName = "";
							// this.avatar = "";
							// this.createUserFunc(0);
						}						
					}
				})
			},
			updateUser(){
				var params = {
					openId: this.currentOpenId,
					nickName: this.nickName,
					avatar: this.avatar
				}
				updateUserInfo(params).then(data => {
					var resData = data.data;
					if(resData.code == 0){
						this.isAuth = true;
					}else{
						wx.showToast({
							title: resData.msg,
							icon: "none",
							duration: 2000
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "更新用户信息失败，网络错误",
						icon: "none",
						duration: 2000
					})
				})
			},
			gotoFeedback(){
				uni.navigateTo({
					url: "/pages/feed_back/index"
				})
			},
			gotoHandbook() {
				uni.navigateTo({
					url: "/pages/handbook/index"
				})
			},
			// onShareClick(){
			// 	wx.showShareMenu({
			// 		withShareTicket:true,
			// 		//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
			// 		menus:["shareAppMessage","shareTimeline"],
			// 		success: (res) => {
			// 			console.log('rrrrrrrrrrrrrrrrrrrrres');
			// 			console.log(res);
			// 		},
			// 		fail:(err) => {
			// 			console.log('errrrrrrrrrr');
			// 			console.log(err);
			// 		}
			// 	})
			// },
			gotoRelation(){
				if(this.currentOpenId){
					uni.navigateTo({
						url:"/pages/relation/index?parentOpenId=" + this.currentUserInfo.parent_openid
					})
				}else{
					wx.showToast({
						title: "获取当前用户openId失败",
						icon: "none",
						duration: 2000
					})
				}
			},
			async getCurrentUserInfo(){
				if(this.currentOpenId && this.currentUserInfo.id){
					if(this.currentUserInfo.is_wx_authorization && this.currentUserInfo.is_wx_authorization != 0){
						//已授权获取用户名以及头像等详细信息
						this.nickName = this.currentUserInfo.wx_nick;
						this.avatar = this.currentUserInfo.wx_avatar;
					}else{
						if(!this.currentUserInfo.wx_nick)
						{
							this.nickName = "微信用户";
						}
						if(!this.currentUserInfo.wx_avatar){
							this.avatar = "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132";
						}
					}
					if(this.currentUserInfo.is_wx_authorization != 1){
						this.isAuth = false;
					}else{
						this.isAuth = true;
					}
				}else{
					var res = await this.getUserOpenId();
					if(res.openId){
						if(res.userCode == 0){
							if(this.currentUserInfo.is_wx_authorization && this.currentUserInfo.is_wx_authorization != 0){
								//已授权获取用户名以及头像等详细信息
								this.nickName = this.currentUserInfo.wx_nick;
								this.avatar = this.currentUserInfo.wx_avatar;
							}else{
								if(!this.currentUserInfo.wx_nick)
								{
									this.nickName = "微信用户";
								}
								if(!this.currentUserInfo.wx_avatar){
									this.avatar = "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132";
								}
							}
							if(this.currentUserInfo.is_wx_authorization != 1){
								this.isAuth = false;
							}else{
								this.isAuth = true;
							}
						}else if(res.userCode == -2){
							//当前用户表不存在该用户 自动注册
							if(this.parentOpenId == res.openId){
								this.parentOpenId = "";
							}
							var resUserData = await this.createUser(res.openId, this.parentOpenId);
							if(resUserData.code == 0){
								if(this.currentUserInfo.is_wx_authorization && this.currentUserInfo.is_wx_authorization != 0){
									//已授权获取用户名以及头像等详细信息
									this.nickName = this.currentUserInfo.wx_nick;
									this.avatar = this.currentUserInfo.wx_avatar;
								}else{
									if(!this.currentUserInfo.wx_nick)
									{
										this.nickName = "微信用户";
									}
									if(!this.currentUserInfo.wx_avatar){
										this.avatar = "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132";
									}
								}
								if(this.currentUserInfo.is_wx_authorization != 1){
									this.isAuth = false;
								}else{
									this.isAuth = true;
								}
							}else{
								wx.showToast({
									title: "获取用户信息失败",
									icon: "none",
									duration: 2000
								})
							}
						}else{
							wx.showToast({
								title: "当前用户信息有误，登陆失败",
								icon: "none",
								duration: 2000
							})
						}
					}else{
						wx.showToast({
							title: "当前用户信息有误，登陆失败",
							icon: "none",
							duration: 2000
						})
					}
				}
			}
		}
	}
</script>

<style>
</style>