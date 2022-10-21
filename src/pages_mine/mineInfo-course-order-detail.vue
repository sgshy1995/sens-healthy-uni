<template>
	<view class="mineinfo-course-order-detail">
		<view class="mineinfo-course-order-detail-top">
			<u-status-bar></u-status-bar>
			<view class="mineinfo-course-order-detail-top-in">
				<view class="top-back" @click="close">
					<u-icon name="arrow-left" color="#333" size="18"></u-icon>
				</view>
				<text class="top-title">订单完成</text>
				<view class="top-right">
					<u-icon name="arrow-left" color="#333" size="18"></u-icon>
				</view>
			</view>
		</view>
		<view class="mineinfo-course-order-detail-bottom">
			<mescroll-uni ref="mescroll" :down="{onScroll:false, use: false}" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
				<view class="mineinfo-course-order-detail-bottom-title" v-if="dataSource.length">共{{ order_info.order_total }}个课程</view>
				<view class="mineinfo-course-order-detail-bottom-item" v-for="(u, index) in dataSource" :key="u.id" @click="handleShowCourseDetail(u, order_info.course_types_list[index] ? 'live' : 'video')">
					<view class="chart-right-content">
						<view class="body-item-top">
							<view class="body-item-top-left">
								<image class="body-item-top-left-img" :src="u.url"></image>
							</view>
							<view class="body-item-top-right">
								<view class="body-item-top-right-title">{{ u.title }}</view>
								<view class="body-item-top-right-tag">
									<text class="item-right-tag-in">
										<text class="tag-in-text">{{ order_info.course_types_list[index] ? '面对面康复指导' : '专业能力提升' }}</text>
										<text class="tag-in-point">·</text>
									</text>
									<text class="item-right-tag-in" >
										<text class="tag-in-text">{{ u.course_type_show }}</text>
										<text class="tag-in-point">·</text>
									</text>
									<text class="item-right-tag-in">
										<text class="tag-in-text">{{ order_info.course_types_list[index] ? `${u.live_num}次直播` : `${u.video_num}视频` }}</text>
									</text>
								</view>
								<view class="body-item-top-right-description">{{ u.description }}</view>
								<view class="body-item-top-right-price">
									<text class="body-item-top-right-price-in">¥ {{ order_info.order_prices_list[index] }}</text>
								</view>
							</view>
						</view>
						<view class="body-item-bottom">
							
						</view>
					</view>
				</view>
				<view class="mineinfo-course-order-detail-bottom-info" v-if="dataSource.length">
					<view class="mineinfo-course-order-detail-bottom-info-item">
						<text class="mineinfo-course-order-detail-bottom-info-item-left">
							订单编号:
						</text>
						<u-tooltip :text="order_info.order_no" overlay></u-tooltip>
					</view>
					<view class="mineinfo-course-order-detail-bottom-info-item">
						<text class="mineinfo-course-order-detail-bottom-info-item-left">
							支付流水号:
						</text>
						<u-tooltip :text="order_info.payment_no" overlay></u-tooltip>
					</view>
					<view class="mineinfo-course-order-detail-bottom-info-item">
						<text class="mineinfo-course-order-detail-bottom-info-item-left">
							下单时间:
						</text>
						<text class="mineinfo-course-order-detail-bottom-info-item-right">
							{{ order_info.order_time_show }}
						</text>
					</view>
					<view class="mineinfo-course-order-detail-bottom-info-item">
						<text class="mineinfo-course-order-detail-bottom-info-item-left">
							支付时间:
						</text>
						<text class="mineinfo-course-order-detail-bottom-info-item-right">
							{{ order_info.payment_time_show }}
						</text>
					</view>
					<view class="mineinfo-course-order-detail-bottom-info-item">
						<text class="mineinfo-course-order-detail-bottom-info-item-left">
							支付类型:
						</text>
						<text class="mineinfo-course-order-detail-bottom-info-item-right">
							{{ order_info.payment_type_show }}
						</text>
					</view>
					<view class="mineinfo-course-order-detail-bottom-info-item last-one">
						<text class="mineinfo-course-order-detail-bottom-info-item-left">
							支付总金额:
						</text>
						<text class="mineinfo-course-order-detail-bottom-info-item-right">
							¥{{ order_info.payment_num }}
						</text>
					</view>
				</view>
				<u-safe-bottom></u-safe-bottom>
			</mescroll-uni>
		</view>
		<view class="mine-detail-footer">
			<view class="mine-detail-footer-in">
				<view class="mine-detail-footer-in-two">
					<view class="mine-detail-footer-left" @click="handleAfterBuy">
						<text class="mine-detail-footer-left-buy">售后服务</text>
					</view>
					<view class="mine-detail-footer-right" @click="handleReBuy">
						<text class="mine-detail-footer-right-buy">再次购买</text>
					</view>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
	</view>
