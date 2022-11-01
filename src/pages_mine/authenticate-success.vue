<template>
	<view class="payment-success">
		<u-status-bar></u-status-bar>
		<view class="payment-success-title">
			提交成功
		</view>
		<view class="payment-success-info">
			<view class="payment-success-info-title">您已提交专业认证信息</view>
			<view class="payment-success-info-ready">我们将尽快为您审核</view>
		</view>
		<view class="payment-success-body">
			<view class="payment-success-body-in">
				<view class="payment-success-body-center-one"></view>
				<view class="payment-success-body-center-two"></view>
				<view class="payment-success-body-center">
					<image src="@/static/images/mine/success-audit-white.png" class="payment-success-body-center-img"></image>
				</view>
			</view>
		</view>
		<view class="payment-success-footer">
			<view class="payment-success-footer-back" @click="handleBack">
				返回
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				count: 0
			}
		},
		onLoad(option) {
			
		},
		computed: {
			userInfo() {
				return this.$store.state.user.userInfo
			},
			info() {
				return this.$store.state.user.info
			}
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			}
		},
	}
</script>

<style lang="scss">
	.payment-success{
		width: 100vw;
		height: 100vh;
		
		.payment-success-title{
			margin-top: 48rpx;
			width: 100%;
			text-align: center;
			font-size: 18px;
			color: #09080A;
			font-weight: bold;
		}
		
		.payment-success-info{
			margin-top: 96rpx;
			width: 100%;
			
			.payment-success-info-title{
				color: #09080A;
				text-align: center;
				font-size: 22px;
			}
			
			.payment-success-info-ready{
				margin-top: 12rpx;
				color: #7F7F7F;
				text-align: center;
				font-size: 16px;
			}
			
			.payment-success-info-amount{
				margin-top: 24rpx;
				color: #09080A;
				text-align: center;
				font-size: 14px;
			}
		}
		
		.payment-success-body{
			margin-top: 164rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.payment-success-body-in{
				width: 424rpx;
				height: 424rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
			}
			
			.payment-success-body-center-one{
				width: 352rpx;
				height: 352rpx;
				border-radius: 50%;
				background: #EDECF7;
				position: absolute;
				z-index: 2;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			
			.payment-success-body-center-two{
				width: 424rpx;
				height: 424rpx;
				border-radius: 50%;
				background: #F8F8FC;
				position: absolute;
				z-index: 1;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			
			.payment-success-body-center{
				width: 280rpx;
				height: 280rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				background-image: linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%);
				position: relative;
				z-index: 3;
				
				.payment-success-body-center-img{
					width: 180rpx;
					height: 180rpx;
				}
			}
			
			.payment-success-body-icon{
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				z-index: 4;
				
				.payment-success-body-icon-img{
					width: 48rpx;
					height: 48rpx;
				}
				
				&.icon-one{
					background: #DFDAEB;
					right: -36rpx;
					top: -36rpx;
					width: 108rpx;
					height: 108rpx;
					
					.payment-success-body-icon-img{
						width: 60rpx;
						height: 60rpx;
					}
				}
				
				&.icon-two{
					background: #FEEEEB;
					left: 0;
					top: 0;
				}
				
				&.icon-three{
					background: #FFF1BC;
					left: -64rpx;
					bottom: 64rpx;
				}
				
				&.icon-four{
					background: #E9E7F3;
					left: 200rpx;
					bottom: -64rpx;
				}
				
				&.icon-five{
					background: #E9E7F3;
					right: -64rpx;
					bottom: 64rpx;
				}
			}
		}
		
		.payment-success-footer{
			margin-top: 164rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			
			.payment-success-footer-back{
				width: 240rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 24rpx;
				background: #000000;
				color: #fff;
				font-size: 16px;
				margin-bottom: 24rpx;
			}
			
			.payment-success-footer-continue{
				width: 100%;
				text-align: center;
				color: #7F7F7F;
				font-size: 14px;
			}
		}
	}
</style>