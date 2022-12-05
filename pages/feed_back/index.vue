<template>
	<div class="flexColAllWidthCls" style="height: 100%;">
		<div class="flexColCls" style="width: 90%;height: 100%;justify-content: flex-start;margin-top: 10px;">
			<textarea class="textarea" v-model="feedBackTxt" style="height: 40%;background-color: #fff;width: 100%;"></textarea>
			<button :loading="btnLoading" :disabled="btnDisabled" type="primary" style="margin-top: 20px;width: 100%;" @click="submitFeedBack">提交反馈</button>
		</div>
	</div>
</template>

<script>
	import { createFeedBack } from '@/api/userApi'
	export default{
		name: "FeedBackPage",
		data(){
			return{
				btnDisabled: false,
				btnLoading: false,
				currentOpenId: this.$store.state.openId,
				feedBackTxt: ""
			}
		},
		onLoad(e) {
			
		},
		methods: {
			submitFeedBack(){
				if(!this.feedBackTxt){
					wx.showToast({
						title: "请填写反馈",
						icon: "none",
						duration: 2000
					})
				}else{
					if(this.currentOpenId){
						this.btnDisabled = true;
						this.btnLoading = true;
						createFeedBack({openId: this.currentOpenId, feedBack: this.feedBackTxt}).then(data => {
							var resData = data.data;
							if(resData.code == 0){
								wx.showToast({
									title: "提交成功",
									icon: "success",
									duration: 2000
								})
								setTimeout(() => {
									this.btnLoading = false;
									this.btnDisabled = false;
									uni.navigateBack();
								}, 1000)
							}else{
								this.btnLoading = false;
								this.btnDisabled = false;
								wx.showToast({
									title: resData.msg,
									icon: "error",
									duration: 2000
								})
							}
						}).catch(err => {
							this.btnLoading = false;
							this.btnDisabled = false;
							wx.showToast({
								title: "操作失败，网络错误",
								icon: "error",
								duration: 2000
							})
						})
					}else{
						
					}
				}
			},
		}
	}
</script>

<style>
</style>