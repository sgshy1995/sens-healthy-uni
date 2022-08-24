<template>
	<scroll-view scroll-y class="course-wrapper">
		<view class="course-top">
			<view class="course-top-left" @click="handleChangeType('equipment')">
				<image class="course-top-left-icon" src="@/static/images/store/switch.png"></image>
				<text class="course-top-left-text">器材</text>
			</view>
			<view class="course-top-center">
				课程商城
			</view>
			<view class="course-top-right">
				zhanwei
			</view>
		</view>
		<view class="course-search">
			<u-search shape="square" :show-action="false"></u-search>
			<image @tap.stop class="course-search-icon" src="@/static/images/store/filter.png"></image>
		</view>
		<view class="course-recommend">
			<view class="course-recommend-title">
				热门推荐
			</view>
			<view class="course-recommend-body">
				<u-scroll-list :indicator="false">
					<view v-for="(item, index) in recommendList" :key="index" class="course-recommend-item"
						:class="{first: index === 0}" @click="handleShowItem(item)">
						<view class="course-recommend-item-img">
							<image class="course-recommend-item-img-in" :src="item.thumb"></image>
						</view>
						<view class="course-recommend-item-tag">
							<text class="course-recommend-item-tag-in" v-for="(item1, index1) in item.tags"
								:key="index1">
								<text class="tag-in-text">{{ item1 }}</text>
								<text class="tag-in-point" v-if="index1 !== item.tags.length - 1">·</text>
							</text>
						</view>
						<view class="course-recommend-item-title">
							{{ item.title }}
						</view>
						<view class="course-recommend-item-description">
							{{ item.description }}
						</view>
						<view class="course-recommend-item-info">
							<image class="item-info-avatar" :src="item.avatar"></image>
							<text class="item-info-author">{{ item.author }}</text>
							<view class="item-info-view">
								<u-icon name="eye-fill" color="#999" size="14"></u-icon>
								<text class="item-info-view-text">{{ item.views }}</text>
							</view>
						</view>
					</view>
				</u-scroll-list>
			</view>
		</view>
		<view class="course-all">
			<view class="course-all-title">
				全部课程
			</view>
			<view class="course-all-body">
				<view class="course-all-item" v-for="(item, index) in recommendList" :key="index"
					@click="handleShowItem(item)">
					<view class="course-all-item-left">
						<image class="course-all-item-left-img" :src="item.thumb"></image>
					</view>
					<view class="course-all-item-right">
						<view class="item-right-tag">
							<text class="item-right-tag-in" v-for="(item1, index1) in item.tags"
								:key="index1">
								<text class="tag-in-text">{{ item1 }}</text>
								<text class="tag-in-point" v-if="index1 !== item.tags.length - 1">·</text>
							</text>
						</view>
						<view class="item-right-title">{{ item.title }}</view>
						<view class="item-right-description">{{ item.description.substring(0, 16) + '...' }}</view>
						<view class="item-right-info">
							<image class="item-info-avatar" :src="item.avatar"></image>
							<text class="item-info-author">{{ item.author }}</text>
							<view class="item-info-view">
								<u-icon name="eye-fill" color="#999" size="14"></u-icon>
								<text class="item-info-view-text">{{ item.views }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				recommendList: [{
						id: '1',
						thumb: require('@/static/images/store/sport/1.jpeg'),
						tags: ['运动康复', '腰椎'],
						title: '腰椎术后康复',
						avatar: require('@/static/images/index/lidashi.jpg'),
						description: '骨关节术后/运动损伤康复套餐，1次一对一评估，6次在线康复指导',
						author: '李大师',
						views: 3306
					},
					{
						id: '2',
						thumb: require('@/static/images/store/sport/2.jpeg'),
						tags: ['运动康复', '头部'],
						title: '脑卒中康复',
						description: '脑卒中康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						views: 1198
					},
					{
						id: '3',
						thumb: require('@/static/images/store/sport/3.jpeg'),
						tags: ['运动康复', '腹部'],
						title: '产后康复套餐',
						description: '产后康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						views: 309
					},
					{
						id: '4',
						thumb: require('@/static/images/store/sport/4.jpeg'),
						tags: ['运动康复', '其他'],
						title: '风湿病运动治疗',
						description: '风湿病运动治疗，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						views: 1109
					},
					{
						id: '5',
						thumb: require('@/static/images/store/sport/5.jpeg'),
						tags: ['运动康复', '骨盆'],
						title: '骨盆前倾改善',
						description: '骨盆前倾改善，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						views: 1109
					}
				]
			}
		},
		methods: {
			handleShowItem(record) {

			},
			handleChangeType(type){
				this.$emit('changeType', type)
			}
		}
	}
</script>

