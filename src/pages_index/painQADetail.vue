<template>
	<view class="pain-q-a-wrapper">
		<scroll-view scroll-y class="pain-q-a-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0"
				title="问答详情" leftIconColor="#fff" :titleStyle="{color: '#fff'}"
				@leftClick="leftClick" leftText="返回">
				<u-icon name="share" color="#fff" size="22" slot="right"></u-icon>
			</u-navbar>
			<view class="pain-q-a-body">
				
				<view class="pain-q-a-body-top">
					<view class="pain-q-a-body-info">
						<image @click.stop="showView(info.avatar)" class="info-avatar" :src="info.avatar"></image>
						<view class="info-user">
							<view class="info-user-name">
								{{ info.name }}
							</view>
							<view class="info-user-time">
								{{ info.create_time }}
							</view>
						</view>
					</view>
					
					<view class="pain-q-a-body-description" v-if="info.description">
						<view class="inner-title">
							问题描述：
						</view>
						<text>{{ info.description }}</text>
					</view>
					
					<view class="pain-q-a-body-description" v-if="info.history">
						<view class="inner-title">
							诊疗史：
						</view>
						<text>{{ info.history }}</text>
					</view>
					
					<view class="pain-q-a-body-album" v-if="info.cover && info.cover.length">
						<u-album :urls="info.cover" multipleSize="226rpx" singleSize="678rpx" maxCount="6"></u-album>
					</view>
					
				</view>
				
				<view class="pain-q-a-body-bottom" v-if="info.description">
					<view class="pain-q-a-body-back"></view>
					<view class="pain-q-a-body-qa">
						<view class="inner-title">
							全部答伤 · {{ qAndA.total }}
						</view>
						<view class="pain-q-a-body-qa-item" v-for="(u,index) in qAndA.list" :key="u.id" :class="{last: index === qAndA.list.length -1}">
							<view class="pain-q-a-body-qa-item-info">
								<image @click.stop="showView(u.avatar)" class="info-avatar" :src="u.avatar"></image>
								<view class="info-user">
									<view class="info-user-name" :class="{major: u.major === 1}">
										<text class="info-user-name-text">{{ u.name }}</text>
										<image v-if="u.major === 1" src="@/static/images/index/major.png" class="info-user-name-major"></image>
									</view>
									<view class="info-user-time">
										{{ u.comment_time }}
									</view>
								</view>
							</view>
							<view class="pain-q-a-body-qa-item-comment" v-html="u.comment"></view>
							<view class="pain-q-a-body-qa-item-album" v-if="u.cover && u.cover.length">
								<u-album :urls="u.cover" multipleSize="95rpx" singleSize="285rpx" maxCount="3"></u-album>
							</view>
							<view class="pain-q-a-body-qa-item-bottom">
								<view class="pain-bottom-reply">
									<image class="pain-bottom-icon" src="@/static/images/index/comment.png"></image>
									<text class="pain-bottom-text">{{ u.reply }}</text>
								</view>
								<view class="pain-bottom-like">
									<image class="pain-bottom-icon" src="@/static/images/index/like.png"></image>
									<text class="pain-bottom-text">{{ u.like }}</text>
								</view>
							</view>
							<view class="pain-q-a-body-qa-item-major" v-if="u.major === 1">
								专业回答
							</view>
						</view>
					</view>
				</view>
				
				
			</view>
			
		</scroll-view>
	</view>
</template>

<script>
	import Vue from 'vue';
	export default Vue.extend({
		data() {
			return {
				info: {
					
				},
				qAndA: {
					total: 3,
					list: [
						{
							id: '1',
							major: 1,
							name: '李大师',
							comment_time: '2022-06-03 18:33:24',
							avatar: require('@/static/images/index/lidashi.jpg'),
							comment: '膝盖后面有根筋疼痛，可能是肌肉或者韧带扭伤，建议每日口服牛儿三两，花生米30颗，户外运动三十分钟；持续一个月会有明显改善。\n如下图所示：',
							cover: [
								'https://www.lemonlv.com/d/file/20170113/7b5ec0fa91284266a2546f3aef2627de.jpg',
								'https://cdn.uviewui.com/uview/album/1.jpg',
								'https://cdn.uviewui.com/uview/album/2.jpg',
								'https://cdn.uviewui.com/uview/album/3.jpg',
								'https://cdn.uviewui.com/uview/album/4.jpg',
								'https://cdn.uviewui.com/uview/album/5.jpg',
								'https://cdn.uviewui.com/uview/album/6.jpg',
								'https://cdn.uviewui.com/uview/album/7.jpg',
								'https://cdn.uviewui.com/uview/album/8.jpg',
								'https://cdn.uviewui.com/uview/album/9.jpg',
							],
							reply: 208,
							like: 1398
						},
						{
							id: '2',
							major: 0,
							name: '一只小病号',
							comment_time: '2022-06-03 18:33:24',
							avatar: 'https://c-ssl.duitang.com/uploads/blog/202203/07/20220307084824_51277.jpeg',
							comment: '这个问题困扰我很久了，我觉得很有用啊！',
							cover: [],
							reply: 2,
							like: 35
						},
						{
							id: '3',
							major: 0,
							name: '呼啦木秦',
							comment_time: '2022-06-03 18:33:24',
							avatar: 'https://c-ssl.duitang.com/uploads/blog/202203/07/20220307084824_51277.jpeg',
							comment: '噢噢噢噢呵呵呵呵',
							cover: [],
							reply: 0,
							like: 16
						}
					]
				}
			};
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
				if(data.record) that.info = data.record
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
			},
		}
	})
