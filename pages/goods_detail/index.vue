<template>
	<div class="flexColAllWidthCls" style="height: 100%;">
		<scroll-view scroll-y="true" style="height: 85%;">
			<div class="flexColAllWidthCls">
				<div class="flexColCls" style="width: 90%;background-color: #fff;border-radius: 20px;">
					<div id="imgTopDiv" class="flexColCls" style="margin: 20px 0;width: 90%;">
						<swiper :indicator-dots="true" :style="swiperStyleStr">
							<swiper-item v-for="item in goodsObj.imgs" :key="item">
								<image :src="item" style="width: 100%;"></image>
							</swiper-item>
						</swiper>
						<div style="color: #3d3d3d;font-size: 14px;font-weight: 700;margin-top: 10px;">
							{{goodsObj.title}}
						</div>
						<div class="flexRowAllWidthCls" style="margin-top: 20px;">
							<div class="flexRowCls" style="flex:1;justify-content: flex-start;">
								<div style="color: #3d3d3d;font-size: 14px;">
									原价
								</div>
								<div style="color: #FA5151;font-size: 18px;font-weight: 700;margin-left: 5px;">
									{{goodsObj.price}}元
								</div>
							</div>
							<div style="color: #3d3d3d;font-size: 14px;">
								返利
							</div>
							<div style="color: #FA5151;font-size: 18px;font-weight: 700;margin-left: 5px;">
								{{goodsObj.cosFee}}元
							</div>
						</div>
						<div class="flexRowAllWidthCls" style="justify-content: flex-start;color: #3d3d3d;font-size: 12px;margin-top: 10px;">
							<div>
								库存：{{goodsObj.inStock}}
							</div>
							<div style="height: 15px;width: 1px;margin: 0 10px;background-color: #3d3d3d;"></div>
							<div>
								商品评分：{{goodsObj.score}}
							</div>
						</div>
					</div>
				</div>
				<div class="flexColCls" style="width: 90%;background-color: #fff;border-radius: 20px;margin-top: 30px;">
					<div class="flexColCls" style="align-items: flex-start;color: #3d3d3d;font-size: 12px;width: 90%;margin: 20px 0;">
						<div>
							店铺名称：{{goodsObj.shopName}}
						</div>
						<div style="margin-top: 10px;">
							商品评价：{{goodsObj.commentNum}}
						</div>
						<div style="margin-top: 10px;">
							近30天商品总订单量：{{goodsObj.orderNum}}
						</div>
						<div style="margin-top: 10px;">
							近30天商品总浏览量：{{goodsObj.viewNum}}
						</div>
						<div style="margin-top: 10px;">
							近30天推广总达人数：{{goodsObj.kolNum}}
						</div>
						<div style="width: 100%;text-align: center;margin-top: 10px;">
							<image :src="goodsObj.cover" style="width: 100%;"></image>
						</div>
					</div>
				</div>
			</div>
		</scroll-view>
		<div class="flexRowAllWidthCls" style="margin-top: 5%;height: 8%;background-color: #fff;justify-content: flex-end;">
			<div style="margin-right: 20px;">
				<button size="mini" type="warn" @click="shareBtnClick(goodsObj.id)">分享赚钱</button>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions } from 'vuex';
	import { getGoodsDetailById, getProductPwdForDy } from '@/api/goodsApi';
	export default{
		name: "GoodsDetailPage",
		data(){
			return {
				currentOpenId: this.$store.state.openId,
				currentProductId: "",
				parentOpenId: "",
				goodsObj: {
					id: "",
					imgs: [],
					title: "",
					price: "",
					cosFee: "",//佣金
					inStock: "",//库存 
					score: "", //评分
					shopName: "",//商铺名称
					commentNum: "", //商品评价数目
					orderNum: "", //近30天商品总订单量
					viewNum: "", //近30天浏览量
					kolNum: "", //近30天推广人数
					cover: "", //商品展示大图
				},
				swiperStyleStr: "width:100%;"
			}
		},
		mounted() {
			var topDiv = uni.createSelectorQuery().select("#imgTopDiv");
			if(topDiv){
				topDiv.fields({
					rect:true,   //是否返回节点布局位置信息{left,top,right,bottom}
					size:true,  //是否返回节点尺寸信息{width，height}
					scrollOffset:true //是否返回节点滚动信息{scrollLeft,scrollTop}
				},(res) => {
					//res 可以返回第一个参数对象中指定为true的相关信息
					console.log("resresresres");
					console.log(res);
					if(res.width){
						// var allHeight = wx.getSystemInfoSync().windowHeight;
						// var bottomDivHeight = allHeight - res.height - 20;
						this.swiperStyleStr = "width: 100%;height:" + res.width + "px;";
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
			if(e.productId){
				this.currentProductId = e.productId;
				this.getGoodsDetail();
			}else{
				wx.showToast({
					title: "商品id有误，获取信息失败",
					icon: "none",
					duration: 2000
				})
			}
		},
		methods:{
			...mapActions(['getUserOpenId', 'createUser']),
			async shareBtnClick(productId){
				if(this.currentOpenId && this.$store.state.currentUserInfo.id){
					this.getProductPwd(productId);
				}else{
					console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeelse');
					console.log(this.currentOpenId , this.$store.state.currentUserInfo.id);
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
			getGoodsDetail(){
				getGoodsDetailById({productId: this.currentProductId}).then(data => {
					console.log("ddddddddddgfggg");
					console.log(data);
					if(data.data.code == 0){
						var resData = data.data.data;
						console.log(data.data);
						this.goodsObj.id = resData.id;
						this.goodsObj.imgs = resData.imgs;
						this.goodsObj.title = resData.title;
						this.goodsObj.price = resData.price;
						this.goodsObj.cosFee = resData.cosFee;
						this.goodsObj.inStock = resData.inStock;
						this.goodsObj.score = resData.score;
						this.goodsObj.shopName = resData.shopName;
						this.goodsObj.commentNum = resData.commentNum;
						this.goodsObj.orderNum = resData.orderNum;
						this.goodsObj.viewNum = resData.viewNum;
						this.goodsObj.kolNum = resData.kolNum;
						this.goodsObj.cover = resData.cover;
					}else{
						wx.showToast({
							title: data.data.msg,
							icon: "none",
							duration: 2000
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "查询失败，网络错误",
						icon: "none",
						duration: 2000
					})
				})
			}
		}
	}
</script>

<style>
</style>