<template>
	<div class="flexColAllWidthCls" style="justify-content: flex-start;">
		<div class="flexRowCls" style="width: 95%;background-color: #fff;border-radius: 10px;">
			<div class="flexColCls" style="width: 90%;margin-top: 10px;font-size: 1.2rem;">
				<div class="flexRowAllWidthCls" style="justify-content: flex-start;">
					<div style="color: #3d3d3d;flex: 1;text-align: left;font-weight: 700;font-size: 30px;">
						佣金合计
					</div>
					<div>
						￥<span style="color: #FA5151;font-size: 30px;">{{totalCommission}}</span>
					</div>
				</div>
				<div class="flexRowAllWidthCls" style="margin-top: 20px;color: #666666;">
					<div style="flex:1;">
						累计提现金额：
					</div>
					<div>
						￥{{cashOutCommission}}
					</div>
				</div>
				<div class="flexRowAllWidthCls" style="margin-top: 10px;color: #666666;">
					<div style="flex:1;">
						未结算金额：
					</div>
					<div>
						￥{{unSettledCommission}}
					</div>
				</div>
				<div class="flexRowAllWidthCls" style="margin-top: 10px;color: #666666;">
					<div style="flex:1;">
						可提现金额：
					</div>
					<div class="flexRowCls">
						<div>
							￥{{unCashOutCommission}}
						</div>
					</div>
				</div>
				<div class="flexRowAllWidthCls" style="margin-top: 10px;color: #666666;margin-bottom: 10px;">
					<div style="flex:1;"></div>
					<div class="flexRowCls">
						<div>
							<button class="cashbtn" v-if="isCanCashOut" type="warn" size="mini" @click="cashoutBtnClick">去提现</button>
							<button class="cashbtn" v-else type="warn" size="mini" :disabled="true">去提现</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="flexRowAllWidthCls" style="margin-top: 20px;">
			<uni-segmented-control :current="currentTab" :values="tabItems" @clickItem="onClickItem" styleType="text" style="width: 80%;"></uni-segmented-control>
		</div>
		<div v-if="currentTab == 0" class="flexColAllWidthCls">
			<div v-if="orderList && orderList.length>0" class="flexColAllWidthCls">
				<div v-for="item in orderList" :key="item.orderId" class="flexRowAllWidthCls" style="width: 95%;margin-top: 10px;background-color: #fff;border-radius: 10px;">
					<div class="flexRowCls" style="margin: 10px;">
						<div>
							<image :src="item.productImg" style="width: 60px;height: 60px;"></image>
						</div>
						<div class="flexColCls" style="align-items: flex-start;justify-content: flex-start;margin-left: 10px;">
							<div style="color: #3d3d3d;font-weight: 700;font-size: 12px;">
								{{item.productName}}
							</div>
							<div class="flexRowCls" style="margin-top: 10px;justify-content: flex-start;">
								<div>
									￥
								</div>
								<div style="color: #FA5151;font-size: 22px;margin-left:5px;">
									{{item.showCommission}}
								</div>
							</div>
							<div class="flexRowCls" style="justify-content: flex-start;width: 100%;">
								<div style="flex:1;font-size: 12px;">
									{{item.createTime}}
								</div>
								<div style="font-size: 12px;">
									{{item.shareType}}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else style="margin-top: 20px;color: #666666;">
				暂无数据
			</div>
		</div>
		<div v-if="currentTab == 1" class="flexColAllWidthCls" style="margin-top: 10px;">
			<div v-if="commissionRecordList && commissionRecordList.length > 0" class="flexColCls" style="width: 90%;background-color: #fff;padding:10px;">
				<div v-for="(item, index) in commissionRecordList" :key="item.id" class="flexColAllWidthCls">
					<div class="flexRowAllWidthCls">
						<div class="flexRowCls" style="flex:1;">
							￥{{item.cashOutAmount}}
						</div>
						<div class="flexRowCls" style="flex:1;font-size: 12px;">
							<div v-if="item.status == 1" style="color: #42b983;">
								提现成功
							</div>
							<div v-if="item.status == 2" style="color: #007aff;">
								提现中
							</div>
							<div v-if="item.status == 3" style="color: #FA5151;">
								提现失败
							</div>
						</div>
						<div class="flexRowCls" style="flex:2;font-size: 12px;">
							{{item.createTime}}
						</div>
					</div>
					<div v-if="commissionRecordList.length > 1 && index < (commissionRecordList.length - 1)" class="underLineCls"></div>
				</div>
			</div>
			<div v-else style="margin-top: 20px;color: #666666;">
				暂无数据
			</div>
		</div>
		<div v-if="currentTab == 2" class="flexColAllWidthCls" style="margin-top: 10px;">
			<div v-if="lowerLevelData && lowerLevelData.length > 0" class="flexColCls" style="width: 90%;background-color: #fff;padding:10px;">
				<div v-for="(item, index) in lowerLevelData" :key="item.id" class="flexColAllWidthCls">
					<div class="flexRowAllWidthCls">
						<div class="flexRowCls" style="flex:1;">
							{{item.nickName}}
						</div>
						<div class="flexRowCls" style="flex:1;">
							￥{{item.totalCommission}}
						</div>
						<div class="flexRowCls" style="flex:2;">
							{{item.updateTime}}
						</div>
					</div>
					<div v-if="lowerLevelData.length > 1 && index < (lowerLevelData.length - 1)" class="underLineCls"></div>
				</div>
			</div>
			<div v-else style="margin-top: 20px;color: #666666;">
				暂无数据
			</div>
		</div>
		<uni-load-more v-if="currentTab==0 && isShowOrderLoadingStatus" :status="loadingStatus"></uni-load-more>
		<uni-load-more v-if="currentTab==1 && isShowCRLoadingStatus" :status="cashoutLoadingStatus"></uni-load-more>
		<uni-load-more v-if="currentTab==2 && isShowLowerLevelDataLoadingStatus" :status="lowerLevelDataLoadingStatus"></uni-load-more>
		<uni-popup ref="commissionRulePopup" type="dialog">
			<uni-popup-dialog mode="base" title="佣金规则" :duration="2000" :before-close="true" @close="close" @confirm="close">
				<div>
					佣金规则弹窗内容
				</div>
			</uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="commissionAmountPop" type="dialog">
			<uni-popup-dialog title="提现" mode="base" :duration="2000" :before-close="true" @close="closeCommissionAmountPop" @confirm="sureBtnClick">
				<div>
					<uni-number-box :min="0" :step="0.01" v-model="commissionAmount" style="width: 50%;"></uni-number-box>
				</div>
			</uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="bankCardMsgPopup" type="dialog">
			<uni-popup-dialog mode="base" confirmText="去完善" title="提示" :duration="2000" :before-close="true" @close="closeBankCardPop" @confirm="gotoBankCardInfo">
				<div>
					请完善银行卡信息
				</div>
			</uni-popup-dialog>
		</uni-popup>
	</div>
