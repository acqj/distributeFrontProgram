<template>
	<div class="flexColAllWidthCls">
		<div class="flexColAllWidthCls" style="width: 90%;">
			<div id="topDiv" class="flexColAllWidthCls">
				<div v-if="isShowChannelName" style="font-size: 20px;color: #3d3d3d;font-weight: 700;">
					{{channelName}}
				</div>
				<div class="flexRowAllWidthCls" style="justify-content: flex-start;margin-top: 20px;">
					<div style="color: #3d3d3d;font-weight: 700;">
						推荐好货
					</div>
				</div>
			</div>
			<!-- <div class="flexColAllWidthCls" :style="styleStr"> -->
			<scroll-view :scroll-top="scrollTop" scroll-y="true" :style="styleStr">
				<div class="flexRowAllWidthCls" v-for="item in goodsList" :key="item.id" style="justify-content: flex-start;background-color: #fff;border-radius: 10px;margin-bottom: 10px;">
					<div style="margin: 10px;">
						<image :src="item.cover" style="width: 150rpx;height: 150rpx;"></image>
					</div>
					<div @click="gotoGoodsDetail(item.id)" class="flexColCls" style="flex: 1;margin: 10px;margin-left: 0px;align-items: flex-start;">
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
								￥{{item.cosFee}}
							</div>
						</div>
						<div class="flexRowAllWidthCls" style="justify-content: flex-start;margin-top: 10px;">
							<div style="color: #3D3D3D;font-size: 12px;flex: 1;">
								评分：{{item.score}} 佣金率：{{item.cosRatio}}
							</div>
							<div>
								<button type="warn" size="mini" @click.stop="shareBtnClick(item.id)">分享赚钱</button>
							</div>
						</div>
					</div>
				</div>
			</scroll-view>
		</div>
	</div>
</template>

<script>
	import { getGoodsListByParams, getProductPwdForDy } from '@/api/goodsApi';
	import { mapActions } from 'vuex';
	export default{
		name: "GoodsListPage",
		data(){
			return {
				isShowChannelName: false,
				channelName: "",
				goodsList: [],
				currentChannelId: "",
				searchGoodsName: "",
				styleStr: "margin-top: 10px;",
				currentOpenId: this.$store.state.openId,
				parentOpenId: ""
			}
		},
		mounted() {
			var topDiv = uni.createSelectorQuery().select("#topDiv");
			if(topDiv){
				topDiv.fields({
					rect:true,   //是否返回节点布局位置信息{left,top,right,bottom}
					size:true,  //是否返回节点尺寸信息{width，height}
					scrollOffset:true //是否返回节点滚动信息{scrollLeft,scrollTop}
				},(res) => {
					//res 可以返回第一个参数对象中指定为true的相关信息
					if(res.height){
						var allHeight = wx.getSystemInfoSync().windowHeight;
						var bottomDivHeight = allHeight - res.height - 20;
						this.styleStr = "margin-top: 10px;height:" + bottomDivHeight + "px;";
					}
				}).exec(function(){
					//上述节点信息获取成功后执行的回调函数
				})
			}
		},
		onLoad(e) {
			if(e.shareFromOpenId){
				//标识带有分享自某个openId 需记录上一级
				this.parentOpenId = e.shareFromOpenId;
			}
			
			if(e.channelId){
				this.isShowChannelName = true;
				this.currentChannelId = e.channelId;
			}else{
				this.isShowChannelName = false;
			}
			if(e.channelName){
				this.channelName = e.channelName;
			}
			
			if(e.searchGoodsName){
				this.searchGoodsName = e.searchGoodsName;
			}
			
			this.getGoodsList();
		},
		created() {
			// var topDiv = this.$refs.topDivRef;
		},
		methods:{
			...mapActions(['getUserOpenId', 'createUser']),
			gotoGoodsDetail(productId){
				console.log('pppppppppppppppppppppppppp', productId);
				uni.navigateTo({
					url:"/pages/goods_detail/index?productId=" + productId
				})
			},
			async shareBtnClick(productId){
				if(this.currentOpenId && this.$store.state.currentUserInfo.id){
					this.getProductPwd(productId);
				}else{
					var res = await this.getUserOpenId();
					if(res.openId){
						if(res.userCode == 0){
							this.getProductPwd(productId);
						}else if(res.userCode == -2){
							//当前用户表不存在该用户 自动注册
							if(this.parentOpenId == res.openId){
								this.parentOpenId = "";
							}
							var resUserData = await this.createUser(res.openId, this.parentOpenId);
							if(resUserData.code == 0){
								this.getProductPwd(productId);
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
			},
			getProductPwd(productId){
				getProductPwdForDy({productId: productId, currentUserId: this.$store.state.currentUserInfo.id}).then(data => {
					if(data.data.code == 0){
						var productPwd = data.data.data.dy_password;
						if(productPwd){
							uni.setClipboardData({
								data: productPwd,
								success(res) {
									wx.showToast({
										title: "复制口令成功",
										icon: "none",
										duration: 2000
									})
								},
								fail() {
									wx.showToast({
										title: "复制失败：" + productPwd,
										icon: "none",
										duration: 2000
									})
								}
							})
						}else{
							wx.showToast({
								title: "生成口令失败",
								icon: "none",
								duration: 2000
							})
						}
					}else{
						wx.showToast({
							title: data.data.message,
							icon: "none",
							duration: 2000
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取商品口令失败，网络错误",
						icon: "none",
						duration: 2000
					})
				})
			},
			getGoodsList(){
				var params = {
					channelId: this.currentChannelId,
					searchGoodsName: this.searchGoodsName
				}
				getGoodsListByParams(params).then(data => {
					var resData = data.data;
					if(resData.code == 0){
						if(resData.list && resData.list.length > 0){
							this.goodsList = resData.list;
						}else{
							this.goodsList = [];
						}
					}else{
						wx.showToast({
							title: resData.msg,
							icon: 'none',
							duration: 2000
						})
					}
				}).catch(err => {
					wx.showToast({
						title: '获取商品失败',
						icon: 'none',
						duration: 2000
					})
				})
			},
		}
	}
</script>

<style>
</style>