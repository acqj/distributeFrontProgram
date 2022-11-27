<template>
	<div class="flexColAllWidthCls">
		
	</div>
</template>

<script>
	import { getMyRelation } from '@/api/userApi';
	export default{
		name: "RelationPage",
		data(){
			return {
				currentOpenId: this.$store.state.openId,
				parentOpenId: ""
			}
		},
		onLoad(e) {
			if(e.parentOpenId){
				this.parentOpenId = e.parentOpenId;
			}
		},
		methods: {
			getRelationData(){
				var params = {
					openId: this.currentOpenId,
					parentOpenId: this.parentOpenId
				}
				getMyRelation(params).then(data => {
					var resData = data.data;
					console.log("ccccccccccccccccccc");
					console.log(resData);
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