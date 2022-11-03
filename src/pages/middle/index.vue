<template>
	<view class="middle-wrapper">
		<u-status-bar></u-status-bar>
		<view class="middle-wrapper-top">
			<view class="middle-wrapper-top-left">
				<view class="middle-wrapper-top-left-in">
					<view class="middle-wrapper-top-left-in-in"></view>
				</view>
				<view class="middle-wrapper-top-left-in active">
					<view class="middle-wrapper-top-left-in-in"></view>
				</view>
				<view class="middle-wrapper-top-left-in">
					<view class="middle-wrapper-top-left-in-in"></view>
				</view>
				<view class="middle-wrapper-top-left-in">
					<view class="middle-wrapper-top-left-in-in"></view>
				</view>
			</view>
			<view class="middle-wrapper-top-right">
				<u-icon name="bell" color="#333" size="42rpx"></u-icon>
				<!-- <image src="@/static/images/middle/search.png" class="middle-wrapper-top-right-img"></image> -->
			</view>
		</view>
		<view class="middle-wrapper-info">
			<view class="middle-wrapper-info-left">
				<view class="middle-wrapper-info-left-top">
					<text class="middle-wrapper-info-left-top-time">{{ timeFix }}</text>
					<text class="middle-wrapper-info-left-top-name">{{ userInfo.name || '森普健康用户' }}</text>
					<image class="middle-wrapper-info-left-top-img" src="@/static/images/middle/sayhi.png"></image>
				</view>
				<view class="middle-wrapper-info-left-bottom">
					今天是是开始您康复之旅的好时候！
				</view>
			</view>
			<view class="middle-wrapper-info-right">
				<view class="middle-wrapper-info-right-avatar">
					<image class="middle-wrapper-info-right-avatar-img" :src="userInfo.avatar ? baseUrl + userInfo.avatar : avatarDefault"></image>
				</view>
			</view>
		</view>
		<view class="middle-wrapper-switch">
			<view class="middle-wrapper-switch-item" :class="{active: showType === 'live'}" @click="handleChangeShowType('live')">
				面对面康复指导
			</view>
			<view class="middle-wrapper-switch-item" :class="{active: showType === 'video'}" @click="handleChangeShowType('video')">
				专业能力提升
			</view>
		</view>
		<view class="middle-wrapper-body">
			<middle-live-course ref="MiddleLiveCourse" v-show="showType === 'live'"></middle-live-course>
		</view>
		<view class="middle-wrapper-buy-button" @click="handleShowBuyCourse">
			<image src="@/static/images/middle/store.png" class="middle-wrapper-buy-button-img"></image>
		</view>
	</view>
</template>

<script>
	import { timeFix } from '@/utils/util'
	import MiddleLiveCourse from "@/pages_middle/middle-live-course.vue"
	export default {
		data(){
			return {
				timeFix: timeFix(),
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				avatarDefault: require('@/static/images/avatar-default.png'),
				showType: 'live'
			}
		},
		components: {
			MiddleLiveCourse
		},
		onShow(){
			this.$nextTick(() => {
				this.$refs.MiddleLiveCourse.getData()
			})
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		methods: {
			handleChangeShowType(type){
				this.showType = type
			},
			handleShowBuyCourse() {
				uni.switchTab({
					url: "/pages/store/index"
				})
			},
		}
	}
</script>

<style lang="scss">
	.middle-wrapper{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		
		.middle-wrapper-buy-button{
			position: fixed;
			right: 24rpx;
			bottom: 48rpx;
			z-index: 999;
			width: 96rpx;
			height: 96rpx;
			
			.middle-wrapper-buy-button-img{
				width: 96rpx;
				height: 96rpx;
			}
		}
		
		.middle-wrapper-top{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 36rpx;
			margin-top: 12rpx;
			
			.middle-wrapper-top-left{
				display: flex;
				align-items: center;
				justify-content: center;
				flex-wrap: wrap;
				width: 50rpx;
				height: 50rpx;
				
				.middle-wrapper-top-left-in{
					width: 25rpx;
					height: 25rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					
					.middle-wrapper-top-left-in-in{
						width: 14rpx;
						height: 14rpx;
						border-radius: 50%;
						background: #333;
					}
					
					&.active{
						.middle-wrapper-top-left-in-in{
							background: #4F68B0;
						}
					}
				}
			}
			
			.middle-wrapper-top-right{
				
				.middle-wrapper-top-right-img{
					width: 42rpx;
					height: 42rpx;
				}
			}
		}
		
		.middle-wrapper-info{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 36rpx;
			margin-top: 36rpx;
			
			.middle-wrapper-info-left{
				
				
				.middle-wrapper-info-left-top{
					display: flex;
					align-items: flex-end;
					
					.middle-wrapper-info-left-top-time{
						font-size: 12px;
						font-weight: bold;
						color: #333;
						padding-right: 12rpx;
					}
					
					.middle-wrapper-info-left-top-name{
						font-size: 18px;
						font-weight: bold;
						color: #333;
						padding-right: 24rpx;
					}
					
					.middle-wrapper-info-left-top-img{
						width: 48rpx;
						height: 48rpx;
					}
				}
				
				.middle-wrapper-info-left-bottom{
					font-size: 13px;
					color: #A4ABB4;
					margin-top: 12rpx;
				}
			}
			
			.middle-wrapper-info-right{
				display: flex;
				align-items: center;
				justify-content: center;
				
				.middle-wrapper-info-right-avatar{
					display: flex;
					align-items: center;
					justify-content: center;
					
					.middle-wrapper-info-right-avatar-img{
						width: 84rpx;
						height: 84rpx;
						border-radius: 12rpx;
					}
				}
			}
		}
		
		.middle-wrapper-switch{
			width: 100%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 0 36rpx;
			margin-top: 36rpx;
			
			.middle-wrapper-switch-item{
				padding: 10rpx 24rpx;
				border-radius: 24rpx;
				box-sizing: border-box;
				background: #fff;
				color: #333;
				font-weight: bold;
				margin-right: 24rpx;
				transition: all 0.3s;
				font-size: 14px;
				
				&.active{
					background: #4F68B0;
					color: #fff;
					box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
				}
			}
		}
		
		.middle-wrapper-body{
			width: 100%;
			height: 1200rpx;
			margin-top: 36rpx;
		}
	}
</style>