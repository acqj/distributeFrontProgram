<template>
	<div class="flexColAllWidthCls">
		<div style="width: 90%;background-color: #fff;border-radius: 10px;padding: 10px;">
			<uni-forms :rules="bankCardRules" :value="bankCardInfo" ref="bankCardFormRef" labelWidth="100px" validate-trigger="bind" err-show-type="undertext">
				<uni-forms-item name="bankCardNo" required label="银行卡号">
					<input type="text" v-model="bankCardInfo.bankCardNo" placeholder="请输入银行卡号" class="uni-input-border"/>
				</uni-forms-item>
				<uni-forms-item name="bankName" required label="银行名称">
					<input type="text" v-model="bankCardInfo.bankName" placeholder="请输入所属银行名称" class="uni-input-border"/>
				</uni-forms-item>
				<uni-forms-item name="openAccountName" required label="开户人姓名">
					<input type="text" v-model="bankCardInfo.openAccountName" placeholder="请输入开户人姓名" class="uni-input-border"/>
				</uni-forms-item>
				<uni-forms-item name="openAccountAddress" required label="开户地">
					<input type="text" v-model="bankCardInfo.openAccountAddress" placeholder="请输入开户省市区" class="uni-input-border"/>
				</uni-forms-item>
			</uni-forms>
		</div>
		<div style="width: 50%;margin-top: 20px;">
			<button type="warn" @click="submitBtnClick">提交</button>
		</div>
	</div>
</template>

<script>
	import { getBankCardInfo, createOrUpdateBankCardInfo } from '@/api/bankCardApi';
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
					openAccountAddress: ""
				},
				bankCardRules:{
					bankCardNo:{
						rules:[{
								required: true,
								errorMessage: '请输入银行卡号'
							}]
					},
					bankName: {
						rules:[{
								required: true,
								errorMessage: '请输入银行名称'
							}]
					},
					openAccountName: {
						rules: [{
							required: true,
							errorMessage: '请输入开户人姓名'
						}]
					},
					openAccountAddress: {
						rules: [{
							required: true,
							errorMessage: '请输入开户地'
						}]
					}
				}
			}
		},
		onLoad(e) {
			console.log('eeeeeeeeeeeeee');
			console.log(e);
			if(e.isNeedBack){
				this.isNeedBack = e.isNeedBack;
			}
			if(this.currentOpenId){
				this.getData();
			}
			// else{
			// 	this.getOpenId();
			// }
		},
		methods: {
			getData(){
				getBankCardInfo({openId: this.currentOpenId}).then(data => {
					if(data.data.code == 0){
						console.log(data.data);
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
					console.log('rrrrrrrrrrrrrrres');
					console.log(res);
					// bankCardNo: "",
					// bankName: "",
					// openAccountName: "",
					// openAccountAddress: ""
					var params = {
						bankCardId: this.bankCardId,
						openId: this.currentOpenId,
						bankCardNo: res.bankCardNo,
						bankName: res.bankName,
						openAccountName: res.openAccountName,
						openAccountAddress: res.openAccountAddress
					}
					createOrUpdateBankCardInfo(params).then(data => {
						if(data.data.code == 0){
							wx.showToast({
								title: "操作成功",
								icon: "success"
							})
							if(this.isNeedBack){
								uni.navigateBack();
							}
						}else{
							wx.showToast({
								title: data.msg,
								icon: "none"
							})
						}
					}).catch(err => {
						wx.showToast({
							title: "操作失败，网络错误",
							icon: "none"
						})
					})
				}).catch(err => {
					console.log(err);
					// wx.showToast({
					// 	title: err,
					// 	icon: "none"
					// })
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