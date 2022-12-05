<template>
	<div class="flexColAllWidthCls">
		<div style="margin: 10px 0;width: 90%;">
			<uni-easyinput type="search" suffixIcon="search"  v-model="searchGoodsName" placeholder="搜索更多折扣" @iconClick="searchGoodsClick"></uni-easyinput>
		</div>
		<div style="margin-top: 10px;border-radius: 10px;width: 90%;background-color: #fff;">
			<div class="flexColCls" style="margin: 10px;">
				<div style="color: #3D3D3D;font-size: 16px;font-weight: 700;width: 100%;text-align: left;">
					今日活动专区
				</div>
				<div style="width: 100%;margin-top: 10px;">
					<SwiperChannel :channelList="channelList" :col="2" style="width: 100%;"></SwiperChannel>
				</div>
			</div>
		</div>
		<!-- <button type="default" @click="getData">通过方法跳转到about页面</button> -->
		<div class="flexColCls" style="width: 90%;">
			<div style="color: #3D3D3D;font-size: 16px;font-weight: 700;margin-top: 20px;width: 100%;text-align: left;margin-bottom: 10px;">
				今日优选
			</div>
			<div @click="gotoGoodsDetail(item.id)" class="flexRowAllWidthCls" v-for="item in bestGoodsList" :key="item.id" style="background-color: #fff;border-radius: 10px;margin-bottom: 10px;justify-content: flex-start;">
				<div style="margin: 10px;">
					<image :src="item.cover" style="width: 150rpx;height: 150rpx;"></image>
				</div>
				<div class="flexColCls" style="margin: 10px;margin-left: 0px;align-items: flex-start;flex: 1;">
					<div style="color: #3d3d3d;font-size: 14px;font-weight: 700;">
						{{item.title}}
					</div>
					<div class="flexRowAllWidthCls" style="justify-content: flex-start;margin-top: 10px;">
						<div class="flexRowCls" style="justify-content: flex-start;flex:1;">
							<div style="font-size: 14px;color: #666666;">
								售价：
							</div>
							<div style="font-size: 16px;font-weight: 700;color: red;">
								￥{{item.price}}
							</div>
						</div>
						<div style="font-size: 14px;color: #666666;">
							赚：
						</div>
						<div style="font-size: 16px;font-weight: 700;color: red;">
							<!-- ￥{{item.cosFee}} -->
							<div v-if="hasParent">
								￥{{item.secondCommission}}
							</div>
							<div v-else>
								￥{{item.onlyFirstCommission}}
							</div>
						</div>
					</div>
					<div class="flexRowAllWidthCls" style="justify-content: flex-start;margin-top: 10px;">
						<div style="color: #3D3D3D;font-size: 12px;flex: 1;">
							评分：{{item.score}} 
							<!-- 佣金率：{{item.cosRatio}} -->
						</div>
						<div>
							<button type="warn" size="mini" @click.stop="shareBtnClick(item.id)">分享赚钱</button>
						</div>
					</div>
				</div>
			</div>
			<uni-load-more :status="loadingStatus"></uni-load-more>
		</div>
		<uni-popup ref="getOpenIdErrPop" type="message">
			<uni-popup-message type="success" message="获取openId成功" :duration="2000"></uni-popup-message>
		</uni-popup>
	</div>
</template>

