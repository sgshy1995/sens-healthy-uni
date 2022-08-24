<template>
	<scroll-view scroll-y class="pain-q-a">
		<view class="pain-q-a-item" v-for="(u,index) in dataSource" :key="u.id">
			<view class="pain-q-a-item-top">
				问题描述 ({{ u.question_type }})
			</view>
			<view class="pain-q-a-item-info">
				<image @click.stop="showView(u.avatar)" class="info-avatar" :src="u.avatar"></image>
				<view class="info-user">
					<view class="info-user-name">
						{{ u.name }}
					</view>
					<view class="info-user-time">
						{{ u.create_time }}
					</view>
				</view>
			</view>
			<view class="pain-q-a-item-content">
				<view class="item-content-left" @click="handleShowDetail(u)">
					{{ u.description }}
				</view>
				<u-album @click.stop.prevent :urls="u.cover" multipleSize="150rpx" singleSize="150rpx" rowCount="1" maxCount="1"></u-album>
			</view>
			<view class="pain-q-a-item-bottom">
				<view class="pain-bottom-comment">
					<image class="pain-bottom-icon" src="@/static/images/index/comment.png"></image>
					<text class="pain-bottom-text">{{ u.comments }}条专业回复</text>
				</view>
				<view class="pain-bottom-payment">
					<image class="pain-bottom-icon" src="@/static/images/index/payment.png"></image>
					<text class="pain-bottom-text">{{ u.payment }}咨询费</text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		name: 'PainQA',
		data() {
			return {
				dataSource: [{
						id: '1',
						name: '张志东',
						question_type: '肩周炎',
						create_time: '2022-05-16 17:24:00',
						description: '病情描述，什么时间发生什么问题，做过什么检查、治疗、现在情况怎么样，想知道科学有效的干预方式...',
						avatar: 'https://c-ssl.duitang.com/uploads/blog/202203/07/20220307084824_51277.jpeg',
						cover: [
							'https://www.lemonlv.com/d/file/20170113/5c7353c560c7f6ca307aac8ac8dc30b6.jpg',
							'https://cdn.uviewui.com/uview/album/1.jpg',
							'https://cdn.uviewui.com/uview/album/2.jpg',
							'https://cdn.uviewui.com/uview/album/3.jpg',
							'https://cdn.uviewui.com/uview/album/4.jpg',
							'https://cdn.uviewui.com/uview/album/3.jpg',
							'https://cdn.uviewui.com/uview/album/4.jpg',
							'https://cdn.uviewui.com/uview/album/3.jpg',
							'https://cdn.uviewui.com/uview/album/4.jpg',
							'https://cdn.uviewui.com/uview/album/3.jpg',
							'https://cdn.uviewui.com/uview/album/4.jpg',
						],
						history: '什么时间在哪里做过什么治疗，治疗效果如何，是否有明确诊断为何病',
						comments: 3,
						payment: 18
					},
					{
						id: '2',
						name: '谢文东',
						question_type: '肩周炎',
						create_time: '2022-05-16 17:24:00',
						description: '病情描述，什么时间发生什么问题，做过什么检查、治疗、现在情况怎么样，想知道科学有效的干预方式...',
						avatar: 'https://c-ssl.dtstatic.com/uploads/blog/202203/04/20220304195641_9cfb0.thumb.1000_0.jpg',
						cover: [
							'https://www.lemonlv.com/d/file/20170113/7b5ec0fa91284266a2546f3aef2627de.jpg',
							'https://cdn.uviewui.com/uview/album/1.jpg',
							'https://cdn.uviewui.com/uview/album/2.jpg',
						],
						history: '什么时间在哪里做过什么治疗，治疗效果如何，是否有明确诊断为何病',
						comments: 2,
						payment: 24
					},
					{
						id: '3',
						name: '高强',
						question_type: '肩周炎',
						create_time: '2022-05-16 17:24:00',
						description: '病情描述，什么时间发生什么问题，做过什么检查、治疗、现在情况怎么样，想知道科学有效的干预方式...',
						avatar: 'https://c-ssl.dtstatic.com/uploads/blog/202203/19/20220319205139_b509f.thumb.1000_0.jpg',
						cover: [
							'https://www.lemonlv.com/d/file/20170113/2d787f64d8750408699f3a3e58d73ae3.jpg',
							'https://cdn.uviewui.com/uview/album/1.jpg',
							'https://cdn.uviewui.com/uview/album/2.jpg',
							'https://cdn.uviewui.com/uview/album/3.jpg',
						],
						history: '什么时间在哪里做过什么治疗，治疗效果如何，是否有明确诊断为何病',
						comments: 1,
						payment: 20
					},
					{
						id: '4',
						name: '李爽',
						question_type: '肩周炎',
						create_time: '2022-05-16 17:24:00',
						description: '病情描述，什么时间发生什么问题，做过什么检查、治疗、现在情况怎么样，想知道科学有效的干预方式...',
						avatar: 'https://c-ssl.dtstatic.com/uploads/blog/202203/19/20220319205139_b509f.thumb.1000_0.jpg',
						cover: [
							'https://www.lemonlv.com/d/file/20170113/2d787f64d8750408699f3a3e58d73ae3.jpg',
							'https://cdn.uviewui.com/uview/album/3.jpg',
							'https://cdn.uviewui.com/uview/album/2.jpg',
						],
						history: '什么时间在哪里做过什么治疗，治疗效果如何，是否有明确诊断为何病',
						comments: 2,
						payment: 17
					}
				]
			}
		},
		methods: {
			showView(url) {
				// 预览图片
				uni.previewImage({
					urls: [url],
					indicator: 'none'
				});
			},
			handleShowDetail(record) {
				const that = this
				uni.navigateTo({
					url: "/pages_index/painQADetail",
					success: function(res) {
					    // 通过eventChannel向被打开页面传送数据
					    res.eventChannel.emit('show', { record })
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.pain-q-a {
		width: 100%;
		background: #fff;
		box-sizing: border-box;
		padding: 24rpx;
		margin-top: 24rpx;
		padding-bottom: 170rpx;
		position: relative;

		.pain-q-a-item {
			width: 100%;
			margin-bottom: 24rpx;
			box-sizing: border-box;
			border: 1px solid #eee;
			border-radius: 10rpx;
			padding: 24rpx;

			.pain-q-a-item-top {
				margin-bottom: 24rpx;
				color: #4F68B0;
				font-size: 14px;
			}

			.pain-q-a-item-info {
				display: flex;
				align-items: center;
				height: 80rpx;

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
				}
			}

			.pain-q-a-item-content {
				display: flex;
				justify-content: space-between;
				height: 150rpx;
				width: 100%;
				margin-top: 24px;

				.item-content-left {
					flex-grow: 1;
					height: 100%;
					font-size: 14px;
					box-sizing: border-box;
					padding-right: 12rpx;
				}

				.item-content-right {
					width: 250rpx;
					height: 150rpx;
					flex-shrink: 0;
				}
			}

			.pain-q-a-item-bottom {
				width: 100%;
				display: flex;
				align-items: center;
				margin-top: 24rpx;

				.pain-bottom-comment,
				.pain-bottom-payment {
					display: flex;
					align-items: center;
					margin-right: 24px;

					.pain-bottom-icon {
						width: 30rpx;
						height: 30rpx;
						margin-right: 8rpx;
					}

					.pain-bottom-text {
						font-size: 13px;
					}
				}
			}
		}

		.no-more {
			width: 100%;
			color: #ddd;
			font-size: 12px;
			width: 100%;
			text-align: center;
			position: absolute;
			bottom: 24rpx;
			left: 0;
		}
	}
</style>
