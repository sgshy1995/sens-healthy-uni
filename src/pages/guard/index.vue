<template>
	<view class="index-guard">
		<view class="index-guard-in">
			<u-status-bar></u-status-bar>
			<view class="index-guard-top" :class="{scale: showLoginRegister}">
				<view class="index-guard-top-img">
					<image class="index-guard-top-img-in" src="@/static/images/logo.png"></image>
				</view>
				<view class="index-guard-top-text">
					<view class="index-guard-top-text-top animate__rubberBand">森普健康</view>
					<view class="index-guard-top-text-bottom">健康，会让你变得更好</view>
				</view>
			</view>
			<view class="index-guard-buttons">
				<view class="index-guard-button button-primary" @click="handleLogin">即刻开始 →</view>
				<view class="bottom-lisence">
					<u-checkbox-group v-model="selectedLicense">
						<u-checkbox size="16" shape="circle" activeColor="#4F68B0" name="select"></u-checkbox>
					</u-checkbox-group>
					<text>已阅读并同意 <text @click="handleShowAgreement" class="a-lisence">森普健康用户协议</text></text>
				</view>
			</view>
			<u-popup round="24rpx" overlayOpacity="0" :show="showLoginRegister" @close="close" @open="open">
				<LoginRegister @ok="handleOk" ref="LoginRegister"></LoginRegister>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import LoginRegister from '@/pages/guard/loginRegister.vue'
	export default {
		components: {
			LoginRegister
		},
		data() {
			return {
				showLoginRegister: false,
				selectedLicense: []
			}
		},
		onLoad(option) {
			if(!option.notAuth){
				if(uni.getStorageSync('SYS_AUTH_TOKEN_KEY')){
					uni.switchTab({
						url: "/pages/index/index"
					})
				}
				setTimeout(() => {
					plus.navigator.closeSplashscreen();
				}, 500)
			}
			
		},
		methods: {
			open() {
				// console.log('open');
			},
			close() {
				this.showLoginRegister = false
				// console.log('close');
			},
			handleLogin(){
				if(!this.selectedLicense.length){
					uni.showToast({
						title: '请同意并勾选用户协议',
						icon: 'none'
					})
				}else{
					this.showLoginRegister = true
				}
			},
			handleRegister(){
				this.showLoginRegister = true
				this.$nextTick(()=>{
					this.$refs.LoginRegister.changeShowType('register')
				})
			},
			handleOk(){
				this.close()
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			handleShowAgreement(){
				uni.navigateTo({
					url: "/pages/guard/agreement-of-usage"
				})
			}
		}
	}
</script>

<style lang="scss">
	.index-guard {
		width: 100vw;
		height: 100vh;
		background: url('../../static/images/guard/guard_back.jpg') no-repeat 100%/100%;
		background-size: cover;

		.index-guard-in {
			width: 100%;
			height: 100%;
			position: relative;
		}

		.index-guard-top {
			width: 100%;
			box-sizing: border-box;
			padding: 48rpx;
			animation: backInLeft; /* referring directly to the animation's @keyframe declaration */
			animation-duration: 1s; /* don't forget to set a duration! */

			.index-guard-top-img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 24rpx;
				background: rgba(255, 255, 255, 0.5);
				transition: all 0.3s;

				.index-guard-top-img-in {
					width: 60rpx;
					height: 60rpx;
				}
			}

			.index-guard-top-text {
				width: 100%;
				color: #fff;
				transition: all 0.3s;

				.index-guard-top-text-top {
					font-size: 22px;
					font-weight: 800;
					animation: rubberBand; /* referring directly to the animation's @keyframe declaration */
					animation-duration: 0.5s; /* don't forget to set a duration! */
					animation-delay: 1s;
				}

				.index-guard-top-text-bottom {
					font-size: 14px;
				}
			}
			
			&.scale{
				.index-guard-top-img{
					animation: heartBeat; /* referring directly to the animation's @keyframe declaration */
					animation-duration: 1s; /* don't forget to set a duration! */
				}
			}
		}

		.index-guard-buttons {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			position: absolute;
			bottom: 0;
			left: 0;
			box-sizing: border-box;
			padding-bottom: 120rpx;

			.index-guard-button {
				width: 60%;
				height: 100rpx;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 16px;
				background: rgba(255,255,255,0.7);
				color: #4F68B0;
				font-weight: 700;

				&.button-primary {
					background: rgba(79,104,176,0.7);
					color: #fff;
				}
			}
			
			.bottom-lisence {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				margin-top: 32rpx;
				color: #fff;

				.a-lisence {
					text-decoration: underline;
					color: #fff;
					padding-left: 4rpx;
					font-weight: bold;
				}
			}
		}
	}
</style>
