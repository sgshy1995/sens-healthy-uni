<template>
	<view class="course-detail-wrapper">
		<view class="course-detail-top" v-if="info.id">
			<u-status-bar></u-status-bar>
			<view class="course-detail-top-back">
				<view class="course-detail-top-back-in" @click="handleBack">
					<image class="course-detail-top-back-in-img" src="@/static/images/store/back-white.png"></image>
				</view>
			</view>
			<image class="course-detail-top-cover" :src="baseUrl + info.cover"></image>
			<view class="course-detail-top-bottom">
				<view class="course-detail-top-bottom-in"></view>
			</view>
		</view>
		<scroll-view scroll-y class="course-detail-bottom" v-if="info.id">
			<view class="course-detail-title">{{ info.title }}</view>
			<view class="course-detail-tags">
				<text class="item-right-tag-in">
					<text class="tag-in-text">{{ show_type === 'video' ? '专业能力提升' : '面对面康复指导' }}</text>
					<text class="tag-in-point">·</text>
				</text>
				<text class="item-right-tag-in" >
					<text class="tag-in-text">{{ info.course_type_show }}</text>
				</text>
			</view>
			<view class="course-detail-info">
				<view class="course-detail-info-item">
					<u-icon name="account-fill" color="#656565" size="18"></u-icon>
					<text class="course-detail-info-item-text">{{ info.frequency_num_show }}购买</text>
				</view>
				<view class="course-detail-info-item">
					<u-icon name="clock-fill" color="#656565" size="14"></u-icon>
					<text class="course-detail-info-item-text" v-if="show_type === 'video'">{{ info.video_num }}节视频</text>
					<text class="course-detail-info-item-text" v-if="show_type === 'live'">{{ info.live_num }}次直播</text>
				</view>
			</view>
			<view class="course-detail-description">
				<s-show-more :content="info.description" :length="150"></s-show-more>
			</view>
			<view class="course-detail-videos" v-if="show_type === 'video'">
				<view class="course-detail-videos-title">
					<text class="course-detail-videos-title-left">视频列表</text>
					<text class="course-detail-videos-title-right">{{ info.video_num }}视频</text>
				</view>
				<view class="course-detail-videos-body">
					<view class="course-detail-videos-item" v-for="(u,index) in videos" :key="u.id">
						<view class="course-detail-videos-item-one" @click="handleCollapse(index)">
							<view class="course-detail-videos-item-left">
								<image class="item-left-left" :src="baseUrl + u.cover"></image>
								<view class="item-left-right">
									<view class="course-detail-videos-item-left-title">{{ u.title }}</view>
									<view class="course-detail-videos-item-left-info">{{ u.time_length }}</view>
								</view>
							</view>
							<view class="course-detail-videos-item-right" v-if="!u.collapse">
								<u-icon name="arrow-down" color="#696969" size="20"></u-icon>
							</view>
							<view class="course-detail-videos-item-right" v-else>
								<u-icon name="arrow-up" color="#696969" size="20"></u-icon>
							</view>
						</view>
						<view class="course-detail-videos-item-two" v-if="u.collapse">
							<s-show-more :content="u.description" :length="100"></s-show-more>
						</view>
					</view>
				</view>
			</view>
			<view class="course-detail-videos" v-if="show_type === 'live'">
				<view class="course-detail-videos-title">
					<text class="course-detail-videos-title-left">直播信息</text>
				</view>
				<view class="course-detail-videos-body">
					<view class="course-detail-videos-body-text">共<text class="course-detail-videos-body-text-in"> {{ info.live_num }} </text>次直播。</view>
					<view class="course-detail-videos-body-text">面对面直播指导，由康复专家现场连线教学，全面、专业地解答您的问题！</view>
					<view class="course-detail-videos-body-text">需提前预约时间。</view>
				</view>
			</view>
			<view class="course-detail-zhanwei"></view>
			<u-safe-bottom></u-safe-bottom>
		</scroll-view>
		<view class="course-detail-footer" v-if="info.id">
			<view class="course-detail-footer-in">
				<view class="course-detail-footer-left" @click="handleAddChart">
					<u-icon name="shopping-cart-fill" color="#4F68B0" size="20"></u-icon>
					<text class="course-detail-footer-left-text">加入购物车</text>
				</view>
				<view class="course-detail-footer-right" @click="handleBuy">
					<text class="course-detail-footer-right-buy">立即购买</text>
					<text class="course-detail-footer-right-price" v-if="!info.is_discount">¥{{ info.price }}</text>
					<text class="course-detail-footer-right-price" v-else>
						<text class="in-discount">¥{{ info.price }}</text>
						<text class="show-discount">¥{{ info.discount }}</text>
					</text>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
	</view>
