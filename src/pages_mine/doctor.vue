<template>
	<view class="doctor-wrapper">
		<view class="doctor-wrapper-top">
			<u-status-bar></u-status-bar>
			<view class="doctor-wrapper-top-one"></view>
			<view class="doctor-wrapper-top-two"></view>
			<view class="doctor-wrapper-top-three"></view>
			<view class="doctor-wrapper-top-four"></view>
			<image src="@/static/images/mine/doctor-img.png" class="doctor-wrapper-top-five"></image>
			<view class="doctor-wrapper-top-info">
				<view class="doctor-wrapper-top-info-left">
					<image class="doctor-wrapper-top-info-left-img" :src="userInfo.avatar ? baseUrl + userInfo.avatar : avatarDefault" @click="showView(userInfo.avatar)"></image>
					<image v-if="userInfo.authenticate === 2" src="@/static/images/mine/auth.png" class="doctor-wrapper-top-info-left-auth"></image>
				</view>
				<view class="doctor-wrapper-top-info-right">
					<u-icon name="bell" color="#212024" size="36rpx"></u-icon>
				</view>
			</view>
			<view class="doctor-wrapper-top-last">
				<view class="doctor-wrapper-top-last-welcome">欢迎您！</view>
				<view class="doctor-wrapper-top-last-name">
					<text class="doctor-wrapper-top-last-name-in">{{ userInfo.authenticate_info.name }}</text>
					<image v-if="userInfo.authenticate_info.gender === 1" src="@/static/images/mine/doctor-male.png" class="doctor-wrapper-top-last-name-img"></image>
					<image v-else-if="userInfo.authenticate_info.gender === 0" src="@/static/images/mine/doctor-famale.png" class="doctor-wrapper-top-last-name-img"></image>
				</view>
				<view class="doctor-wrapper-top-last-organization">@{{ userInfo.authenticate_info.organization }}</view>
				<view class="doctor-wrapper-top-last-button">
					查看个人资料
				</view>
			</view>
		</view>
		<view class="doctor-wrapper-bottom">
			<view class="doctor-wrapper-bottom-service">
				<view class="doctor-wrapper-bottom-service-title">
					医师服务
				</view>
				<scroll-view scroll-x class="doctor-wrapper-bottom-service-body">
					<view class="doctor-wrapper-bottom-service-body-item" @click="handleShowBookManage">
						<view class="doctor-wrapper-bottom-service-body-item-top">
							<image src="@/static/images/mine/book-time.png" class="doctor-wrapper-bottom-service-body-item-top-img"></image>
						</view>
						<view class="doctor-wrapper-bottom-service-body-item-bottom">
							预约时间
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="doctor-wrapper-bottom-course">
				<view class="doctor-wrapper-bottom-course-title">
					已预约课程
				</view>
				<view class="doctor-wrapper-bottom-course-body">
					<mescroll-uni style="width: 100%" ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
						<view class="doctor-wrapper-bottom-course-body-empty" v-if="!recentList.length">
							<image src="@/static/images/recovery/empty-data.png" class="doctor-wrapper-bottom-course-body-empty-img"></image>
							<text class="doctor-wrapper-bottom-course-body-empty-text">暂无预约课程，刷新下看看吧~</text>
						</view>
					</mescroll-uni>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				avatarDefault: require('@/static/images/avatar-default.png'),
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				recentList: []
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			},
			info(){
				return this.$store.state.user.info
			},
			authStatus(){
				return this.$store.state.auth.authStatus
			}
		},
		onLoad(){
			this.$loadingOn()
		},
		onShow(){
			this.$loadingOn()
			this.getData()
			this.$loadingOff()
		},
		methods: {
			handleShowDoctorTime(){
				const that = this
				uni.navigateTo({
					url: "/pages_mine/doctor-time",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							
						})
					}
				})
			},
			close() {
				uni.navigateBack()
			},
			showView(url) {
				if(!url) return
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + url],
					indicator: 'none'
				});
			},
			handleShowBookManage(){
				if (!this.userInfo.identity || this.userInfo.authenticate !== 2 || !this.userInfo.if_lecture_auth) {
					this.$toast('您还没有讲师权限哦~')
					return
				}
				this.handleShowDoctorTime()
			},
			handleRefreshDown(mescroll) {
				setTimeout(() => {
					mescroll.endSuccess(1, false)
				}, 300);
				// this.getData().then(res=>{
				// 	mescroll.endSuccess(res.length, false)
				// }).catch(err=>{
				// 	mescroll.endErr()
				// })
			},
			getData(){
				
			}
		}
	}
</script>

