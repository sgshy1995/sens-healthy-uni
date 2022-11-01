<template>
	<view class="mineinfo-question-aks">
		<mescroll-uni ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
			<view class="mineinfo-question-aks-empty" v-if="!dataSource.length">
				<image src="@/static/images/recovery/empty-data.png" class="mineinfo-question-aks-empty-img"></image>
				<text class="mineinfo-question-aks-empty-text">你的收藏夹空空如也~</text>
			</view>
			<view class="mineinfo-question-aks-item-wrapper" v-if="dataSource.length">
				<view class="mineinfo-question-aks-item" v-for="(u,index) in dataSource" :key="u.id"
					:class="{'last-item': index === dataSource.length - 1}">
					<view class="mineinfo-question-aks-item-info" @click="handleShowDetail(u)">
						<view class="info-user-time">
							发表于 {{ u.show_question_time }}
						</view>
					</view>
					<view class="mineinfo-question-aks-item-content">
						<view class="item-content-left" @click="handleShowDetail(u)">
							<text class="mineinfo-question-aks-item-content-topic">#{{ u.pain_type }}#</text>
							{{ u.description }}
						</view>
						<view class="item-content-right" v-show="u.urls && u.urls.length">
							<s-album :urls="u.urls" :max="3" multiHeight="80rpx" singleHeight="120rpx"></s-album>
						</view>
					</view>
					<view class="mineinfo-question-aks-item-bottom" @click="handleShowDetail(u)">
						<view class="mineinfo-question-aks-item-bottom-left">
							<view class="pain-bottom-payment" :class="{active: u.has_major}">
								<image v-if="!u.has_major" class="pain-bottom-icon"
									src="@/static/images/index/major-light.png"></image>
								<image v-else class="pain-bottom-icon" src="@/static/images/index/major-color.png">
								</image>
								<text class="pain-bottom-text">{{ u.has_major ? '有专业回复' : '暂无专业回复' }}</text>
							</view>
						</view>
						<view class="mineinfo-question-aks-item-bottom-right">
							<view class="pain-bottom-comment">
								<image class="pain-bottom-icon" src="@/static/images/index/comment-light.png"></image>
								<text class="pain-bottom-text">{{ u.reply_num }}</text>
							</view>
							<view class="pain-bottom-collect" :class="{active: u.ready_collect}"
								@click.stop="handleChangeCollect(u.id, u.ready_collect ? 0 : 1)">
								<image v-if="!u.ready_collect" class="pain-bottom-icon"
									src="@/static/images/index/collect-light.png"></image>
								<image v-else class="pain-bottom-icon" src="@/static/images/index/collect-color.png">
								</image>
								<text class="pain-bottom-text">{{ u.collect_num }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		getCustomQuestionsAction,
		updateQuestionCollectAction
	} from '@/service/service'
	import moment from 'moment'
	export default {
		data(){
			return {
				dataSource: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/'
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		methods: {
			getData(){
				return new Promise((resolve, reject) => {
					getCustomQuestionsAction({
						collect_user_ids: this.userInfo.id,
						status: 1
					}).then(res=>{
						this.dataSource = res.data || []
						this.dataSource.map(item => {
							item.urls = item.image_data ? item.image_data.split(',').map(url => this.baseUrl +
								url) : []
							if (moment(new Date(item.question_time), 'YYYY-MM-DD').format('YYYY-MM-DD') ===
								moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')) {
								item.show_question_time = '今天 ' + moment(new Date(item.question_time), 'HH:mm')
									.format('HH:mm')
							} else if (new Date().getFullYear() === new Date(item.question_time)
							.getFullYear()) {
								item.show_question_time = moment(new Date(item.question_time), 'MM-DD HH:mm')
									.format('MM-DD HH:mm')
							} else {
								item.show_question_time = moment(new Date(item.question_time),
									'YY-MM-DD HH:mm').format('YY-MM-DD HH:mm')
							}
							const ids = (item.collect_user_ids || '').split(',')
							item.ready_collect = ids.includes(this.userInfo.id)
						})
						resolve(this.dataSource)
					}).catch(err=>{
						reject(err)
					})
				})
			},
			handleRefreshDown(mescroll) {
				this.getData().then(res=>{
					mescroll.endSuccess(res.length, false)
				}).catch(err=>{
					mescroll.endErr()
				})
			},
			handleShowDetail(record) {
				const that = this
				uni.navigateTo({
					url: "/pages_index/painQADetail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							record
						})
					}
				})
			},
			handleChangeCollect(id, status) {
				this.$loadingOn()
				updateQuestionCollectAction(id, status).then(res => {
					this.$loadingOff()
					this.getData()
					this.$toast(status ? '已收藏' : '已取消收藏');
				}).catch(err => {
					this.$loadingOff()
				})
			}
		}
	}
