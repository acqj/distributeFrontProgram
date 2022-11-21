<template>
	<div class="flexColAllWidthCls">
		<div style="margin: 10px 0;width: 90%;">
			<uni-easyinput type="search" suffixIcon="search"  v-model="searchGoodsName" placeholder="搜索更多折扣" @iconClick="onClick"></uni-easyinput>
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
	import { getChannelList } from '@/api/homeApi'
	import SwiperChannel from './components/swiperMenu';
	export default{
		name: "HomeIndex",
		components: {SwiperChannel},
		data(){
			return {
				currentOpenId: this.$store.state.openId,
				searchGoodsName: "",
				channelList: [], //活动专区列表
			}
		},
		onLoad(e) {
			console.log("dddddddddddd");
			console.log(e);
			if(e.shareFromOpenId){
				//标识带有分享自某个openId 需记录上一级
			}
			if(!this.$store.state.openId){
				// this.getOpenId();
			}
			
			this.getData();
		},
		created() {
			
		},
		methods: {
			...mapActions(['getUserOpenId']),
			testData(){
				uni.request({
					url:"https://weixin.fletu.com/api/TrainingInfo/Search",
					method: "POST",
					data:{
						"TrainingType":this.currentType,"Limit":10,"Page":1
					},
					success: res => {
							console.log("reeeeeeeeeees", res);
						},
					fail: () => {},
					complete: () => {}
				})
			},
			getData(){
				var params = {
					pageNo: 1,
					pageSize: 10,
					stateFlag: 0,
					keyword: ""
				}
				getChannelList(params).then(data => {
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
					this.$refs.getOpenIdErrPop.open('top');
					// console.log('fffffffffffffffffffff', uni.getUserProfile);
					uni.showModal({
						title:'授权',
						content:"是否授权",
						success: () => {
							uni.getUserProfile({
								desc: "获取你的昵称、头像信息",//必填项，声明获取用户个人信息后的用途，不超过30个字符
								success: (res) => {
								  const userInfo = res.userInfo;
								  // console.log("用户基本信息", userInfo);
								},
								fail: (res) => {
									// console.log(res);
								  //拒绝授权
								  wx.showToast({
									title: "获取失败",
									icon: "error",
									duration: 2000,
									});
								  return;
								},
							});
						}
					})
				}
				// console.log('666666666666666666666666',this.$store.state.openId);
				// if(this.currentOpenId){
				// 	this.$refs.getOpenIdErrPop.open('top');
				// }
			}
		}
	}
</script>

<style>
	.searchCls{
		border-radius: 10px;
	}
</style>