</template>

<script>
	import { getOrderList, getOnlyMyOrderList } from '@/api/orderApi';
	import { getMyCommission, cashoutFunc, getCashOutRecordList, getLowerLevelData } from '@/api/commissionApi';
	import { getBankCardInfo } from '@/api/bankCardApi';
	import { getNonceStr } from '@/common/util';
	export default{
		name: "CommissionIndex",
		data(){
			return {
				isShowCRLoadingStatus: false,
				isShowOrderLoadingStatus: false,
				isShowLowerLevelDataLoadingStatus: false,
				loadingStatus: "more",
				cashoutLoadingStatus: "more",
				lowerLevelDataLoadingStatus: "more",
				totalCommission: "0",
				cashOutCommission: "0",
				unCashOutCommission: "0",
				unSettledCommission: "0",
				currentOpenId: this.$store.state.openId,
				tabItems: ["我的订单", "提现记录", "二级代理佣金"],
				currentTab: 0,
				orderList: [],
				orderPageNum: 1,
				orderPageSize: 10,
				commissionRecordList: [],
				lowerLevelData: [],
				cashPageNum: 1,
				cashPageSize: 10,
				lowerLevelPageNum: 1,
				lowerLevelPageSize: 10,
				commissionAmount: 0,
				isCanCashOut: true
			}
		},
		onLoad(e){
			this.getMyCommission();
			// this.getMyOrderList();
			if(this.currentTab == 0){
				this.getOnlyMyOrderList();
			}else{
				this.getCashOutRecordList();
			}
		},
		onReachBottom(){
			this.loadingStatus = "loading";
			setTimeout(() => {
				if(this.currentTab == 0){
					this.isShowOrderLoadingStatus = true;
					this.getOnlyMyOrderList();
				}else{
					this.isShowCRLoadingStatus = true;
					this.getCashOutRecordList();
				}
			}, 1000)
		},
		onShow() {
			this.getMyCommission();
			this.currentTab = 0;
			this.orderPageNum = 1;
			this.orderPageSize = 10;
			this.cashPageNum = 1;
			this.cashPageSize = 10;
			this.lowerLevelPageNum = 1,
			this.lowerLevelPageSize = 10,
			this.getOnlyMyOrderList();
			this.checkCurrentDate();
		},
		methods: {
			gotoLowerLevelTotal(){
				uni.navigateTo({
					url:"/pages/lowerLevel_total/index"
				})
			},
			checkCurrentDate(){
				var date = new Date();
				var currentDay = date.getDate();
				if(currentDay != 10 && currentDay != 20){
					this.isCanCashOut = false;
				}else{
					this.isCanCashOut = true;
				}
			},
			getCashOutRecordList(){
				getCashOutRecordList({openId: this.currentOpenId, pageNum: this.cashPageNum, pageSize: this.cashPageSize}).then(data => {
					if(data.data.code == 0){
						var resData = data.data.data;
						if(resData && resData.length > 0){
							this.commissionRecordList = resData;
							if(this.commissionRecordList.length < (this.cashPageNum * this.cashPageSize)){
								this.cashoutLoadingStatus = "noMore";
							}else{
								this.cashoutLoadingStatus = "more";
								this.cashPageNum += 1;
							}
						}else{
							this.cashoutLoadingStatus = "noMore";
						}
					}else{
						wx.showToast({
							title: data.data.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取提现记录失败，网络错误",
						icon: "none"
					})
				})
			},
			getLowerLevelData() {
				getLowerLevelData({openId: this.currentOpenId, pageNum: this.lowerLevelPageNum, pageSize: this.lowerLevelPageSize}).then(data => {
					if (data.data.code == 0) {
						var resData = data.data.data;
						if (resData && resData.length > 0) {
							this.lowerLevelData = resData;
							if (this.lowerLevelData.length < (this.lowerLevelPageNum * this.lowerLevelPageSize)) {
								this.lowerLevelDataLoadingStatus = "noMore";
							} else {
								this.lowerLevelDataLoadingStatus = "more";
								this.lowerLevelPageNum += 1;
							}
						} else {
							this.lowerLevelDataLoadingStatus = "noMore";
						}
					} else {
						wx.showToast({
							title: data.data.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取二级佣金列表失败，网络错误",
						icon: "none"
					})
				})
			},
			sureBtnClick(){
				var resNonceStr = getNonceStr(32);
				if(this.commissionAmount){
					if(this.commissionAmount <= 0){
						wx.showToast({
							title:"请输入提现金额",
							icon: "none"
						})
					}else if(!resNonceStr){
						wx.showToast({
							title: "生成随机参数失败",
							icon: "none"
						})
					}else{
						cashoutFunc({openId: this.currentOpenId, commissionAmount: this.commissionAmount}).then(data => {
							console.log(data);
							if(data.data.code == 0){
								wx.showToast({
									title: "提交成功，请等待提现结果",
									icon: "none"
								})
								this.$refs.commissionAmountPop.close();
								this.commissionAmount = 0;
								//执行提现
								this.getMyCommission();
								if(this.currentTab == 1){
									this.getCashOutRecordList();
								}
							}else{
								wx.showToast({
									title: data.data.msg,
									icon: "none"
								})
							}
						}).catch(err => {
							wx.showToast({
								title: "提现失败，网络错误",
								icon: "none"
							})
						})
					}
				}else{
					wx.showToast({
						title:"请输入提现金额",
						icon: "none"
					})
				}
				console.log(this.commissionAmount);
			},
			closeBankCardPop(){
				this.$refs.bankCardMsgPopup.close();
			},
			gotoBankCardInfo(){
				this.$refs.bankCardMsgPopup.close();
				uni.navigateTo({
					url:"/pages/bankCard_info/index?isNeedBack=true"
				})
			},
			cashoutBtnClick(){
				getBankCardInfo({openId: this.currentOpenId}).then(data => {
					if(data.data.code == 0){
						if(data.data.data){
							this.$refs.commissionAmountPop.open();
						}else{
							//未查询到银行卡信息需弹窗提醒
							this.$refs.bankCardMsgPopup.open();
						}
					}else{
						wx.showToast({
							title: data.data.msg,
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
			closeCommissionAmountPop(){
				this.commissionAmount = 0;
				this.$refs.commissionAmountPop.close();
			},
			close(){
				this.$refs.commissionRulePopup.close();
			},
			openDialog(){
				this.$refs.commissionRulePopup.open();
			},
			onClickItem(e){
				this.currentTab = e.currentIndex;
				if(this.currentTab == 0){
					this.getOnlyMyOrderList();
				}else if(this.currentTab == 1){
					this.getCashOutRecordList();
				}else {
					this.getLowerLevelData();
				}
			},
			getOnlyMyOrderList(){
				getOnlyMyOrderList({openId: this.currentOpenId, pageNum: this.orderPageNum, pageSize: this.orderPageSize }).then(data=> {
					if(data.data.code == 0){
						var resData = data.data.data;
						if(resData && resData.length > 0){
							this.orderList = resData;
							if(this.orderList.length < (this.orderPageNum * this.orderPageSize)){
								this.loadingStatus = "noMore";
							}else{
								this.orderPageNum += 1;
								this.loadingStatus = "more";
							}
						}else{
							this.loadingStatus = "noMore";
						}
					}else{
						wx.showToast({
							title: data.data.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取订单列表失败，网络错误",
						icon: 'none'
					})
				})
			},
			getMyCommission(){
				getMyCommission({openId: this.currentOpenId}).then(data => {
					if(data.data.code == 0){
						var resData = data.data.data;
						if(resData){
							this.totalCommission = resData.totalCommission;
							this.cashOutCommission = resData.cashOutCommision;
							this.unCashOutCommission = resData.unCashOutCommision;
							this.unSettledCommission = resData.unSettledCommission;
						}else{
							this.totalCommission = 0;
							this.cashOutCommission = 0;
							this.unCashOutCommission = 0;
						}
					}else{
						wx.showToast({
							title: resData.msg,
							icon: 'none'
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取佣金信息失败，网络错误",
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style>
	.underLineCls{
		width: 100%;
		height: 1px;
		background-color: #f5f5f5;
		margin: 5px 0;
	}
	.cashbtn {
		font-size: 1.2rem;
	}
</style>