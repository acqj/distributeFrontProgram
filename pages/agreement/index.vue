<template>
	<div>
		<div v-if="pageTitle=='用户服务协议'">
			<!-- 用户服务协议 -->
		</div>
		<div v-else>
			<!-- 隐私政策 -->
		</div>
	</div>
</template>

<script>
	export default{
		name: "AgreementPage",
		data() {
			return {
				pageTitle: ""
			}
		},
		onLoad(e){
			// var title = "";
			if(e.title){
				this.pageTitle = e.title;
			}else{
				this.pageTitle = "隐私政策";
			}
			uni.setNavigationBarTitle({
				title: this.pageTitle,
				success: () => {
					console.log('修改标题成功')
				},
				fail: () => {
					console.log('修改标题失败')
				},
				complete: () => {
					console.log('修改标题结束')
				},
			})
		},
		methods: {
			
		}
	}
</script>

<style>
</style>