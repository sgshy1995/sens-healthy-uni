<template>
	<view class="mineinfo-course-order">
		<mescroll-uni ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
			<view class="mineinfo-course-order-empty" v-if="!dataSource.length">
				<image src="@/static/images/recovery/empty-data.png" class="mineinfo-course-order-empty-img"></image>
				<text class="mineinfo-course-order-empty-text">暂无订单信息~</text>
			</view>
			<view class="mineinfo-course-order-item-wrapper" v-if="dataSource.length">
				<view class="mineinfo-course-order-item" v-for="(u,index) in dataSource" :key="index" @click="handleShowDetail(u)"
					:class="{'last-item': index === dataSource.length - 1}">
					<view class="mineinfo-course-order-item-middle">
						<view class="mineinfo-course-order-item-middle-body">
							<scroll-view scroll-x class="mineinfo-course-order-item-middle-body-left">
								<view class="mineinfo-course-order-item-middle-body-left-in">
									<view class="mineinfo-course-order-item-middle-body-left-item" v-for="(u1,index1) in u.course_infos" @click.stop="handleShowCourseDetail(u1, u.order_list[index1].course_type ? 'live' : 'video')">
										<image class="mineinfo-course-order-item-middle-body-left-item-img" :src="u1.cover_show"></image>
										<view class="mineinfo-course-order-item-middle-body-left-item-text">{{ u1.title }}</view>
									</view>
								</view>
								
							</scroll-view>
							<view class="mineinfo-course-order-item-middle-body-right">
								<view class="mineinfo-course-order-item-middle-body-right-top">¥{{ u.payment_num }}</view>
								<view class="mineinfo-course-order-item-middle-body-right-bottom">共{{ u.course_infos.length }}个</view>
							</view>
						</view>
					</view>
					<view class="mineinfo-course-order-item-bottom">
						<view class="mineinfo-course-order-item-bottom-left">
							下单于 {{ u.payment_time_show }}
						</view>
						<view class="mineinfo-course-order-item-bottom-right">
							<view class="mineinfo-course-order-item-bottom-right-button-one" @click.stop="handleShowDetail(u)">查看详情</view>
							<view class="mineinfo-course-order-item-bottom-right-button-two" @click.stop="handleReBuy(u)">再次购买</view>
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
		findManyCourseOrdersByUserIdAction,
		getLiveCoursesByIdsAction,
		getVideoCoursesByIdsAction
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
			handleReBuy(record){
				this.$loadingOn()
				let courses = []
				const course_ids_list = record.course_ids.split(',')
				const course_types_list = record.course_types.split(',').map(type => Number(type))
				const live_courses_ids = []
				const video_courses_ids = []
				course_types_list.forEach((type, index) => {
					type === 1 ? live_courses_ids.push(course_ids_list[index]) : video_courses_ids.push(course_ids_list[index])
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
			},
			getData(){
				return new Promise((resolve, reject) => {
					findManyCourseOrdersByUserIdAction().then(res=>{
						this.dataSource = res.data || []
						this.dataSource.map(item => {
							item.course_infos.map(itemIn=>{
								itemIn.cover_show = this.baseUrl + itemIn.cover
							})
							item.live_courses = item.course_infos.filter(item=>item.live_num)
							item.video_courses = item.course_infos.filter(item=>item.video_num)
							item.payment_time_show = moment(new Date(item.payment_time), 'YYYY-MM-DD').format('YYYY-MM-DD')
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
			handleShowDetail(record){
				const that = this
				uni.navigateTo({
					url: "/pages_mine/mineInfo-course-order-detail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							order_no: record.order_no
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.mineinfo-course-order{
		width: 100%;
		height: 700rpx;
		background: #f6f6f6;
		
		.mineinfo-course-order-empty {
			width: 100%;
			padding: 48rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			margin-top: 64rpx;
		
			.mineinfo-course-order-empty-img {
				width: 64rpx;
				height: 64rpx;
				margin-bottom: 24rpx;
			}
		
			.mineinfo-course-order-empty-text {
				font-size: 13px;
				color: #DAE1F4;
			}
		}
		
		.mineinfo-course-order-item-wrapper{
			width: 100%;
			border-radius: 24rpx;
			box-sizing: border-box;
			padding: 0 24rpx;
			
			.mineinfo-course-order-item{
				width: 100%;
				background: #fff;
				border-radius: 12rpx;
				box-sizing: border-box;
				padding: 24rpx;
				margin-top: 24rpx;
				
				&.last-item{
					margin-bottom: 24rpx;
				}
				
				.mineinfo-course-order-item-top{
					width: 100%;
					font-size: 12px;
				}
				
				.mineinfo-course-order-item-middle{
					width: 100%;
					margin-top: 12rpx;
					
					.mineinfo-course-order-item-middle-title{
						width: 100%;
						font-size: 12px;
						color: #999;
					}
					
					.mineinfo-course-order-item-middle-body{
						width: 100%;
						display: flex;
						align-items: center;
						margin-top: 12rpx;
						
						.mineinfo-course-order-item-middle-body-left{
							width: calc(100% - 120rpx);
							
							.mineinfo-course-order-item-middle-body-left-in{
								width: 100%;
								display: flex;
								align-items: center;
								flex-direction: row;
								flex-wrap: nowrap;
							}
							
							.mineinfo-course-order-item-middle-body-left-item{
								display: flex;
								align-items: center;
								justify-content: center;
								flex-direction: column;
								width: 120rpx;
								margin-right: 36rpx;
								
								.mineinfo-course-order-item-middle-body-left-item-img{
									width: 120rpx;
									height: 80rpx;
									border-radius: 12rpx;
								}
								
								.mineinfo-course-order-item-middle-body-left-item-text{
									font-size: 11px;
									margin-top: 6rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 1;
									-webkit-box-orient: vertical;
									width: 120rpx;
									text-align: center;
								}
							}
						}
						
						.mineinfo-course-order-item-middle-body-right{
							width: 120rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
							flex-shrink: 0;
							
							.mineinfo-course-order-item-middle-body-right-top{
								font-size: 13px;
								font-weight: bold;
								margin-bottom: 12rpx;
							}
							
							.mineinfo-course-order-item-middle-body-right-bottom{
								font-size: 12px;
							}
						}
					}
				}
				
				.mineinfo-course-order-item-bottom{
					width: 100%;
					margin-top: 12rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.mineinfo-course-order-item-bottom-left{
						font-size: 12px;
					}
					
					.mineinfo-course-order-item-bottom-right{
						display: flex;
						align-items: center;
						
						.mineinfo-course-order-item-bottom-right-button-one{
							width: 130rpx;
							height: 50rpx;
							border-radius: 12rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							box-sizing: border-box;
							border: 1rpx solid #333;
							color: #333;
							white-space: nowrap;
							font-size: 12px;
						}
						
						.mineinfo-course-order-item-bottom-right-button-two{
							width: 130rpx;
							height: 50rpx;
							border-radius: 12rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-left: 24rpx;
							box-sizing: border-box;
							border: 1rpx solid #4F68B0;
							color: #4F68B0;
							white-space: nowrap;
							font-size: 12px;
						}
					}
				}
			}
		}
	}
</style>