<style lang="scss">
	.popup-view {
		width: 100%;
		background: #fff;

		.popup-view-in {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 24rpx;

			.popup-view-in-button {
				width: 40%;
			}
		}
	}

	.course-wrapper {
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 110rpx;

		.course-top {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 24rpx;
			position: sticky;
			top: 0;

			.course-top-left {
				width: 80rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2px solid #4F68B0;
				border-radius: 16rpx;
				flex-direction: column;

				.course-top-left-icon {
					width: 24rpx;
					height: 24rpx;
					margin-bottom: 6rpx;
				}

				.course-top-left-text {
					font-size: 10px;
					font-weight: 700;
				}
			}

			.course-top-center {
				font-size: 16px;
				color: #333;
				font-weight: 700;
				color: #2F3A4C;
			}

			.course-top-right {
				width: 80rpx;
				font-size: 16px;
				color: #fff;
			}
		}

		.course-search {
			width: 100%;
			box-sizing: border-box;
			padding: 0 24rpx;
			margin-top: 36rpx;
			position: relative;

			.course-search-icon {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				top: 50%;
				right: 36rpx;
				transform: translateY(-50%);
				z-index: 1;
			}
		}

		.course-recommend {
			width: 100%;
			margin-top: 36rpx;

			.course-recommend-title {
				width: 100%;
				font-size: 14px;
				color: #333;
				font-weight: 700;
				color: #2F3A4C;
				box-sizing: border-box;
				padding: 0 24rpx;
			}

			.course-recommend-body {
				margin-top: 24rpx;

				.course-recommend-item {
					margin-right: 48rpx;
					box-sizing: border-box;
					padding: 24rpx 24rpx 36rpx 24rpx;
					box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
					margin-bottom: 36rpx;
					margin-top: 24rpx;
					border-radius: 16rpx;
					width: 528rpx;

					&.first {
						margin-left: 24rpx;
					}

					.course-recommend-item-img {
						width: 480rpx;
						height: 288rpx;

						.course-recommend-item-img-in {
							width: 100%;
							height: 100%;
							border-radius: 24rpx;
						}
					}

					.course-recommend-item-tag {
						width: 100%;
						margin-top: 12rpx;
						display: flex;
						align-items: center;

						.course-recommend-item-tag-in {
							font-size: 11px;
							color: #333;
							font-weight: 700;
							color: #aaa;

							.tag-in-point {
								box-sizing: border-box;
								padding: 0 12rpx;
							}
						}
					}

					.course-recommend-item-title {
						width: 100%;
						margin-top: 12rpx;
						box-sizing: border-box;
						font-size: 15px;
						color: #333;
						font-weight: 700;
						color: #2F3A4C;
					}

					.course-recommend-item-description {
						width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						margin-top: 6rpx;
						box-sizing: border-box;
						font-size: 12px;
						color: #aaa;
					}

					.course-recommend-item-info {
						width: 100%;
						display: flex;
						align-items: center;
						box-sizing: border-box;
						margin-top: 26rpx;

						.item-info-avatar {
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
							margin-right: 12rpx;
						}

						.item-info-author {
							font-size: 13px;
							color: #333;
							color: #2F3A4C;
							margin-right: 24rpx;
						}

						.item-info-view {
							font-size: 12px;
							color: #999;
							display: flex;
							align-items: center;

							.item-info-view-text {
								padding-left: 12rpx;
							}
						}
					}
				}
			}
		}

		.course-all {
			width: 100%;

			.course-all-title {
				width: 100%;
				font-size: 14px;
				color: #333;
				font-weight: 700;
				color: #2F3A4C;
				box-sizing: border-box;
				padding: 0 24rpx;
			}

			.course-all-body {
				margin-top: 24rpx;
				width: 100%;
				box-sizing: border-box;
				padding: 0 24rpx;

				.course-all-item {
					width: 100%;
					display: flex;
					align-items: center;
					height: 220rpx;
					box-sizing: border-box;
					box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
					margin-bottom: 24rpx;
					border-radius: 16rpx;
					overflow: hidden;

					.course-all-item-left {
						width: 300rpx;
						height: 100%;
						flex-shrink: 0;

						.course-all-item-left-img {
							width: 100%;
							height: 100%;
						}
					}

					.course-all-item-right {
						flex-grow: 1;
						height: 100%;
						box-sizing: border-box;
						padding: 0 12rpx;

						.item-right-tag {

							width: 100%;
							margin-top: 12rpx;
							display: flex;
							align-items: center;

							.item-right-tag-in {
								font-size: 11px;
								color: #333;
								font-weight: 700;
								color: #aaa;

								.tag-in-point {
									box-sizing: border-box;
									padding: 0 12rpx;
								}
							}
						}
						
						.item-right-title{
							width: 100%;
							margin-top: 12rpx;
							box-sizing: border-box;
							font-size: 15px;
							color: #333;
							font-weight: 700;
							color: #2F3A4C;
						}
						
						.item-right-description{
							width: 100%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							margin-top: 6rpx;
							box-sizing: border-box;
							font-size: 12px;
							color: #aaa;
						}
						
						.item-right-info{
							width: 100%;
							display: flex;
							align-items: center;
							box-sizing: border-box;
							margin-top: 26rpx;
							
							.item-info-avatar {
								width: 40rpx;
								height: 40rpx;
								border-radius: 50%;
								margin-right: 12rpx;
							}
							
							.item-info-author {
								font-size: 13px;
								color: #333;
								color: #2F3A4C;
								margin-right: 24rpx;
							}
							
							.item-info-view {
								font-size: 12px;
								color: #999;
								display: flex;
								align-items: center;
							
								.item-info-view-text {
									padding-left: 12rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
