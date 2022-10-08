<template>
	<view class="index-wrapper-outer">
		<view class="index-wrapper" :class="{hiden: visible}">
			<view class="index-nav" placeholder title="" leftIconSize="28" border bgColor="#fff">
				<u-status-bar></u-status-bar>
				<!-- <view class="index-nav-in">
					<view class="index-nav-in-left"></view>
					<view class="index-nav-in-center">
						<view class="index-nav-tabs">
							<view class="index-nav-tabs__item" @click="changeTabs(index)" v-for="(u,index) in listTitle" :key="index" :class="{active: current === index}">
								<text>{{ u.name }}</text>
								<view class="index-nav-tabs__item__live" v-if="index === 1">
									<image src="@/static/images/live-white.png" class="index-nav-tabs__item__live__image"></image>
									<text class="index-nav-tabs__item__live__text">Live</text>
								</view>
							</view>
							<view class="index-nav-tabs__line" :class="{right: current === 1}"></view>
						</view>
					</view>
					<view class="index-nav-in-right">
						<view class="right-item" @click="handleShowTips">
							<image class="add-icon" src="@/static/images/recovery/tips.png"></image>
						</view>
					</view>
				</view> -->
				<view class="index-nav-title">
					<image class="index-nav-title-img" src="@/static/images/recovery/recovery.png"></image>
					<text class="index-nav-title-in">智能处方</text>
				</view>
				<view class="index-nav-tip">汇集智能处方相关的视频、文章等, 内容全部为您精心挑选, 让您拥有健康、全面的第一信息</view>
			</view>
			<Prescription @hide="handleHidePrescription" @show="handleShowPrescription" v-show="current === 0"></Prescription>
		</view>
	</view>
	
</template>

<script>
	import Prescription from '@/pages_recovery/prescription.vue'
	export default {
		components: {
			Prescription
		},
		data() {
			return {
				ifSticky: false,
				visible: false,
				itemStyle: {
					height: '38px',
					fontWeight: 'bold',
					fontSize: '18px'
				},
				listTitle: [
					{
						name: '智能处方',
					},
					{
						name: '专业指导',
						showCustom: true
					}
				],
				menuBaseUrl: 'https://cdn.uviewui.com/uview/menu/',
				title: 'Hello',
				current: 0,
				message: 998
			}
		},
		onLoad(){
			uni.switchTab({
				url: '/pages/store/index'
			});
		},
		methods: {
			showCamera(){
				
			},
			changeTabs(index){
				this.current = index
			},
			handleShowTips() {
				const that = this
				
			},
			handleShowPrescription(){
				console.log('显示弹窗')
				this.visible = true
			},
			handleHidePrescription(){
				console.log('关闭弹窗')
				this.visible = false
			},
			onPageScroll(res) {
				this.ifSticky = res.scrollTop >= 24
			},
		}
	}
</script>

<style lang="scss">
	.index-wrapper-outer{
		width: 100vw;
		height: 100vh;
	}
	
	.index-wrapper {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
		
		.index-nav{
			width: 100%;
			box-sizing: border-box;
			border-bottom: 1px solid #ddd;
			
			.index-nav-title{
				width: 100%;
				box-sizing: border-box;
				padding: 0 24rpx;
				display: flex;
				align-items: center;
				
				.index-nav-title-img{
					width: 48rpx;
					height: 48rpx;
					margin-right: 12rpx;
				}
				
				.index-nav-title-in{
					font-size: 14px;
					font-weight: bold;
				}
			}
			
			.index-nav-tip{
				width: 100%;
				box-sizing: border-box;
				padding: 0 24rpx 24rpx 24rpx;
				font-size: 12px;
				color: #666;
				margin-top: 24rpx;
			}
			
			.index-nav-in{
				width: 100%;
				height: 84rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 24rpx;
				
				.index-nav-in-center{
					flex-grow: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					
					.index-nav-tabs{
						width: 280rpx;
						display: flex;
						align-items: center;
						position: relative;
						box-sizing: border-box;
						padding-bottom: 8rpx;
						
						&__item{
							width: 50%;
							box-sizing: border-box;
							font-size: 14px;
							font-weight: 800;
							color: #666;
							transition: all 0.3s;
							display: flex;
							align-items: center;
							justify-content: center;
							white-space: nowrap;
							position: relative;
							
							&.active{
								color: #333;
							}
							
							&__live{
								position: absolute;
								bottom: 50%;
								left: 80%;
								box-sizing: border-box;
								background: rgba(224,108,117,0.7);
								padding: 2rpx 6rpx;
								display: flex;
								align-items: center;
								border-radius: 10rpx;
								
								&__image{
									width: 28rpx;
									height: 28rpx;
									margin-right: 4rpx;
								}
								
								&__text{
									font-size: 10px;
									font-weight: bold;
									color: #fff;
								}
							}
						}
						
						&__line{
							height: 6rpx;
							border-radius: 4rpx;
							width: 60rpx;
							position: absolute;
							top: 100%;
							left: 40rpx;
							background: #4F68B0;
							transition: all 0.3s;
							
							&.right{
								left: 180rpx;
							}
						}
					}
				}
			}
		}
		
		.index-nav-in-right, .index-nav-in-left{
			display: flex;
			align-items: center;
			width: 32rpx;
		}
		
		.right-item{
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 10px;
			flex-direction: column;
			position: relative;
		}
		
		.msg-icon{
			width: 18px;
			height: 18px;
		}
		
		.add-icon{
			width: 32rpx;
			height: 32rpx;
		}
	}
	
	
	
	.home-sticky {
		top: 0 !important;
	}
</style>
