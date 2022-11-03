<template>
	<view class="middle-live-course">
		<view class="middle-live-course-sort">
			<text class="middle-live-course-sort-one" :class="{active: sort === 'learn'}"
				@click="handleChangeSort('learn')">待学习</text>
			<text class="middle-live-course-sort-two">/</text>
			<text class="middle-live-course-sort-three" :class="{active: sort === 'finish'}"
				@click="handleChangeSort('finish')">已完成</text>
		</view>
		<view class="middle-live-course-main">
			<mescroll-uni ref="mescroll" @down="handleRefreshDown"
				:up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
				<view class="middle-live-course-empty" v-if="!dataSource.length">
					<image src="@/static/images/recovery/empty-data.png" class="middle-live-course-empty-img"></image>
					<text class="middle-live-course-empty-text">{{ sort === 'learn' ? '您没有待学习课程' : '您没有已完成课程' }}~</text>
				</view>
				<view class="middle-live-course-body" v-else>
					<view class="middle-live-course-item" v-for="(u,index) in dataSource" :key="u.id">
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
											<text class="tag-in-text">{{ `共${u.course_live_num}次直播` }}</text>
										</text>
									</view>
									<view class="body-item-top-right-description">
										{{ u.course_info.description }}
									</view>
									<view class="body-item-top-right-manage">
										<view>已学习次数: <text class="body-item-top-right-manage-in">{{ u.learn_num }}</text></view>
										<view class="body-item-top-right-manage-right">有效期: {{ u.validity_time_show }}</view>
									</view>
								</view>
							</view>
							<view class="body-item-bottom">
								<view class="body-item-bottom-ready-points" v-if="u.book_info && (!u.cancel_num || !u.book_info.change_num)">
									<view class="body-item-bottom-ready-points-text">已预约<text v-if="u.book_info && u.book_info.change_num" class="body-item-bottom-ready-points-text-in">(已修改)</text></view>
									<rudon-rowMenuDotDotDot :localdata="u.book_info.change_num ? optionsThree : u.cancel_num ? optionsOne : optionsTwo" @change="menuAction($event, u)">
										<view class="body-item-bottom-ready-points-in">···</view>
									</rudon-rowMenuDotDotDot>
								</view>
								<view class="body-item-bottom-book" v-if="!u.book_info">
									<view class="body-item-bottom-book-in" @click="handleShowBookTimeManage(u)">
										预约时间
									</view>
								</view>
								<view class="body-item-bottom-ready" v-if="u.book_info">
									<view class="body-item-bottom-ready-top">
										<image class="body-item-bottom-ready-top-img"
											src="@/static/images/mine/popup-date.png"></image>
										<text class="body-item-bottom-ready-top-text">预约时间</text>
									</view>
									<view class="body-item-bottom-ready-bottom">
										{{ `${u.book_info.book_start_time_show} ~ ${u.book_info.book_end_time_show}` }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
		<u-modal :show="showDeleteModal" showCancelButton confirmColor="#4F68B0" @confirm="handleConfirmOkDelete" @cancel="handleCancelDeleteModal">
			<view class="slot-content modal-delete-time">
				<view class="modal-delete-time-course">
					已预约课程: <text class="modal-delete-time-course-in">{{ pickInfo.course_info.title }}</text>
				</view>
				<view class="modal-delete-time-tip">
					<image class="modal-delete-time-tip-img" src="@/static/images/mine/popup-date.png"></image>
					<text class="modal-delete-time-tip-text">{{ `${pickInfo.book_info.book_start_time_show} ~ ${pickInfo.book_info.book_end_time_show}` }}</text>
				</view>
				<view class="modal-delete-time-in">您有且仅有一次取消预约的机会，确定取消预约吗？</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		getPatientCoursesListAction,
		cancelBookAction
	} from '@/service/service'
	import moment from 'moment'
	export default {
		data() {
			return {
				dataSource: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				sort: 'learn',
				// 右边菜单内容
				optionsThree: [
					{
						value: 'cancel',
						text: '取消预约'
					}
				],
				optionsTwo: [
					{
						value: 'change',
						text: '修改时间'
					},
					{
						value: 'cancel',
						text: '取消预约'
					}
				],
				optionsOne: [
					{
						value: 'change',
						text: '修改时间'
					}
				],
				showDeleteModal: false,
				pickInfo: {
					course_info: {},
					book_info: {}
				}
			}
		},
		methods: {
			/**
			 * 不同行的不同菜单点击事件
			 * 
			 * @param {Object} action 第一个参数必须传入“$event” | 点击了哪个按钮 | 传入options的value
			 * @param {Number} rowId 第二个参数随意，可以是行ID等
			 */
			menuAction(action, record) {
				// 忽略初始化时的传入的空操作
				if (action === '') {
					return
				}
				
				console.log('record', record)
				
				this.pickInfo = {...record}

				// 动作
				// ...
				if (action === 'cancel'){
					this.showDeleteModal = true
				} else if (action === 'change'){
					this.handleShowBookTimeManage({...record})
				}
			},
			handleCancelDeleteModal(){
				this.pickInfo = {
					course_info: {},
					book_info: {}
				}
				this.showDeleteModal = false
			},
			handleConfirmOkDelete(){
				this.$loadingOn()
				cancelBookAction(this.pickInfo.book_info.id, '用户首次无责取消').then(res => {
					this.$toast(res.message || '预约已取消')
					this.handleCancelDeleteModal()
					this.getData()
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleShowBookTimeManage(record) {
				const that = this
				uni.navigateTo({
					url: "/pages_middle/book-time",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							record
						})
					}
				})
			},
			getData() {
				return new Promise((resolve, reject) => {
					getPatientCoursesListAction({
						status: this.sort === 'learn' ? 1 : this.sort === 'finish' ? 2 : undefined
					}).then(res => {
						const data = res.data ? [...res.data] : []
						data.map(item => {
							item.validity_time_show = moment(new Date(item.validity_time), 'YYYY-MM-DD').format('YYYY-MM-DD')
							const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
							item.course_info.course_type_show = course_type_map[item.course_info.course_type]
							item.course_info.url = this.baseUrl + item.course_info.cover
							if (item.book_info){
								item.book_info.book_start_time_show = moment(new Date(item.book_info.book_start_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
								item.book_info.book_end_time_show = moment(new Date(item.book_info.book_end_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
							}
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
				this.sort = sort
				this.$loadingOn()
				this.getData().then(res => {
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			}
		}
	}
</script>

<style lang="scss">
	.modal-delete-time{
		width: 100%;
		
		.modal-delete-time-course{
			width: 100%;
			display: flex;
			align-items: center;
			font-size: 14px;
			
			.modal-delete-time-course-in{
				font-weight: bold;
				color: #4F68B0;
				padding-left: 6rpx;
			}
		}
		
		.modal-delete-time-tip{
			font-size: 14px;
			color: #4F68B0;
			font-weight: bold;
			margin-top: 12rpx;
			margin-bottom: 12rpx;
			display: flex;
			align-items: center;
			
			.modal-delete-time-tip-img{
				width: 32rpx;
				height: 32rpx;
				margin-right: 12rpx;
			}
		}
		
		.modal-delete-time-in{
			width: 100%;
			font-size: 14px;
			color: #333;
			display: flex;
			align-items: center;
		}
	}
	
	.middle-live-course {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0 24rpx 24rpx 24rpx;

		.middle-live-course-sort {
			width: 100%;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			margin-bottom: 24rpx;
			padding-left: 24rpx;
			height: 48rpx;

			.middle-live-course-sort-one,
			.middle-live-course-sort-three {
				font-size: 14px;
				color: #999;

				&.active {
					color: #333;
					font-weight: bold;
				}
			}

			.middle-live-course-sort-two {
				color: #333;
				font-size: 14px;
				padding: 0 24rpx;
			}
		}

		.middle-live-course-main {
			width: 100%;
			height: calc(100% - 84rpx);
		}

		.middle-live-course-empty {
			width: 100%;
			margin-top: 24rpx;
			margin-bottom: 24rpx;
		}

		.middle-live-course-empty {
			width: 100%;
			padding: 48rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			margin-top: 100rpx;

			.middle-live-course-empty-img {
				width: 160rpx;
				height: 160rpx;
				margin-bottom: 24rpx;
			}

			.middle-live-course-empty-text {
				font-size: 13px;
				color: #DAE1F4;
			}

		}

		.middle-live-course-buy-button {
			width: 100%;
			margin-top: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.middle-live-course-buy-button-in {
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

		.middle-live-course-body {
			width: 100%;
			box-sizing: border-box;
			padding: 16rpx;
		}

		.middle-live-course-item {
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
					width: 200rpx;
					height: 160rpx;
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
					height: 160rpx;

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

					.body-item-top-right-manage {
						color: #333;
						font-size: 12px;
						margin-top: 10rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.body-item-top-right-manage-in {
							padding-left: 6rpx;
							font-weight: bold;
						}
						
						.body-item-top-right-manage-right{
							font-size: 10px;
							color: #999;
						}
					}

				}
			}

			.body-item-bottom {
				width: 100%;
				box-sizing: border-box;
				border-top: 2rpx dashed #999;
				padding-top: 24rpx;
				margin-top: 24rpx;
				
				.body-item-bottom-ready-points{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 12rpx;
					
					.body-item-bottom-ready-points-text{
						font-size: 13px;
						color: #51CE60;
						
						.body-item-bottom-ready-points-text-in{
							color: #E4A943;
							padding-left: 6rpx;
						}
					}
					
					.body-item-bottom-ready-points-in{
						font-weight: bold;
						font-size: 13px;
					}
				}

				.body-item-bottom-book {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;

					.body-item-bottom-book-in {
						box-sizing: border-box;
						padding: 4rpx 10rpx;
						font-size: 13px;
						color: #fff;
						background: #4F68B0;
						border-radius: 12rpx;
					}
				}

				.body-item-bottom-ready {
					width: 100%;
					position: relative;

					.body-item-bottom-ready-top {
						width: 100%;
						display: flex;
						align-items: center;

						.body-item-bottom-ready-top-img {
							width: 32rpx;
							height: 32rpx;
							margin-right: 6rpx;
						}

						.body-item-bottom-ready-top-text {
							font-size: 13px;
							color: #333;
						}
					}
					
					.body-item-bottom-ready-bottom{
						font-size: 13px;
						color: #333;
						font-weight: bold;
						margin-top: 12rpx;
					}
				}
			}
		}
	}
</style>