</script>

<style lang="scss">
	.mineinfo-question-aks{
		width: 100%;
		height: 700rpx;
		
		.mineinfo-question-aks-empty {
			width: 100%;
			margin-top: 24rpx;
			margin-bottom: 24rpx;
		}
		
		.mineinfo-question-aks-empty {
			width: 100%;
			padding: 48rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			margin-top: 64rpx;
		
			.mineinfo-question-aks-empty-img {
				width: 64rpx;
				height: 64rpx;
				margin-bottom: 24rpx;
			}
		
			.mineinfo-question-aks-empty-text {
				font-size: 13px;
				color: #DAE1F4;
			}
		}
		
		.mineinfo-question-aks-item-wrapper {
			width: 100%;
			margin-bottom: 24rpx;
			box-sizing: border-box;
			padding: 0 24rpx;
		}
		
		.mineinfo-question-aks-item {
			width: 100%;
			margin-top: 24rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #f6f6f6;
			border-radius: 12rpx;
			padding: 24rpx;
			background: #fff;
		
			&.last-item {
				border-bottom: 24rpx;
			}
		
			.mineinfo-question-aks-item-top {
				margin-bottom: 12rpx;
				color: #4F68B0;
				font-size: 14px;
				font-weight: 700;
			}
		
			.mineinfo-question-aks-item-info {
				display: flex;
				align-items: center;
		
				.info-user-time {
					font-size: 10px;
					color: #333;
				}
			}
		
			.mineinfo-question-aks-item-content {
				display: flex;
				flex-direction: column;
				width: 100%;
				margin-top: 12rpx;
		
				.item-content-left {
					width: 100%;
					height: 100%;
					font-size: 12px;
					box-sizing: border-box;
					margin-bottom: 12rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
		
					.mineinfo-question-aks-item-content-topic {
						color: #4F68B0;
						font-weight: 800;
						padding-right: 4rpx;
						font-size: 12px;
					}
				}
		
				.item-content-right {
					width: 70%;
					flex-shrink: 0;
				}
			}
		
			.mineinfo-question-aks-item-bottom {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 12rpx;
		
				.mineinfo-question-aks-item-bottom-left {
					display: flex;
					align-items: center;
				}
		
				.mineinfo-question-aks-item-bottom-right {
					display: flex;
					align-items: center;
				}
		
				.pain-bottom-comment,
				.pain-bottom-payment,
				.pain-bottom-collect {
					display: flex;
					align-items: center;
					margin-right: 24px;
		
					.pain-bottom-icon {
						width: 30rpx;
						height: 30rpx;
						margin-right: 8rpx;
					}
		
					.pain-bottom-text {
						font-size: 12px;
					}
				}
		
				.pain-bottom-payment {
					color: #C8C9D0;
		
					&.active {
						color: #4F68B0;
					}
				}
		
				.pain-bottom-collect {
					margin-right: 0;
				}
		
				.pain-bottom-comment,
				.pain-bottom-collect {
					background: #F4F8FD;
					border-radius: 24rpx;
					color: #D6D9E3;
					box-sizing: border-box;
					padding: 4rpx 10rpx;
				}
		
				.pain-bottom-collect.active {
					color: #4F68B0;
					background: rgba(79, 104, 176, 0.2);
				}
			}
		}
	}
</style>