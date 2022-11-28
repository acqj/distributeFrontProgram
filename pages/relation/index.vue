<template>
	<div class="flexColAllWidthCls">
		<div>
			
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
					console.log("ccccccccccccccccccc");
					console.log(resData);
					if(resData.code == 0){
						if(resData.parentUserInfo){
							this.hasParent = true;
							this.parentUserInfo = resData.parentUserInfo;
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