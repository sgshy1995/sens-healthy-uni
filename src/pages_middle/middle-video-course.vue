<template>
	<view class="middle-video-course">
		<view class="middle-video-course-sort">
			<view class="middle-video-course-sort-one" @click="handleChangeSort('desc')">
				<image src="@/static/images/middle/sort-desc.png" class="middle-video-course-sort-img" v-if="sort === 'asc'"></image>
				<image src="@/static/images/middle/sort-desc-active.png" class="middle-video-course-sort-img" v-if="sort === 'desc'"></image>
			</view>
			<text class="middle-video-course-sort-two">/</text>
			<view class="middle-video-course-sort-three" @click="handleChangeSort('asc')">
				<image src="@/static/images/middle/sort-asc.png" class="middle-video-course-sort-img" v-if="sort === 'desc'"></image>
				<image src="@/static/images/middle/sort-asc-active.png" class="middle-video-course-sort-img" v-if="sort === 'asc'"></image>
			</view>
		</view>
		<view class="middle-video-course-main">
			<mescroll-uni ref="mescroll" @down="handleRefreshDown"
				:up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
				<view class="middle-video-course-empty" v-if="!dataSource.length">
					<image src="@/static/images/recovery/empty-data.png" class="middle-video-course-empty-img"></image>
					<text class="middle-video-course-empty-text">{{ sort === 'learn' ? '您没有待学习课程' : '您没有已完成课程' }}~</text>
				</view>
				<view class="middle-video-course-body" v-else>
					<view class="middle-video-course-item" v-for="(u,index) in dataSource" :key="u.id" @click="handleShowDetail(u)">
						<view class="chart-right-content">
							<view class="body-item-top">
								<view class="body-item-top-left">
									<image class="body-item-top-left-img" :src="baseUrl + u.course_info.cover">
									</image>
								</view>
								<view class="body-item-top-right">
									<view class="body-item-top-right-title">{{ u.course_info.title }}</view>
									<view class="body-item-top-right-tag">
										<text class="item-right-tag-in">
											<text class="tag-in-text">{{ u.course_info.course_type_show }}</text>
											<text class="tag-in-point">·</text>
										</text>
										<text class="item-right-tag-in">
											<text class="tag-in-text">{{ `共${u.course_info.video_num}节视频` }}</text>
										</text>
									</view>
									<view class="body-item-top-right-description">
										{{ u.course_info.description }}
									</view>
								</view>
							</view>
							<view class="body-item-bottom" v-if="u.recent_num !== null">
								<view class="body-item-bottom-continue" @click.stop="handleShowDetail(u, u.recent_num, u.recent_progress)">
									<image src="@/static/images/middle/video-history-aaa.png" class="body-item-bottom-continue-img"></image>
									<text class="body-item-bottom-continue-text">{{ `上次播放: 第${u.recent_num + 1}节 ${u.recent_progress} 继续播放` }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	import {
		getMajortCoursesListAction
	} from '@/service/service'
	export default {
		data(){
			return {
				sort: 'desc',
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				dataSource: []
			}
		},
		methods: {
			getData() {
				return new Promise((resolve, reject) => {
					getMajortCoursesListAction({
						created_at: this.sort
					}).then(res => {
						const data = res.data ? [...res.data] : []
						data.map(item => {
							const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
							item.course_info.course_type_show = course_type_map[item.course_info.course_type]
							item.course_info.url = this.baseUrl + item.course_info.cover
						})
						this.dataSource = [...data]
						resolve(data)
					}).catch(err => {
						reject(err)
					})
				})
			},
			handleRefreshDown(mescroll) {
				this.getData().then(res => {
					mescroll.endSuccess(res.length, false)
				}).catch(err => {
					console.log('err === err', err)
					mescroll.endErr()
				})
			},
			handleChangeSort(sort) {
				if(this.sort === sort) return
				this.sort = sort
				this.$loadingOn()
				this.getData().then(res => {
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleShowDetail(record, current, history) {
				const that = this
				uni.navigateTo({
					url: "/pages_middle/middle-video-course-detail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							record,
							current,
							history
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.middle-video-course {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0 24rpx 24rpx 24rpx;
	
		.middle-video-course-sort {
			width: 100%;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			margin-bottom: 24rpx;
			padding-left: 24rpx;
			height: 48rpx;
	
			.middle-video-course-sort-one,
			.middle-video-course-sort-three {
				width: 36rpx;
				height: 36rpx;
				
				.middle-video-course-sort-img{
					width: 36rpx;
					height: 36rpx;
				}
			}
	
			.middle-video-course-sort-two {
				color: #333;
				font-size: 14px;
				padding: 0 24rpx;
			}
		}
	
		.middle-video-course-main {
			width: 100%;
			height: calc(100% - 84rpx);
		}
	
		.middle-video-course-empty {
			width: 100%;
			margin-top: 24rpx;
			margin-bottom: 24rpx;
		}
	
		.middle-video-course-empty {
			width: 100%;
			padding: 48rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			margin-top: 100rpx;
	
			.middle-video-course-empty-img {
				width: 160rpx;
				height: 160rpx;
				margin-bottom: 24rpx;
			}
	
			.middle-video-course-empty-text {
				font-size: 13px;
				color: #DAE1F4;
			}
	
		}
	
		.middle-video-course-buy-button {
			width: 100%;
			margin-top: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
	
			.middle-video-course-buy-button-in {
				font-size: 14px;
				color: #fff;
				background: #4F68B0;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				white-space: nowrap;
				padding: 8rpx 24rpx;
				box-sizing: border-box;
			}
		}
	
		.middle-video-course-body {
			width: 100%;
			box-sizing: border-box;
			padding: 16rpx;
		}
	
		.middle-video-course-item {
			width: 100%;
			margin-bottom: 36rpx;
			border-radius: 24rpx;
			display: flex;
			justify-content: space-between;
			background: #fff;
			box-sizing: border-box;
			padding: 24rpx;
			position: relative;
			box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	
			.chart-left-icon-delete {
				margin-top: 24rpx;
				width: 32rpx;
				position: absolute;
				right: 24rpx;
				top: 0;
			}
	
			.chart-left-icon {
				width: 32rpx;
				box-sizing: border-box;
				margin-right: 24rpx;
				flex-shrink: 0;
				margin-top: 12rpx;
	
				.chart-left-icon-select {
					display: flex;
					justify-content: center;
					align-items: center;
					box-sizing: border-box;
					border: 1px solid #B0B3BC;
					height: 32rpx;
					border-radius: 6rpx;
	
					.chart-left-icon-select-in {
						display: none;
					}
	
					&.active {
						border-color: #4F68B0;
						background: #4F68B0;
	
						.chart-left-icon-select-in {
							display: block;
						}
					}
				}
	
			}
	
			.chart-right-content {
				flex-grow: 1;
			}
	
			.body-item-top {
				width: 100%;
				display: flex;
				align-items: center;
	
				.body-item-top-left {
					width: 180rpx;
					height: 120rpx;
					border-radius: 24rpx;
					flex-shrink: 0;
					margin-right: 12rpx;
					overflow: hidden;
	
					.body-item-top-left-img {
						width: 100%;
						height: 100%;
					}
				}
	
				.body-item-top-right {
					flex-grow: 1;
					height: 120rpx;
	
					.body-item-top-right-title {
						width: calc(100% - 32rpx);
						font-size: 12px;
						font-weight: bold;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}
	
					.body-item-top-right-tag {
						width: 100%;
						margin-top: 6rpx;
						display: flex;
						align-items: center;
	
						.item-right-tag-in {
							font-size: 11px;
							color: #333;
							font-weight: 700;
							color: #aaa;
	
							.tag-in-point {
								box-sizing: border-box;
								padding: 0 6rpx;
							}
						}
					}
	
					.body-item-top-right-description {
						font-size: 8px;
						width: 100%;
						margin-top: 6rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						color: #aaa;
					}
	
				}
			}
			
			.body-item-bottom{
				margin-top: 24rpx;
				width: 100%;
				
				.body-item-bottom-continue{
					display: flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					padding: 6rpx 12rpx;
					background: #eee;
					
					.body-item-bottom-continue-img{
						width: 24rpx;
						height: 24rpx;
						margin-right: 8rpx;
					}
					
					.body-item-bottom-continue-text{
						font-size: 11px;
						color: #aaa;
					}
				}
			}
		}
	}
</style>