</script>

<style lang="scss">
	.pain-q-a-wrapper{
		width: 100vw;
		height: 100vh;
		
		.pain-q-a-box{
			width: 100%;
			height: 100%;
		}
		
		.pain-q-a-body{
			width: 100%;
			
			
			.pain-q-a-body-top{
				width: 100%;
				background: #fff;
				box-sizing: border-box;
				padding: 24rpx;
			}
			
			.pain-q-a-body-bottom{
				width: 100%;
				background: #fff;
				box-sizing: border-box;
				
				.pain-q-a-body-back{
					width: 100%;
					height: 24rpx;
					background: #F6F6F6;
				}
			}
			
			.pain-q-a-body-info {
				display: flex;
				align-items: center;
				height: 80rpx;
				width: 100%;
			
				.info-avatar {
					width: 70rpx;
					height: 70rpx;
					margin-right: 24rpx;
					border-radius: 10rpx;
				}
			
				.info-user {
					display: flex;
					justify-content: space-between;
					height: 100%;
					flex-direction: column;
					font-size: 13px;
					
					.info-user-name{
						font-weight: 700;
					}
				}
			}
			
			.pain-q-a-body-description{
				width: 100%;
				margin-top: 24rpx;
				font-size: 14px;
				
				.inner-title{
					width: 100%;
					font-size: 14px;
					font-weight: 700;
					margin-bottom: 12px;
				}
			}
			
			.pain-q-a-body-album{
				width: 100%;
				margin-top: 24rpx;
				font-size: 14px;
			}
			
			.pain-q-a-body-qa{
				width: 100%;
				margin-top: 24rpx;
				font-size: 14px;
				
				.inner-title{
					width: 100%;
					font-size: 14px;
					font-weight: 700;
					margin-bottom: 12px;
					box-sizing: border-box;
					padding-left: 24rpx;
				}
				
				.pain-q-a-body-qa-item{
					width: 100%;
					box-sizing: border-box;
					padding: 0 24rpx 24rpx 24rpx;
					margin-bottom: 24rpx;
					border-bottom: 1px solid #eee;
					position: relative;
					
					&.last{
						border-bottom: none;
					}
					
					.pain-q-a-body-qa-item-info{
						display: flex;
						align-items: center;
						height: 70rpx;
						width: 100%;
									
						.info-avatar {
							width: 60rpx;
							height: 60rpx;
							margin-right: 24rpx;
							border-radius: 10rpx;
						}
									
						.info-user {
							display: flex;
							justify-content: space-between;
							height: 100%;
							flex-direction: column;
							font-size: 12px;
							
							.info-user-name{
								font-weight: 700;
								display: flex;
								align-items: center;
								height: 30rpx;
								
								&.major{
									color: #FCA231;
								}
								
								.info-user-name-major{
									width: 30rpx;
									height: 30rpx;
									margin-left: 8rpx;
								}
							}
						}
					}
					
					.pain-q-a-body-qa-item-comment{
						width: 100%;
						font-size: 13px;
						margin-top: 12rpx;
					}
					
					.pain-q-a-body-qa-item-album{
						width: 100%;
						margin-top: 12rpx;
					}
					
					.pain-q-a-body-qa-item-bottom {
						width: 100%;
						display: flex;
						align-items: center;
						margin-top: 24rpx;
					
						.pain-bottom-reply,
						.pain-bottom-like {
							display: flex;
							align-items: center;
							margin-right: 24px;
					
							.pain-bottom-icon {
								width: 26rpx;
								height: 26rpx;
								margin-right: 8rpx;
							}
					
							.pain-bottom-text {
								font-size: 13px;
							}
						}
					}
					
					.pain-q-a-body-qa-item-major{
						position: absolute;
						top: 0;
						right: 24rpx;
						box-sizing: border-box;
						padding: 6rpx 12rpx;
						border: 1px solid #FCA231;
						color: #FCA231;
						font-size: 14px;
						border-radius: 6rpx;
					}
				}
				
				
			}
		}
	}
</style>