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
		<div class="flexRowCls" style="justify-content: flex-start;width: 90%;">
			<div style="color: #3D3D3D;font-size: 16px;font-weight: 700;margin-top: 20px;">
				今日优选
			</div>
		</div>
		<uni-popup ref="getOpenIdErrPop" type="message">
			<uni-popup-message type="success" message="获取openId成功" :duration="2000"></uni-popup-message>
		</uni-popup>
	</div>
</template>

<script>
	import { mapActions } from 'vuex';
	import { getChannelList } from '@/api/goodsApi';
	import { getUserByOpenId, createUser } from '@/api/userApi';
	import SwiperChannel from './components/swiperMenu';
	export default{
		name: "HomeIndex",
		components: {SwiperChannel},
		data(){
			return {
				currentOpenId: this.$store.state.openId,
				searchGoodsName: "",
				channelList: [], //活动专区列表
				parentOpenId: "",
				wxNick: "",
				wxAvatar: ""
			}
		},
		onLoad(e) {
			console.log("dddddddddddd");
			console.log(e);
			if(e.shareFromOpenId){
				//标识带有分享自某个openId 需记录上一级
				this.parentOpenId = e.shareFromOpenId;
			}
			if(!this.$store.state.openId){
				this.getOpenId();
			}
			
			this.getData();
		},
		onShow() {
			// this.searchGoodsName = "";
		},
		created() {
			
		},
		methods: {
			...mapActions(['getUserOpenId']),
			searchGoodsClick(){
				uni.navigateTo({
					url: '/pages/goods_list/index?searchGoodsName=' + this.searchGoodsName
				})
			},
			getData(){
				getChannelList().then(data => {
					console.log('ddddddddddf');
					console.log(data);
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
							icon: 'none',
						    duration: 2000
						});
					}
				}).catch(err => {
					console.log("eeeeeeeeeeeeeeeeeerr");
					console.log(err);
					uni.showToast({
					    title: '获取频道失败',
						icon: 'none',
					    duration: 2000
					});
				})
			},
			change(){
				
			},
			async getOpenId(){
				var res = await this.getUserOpenId();
				// console.log('rrrrrrrresss', res);
				if(res){
					this.currentOpenId = res;
					this.$store.commit("setopenId", this.currentOpenId);
					if(this.parentOpenId == this.currentOpenId){
						this.parentOpenId = "";
					}
					getUserByOpenId({openId: this.currentOpenId}).then(data => {
						var resData = data.data;
						if(resData.code == 0){
							console.log("dddddddddddd");
							// console.log(resData.userInfo);
							// this.$store.state.setUserInfo(resData.userInfo);
							// console.log(this.$store.state.currentUserInfo);
							this.$store.commit('setUserInfo', resData.userInfo)
							console.log(this.$store.state.currentUserInfo);
						}else if(resData.code == -2){
							//当前用户不存在用户表 需新增
							this.getWXUserInfo();
						}
					}).catch(err => {
						wx.showToast({
								title: "获取用户信息失败",
								icon: "error",
								duration: 2000,
							});
					})
					// this.$refs.getOpenIdErrPop.open('top');
				}
			},
			getWXUserInfo(){
				uni.showModal({
					title:'授权',
					content:"是否授权",
					success: (resData) => {
						console.log('resDataresDataresDataresData',resData);
						if(resData.confirm){
							uni.getUserProfile({
								desc: "获取你的昵称、头像信息",//必填项，声明获取用户个人信息后的用途，不超过30个字符
								success: (res) => {
									console.log("resresresres",res);
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
				console.log('isAuthorizationisAuthorizationisAuthorization', isAuthorization);
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