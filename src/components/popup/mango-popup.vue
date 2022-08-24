<template>
	<view :animation="animationData" class="mango-popup" :class="{show: show}" v-show="show">
		<view>弹窗</view>
		<view>hahaha</view>
		<u-button @click="close">关闭</u-button>
	</view>
</template>

<script>
	export default {
		name: 'MangoPopup',
		data(){
			return {
				animationData: {}
			}
		},
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			show: {
				handler(){
					if(this.show){
						console.log('this')
						this.animation = uni.createAnimation()
						this.animation.translateX(0).step({duration:200})
						this.animationData = this.animation.export()
					}else{
						console.log('else')
						this.animation = uni.createAnimation()
						this.animation.translateX('375rpx').step({duration:200})
						this.animationData = this.animation.export()
					}
				}
			}
		},
		methods: {
			close(){
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss">
	.mango-popup{
		width: 100vw;
		height: 100vh;
		transform: translateX(100%);
		position: fixed;
		top: 0;
		left: 0;
		background: #fff;
		box-sizing: border-box;
		border: 1px solid #333;
		padding: 200rpx;
	}
</style>
