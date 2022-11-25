<template>
	<div class="flexColAllWidthCls" style="justify-content: flex-start;">
		<image :src="avatar"></image>
		<div style="margin-top: 10px;color: #3d3d3d;font-size: 14px;">
			{{nickName}}
		</div>
	</div>
</template>

<script>
	import { getUserByOpenId } from '@/api/userApi';
	import { mapActions } from 'vuex';
	export default{
		name: "PersonalIndex",
		data(){
			return{
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
			this.getUserInfo();
		},
		onShareAppMessage(e) {
			return {
				title: "分享邀请",
				path: 'pages/home/index?shareFromOpenId=' + this.$store.state.openId
			}
		},
		methods: {
			...mapActions(['getUserOpenId', 'createUser']),
			async getUserInfo(){
				if(this.currentOpenId && this.currentUserInfo.id){
					if(this.currentUserInfo.is_wx_authorization && this.currentUserInfo.is_wx_authorization != 0){
						//已授权获取用户名以及头像等详细信息
						this.nickName = currentUserInfo.wx_nick;
						this.avatar = currentUserInfo.wx_avatar;
					}else{
						this.nickName = "微信用户";
						this.avatar = "";
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
								this.nickName = "微信用户";
								this.avatar = "";
							}
							// this.getProductPwd(productId);
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
									this.nickName = "微信用户";
									this.avatar = "";
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