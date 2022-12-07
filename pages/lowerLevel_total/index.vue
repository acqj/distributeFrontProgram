<template>
	<div class="flexColAllWidthCls">
		<div class="flexColCls" style="width: 95%;background-color: #fff;">
			<uni-table border stripe emptyText="暂无更多数据">
				<uni-tr>
					<uni-th align="center">昵称</uni-th>
					<uni-th align="center">佣金</uni-th>
					<uni-th align="center">日期</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in dataList" :key="index" class="acls">
					<uni-th align="center" style="font-weight: normal;color: #3d3d3d;">
						<div style="font-weight: normal;color: #3d3d3d;">
							{{item.nickName}}
						</div>
					</uni-th>
					<uni-th align="center">
						<div style="font-weight: normal;color: #3d3d3d;">
							￥{{item.totalCommission}}
						</div>
					</uni-th>
					<uni-th align="center">
						<div style="font-weight: normal;color: #3d3d3d;">
							{{item.updateTime}}
						</div>
					</uni-th>
				</uni-tr>
			</uni-table>
		</div>
	</div>
</template>

<script>
	import { getLowerLevelData } from '@/api/commissionApi';
	export default{
		name: "LowerLevelTotal",
		data(){
			return {
				currentOpenId: this.$store.state.openId,
				dataList: []
			}
		},
		onLoad(e) {
			this.getData();
		},
		methods: {
			getData(){
				getLowerLevelData({openId: this.currentOpenId}).then(data => {
					console.log(data);
					if(data.data.code == 0){
						this.dataList = data.data.data;
					}else{
						wx.showToast({
							title: data.data.msg,
							icon: "none"
						})
					}
				}).catch(err => {
					wx.showToast({
						title: "获取失败，网络错误",
						icon: "none"
					})
				})
			}
		}
	}
</script>

<style>
</style>