</template>

<script>
	import {
		findCourseOrderByOrderNoAction,
		getLiveCoursesByIdsAction,
		getVideoCoursesByIdsAction
	} from '@/service/service'
	import moment from 'moment'
	export default {
		data(){
			return {
				dataSource: [],
				order_info: {},
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				order_no: ''
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
				if (data.order_no) {
					console.log('data.order_no', data.order_no)
					that.order_no = data.order_no
					that.$loadingOn()
					that.getData()
				}
			})
		},
		methods: {
			handleShowCourseDetail(record, type) {
				const that = this
				uni.navigateTo({
					url: "/pages_store/course-detail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							record,
							type
						})
					}
				})
			},
			getData(){
				return new Promise((resolve, reject) => {
					findCourseOrderByOrderNoAction(this.order_no).then(res=>{
						const data = res.data ? {...res.data} : {}
						data.order_time_show = moment(data.order_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
						data.payment_time_show = moment(data.payment_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
						data.course_ids_list = data.course_ids.split(',')
						data.course_types_list = data.course_types.split(',').map(type => Number(type))
						data.order_prices_list = data.order_prices.split(',')
						const payment_typ_map = ['余额支付', '微信支付', '支付宝支付', 'Apple支付']
						data.payment_type_show = payment_typ_map[data.payment_type]
						const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
						data.course_infos.map(course=>{
							course.course_type_show = course_type_map[course.course_type]
							course.url = this.baseUrl + course.cover
						})
						this.dataSource = [...data.course_infos]
						this.order_info = {...data}
						this.$loadingOff()
						resolve(data)
					}).catch(err=>{
						this.$loadingOff()
						reject(err)
					})
				})
			},
			close() {
				uni.navigateBack()
			},
			handleAfterBuy(){
				
			},
			handleReBuy(){
				this.$loadingOn()
				let courses = []
				const live_courses_ids = []
				const video_courses_ids = []
				this.order_info.course_types_list.forEach((type, index) => {
					type === 1 ? live_courses_ids.push(this.order_info.course_ids_list[index]) : video_courses_ids.push(this.order_info.course_ids_list[index])
				})
				Promise.all([
					getLiveCoursesByIdsAction(live_courses_ids.join()),
					getVideoCoursesByIdsAction(video_courses_ids.join())
				]).then(responses => {
					const live_courses = responses[0].data.map(course => { return {course_info: course, add_course_type: 1} })
					const video_courses = responses[1].data.map(course => { return {course_info: course, add_course_type: 0} })
					courses = [...live_courses, ...video_courses]
					if(!courses.find(course_outer => course_outer.course_info.status) || !courses.length){
						this.$toast('所有课程均已下架，无法购买')
						this.$loadingOff()
						return
					}else if(courses.find(course_outer => !course_outer.course_info.status)){
						this.$toast('有课程已下架，请注意订单变化')
					}
					courses = courses.filter(course_outer => course_outer.course_info.status)
					const mount = courses.map(course_outer => course_outer.course_info).map(course => course.is_discount ? course.discount : course.price).map(num => Number(num)).reduce((a,b) => a + b)
					const that = this
					uni.navigateTo({
						url: "/pages_store/payment-course",
						success: function(res) {
							// 通过eventChannel向被打开页面传送数据
							res.eventChannel.emit('show', {
								totalInfo: {
									course: courses.length
								},
								courses: courses,
								mount,
								order_time: moment(new Date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
								payment_origin: 'normal'
							})
						}
					})
					this.$loadingOff()
				}).catch(err => {
					console.log('err', err)
					this.$loadingOff()
				})
			}
		}
	}
</script>

<style lang="scss">
	.mine-detail-footer{
		position: fixed;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		width: 100%;
		z-index: 99;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px, rgba(149, 157, 165, 0.1) 0px 8px 24px inset;
		background: #fff;
		
		.mine-detail-footer-in{
			width: 100%;
			box-sizing: border-box;
			padding: 24rpx 48rpx 24rpx 48rpx;
			
			.mine-detail-footer-in-two{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
			
			.mine-detail-footer-left{
				box-sizing: border-box;
				border: 2rpx solid #999;
				border-radius: 24rpx;
				padding: 0 12rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #fff;
				color: #333;
				font-size: 13px;
				white-space: nowrap;
				margin-right: 36rpx;
			}
			
			.mine-detail-footer-right{
				box-sizing: border-box;
				border: 2rpx solid #4F68B0;
				border-radius: 24rpx;
				padding: 0 12rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #4F68B0;
				color: #fff;
				font-size: 13px;
				white-space: nowrap;
			}
		}
	}
	
	
	.mineinfo-course-order-detail{
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		background: #f6f6f6;
		
		.mineinfo-course-order-detail-top {
			box-sizing: border-box;
			width: 100%;
			padding-top: 12rpx;
			padding-bottom: 48rpx;
			background: #f6f6f6;
			
			.mineinfo-course-order-detail-top-in{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;
				box-sizing: border-box;
				padding: 0 24rpx;
			}
		
			.top-back {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 16px;
				color: #333;
			}
		
			.top-title {
				text-align: center;
				width: 100%;
				font-size: 16px;
				color: #333;
			}
			
			.top-right {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 16px;
				color: #333;
				opacity: 0;
			}
		}
		
		.mineinfo-course-order-detail-bottom{
			width: 100%;
			height: 1300rpx;
			box-sizing: border-box;
			padding: 0 24rpx;
			
			.mineinfo-course-order-detail-bottom-info{
				width: 100%;
				border-radius: 12rpx;
				background: #fff;
				box-sizing: border-box;
				padding: 24rpx;
				
				.mineinfo-course-order-detail-bottom-info-item{
					margin-bottom: 12rpx;
					width: 100%;
					display: flex;
					align-items: center;
					
					.mineinfo-course-order-detail-bottom-info-item-left{
						font-size: 13px;
						padding-right: 12rpx;
					}
					
					.mineinfo-course-order-detail-bottom-info-item-right{
						font-size: 13px;
						font-weight: bold;
					}
					
					.u-tooltip__wrapper__text{
						font-size: 13px !important;
						font-weight: bold !important;
						color: #333 !important;
					}
					
					&.last-one{
						margin-bottom: 0;
					}
				}
			}
			
			.mineinfo-course-order-detail-bottom-title{
				width: 100%;
				font-size: 13px;
				font-weight: bold;
				margin-bottom: 24rpx;
			}
			
			.mineinfo-course-order-detail-bottom-item{
				width: 100%;
				margin-bottom: 36rpx;
				border-radius: 12rpx;
				display: flex;
				justify-content: space-between;
				background: #fff;
				box-sizing: border-box;
				padding: 24rpx;
				position: relative;
				
				.chart-left-icon-delete{
					margin-top: 24rpx;
					width: 32rpx;
					position: absolute;
					right: 24rpx;
					top: 0;
				}
				
				.chart-left-icon{
					width: 32rpx;
					box-sizing: border-box;
					margin-right: 24rpx;
					flex-shrink: 0;
					margin-top: 12rpx;
					
					.chart-left-icon-select{
						display: flex;
						justify-content: center;
						align-items: center;
						box-sizing: border-box;
						border: 1px solid #B0B3BC;
						height: 32rpx;
						border-radius: 6rpx;
						
						.chart-left-icon-select-in{
							display: none;
						}
						
						&.active{
							border-color: #4F68B0;
							background: #4F68B0;
							
							.chart-left-icon-select-in{
								display: block;
							}
						}
					}
					
				}
				
				.chart-right-content{
					flex-grow: 1;
				}
				
				.body-item-top{
					width: 100%;
					display: flex;
					align-items: center;
					
					.body-item-top-left{
						width: 200rpx;
						height: 160rpx;
						border-radius: 12rpx;
						flex-shrink: 0;
						margin-right: 12rpx;
						overflow: hidden;
						
						.body-item-top-left-img{
							width: 100%;
							height: 100%;
						}
					}
					
					.body-item-top-right{
						flex-grow: 1;
						height: 160rpx;
						
						.body-item-top-right-title{
							width: calc(100% - 32rpx);
							font-size: 12px;
							font-weight: bold;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
						
						.body-item-top-right-tag{
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
						
						.body-item-top-right-description{
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
						
						.body-item-top-right-price{
							color: #333;
							font-size: 13px;
							margin-top: 10rpx;
							
							.body-item-top-right-price-in{
								font-weight: bold;
								padding-left: 4rpx;
							}
							
							.in-discount{
								text-decoration:line-through;
								color: #999;
							}
							
							.show-discount{
								color: #4F68B0;
								padding-left: 16rpx;
							}
						}
					}
				}
			}
		}
	}
</style>