<style lang="scss">
	.doctor-wrapper{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		
		.doctor-wrapper-top{
			width: 100%;
			height: 636rpx;
			position: relative;
			
			.doctor-wrapper-top-info{
				margin-top: 24rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 36rpx;
				position: relative;
				z-index: 6;
				
				.doctor-wrapper-top-info-left{
					position: relative;
					width: 84rpx;
					height: 84rpx;
					
					.doctor-wrapper-top-info-left-img{
						width: 84rpx;
						height: 84rpx;
						border-radius: 50%;
					}
					
					.doctor-wrapper-top-info-left-auth{
						width: 36rpx;
						height: 36rpx;
						position: absolute;
						bottom: 0;
						right: 0;
					}
				}
				
				.doctor-wrapper-top-info-right{
					position: relative;
					width: 64rpx;
					height: 64rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background :#fff;
					border-radius: 50%;
				}
			}
			
			.doctor-wrapper-top-last{
				margin-top: 48rpx;
				width: 100%;
				box-sizing: border-box;
				padding: 0 36rpx;
				position: relative;
				z-index: 6;
				
				.doctor-wrapper-top-last-welcome{
					font-size: 20px;
					font-weight: bold;
					color: #1D1E24;
				}
				
				.doctor-wrapper-top-last-name{
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					
					.doctor-wrapper-top-last-name-in{
						font-size: 20px;
						font-weight: bold;
						color: #1D1E24;
						white-space: nowrap;
					}
					
					.doctor-wrapper-top-last-name-img{
						width: 48rpx;
						height: 48rpx;
						margin-left: 24rpx;
					}
				}
				
				.doctor-wrapper-top-last-organization{
					font-size: 14px;
					color: #8998A7;
					margin-top: 12rpx;
				}
				
				.doctor-wrapper-top-last-button{
					margin-top: 48rpx;
					width: 200rpx;
					height: 60rpx;
					border-radius: 24rpx;
					background: #4F68B0;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					font-weight: bold;
					color: #fff;
				}
			}
			
			.doctor-wrapper-top-one{
				background: radial-gradient(#B9EAFD 0, #F8F8FC 70%);
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
			}
			
			.doctor-wrapper-top-two{
				background-image: linear-gradient(to right, #F5F9FC 0%, #D8F2FD 30%, #D3F1FD 100%);
				width: 600rpx;
				height: 600rpx;
				position: absolute;
				border-radius: 50%;
				top: -250rpx;
				left: 100rpx;
				z-index: 2;
			}
			
			.doctor-wrapper-top-three{
				background: radial-gradient(#BDD8FD 0, #C9EEFC 70%);
				width: 600rpx;
				height: 600rpx;
				position: absolute;
				border-radius: 50%;
				top: -200rpx;
				left: 250rpx;
				z-index: 3;
			}
			
			.doctor-wrapper-top-four{
				background-image: linear-gradient(to right, #F8F8FC 0%, #BDD8FD 100%);
				width: 400rpx;
				height: 400rpx;
				position: absolute;
				border-radius: 50%;
				top: -200rpx;
				left: 100rpx;
				z-index: 4;
			}
			
			.doctor-wrapper-top-five{
				width: 200rpx;
				height: 200rpx;
				position: absolute;
				bottom: 96rpx;
				right: 48rpx;
				z-index: 5;
			}
		}
		
		.doctor-wrapper-bottom{
			width: 100%;
			margin-top: -48rpx;
			height: calc(100vh - 588rpx);
			border-top-left-radius: 48rpx;
			border-top-right-radius: 48rpx;
			background: #fff;
			box-sizing: border-box;
			padding: 48rpx 36rpx 0 36rpx;
			position: relative;
			z-index: 7;
			
			.doctor-wrapper-bottom-service{
				width: 100%;
				
				.doctor-wrapper-bottom-service-title{
					font-size: 14px;
					font-weight: bold;
				}
				
				.doctor-wrapper-bottom-service-body{
					font-size: 14px;
					margin-top: 24rpx;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					box-sizing: border-box;
					flex-wrap: nowrap;
					padding: 0 12rpx;
					
					.doctor-wrapper-bottom-service-body-item{
						display: inline-flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						margin-right: 48rpx;
						
						.doctor-wrapper-bottom-service-body-item-top{
							width: 96rpx;
							height: 96rpx;
							border-radius: 50%;
							box-sizing: border-box;
							border: 2rpx solid #F6F6F7;
							display: flex;
							align-items: center;
							justify-content: center;
							
							.doctor-wrapper-bottom-service-body-item-top-img{
								width: 64rpx;
								height: 54rpx;
							}
						}
						
						.doctor-wrapper-bottom-service-body-item-bottom{
							margin-top: 12rpx;
							font-size: 13px;
							white-space: nowrap;
						}
					}
				}
			}
			
			.doctor-wrapper-bottom-course{
				width: 100%;
				margin-top: 36rpx;
				
				.doctor-wrapper-bottom-course-title{
					font-size: 14px;
					font-weight: bold;
				}
				
				.doctor-wrapper-bottom-course-body{
					width: 100%;
					font-size: 14px;
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					box-sizing: border-box;
					padding: 0 12rpx;
					height: 700rpx;
					
					.doctor-wrapper-bottom-course-body-empty {
						width: 100%;
						margin-top: 24rpx;
						margin-bottom: 24rpx;
					}
					
					.doctor-wrapper-bottom-course-body-empty {
						width: 100%;
						padding: 48rpx 0;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						box-sizing: border-box;
						margin-top: 100rpx;
					
						.doctor-wrapper-bottom-course-body-empty-img {
							width: 160rpx;
							height: 160rpx;
							margin-bottom: 24rpx;
						}
					
						.doctor-wrapper-bottom-course-body-empty-text {
							font-size: 13px;
							color: #DAE1F4;
						}
					}
				}
			}
		}
	}
</style>