</template>

<script>
	import {
		getVideoCourseByIdAction,
		getLiveCourseByIdAction,
		getCourseInVideosByCourseIdAction,
		createCourseChartAction
	} from '@/service/service'
	import SShowMore from '@/components/show-more/s-show-more'
	import moment from 'moment'
	export default {
		data(){
			return {
				id: '',
				show_type: '',
				info: {},
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				videos: []
			}
		},
		components: {
			SShowMore
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
				if (data.type) that.show_type = data.type
				if (data.record) that.id = data.record.id
				that.$loadingOn()
				if(that.show_type === 'video'){
					that.getVideoDetailInfo()
					that.getDetailVideosInfo()
				}else if(that.show_type === 'live'){
					that.getLiveDetailInfo()
				}
				that.$nextTick(() => {
					
				})
			})
		},
		methods: {
			async handleBuy(){
				this.$loadingOn()
				const course_res = this.show_type === 'video' ? await getVideoCourseByIdAction(this.id) : await getLiveCourseByIdAction(this.id)
				const course = course_res.data ? {...course_res.data} : null
				console.log('course', course)
				if(course){
					const that = this
					const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
					course.course_type_show = course_type_map[course.course_type]
					uni.navigateTo({
						url: "/pages_store/payment-course",
						success: function(res) {
							// 通过eventChannel向被打开页面传送数据
							res.eventChannel.emit('show', {
								totalInfo: {
									course: 1
								},
								courses: [{course_info: course, add_course_type: that.show_type === 'video' ? 0 : 1}],
								mount: course.is_discount ? course.discount : course.price,
								order_time: moment(new Date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
								payment_origin: 'normal'
							})
						}
					})
				}
				this.$loadingOff()
			},
			handleAddChart(){
				this.$loadingOn()
				createCourseChartAction({
					course_id: this.info.id,
					add_course_type: this.show_type === 'live' ? 1 : 0
				}).then(res=>{
					this.$loadingOff()
					this.$toast('已加入购物车~')
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			getLiveDetailInfo() {
				getLiveCourseByIdAction(this.id).then(res => {
					this.info = {
						...res.data
					}
					this.info.frequency_num_show = (this.info.frequency_num > 1000 && this.info.frequency_num <=
							10000) ? `${Math.floor(this.info.frequency_num / 1000)}k+` : (this.info
							.frequency_num > 10000 && this.info.frequency_num <= 100000) ?
						`${Math.floor(this.info.frequency_num / 10000)}k+` : this.info.frequency_num
					const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
					this.info.course_type_show = course_type_map[this.info.course_type]
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			getVideoDetailInfo() {
				getVideoCourseByIdAction(this.id).then(res => {
					this.info = {
						...res.data
					}
					this.info.frequency_num_show = (this.info.frequency_num > 1000 && this.info.frequency_num <=
							10000) ? `${Math.floor(this.info.frequency_num / 1000)}k+` : (this.info
							.frequency_num > 10000 && this.info.frequency_num <= 100000) ?
						`${Math.floor(this.info.frequency_num / 10000)}k+` : this.info.frequency_num
					const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
					this.info.course_type_show = course_type_map[this.info.course_type]
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			getDetailVideosInfo() {
				getCourseInVideosByCourseIdAction(this.id).then(res => {
					this.videos = res.data ? [...res.data] : [],
					this.videos.map(item=>{
						this.$set(item, 'collapse', false)
					})
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleBack() {
				uni.navigateBack()
			},
			handleCollapse(index){
				this.videos[index].collapse = !this.videos[index].collapse
			}
		}
	}
</script>

<style lang="scss">
	.course-detail-footer{
		position: fixed;
		left: 0;
		bottom: 0;
		background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 100%);
		box-sizing: border-box;
		width: 100%;
		z-index: 99;
		
		.course-detail-footer-in{
			width: 100%;
			box-sizing: border-box;
			padding: 60rpx 48rpx 24rpx 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.course-detail-footer-left{
				border-radius: 24rpx;
				padding: 0 24rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				border: 1px solid #4F68B0;	
				margin-right: 36rpx;
				
				.course-detail-footer-left-text{
					color: #4F68B0;
					font-size: 12px;
					font-weight: bold;
					padding-left: 4rpx;
				}
			}
			
			.course-detail-footer-right{
				box-sizing: border-box;
				border-radius: 24rpx;
				padding: 0 24rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #4F68B0;
				color: #fff;
				font-size: 14px;
				font-weight: bold;
				white-space: nowrap;
				flex-grow: 1;
				
				.course-detail-footer-right-buy{
					padding-right: 16rpx;
				}
				
				.course-detail-footer-right-price{
					
					.in-discount{
						text-decoration:line-through;
						color: rgba(255,255,255,0.4);
						font-size: 12px;
					}
					
					.show-discount{
						color: #fff;
						padding-left: 4rpx;
					}
				}
			}
		}
	}
	
	.course-detail-wrapper{
		width: 100vw;
		height: 100vh;
		
		.course-detail-top{
			width: 100%;
			height: 500rpx;
			position: relative;
			
			.course-detail-top-back{
				width: 100%;
				box-sizing: border-box;
				padding-left: 32rpx;
				padding-top: 24rpx;
				z-index: 2;
				height: 72rpx;
				position: relative;
				
				.course-detail-top-back-in{
					width: 48rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: rgba(0,0,0,0.45);
					border-radius: 50%;
					
					.course-detail-top-back-in-img{
						width: 32rpx;
						height: 32rpx;
					}
				}
			}
			
			.course-detail-top-cover{
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
			}
			
			.course-detail-top-bottom{
				width: 100%;
				height: 48rpx;
				border-top-left-radius: 24rpx;
				border-top-right-radius: 24rpx;
				background: #fff;
				position: absolute;
				z-index: 2;
				bottom: 0;
				left: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.course-detail-top-bottom-in{
					width: 64rpx;
					height: 2px;
					background: #676767;
				}
			}
		}
		
		.course-detail-bottom{
			height: calc(100vh - 500rpx);
			width: 100%;
			background: #fff;
			box-sizing: border-box;
			padding: 24rpx 36rpx;
			
			.course-detail-title{
				font-size: 20px;
				font-weight: bold;
				color: #333;
			}
			
			.course-detail-tags{
				width: 100%;
				margin-top: 24rpx;
				display: flex;
				align-items: center;
				
				.item-right-tag-in {
					font-size: 12px;
					font-weight: 700;
					color: #656565;
				
					.tag-in-point {
						box-sizing: border-box;
						padding: 0 6rpx;
					}
				}
			}
			
			.course-detail-info{
				width: 100%;
				margin-top: 12rpx;
				display: flex;
				align-items: center;
				
				.course-detail-info-item{
					display: flex;
					align-items: center;
					margin-right: 32rpx;
					
					.course-detail-info-item-text{
						font-size: 11px;
						color: #656565;
						font-weight: 700;
						padding-left: 4rpx;
					}
				}
			}
			
			.course-detail-zhanwei{
				width: 100%;
				height: 144rpx;
			}
			
			.course-detail-description{
				width: 100%;
				margin-top: 24rpx;
			}
			
			.course-detail-videos{
				width: 100%;
				margin-top: 24rpx;
				
				.course-detail-videos-title{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.course-detail-videos-title-left{
						font-size: 14px;
						font-weight: bold;
						color: #333;
					}
					
					.course-detail-videos-title-right{
						font-size: 12px;
						color: #656565;
						font-weight: 700;
					}
				}
				
				.course-detail-videos-body{
					margin-top: 24rpx;
					width: 100%;
					
					.course-detail-videos-body-text{
						font-size: 13px;
						margin-bottom: 16rpx;
						
						.course-detail-videos-body-text-in{
							font-weight: bold;
						}
					}
					
					.course-detail-videos-item{
						width: 100%;
						border-radius: 24rpx;
						box-sizing: border-box;
						padding: 24rpx;
						background: #F7F7F7;
						margin-bottom: 24rpx;
						
						.course-detail-videos-item-one{
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: space-between;
						}
						
						.course-detail-videos-item-two{
							margin-top: 24rpx;
							width: 100%;
						}
						
						.course-detail-videos-item-left{
							display: flex;
							align-items: center;
							
							.item-left-left{
								height: 80rpx;
								width: 120rpx;
								border-radius: 24rpx;
								margin-right: 24rpx;
							}
							
							.course-detail-videos-item-left-title{
								font-size: 14px;
								font-weight: bold;
								color: #333;
							}
							
							.course-detail-videos-item-left-info{
								font-size: 12px;
								font-weight: bold;
								color: #656565;
								margin-top: 12rpx;
							}
						}
					}
				}
			}
		}
	}
</style>