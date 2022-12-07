<template>
	<div class="flexColAllWidthCls">
		<div v-if="hasBankCard" class="flexColAllWidthCls">
			<div class="flexColCls" style="width: 90%;border-radius: 10px;background-color: #fff;">
				<div class="flexRowCls" style="width: 90%;margin-top: 10px;justify-content: flex-start;">
					<div style="font-weight: bold;font-size: 18px;color: #3d3d3d;flex:1;">
						{{bankCardNo}}
					</div>
					<div>
						<button type="warn" size="mini" @click="delBtnClick">删除此卡</button>
					</div>
				</div>
				<div style="margin-top: 10px;width: 90%;color: #666;">
					{{userName}}
				</div>
				<div class="flexRowCls" style="margin-top: 10px;color: #666;font-size: 12px;width: 90%;margin-bottom: 10px;">
					<div style="flex:1;">
						{{tel}}
					</div>
					<div>
						{{createTime}}
					</div>
				</div>
			</div>
		</div>
		<div v-else class="flexColAllWidthCls">
			<div style="font-size: 16px;color: #3d3d3d;margin-top: 50px;">
				暂未绑定银行卡信息
			</div>
			<button type="warn" size="mini" style="margin-top: 10px;" @click="gotoAddBankCard">去绑定</button>
		</div>
		<uni-popup ref="bankCardDelMsgPopup" type="dialog">
			<uni-popup-dialog mode="base" confirmText="确认删除" title="提示" :duration="2000" :before-close="true" @close="closeDelMsgPop" @confirm="sureDelBtn">
				<div class="flexColAllWidthCls">
					<div style="font-size: 18px;">
						是否确认删除此卡？
					</div>
					<div style="font-size: 12px;color: #FA5151;margin-top: 10px;">
						删除后需重新绑定银行卡才可提现。
					</div>
				</div>
			</uni-popup-dialog>
		</uni-popup>
	</div>
</template>

<script>
	import { getCurrentUserBankCard, delBankCard } from '@/api/bankCardApi'
	export default{
		name: "BankCard",
		data(){
			return {
				hasBankCard: true,
				currentOpenId: this.$store.state.openId,
				bankCardNo: "",
				userName: "",
				tel: "",
				createTime: ""
			}
		},
		onLoad(e) {
			this.getData();
		},
		onShow() {
			this.getData();
		},
		methods: {
			closeDelMsgPop(){
				this.$refs.bankCardDelMsgPopup.close();
			},
			sureDelBtn(){
				console.log('sssssssssssure');
				delBankCard({openId: this.currentOpenId}).then(data => {
					if(data.data.code == 0){
						this.$refs.bankCardDelMsgPopup.close();
						wx.showToast({
							title: "删除成功",
							icon: "none"
						})
						setTimeout(() => {
							this.getData();
						}, 1000)
					}else{
						this.$refs.bankCardDelMsgPopup.close();
						wx.showToast({
							title: data.data.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					this.$refs.bankCardDelMsgPopup.close();
					wx.showToast({
						title: "删除失败，网络失败",
						icon: "none"
					})
				})
			},
			delBtnClick(){
				this.$refs.bankCardDelMsgPopup.open();
			},
			gotoAddBankCard(){
				uni.navigateTo({
					url:"/pages/bankCard_info/index"
				})
			},
			getData(){
				getCurrentUserBankCard({openId: this.currentOpenId}).then(data => {
					if(data.data.code == 0){
						if(data.data.data){
							//存在银行卡信息
							this.hasBankCard = true;
							console.log(data.data.data);
							var resData = data.data.data;
							this.bankCardNo = resData.bankCardNo;
							this.userName = resData.userName;
							this.tel = resData.tel;
							this.createTime = resData.createTime;
						}else{
							//不存在
							this.hasBankCard = false;
						}
					}else{
						wx.showToast({
							title: data.data.msg,
							icon: 'none'
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取银行卡信息失败，网络错误",
						icon: "none"
					})
				})
			}
		}
	}
</script>

<style>
</style>