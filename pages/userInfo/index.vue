<template>
	<div class="flexColAllWidthCls" style="background-color: #fff;padding: 20px 0;">
		<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" style="height: 80px;width: 80px;border-radius: 40px;padding: 0;font-size: 14px;line-height: 80px;text-align: center;position: relative;">
			选择头像
			<image class="avatar" :src="currentAvatar" style="height: 80px;width: 80px;border-radius: 40px;position: absolute;top: 0;left: 0;"></image>
		</button> 
		<input type="nickname" v-model="currentNickName" class="weui-input" placeholder="请输入昵称" style="margin-top: 20px;border: 1px solid #666;height: 30px;width: 70%;border-radius: 3px;text-align: center;"/>
		<button @click="submitBtnClick" size="mini" type="warn" style="margin-top: 10px;">提交资料</button>
	</div>
</template>

<script>
	import { getUserByOpenId, updateUserInfo } from '@/api/userApi';
	export default{
		name: "UserInfo",
		data(){
			return {
				currentOpenId: this.$store.state.openId,
				currentAvatar: "",
				currentNickName: ""
			}
		},
		onLoad(e){
			this.getUserInfo();
		},
		methods: {
			submitBtnClick(){
				var params = {
					openId: this.currentOpenId,
					nickName: this.currentNickName,
					avatar: this.currentAvatar
				}
				updateUserInfo(params).then(data => {
					if(data.data.code == 0){
						wx.showToast({
							title: "修改成功",
							icon: "none"
						})
						setTimeout(() => {
							uni.navigateBack();
						}, 1000)
					}else{
						wx.showToast({
							title: data.data.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "提交失败，网络错误",
						icon: "none"
					})
				})
			},
			onChooseAvatar(e){
				const { avatarUrl } = e.detail;
				this.currentAvatar = avatarUrl;
			},
			getUserInfo(){
				getUserByOpenId({openId: this.currentOpenId}).then(data => {
					if(data.data.code == 0){
						var resData = data.data.userInfo;
						this.currentAvatar = resData.wx_avatar;
						this.currentNickName = resData.wx_nick;
					}
				}).catch(err => {
					
				})
			}
		}
	}
</script>

<style>
</style>