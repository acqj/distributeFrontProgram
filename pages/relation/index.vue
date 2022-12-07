<template>
	<div class="flexColAllWidthCls">
		<!-- <div style="width: 90%;text-align: left;font-weight: bold;margin-top: 20px;" v-if="parentUserInfo != null">
			我的上级
		</div>
		<div v-if="parentUserInfo != null" class="flexColCls" style="width: 90%;border-radius: 10px;background-color: #fff;margin-top: 10px;">
			<div class="flexRowAllWidthCls" style="margin-top: 20px;">
				<div style="text-align: right;width: 40%;">
					昵称：
				</div>
				<div style="text-align: left;width: 60%;">
					{{parentUserInfo.wx_nick}}
				</div>
			</div>
			<div class="flexRowAllWidthCls" style="margin-top: 10px;margin-bottom: 20px;">
				<div style="text-align: right;width: 40%;">
					加入时间：
				</div>
				<div style="text-align: left;width: 60%;">
					{{parentUserInfo.create_datetime}}
				</div>
			</div>
		</div> -->
		<div style="width: 90%;text-align: left;font-weight: bold;margin-top: 30px;">
			我的下级
		</div>
		<div style="width: 90%;border-radius: 10px;margin-top: 10px;">
			<uni-table border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th align="center">昵称</uni-th>
					<uni-th align="center">加入时间</uni-th>
				</uni-tr>
				<uni-tr v-for="item in childrenList" :key="item.id" class="acls">
					<uni-th align="center" style="font-weight: normal;color: #3d3d3d;">
						<div style="font-weight: normal;color: #3d3d3d;">
							{{item.wx_nick}}
						</div>
					</uni-th>
					<uni-th align="center">
						<div style="font-weight: normal;color: #3d3d3d;">
							{{item.create_datetime}}
						</div>
					</uni-th>
				</uni-tr>
			</uni-table>
		</div>
	</div>
</template>

<script>
	import { getMyRelation } from '@/api/userApi';
	export default{
		name: "RelationPage",
		data(){
			return {
				currentOpenId: this.$store.state.openId,
				parentOpenId: "",
				hasParent: false,
				parentUserInfo: null,
				childrenList: []
			}
		},
		onLoad(e) {
			if(e.parentOpenId){
				this.parentOpenId = e.parentOpenId;
			}
			this.getRelationData();
		},
		methods: {
			getRelationData(){
				var params = {
					openId: this.currentOpenId,
					parentOpenId: this.parentOpenId
				}
				getMyRelation(params).then(data => {
					var resData = data.data;
					if(resData.code == 0){
						if(resData.parentUserInfo){
							this.hasParent = true;
							this.parentUserInfo = resData.parentUserInfo;
							if(!this.parentUserInfo.wx_nick){
								this.parentUserInfo.wx_nick = "微信昵称";
							}
						}
						if(resData.childrenList && resData.childrenList.length > 0){
							this.childrenList = resData.childrenList;
						}else{
							this.childrenList = [];
						}
					}else{
						wx.showToast({
							title: data.msg,
							icon: "none",
							duration: 2000
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取信息失败，网络错误",
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