<template>
	<div>
		我的
		<button class="separate-fl" plain="true" data-name="shareBtn" open-type="share">
		           <text class="icon-fenxiang iconfont"></text>
		            <text class="separate-text">分享</text>                     
		 </button>
	</div>
</template>

<script>
	export default{
		name: "PersonalIndex",
		data(){
			return{
				
			}
		},
		onLoad() {
			
		},
		onShareAppMessage(e) {
			return {
				title: "分享邀请",
				path: 'pages/home/index?shareFromOpenId=' + this.$store.state.openId
			}
		},
		methods: {
			
		}
	}
</script>

<style>
</style>