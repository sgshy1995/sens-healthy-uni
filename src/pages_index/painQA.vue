<template>
	<scroll-view scroll-y class="pain-q-a">
		<view class="pain-q-a-top">
			<u-search placeholder="搜索关键词" :showAction="false" v-model="keyword" @search="handleSearch" @clear="handleClearSearch"></u-search>
		</view>
		<view class="pain-q-a-top-tabs">
			<u-tabs
			        :list="listItems"
			        lineWidth="30"
			        lineColor="#4F68B0"
			        :activeStyle="{
			            color: '#303133',
			            fontWeight: 'bold',
			            transform: 'scale(1.05)'
			        }"
			        :inactiveStyle="{
			            color: '#606266',
			            transform: 'scale(1)'
			        }"
					@change="handleChangeTabs"
					:current="tabCurrent"
			        itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
			    >
			    </u-tabs>
		</view>
		<view class="pain-q-a-top-empty" v-if="(!dataSource.length && tabCurrent === 0) || (!dataSourceCustom.length && tabCurrent === 1)">
			<image src="@/static/images/index/empty.png" class="pain-q-a-top-empty-img"></image>
			<text class="pain-q-a-top-empty-text">暂无问答动态~</text>
		</view>
		<view class="pain-q-a-item-wrapper" v-if="tabCurrent === 0 && dataSource.length">
			<view class="pain-q-a-item" v-for="(u,index) in dataSource" :key="u.id" :class="{'last-item': index === dataSource.length - 1}">
				<view class="pain-q-a-item-info" @click="handleShowDetail(u)">
					<image class="info-avatar" :src="u.anonymity ? avatarDefault : u.avatar ? baseUrl + u.avatar : avatarDefault"></image>
					<view class="info-user">
						<view class="info-user-name">
							{{ u.anonymity ? '森普健康用户' : u.name ? u.name : '森普健康用户' }}
						</view>
						<view class="info-user-time">
							{{ u.show_question_time }}
						</view>
					</view>
				</view>
				<view class="pain-q-a-item-content">
					<view class="item-content-left" @click="handleShowDetail(u)">
						<text class="pain-q-a-item-content-topic">#{{ u.pain_type }}#</text>
						{{ u.description }}
					</view>
					<view class="item-content-right" v-show="u.urls && u.urls.length">
						<u-album @click.stop.prevent :urls="u.urls" multipleSize="200rpx" singleSize="200rpx" rowCount="3" maxCount="3"></u-album>
					</view>
				</view>
				<view class="pain-q-a-item-bottom" @click="handleShowDetail(u)">
					<!-- <view class="pain-q-a-item-bottom-left" @click="handleShowDetail(u)">
						<view class="pain-bottom-payment">
							<image class="pain-bottom-icon" src="@/static/images/index/payment-light.png"></image>
							<text class="pain-bottom-text">¥{{ u.consulting_fee }} 咨询费</text>
						</view>
					</view> -->
					<view class="pain-q-a-item-bottom-left">
						<view class="pain-bottom-payment" :class="{active: u.has_major}">
							<image v-if="!u.has_major" class="pain-bottom-icon" src="@/static/images/index/major-light.png"></image>
							<image v-else class="pain-bottom-icon" src="@/static/images/index/major-color.png"></image>
							<text class="pain-bottom-text">{{ u.has_major ? '有专业回复' : '暂无专业回复' }}</text>
						</view>
					</view>
					<view class="pain-q-a-item-bottom-right">
						<view class="pain-bottom-comment">
							<image class="pain-bottom-icon" src="@/static/images/index/comment-light.png"></image>
							<text class="pain-bottom-text">{{ u.reply_num }}</text>
						</view>
						<view class="pain-bottom-collect" :class="{active: u.ready_collect}" @click.stop="handleChangeCollect(u.id, u.ready_collect ? 0 : 1)">
							<image v-if="!u.ready_collect" class="pain-bottom-icon" src="@/static/images/index/collect-light.png"></image>
							<image v-else class="pain-bottom-icon" src="@/static/images/index/collect-color.png"></image>
							<text class="pain-bottom-text">{{ u.collect_num }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pain-q-a-item-wrapper" v-if="tabCurrent === 1 && dataSourceCustom.length">
			<view class="pain-q-a-item" v-for="(u,index) in dataSourceCustom" :key="u.id" :class="{'last-item': index === dataSource.length - 1}">
				<view class="pain-q-a-item-info" @click="handleShowDetail(u)">
					<image class="info-avatar" :src="u.anonymity ? avatarDefault : u.avatar ? baseUrl + u.avatar : avatarDefault"></image>
					<view class="info-user">
						<view class="info-user-name">
							{{ u.anonymity ? '森普健康用户' : u.name ? u.name : '森普健康用户' }}
						</view>
						<view class="info-user-time">
							{{ u.show_question_time }}
						</view>
					</view>
				</view>
				<view class="pain-q-a-item-content">
					<view class="item-content-left" @click="handleShowDetail(u)">
						<text class="pain-q-a-item-content-topic">#{{ u.pain_type }}#</text>
						{{ u.description }}
					</view>
					<view class="item-content-right" v-show="u.urls && u.urls.length">
						<u-album @click.stop.prevent :urls="u.urls" multipleSize="200rpx" singleSize="200rpx" rowCount="3" maxCount="3"></u-album>
					</view>
				</view>
				<view class="pain-q-a-item-bottom" @click="handleShowDetail(u)">
					<!-- <view class="pain-q-a-item-bottom-left" @click="handleShowDetail(u)">
						<view class="pain-bottom-payment">
							<image class="pain-bottom-icon" src="@/static/images/index/payment-light.png"></image>
							<text class="pain-bottom-text">¥{{ u.consulting_fee }} 咨询费</text>
						</view>
					</view> -->
					<view class="pain-q-a-item-bottom-left">
						<view class="pain-bottom-payment" :class="{active: u.has_major}">
							<image v-if="!u.has_major" class="pain-bottom-icon" src="@/static/images/index/major-light.png"></image>
							<image v-else class="pain-bottom-icon" src="@/static/images/index/major-color.png"></image>
							<text class="pain-bottom-text">{{ u.has_major ? '有专业回复' : '暂无专业回复' }}</text>
						</view>
					</view>
					<view class="pain-q-a-item-bottom-right">
						<view class="pain-bottom-comment">
							<image class="pain-bottom-icon" src="@/static/images/index/comment-light.png"></image>
							<text class="pain-bottom-text">{{ u.reply_num }}</text>
						</view>
						<view class="pain-bottom-collect" :class="{active: u.ready_collect}" @click.stop="handleChangeCollect(u.id, u.ready_collect ? 0 : 1)">
							<image v-if="!u.ready_collect" class="pain-bottom-icon" src="@/static/images/index/collect-light.png"></image>
							<image v-else class="pain-bottom-icon" src="@/static/images/index/collect-color.png"></image>
							<text class="pain-bottom-text">{{ u.collect_num }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="qa-publish" @click="handleShowPublish">
			<u-icon name="plus" color="#fff" size="18"></u-icon>
		</view>
	</scroll-view>
</template>

<script>
	import {
		getQuestionsAction,
		getCustomQuestionsAction,
		updateQuestionCollectAction
	} from '@/service/service'
	import moment from 'moment'
	export default {
		name: 'PainQA',
		data() {
			return {
				keyword: '',
				dataSource: [],
				dataSourceCustom: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				avatarDefault: require('@/static/images/avatar-default.png'),
				listItems: [
					{
						name: '最新'
					},
					{
						name: '专业回复'
					}
				],
				tabCurrent: 0
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		methods: {
			handleChangeTabs(e){
				this.tabCurrent = e.index
				console.log('tabCurrent', this.tabCurrent)
			},
			handleSearch(){
				this.$loadingOn()
				this.getQuestionsList()
			},
			handleClearSearch(){
				this.$loadingOn()
				this.getQuestionsList()
			},
			handleChangeCollect(id, status){
				this.$loadingOn()
				updateQuestionCollectAction(id, status).then(res=>{
					this.$loadingOff()
					this.getQuestionsList()
					this.$toast(status ? '已收藏' : '已取消收藏');
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			showView(url) {
				if(!url) return
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + url],
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
			},
			handleShowPublish() {
				const that = this
				uni.navigateTo({
					url: "/pages_index/painQAPublish"
				})
			},
			getQuestionsList(){
				console.log('获取问题列表')
				Promise.all([
					getCustomQuestionsAction({keyword: this.keyword || undefined}),
					getCustomQuestionsAction({has_major: 1, keyword: this.keyword || undefined})
				]).then(responses=>{
					this.dataSource = responses[0].data || []
					this.dataSource.map(item=>{
						item.urls = item.image_data ? item.image_data.split(',').map(url=>this.baseUrl+url) : []
						console.log('item.urls', item.urls)
						if(moment(new Date(item.question_time), 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')){
							item.show_question_time = '今天 ' + moment(new Date(item.question_time), 'HH:mm').format('HH:mm')
						}else if(new Date().getFullYear() === new Date(item.question_time).getFullYear()){
							item.show_question_time = moment(new Date(item.question_time), 'MM-DD HH:mm').format('MM-DD HH:mm')
						}else{
							item.show_question_time = moment(new Date(item.question_time), 'YY-MM-DD HH:mm').format('YY-MM-DD HH:mm')
						}
						const ids = (item.collect_user_ids || '').split(',')
						item.ready_collect = ids.includes(this.userInfo.id)
					})
					console.log('dataSource', this.dataSource)
					
					this.dataSourceCustom = responses[1].data || []
					this.dataSourceCustom.map(item=>{
						item.urls = item.image_data ? item.image_data.split(',').map(url=>this.baseUrl+url) : []
						console.log('item.urls', item.urls)
						if(moment(new Date(item.question_time), 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')){
							item.show_question_time = '今天 ' + moment(new Date(item.question_time), 'HH:mm').format('HH:mm')
						}else if(new Date().getFullYear() === new Date(item.question_time).getFullYear()){
							item.show_question_time = moment(new Date(item.question_time), 'MM-DD HH:mm').format('MM-DD HH:mm')
						}else{
							item.show_question_time = moment(new Date(item.question_time), 'YY-MM-DD HH:mm').format('YY-MM-DD HH:mm')
						}
						const ids = (item.collect_user_ids || '').split(',')
						item.ready_collect = ids.includes(this.userInfo.id)
					})
					console.log('dataSourceCustom', this.dataSourceCustom)
					this.$loadingOff()
				}).catch(err=>{
					this.$loadingOff()
				})
			}
		}
	}
</script>

<style lang="scss">
	.qa-publish{
		position: fixed;
		right: 12rpx;
		bottom: 200rpx;
		width: 80rpx;
		height: 80rpx;
		background: #4F68B0;
		box-shadow: rgba(79,104,176, 0.3) 0px 14px 24px, rgba(79,104,176, 0.22) 0px 9px 8px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.pain-q-a {
		width: 100%;
		background: transparent;
		box-sizing: border-box;
		padding: 24rpx;
		padding-bottom: 170rpx;
		position: relative;
		
		.pain-q-a-top{
			margin-bottom: 24rpx;
		}
		
		.pain-q-a-top-empty{
			width: 100%;
			margin-top: 24rpx;
			margin-bottom: 24rpx;
		}
		
		.pain-q-a-top-empty{
			width: 100%;
			padding: 48rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			margin-top: 64rpx;
			
			.pain-q-a-top-empty-img{
				width: 64rpx;
				height: 64rpx;
				margin-bottom: 24rpx;
			}
			
			.pain-q-a-top-empty-text{
				font-size: 13px;
				color: #DAE1F4;
			}
		}
		
		.pain-q-a-item-wrapper{
			width: 100%;
		}

		.pain-q-a-item {
			width: 100%;
			margin-bottom: 24rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #f6f6f6;
			border-radius: 10rpx;
			padding: 24rpx;
			background: #fff;
			
			&.last-item{
				border-bottom: none;
			}

			.pain-q-a-item-top {
				margin-bottom: 24rpx;
				color: #4F68B0;
				font-size: 14px;
				font-weight: 700;
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
					
					.info-user-name{
						font-weight: 700;
					}
					
					.info-user-time{
						font-size: 12px;
						color: #aaa;
					}
				}
			}

			.pain-q-a-item-content {
				display: flex;
				flex-direction: column;
				width: 100%;
				margin-top: 24rpx;

				.item-content-left {
					width: 100%;
					height: 100%;
					font-size: 14px;
					box-sizing: border-box;
					margin-bottom: 12rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					
					.pain-q-a-item-content-topic{
						color: #4F68B0;
						font-weight: 800;
						padding-right: 4rpx;
						font-size: 14px;
					}
				}

				.item-content-right {
					width: 100%;
					height: 150rpx;
					flex-shrink: 0;
					overflow: hidden;
				}
			}

			.pain-q-a-item-bottom {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 24rpx;
				
				.pain-q-a-item-bottom-left{
					display: flex;
					align-items: center;
				}
				
				.pain-q-a-item-bottom-right{
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
						font-size: 13px;
					}
				}
				
				.pain-bottom-payment{
					color: #C8C9D0;
					
					&.active{
						color: #4F68B0;
					}
				}
				
				.pain-bottom-collect{
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
				
				.pain-bottom-collect.active{
					color: #4F68B0;
					background: rgba(79,104,176,0.2);
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