<script>
	import { mapActions } from 'vuex';
	import { getChannelList, getBestGoodsList, getProductPwdForDy } from '@/api/goodsApi';
	import { getUserByOpenId, createUser } from '@/api/userApi';
	import SwiperChannel from './components/swiperMenu';
	export default{
		name: "HomeIndex",
		components: {SwiperChannel},
		data(){
			return {
				loadingStatus: "more",
				currentOpenId: this.$store.state.openId,
				searchGoodsName: "",
				channelList: [], //活动专区列表
				parentOpenId: "",
				wxNick: "",
				wxAvatar: "",
				pageNum: 1,
				pageSize: 10,
				bestGoodsList: [],
				hasParent: false
			}
		},
		onLoad(e) {
			if(e.shareFromOpenId){
				//标识带有分享自某个openId 需记录上一级
				this.parentOpenId = e.shareFromOpenId;
			}
			if(!this.$store.state.openId){
				this.getOpenId();
			}
			this.pageNum = 1;
			this.getData();
			this.getBeseGoodsListFunc();
		},
		onReachBottom(){
			this.loadingStatus = "loading";
			setTimeout(() => {
				this.getBeseGoodsListFunc();
			}, 1000)
		},
		onShow() {
			if(!this.$store.state.openId){
				this.getOpenId();
			}
		},
		created() {
			
		},
		methods: {
			...mapActions(['getUserOpenId', 'getUserInfo']),
			gotoGoodsDetail(productId){
				uni.navigateTo({
					url:"/pages/goods_detail/index?productId=" + productId
				})
			},
			getBeseGoodsListFunc(){
				getBestGoodsList({pageNum: this.pageNum, pageSize: this.pageSize}).then(data => {
					var resData = data.data;
					if(resData.code == 0){
						if(resData.list.length > 0){
							this.pageNum += 1;
							this.bestGoodsList = resData.list;
							if(resData.list.length < (this.pageNum * this.pageSize)){
								this.loadingStatus = "noMore";
							}else{
								this.loadingStatus = "more";
							}
						}else{
							this.loadingStatus = "noMore";
						}
					}else{
						wx.showToast({
							title: resData.msg,
							icon: "error",
							duration: 2000
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取今日优选失败，网络错误",
						icon: "error",
						duration: 2000
					})
				})
			},
			shareBtnClick(productId){
				if(this.currentOpenId && this.$store.state.currentUserInfo.id){
					getProductPwdForDy({productId: productId, currentUserId: this.$store.state.currentUserInfo.id}).then(data => {
						if(data.data.code == 0){
							var productPwd = data.data.data.dy_password;
							if(productPwd){
								uni.setClipboardData({
									data: productPwd,
									success(res) {
										wx.showToast({
											title: "复制口令成功",
											icon: "success",
											duration: 2000
										})
									},
									fail() {
										wx.showToast({
											title: "复制失败：" + productPwd,
											icon: "error",
											duration: 2000
										})
									}
								})
							}else{
								wx.showToast({
									title: "生成口令失败",
									icon: "error",
									duration: 2000
								})
							}
						}else{
							wx.showToast({
								title: data.data.message,
								icon: "error",
								duration: 2000
							})
						}
					}).catch(err => {
						wx.showToast({
							title: "获取商品口令失败，网络错误",
							icon: "error",
							duration: 2000
						})
					})
				}else{
					wx.showToast({
						title: "当前用户信息有误",
						icon: "error",
						duration: 2000
					})
				}
			},
			searchGoodsClick(){
				uni.navigateTo({
					url: '/pages/goods_list/index?searchGoodsName=' + this.searchGoodsName
				})
			},
			getData(){
				getChannelList().then(data => {
					if(data.data.code == 0){
						this.channelList = data.data.list;
						uni.showToast({
						    title: '获取频道成功',
							icon: "success",
						    duration: 2000
						});
					}else{
						uni.showToast({
						    title: '获取频道失败',
							icon: 'error',
						    duration: 2000
						});
					}
				}).catch(err => {
					uni.showToast({
					    title: '获取频道失败',
						icon: 'error',
					    duration: 2000
					});
				})
			},
			change(){
				
			},
			async getOpenId(){
				var res = await this.getUserOpenId();
				if(res.openId){
					this.currentOpenId = res.openId;
					// this.$store.commit("setopenId", this.currentOpenId);
					if(this.parentOpenId == this.currentOpenId){
						this.parentOpenId = "";
					}
					if(res.userCode != 0){
						if(res.userCode == -2){
							//当前用户不存在用户表 需新增
							this.getWXUserInfo();
						}else{
							wx.showToast({
								title: res.userMsg,
								icon: "error",
								duration: 2000
							})
						}
					}else{
						if(this.$store.state.currentUserInfo.parent_openid){
							this.hasParent = true;
						}else{
							this.hasParent = false;
						}
					}
				}else{
					wx.showToast({
						title: "获取当前登录用户信息失败",
						icon: "error"
					})
				}
			},
			getWXUserInfo(){
				uni.showModal({
					title:'授权',
					content:"是否授权",
					success: (resData) => {
						if(resData.confirm){
							uni.getUserProfile({
								desc: "获取你的昵称、头像信息",//必填项，声明获取用户个人信息后的用途，不超过30个字符
								success: (res) => {
								  const userInfo = res.userInfo;
								  this.wxNick = userInfo.nickName;
								  this.wxAvatar = userInfo.avatarUrl;
								  this.createUserFunc(1);
								},
								fail: (res) => {
									this.wxNick = "";
									this.wxAvatar = "";
									this.createUserFunc(0);
									// console.log(res);
								  //拒绝授权
								  wx.showToast({
									title: "获取失败",
									icon: "error",
									duration: 2000,
									});
								 //  return;
								},
							});
						}else{
							this.wxNick = "";
							this.wxAvatar = "";
							this.createUserFunc(0);
						}
					}
				})
			},
			createUserFunc(isAuthorization){
				var params = {
					openId: this.currentOpenId,
					wxNick: this.wxNick,
					wxAvatar: this.wxAvatar,
					parentOpenId: this.parentOpenId,
					isAuthorization: isAuthorization
				}
				createUser(params).then(data => {
					var resData = data.data;
					if(resData.code == 0){
						wx.showToast({
							title: "新增用户成功",
							icon: "success",
							duration: 2000,
						});
						this.getUserInfo(this.currentOpenId).then(data => {
							if(data.code == 0){
								if(this.$store.state.currentUserInfo.parent_openid){
									this.hasParent = true;
								}else{
									this.hasParent = false;
								}
							}
						}).catch(err => {
							
						})
					}else{
						wx.showToast({
							title: resData.msg,
							icon: "error",
							duration: 2000,
						});
					}
				}).catch(err => {
					wx.showToast({
						title: "新增用户失败",
						icon: "error",
						duration: 2000,
					})
				})
			}
		}
	}
</script>

<style>
	.searchCls{
		border-radius: 10px;
	}
</style>