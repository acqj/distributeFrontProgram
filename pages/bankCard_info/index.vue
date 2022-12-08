<template>
	<div class="flexColAllWidthCls">
		<div style="width: 90%;background-color: #fff;border-radius: 10px;padding: 10px;">
			<uni-forms :value="bankCardInfo" ref="bankCardFormRef" labelWidth="100px" validate-trigger="bind" err-show-type="undertext">
				<uni-forms-item name="openAccountName" required label="姓名">
					<input type="text" v-model="bankCardInfo.openAccountName" placeholder="请输入开户人姓名" class="uni-input-border"/>
				</uni-forms-item>
				<uni-forms-item name="idCardNo" required label="身份证号">
					<input type="text" v-model="bankCardInfo.idCardNo" placeholder="请输入身份证号" class="uni-input-border"/>
				</uni-forms-item>
				<uni-forms-item name="tel" required label="手机号码">
					<input type="text" v-model="bankCardInfo.tel" placeholder="请输入手机号码" class="uni-input-border"/>
				</uni-forms-item>
				<uni-forms-item name="bankCardNo" required label="银行卡号">
					<input type="text" v-model="bankCardInfo.bankCardNo" placeholder="请输入银行卡号" class="uni-input-border"/>
				</uni-forms-item>
				<!-- <uni-forms-item name="bankName" required label="银行名称">
					<input type="text" v-model="bankCardInfo.bankName" placeholder="请输入所属银行名称" class="uni-input-border"/>
				</uni-forms-item>
				<uni-forms-item name="openAccountAddress" required label="开户地">
					<input type="text" v-model="bankCardInfo.openAccountAddress" placeholder="请输入开户省市区" class="uni-input-border"/>
				</uni-forms-item> -->
			</uni-forms>
		</div>
		<div style="width: 50%;margin-top: 20px;">
			<button type="warn" @click="submitBtnClick">提交</button>
		</div>
	</div>
</template>

<script>
	import { getBankCardInfo, createOrUpdateBankCardInfo, addBankCardInfo } from '@/api/bankCardApi';
	export default{
		name: "BankCardInfo",
		data(){
			return {
				isNeedBack: false,
				currentOpenId: this.$store.state.openId,
				bankCardId: "",
				bankCardInfo: {
					bankCardNo: "",
					bankName: "",
					openAccountName: "",
					openAccountAddress: "",
					tel: "",
					idCardNo: ""
				},
				bankCardRules:{
					tel:{
						rules:[
							{
								required: true,
								errorMessage: '请输入手机号码',
							},
							{
								validateFunction: function(rule, value, data, callback) {
									let iphoneReg = (
										/^(13[0-9]|14[1579]|15[0-3,5-9]|16[6]|17[0123456789]|18[0-9]|19[89])\d{8}$/
									); //手机号码
									if (!iphoneReg.test(value)) {
										callback('手机号码格式不正确，请重新填写')
									}
								}
							}
						]
					},
					bankCardNo:{
						rules:[{
								required: true,
								errorMessage: '请输入银行卡号'
							}]
					},
					// bankName: {
					// 	rules:[{
					// 			required: true,
					// 			errorMessage: '请输入银行名称'
					// 		}]
					// },
					openAccountName: {
						rules: [{
							required: true,
							errorMessage: '请输入开户人姓名'
						}]
					},
					idCardNo: {
						rules: [
							{
								required: true,
								errorMessage: "请输入身份证号码"
							},
							{
								validateFunction: function(rule, value, data, callback) {
									let iphoneReg = (
										/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
									); //
									if (!iphoneReg.test(value)) {
										callback('身份证格式不正确，请重新填写')
									}
								}
							}
						]
					}
					// openAccountAddress: {
					// 	rules: [{
					// 		required: true,
					// 		errorMessage: '请输入开户地'
					// 	}]
					// }
				}
			}
		},
		onLoad(e) {
			if(e.isNeedBack){
				this.isNeedBack = e.isNeedBack;
			}
			// if(this.currentOpenId){
			// 	this.getData();
			// }
			// else{
			// 	this.getOpenId();
			// }
		},
		onReady() {
			this.$nextTick(() => {  
			    this.$refs.bankCardFormRef.setRules(this.bankCardRules);  
			});
		},
		methods: {
			getData(){
				getBankCardInfo({openId: this.currentOpenId}).then(data => {
					if(data.data.code == 0){
						var resData = data.data.data;
						if(resData){
							this.bankCardId = resData.id;
							this.bankCardInfo.bankCardNo = resData.bankCardNo;
							this.bankCardInfo.bankName = resData.bankName;
							this.bankCardInfo.openAccountName = resData.openAccountName;
							this.bankCardInfo.openAccountAddress = resData.openAccountAddress;
						}
					}else{
						wx.showToast({
							title: data.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取银行卡信息失败，网络错误",
						icon: "none"
					})
				})
			},
			submitBtnClick(){
				this.$refs.bankCardFormRef.validate().then(res => {
					var params = {
						openId: this.currentOpenId,
						bankCardNo: res.bankCardNo,
						userName: res.openAccountName,
						tel: res.tel,
						idCardNo: res.idCardNo
					}
					addBankCardInfo(params).then(data => {
						if(data.data.code == 0){
							wx.showToast({
								title: "绑定成功",
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
							title: "校验失败"
						})
					})
					// var params = {
					// 	bankCardId: this.bankCardId,
					// 	openId: this.currentOpenId,
					// 	bankCardNo: res.bankCardNo,
					// 	bankName: res.bankName,
					// 	openAccountName: res.openAccountName,
					// 	openAccountAddress: res.openAccountAddress
					// }
					// createOrUpdateBankCardInfo(params).then(data => {
					// 	if(data.data.code == 0){
					// 		wx.showToast({
					// 			title: "操作成功",
					// 			icon: "none"
					// 		})
					// 		if(this.isNeedBack){
					// 			uni.navigateBack();
					// 		}
					// 	}else{
					// 		wx.showToast({
					// 			title: data.msg,
					// 			icon: "none"
					// 		})
					// 	}
					// }).catch(err => {
					// 	wx.showToast({
					// 		title: "操作失败，网络错误",
					// 		icon: "none"
					// 	})
					// })
				}).catch(err => {
					console.log(err);
				})
			}
		}
	}
</script>

<style>
	.uni-input-border {
		padding: 0 10px;
		height: 35px;
		width: 95%;
		font-size: 14px;
		color: #666;
		border: 1px #666 solid;
		border-radius: 5px;
		box-sizing: border-box;
	}
</style>