<template>
	<view class="notice-page-wrapper">
		<scroll-view scroll-y class="notice-page-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0" title="我的消息" leftIconColor="#fff"
				:titleStyle="{color: '#fff'}" @leftClick="leftClick" leftText="返回">
				<text class="right-text" slot="right">全标已读</text>
			</u-navbar>
			<view class="notice-page-body">
				<view class="notice-page-body-top">
					<view class="body-top-item">
						<view class="top-logo-wrapper item-wrapper-one">
							<image class="top-logo" src="@/static/images/index/praise.png"></image>
							<view class="badge-box" :class="{'less99': praiseNum <= 99 && praiseNum >= 10, 'less10': praiseNum <10}" v-if="praiseNum">
								<u-badge numberType="overflow" type="error" max="99" :value="praiseNum"></u-badge>
							</view>
						</view>
						<text class="top-text">点赞收藏</text>
					</view>
					<view class="body-top-item">
						<view class="top-logo-wrapper item-wrapper-two">
							<image class="top-logo" src="@/static/images/index/talk.png"></image>
							<view class="badge-box" :class="{'less99': commentNum <= 99 && commentNum >= 10, 'less10': commentNum <10}" v-if="commentNum">
								<u-badge numberType="overflow" type="error" max="99" :value="commentNum"></u-badge>
							</view>
						</view>
						<text class="top-text">评论@</text>
					</view>
				</view>
				
				<view class="notice-page-body-bottom">
					<view class="body-bottom-item">
						<view class="body-bottom-item-left">
							<view class="item-left">
								<view class="item-logo-wrapper">
									<image class="item-logo" src="@/static/images/index/message.png"></image>
								</view>
							</view>
							<view class="item-right">
								<view class="item-right-top">消息通知</view>
								<view class="item-right-bottom">您的优惠券马上要过期啦！</view>
							</view>
						</view>
						<view class="body-bottom-item-right">
							昨天
						</view>
					</view>
					
					<view class="body-bottom-item">
						<view class="body-bottom-item-left">
							<view class="item-left">
								<view class="item-logo-wrapper rebot">
									<image class="item-logo" src="@/static/images/index/rebot.png"></image>
								</view>
							</view>
							<view class="item-right">
								<view class="item-right-top">Sens机器人</view>
								<view class="item-right-bottom">欢迎来到森普健康，有什么可以帮助您？</view>
							</view>
						</view>
						<view class="body-bottom-item-right">
							昨天
						</view>
					</view>
					
					<view class="body-bottom-item" v-for="(u,index) in messageList" :key="u.id">
						<view class="read-flag" v-if="!u.if_read"></view>
						<view class="body-bottom-item-left">
							<view class="item-left">
								<view class="item-logo-wrapper avatar">
									<image @click="showView(u.avatar)" class="item-logo" :src="u.avatar"></image>
								</view>
							</view>
							<view class="item-right">
								<view class="item-right-top">
									<text class="item-right-top-user">{{ u.username }}</text>
									<text v-if="u.identity === 'physician'" class="item-right-top-identity">医师</text>
									<image v-if="u.authenticate === 1" src="@/static/images/index/major.png" class="item-right-top-auth"></image>
								</view>
								<view class="item-right-bottom">{{ u.messgae }}</view>
							</view>
						</view>
						<view class="body-bottom-item-right">
							{{ u.send_time }}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				praiseNum: 3,
				commentNum: 0,
				messageList: [
					{
						id: '1',
						username: '李大师',
						identity: 'physician',
						authenticate: 1,
						avatar: require('@/static/images/index/lidashi.jpg'),
						messgae: '小伙啊，明天有空吗，出来尿一口？',
						send_time: '30分钟前',
						if_read: 0
					},
					{
						id: '2',
						username: '赵思川',
						identity: 'patient',
						authenticate: 0,
						avatar: 'https://c-ssl.duitang.com/uploads/blog/202203/07/20220307084824_51277.jpeg',
						messgae: '有个问题想咨询一下你',
						send_time: '1小时前',
						if_read: 0
					},
					{
						id: '3',
						username: '李玉',
						identity: 'patient',
						authenticate: 0,
						avatar: 'https://c-ssl.duitang.com/uploads/blog/202203/07/20220307084824_51277.jpeg',
						messgae: '好的，明天见',
						send_time: '昨天',
						if_read: 1
					}
				]
			}
		},
		onLoad() {
			const that = this
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('show', function(data) {
				console.log(data)
				if (data.record) that.info = data.record
				that.$nextTick(() => {

				})
			})
		},
		methods: {
			close() {
				uni.navigateBack()
			},
			leftClick() {
				this.close()
			},
			showView(url) {
				// 预览图片
				uni.previewImage({
					urls: [url],
					indicator: 'none'
				});
			}
		}
	}
