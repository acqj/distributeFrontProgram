<template>
	<div>
		佣金
		<button type="warn" size="mini" @click="getOrderBtnClick">查询</button>
	</div>
</template>

<script>
	import { getOrderList } from '@/api/orderApi';
	export default{
		name: "CommissionIndex",
		data(){
			return {
				
			}
		},
		onLoad(e){
			
		},
		methods: {
			getOrderBtnClick(){
				getOrderList().then(data => {
					console.log("ddddddddddddddddddddaaa");
					console.log(data);
				}).catch(err => {
					wx.showToast({
						title: "获取订单失败，网络错误",
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