</script>

<style lang="scss">
	.notice-page-wrapper {
		width: 100vw;
		height: 100vh;
		background: #fff;

		.notice-page-box {
			width: 100%;
			height: 100%;
			
			.right-text{
				color: #fff;
				font-size: 12px;
			}
		}

		.notice-page-body {
			width: 100%;
			padding: 24rpx 48rpx;
			box-sizing: border-box;
			
			.notice-page-body-top{
				width: 100%;
				box-sizing: border-box;
				padding: 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				margin-top: 24rpx;
				
				.body-top-item{
					
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					
					.top-logo-wrapper{
						width: 80rpx;
						height: 80rpx;
						margin-bottom: 24rpx;
						border-radius: 20rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						position: relative;
						
						&.item-wrapper-one{
							background: #FDCDB7;
						}
						
						&.item-wrapper-two{
							background: #FCDC9C;
						}
						
						.top-logo{
							width: 44rpx;
							height: 44rpx;
						}
						
						.badge-box{
							position: absolute;
							right: -36rpx;
							top: -12rpx;
							
							&.less99{
								right: -24rpx;
							}
							
							&.less10{
								right: -12rpx;
							}
						}
					}
					
					.top-text{
						color: #999;
						font-size: 14px;
					}
				}
			}
		
			.notice-page-body-bottom{
				width: 100%;
				margin-top: 24rpx;
				
				.body-bottom-item{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 100rpx;
					margin-bottom: 36rpx;
					position: relative;
					
					.read-flag{
						position: absolute;
						width: 10rpx;
						height: 10rpx;
						border-radius: 50%;
						background: #D74044;
						top: 10rpx;
						right: 0;
					}
					
					.body-bottom-item-left{
						display: flex;
						align-items: center;
						height: 86rpx;
						
						.item-left{
							display: flex;
							align-items: center;
							justify-content: center;
							width: 80rpx;
							height: 80rpx;
							
							.item-logo-wrapper{
								width: 100%;
								height: 100%;
								border-radius: 20rpx;
								background: #B2E1F6;
								display: flex;
								align-items: center;
								justify-content: center;
								
								&.rebot{
									background: #ECE1D9;
								}
								
								.item-logo{
									width: 50rpx;
									height: 50rpx;
								}
								
								&.avatar{
									background: transparent;
									overflow: hidden;
									
									.item-logo{
										width: 100%;
										height: 100%;
									}
								}
							}
						}
						
						.item-right{
							height: 100%;
							display: flex;
							justify-content: space-between;
							flex-direction: column;
							box-sizing: border-box;
							margin-left: 24rpx;
							
							.item-right-top{
								font-size: 14px;
								display: flex;
								align-items: center;
								
								.item-right-top-user{
									font-size: 14px;
									padding-right: 12rpx;
								}
								
								.item-right-top-identity{
									font-size: 10px;
									box-sizing: border-box;
									padding: 0 4rpx;
									border-radius: 6rpx;
									background: #fff;
									border: 1px solid #FCA315;
									color: #FCA315;
								}
								
								.item-right-top-auth{
									width: 40rpx;
									height: 40rpx;
									margin-left: 12rpx;
								}
							}
							
							.item-right-bottom{
								font-size: 13px;
								color: #999;
								max-width: 400rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
					}
					
					.body-bottom-item-right{
						font-size: 13px;
						color: #999;
						display: flex;
						align-items: flex-start;
						justify-content: start;
					}
				}
			}
		}
	}
</style>
