<template>
	<view class="payment-wrapper">
		<view class="payment-top">
			<u-status-bar></u-status-bar>
			<view class="payment-top-back">
				<view class="payment-top-back-in" @click="handleBack">
					<image class="payment-top-back-in-img" src="@/static/images/store/back.png"></image>
				</view>
				<view class="payment-top-title">
					<text>课程订单</text>
				</view>
				<view class="payment-top-right"></view>
			</view>
		</view>
		<view class="payment-bottom">
			<view class="payment-bottom-title">共{{ totalInfo.course }}个课程</view>
			<view class="payment-bottom-sub">
				<view class="payment-bottom-sub-left">
					<image src="@/static/images/store/order-list.png" class="payment-bottom-sub-img"></image>
					<text class="payment-bottom-sub-text">购物清单</text>
				</view>
				<view class="payment-bottom-sub-center"></view>
				<view class="payment-bottom-sub-right">
					<text class="payment-bottom-sub-total">{{ totalInfo.course }}件</text>
				</view>
			</view>
			<view class="payment-bottom-course-all">
				<mescroll-uni ref="mescroll" :down="{use: false}"
					:up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
					<view class="payment-bottom-course">
						<view class="payment-bottom-course-divider">
							<u-divider text="课程"></u-divider>
						</view>
						<view class="payment-bottom-course-in">
							<view class="payment-bottom-course-item" v-for="(u,index) in courses" :key="u.id">
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
													<text
														class="tag-in-text">{{ u.add_course_type ? '面对面康复指导' : '专业能力提升' }}</text>
													<text class="tag-in-point">·</text>
												</text>
												<text class="item-right-tag-in">
													<text
														class="tag-in-text">{{ u.course_info.course_type_show }}</text>
													<text class="tag-in-point">·</text>
												</text>
												<text class="item-right-tag-in">
													<text
														class="tag-in-text">{{ u.add_course_type ? `${u.course_info.live_num}次直播` : `${u.course_info.video_num}视频` }}</text>
												</text>
											</view>
											<view class="body-item-top-right-description">
												{{ u.course_info.description }}</view>
											<view class="body-item-top-right-price">
												售价: <text class="body-item-top-right-price-in"
													v-if="!u.course_info.is_discount">¥ {{ u.course_info.price }}</text>
												<text class="body-item-top-right-price-in" v-else>
													<text class="in-discount">¥ {{ u.course_info.price }}</text>
													<text class="show-discount">¥ {{ u.course_info.discount }}</text>
												</text>
											</view>
										</view>
									</view>
									<view class="body-item-bottom">

									</view>
								</view>
							</view>
						</view>
					</view>
					<u-safe-bottom></u-safe-bottom>
				</mescroll-uni>
			</view>
		</view>
		<view class="payment-footer">
			<view class="payment-footer-in">
				<view class="payment-footer-in-one">
					<view class="payment-footer-in-one-top">
						<view class="payment-footer-in-one-top-left" v-if="payment_type === 0">
							<image src="@/static/images/mine/balance.png" class="payment-footer-in-one-top-left-img"></image>
							<text class="payment-footer-in-one-top-left-text">余额支付<text class="payment-footer-in-one-top-left-text-in">余额: {{ info.balance }}</text></text>
						</view>
						<view class="payment-footer-in-one-top-left" v-if="payment_type === 1">
							<image src="@/static/images/payment/payment-wechat.png" class="payment-footer-in-one-top-left-img"></image>
							<text class="payment-footer-in-one-top-left-text">微信支付</text>
						</view>
						<view class="payment-footer-in-one-top-left" v-if="payment_type === 2">
							<image src="@/static/images/payment/payment-alipay.png" class="payment-footer-in-one-top-left-img"></image>
							<text class="payment-footer-in-one-top-left-text">支付宝支付</text>
						</view>
						<view class="payment-footer-in-one-top-right" @click="handleShowPick">
							其他支付方式 >
						</view>
					</view>
					<view class="payment-footer-in-one-bottom">
						<text class="payment-footer-in-one-left">共计费用</text>
						<text class="payment-footer-in-one-right">¥ {{ mount }}</text>
					</view>
				</view>
				<view class="payment-footer-in-two">
					<view class="payment-footer-right" @click="handleBuyChart" v-if="payment_origin === 'chart'">
						<text class="payment-footer-right-buy">立即购买</text>
					</view>
					<view class="payment-footer-right" @click="handleBuyNormal" v-else>
						<text class="payment-footer-right-buy">立即购买</text>
					</view>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
		<u-popup :show="showPick" @close="handleClosePick" @open="handleShowPick">
			<view class="confirm-start">
				<view class="confirm-start-title">选择支付方式</view>
				<view class="confirm-start-body">
					<view class="confirm-start-item" @click="handleChangePayment(1)" :class="{active: payment_type === 1}">
						<view class="confirm-start-item-left">
							<image src="@/static/images/payment/payment-wechat.png" class="confirm-start-item-left-img">
							</image>
							<text class="confirm-start-item-left-text">微信支付</text>
						</view>
					</view>
					<view class="confirm-start-item" @click="handleChangePayment(2)" :class="{active: payment_type === 2}">
						<view class="confirm-start-item-left">
							<image src="@/static/images/payment/payment-alipay.png" class="confirm-start-item-left-img">
							</image>
							<text class="confirm-start-item-left-text">支付宝支付</text>
						</view>
					</view>
					<view class="confirm-start-item-new" @click="handleChangePayment(0)" :class="{active: payment_type === 0, disabled}">
						<view class="confirm-start-item-top">
							<view class="confirm-start-item-left">
								<image src="@/static/images/mine/balance.png" class="confirm-start-item-left-img">
								</image>
								<text class="confirm-start-item-left-text">{{ disabled ? '余额不足' : '余额支付' }}</text>
							</view>
						</view>
						<view class="confirm-start-item-bottom">
							账户余额余额: {{ info.balance }}
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		addChartCourseOrderByUserIdAction,
		addNormalCourseOrderByUserIdAction
	} from '@/service/service'
	export default {
		data() {
			return {
				totalInfo: {
					course: 0,
					equipment: 0,
					originCourseTotal: 0,
					discountCourseTotal: 0,
					originEquipmentTotal: 0,
					discountEquipmentTotal: 0,
					course_num: 0,
					equipment_num: 0
				},
				courses: [],
				equipments: [],
				real_equipments: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				mount: '',
				payment_type: 1,
				showPick: false,
				order_time: '',
				payment_origin: 'chart'
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.user.userInfo
			},
			info() {
				return this.$store.state.user.info
			},
			disabled() {
				return Number(this.info.balance) < Number(this.mount)
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
				if (data.totalInfo) that.totalInfo = {
					...data.totalInfo
				}
				if (data.courses) that.courses = [...data.courses]
				console.log('that.courses', that.courses)
				if (data.mount) that.mount = data.mount
				if (data.order_time) that.order_time = data.order_time
				if (data.payment_origin) that.payment_origin = data.payment_origin
				that.$nextTick(() => {

				})
			})
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
			handleShowSuccess(course, live_course, video_course, equipment, count) {
				const that = this
				uni.redirectTo({
					url: `/pages_store/payment-course-success?course=${course}&live_course=${live_course}&video_course=${video_course}&count=${count}`
				})
			},
			handleBuyChart() {
				if(this.payment_type !== 0){
					this.$loadingOn(`模拟调取${this.payment_type === 1 ? '微信' : this.payment_type === 2 ? '支付宝' : 'Apple Pay'}支付API`)
				}else{
					this.$loadingOn('正在处理订单')
				}
				setTimeout(() => {
					this.$loadingOn('正在模拟生成订单记录')
					setTimeout(() => {
						const coursesIn = this.courses.map(item=>item.course_info)
						addChartCourseOrderByUserIdAction({
							course_chart_ids: this.courses.map(item=>item.id).join(),
							course_info: {
								course_ids: coursesIn.map(item=>item.id).join(),
								course_types: this.courses.map(item=>item.add_course_type).join(),
								payment_num: this.mount.toString()
							},
							order_time: this.order_time,
							payment_type: this.payment_type,
						}).then(res => {
							const live_course_num = this.courses.filter(item=>item.add_course_type === 1)
							const video_course_num = this.courses.filter(item=>item.add_course_type === 0)
							this.handleShowSuccess(coursesIn.length, live_course_num, video_course_num, 0, this.mount)
							this.$loadingOff()
						}).catch(err => {
							this.$loadingOff()
						})
					}, 2000);
				}, 2000);
			},
			handleBuyNormal(){
				console.log(1111)
				if(this.payment_type !== 0){
					this.$loadingOn(`模拟调取${this.payment_type === 1 ? '微信' : this.payment_type === 2 ? '支付宝' : 'Apple Pay'}支付API`)
				}else{
					this.$loadingOn('正在处理订单')
				}
				setTimeout(() => {
					console.log(2222)
					this.$loadingOn('正在模拟生成订单记录')
					setTimeout(() => {
						console.log(3333)
						const coursesIn = this.courses.map(item=>item.course_info)
						console.log(4444)
						addNormalCourseOrderByUserIdAction({
							course_info: {
								course_ids: coursesIn.map(item=>item.id).join(),
								course_types: this.courses.map(item=>item.add_course_type).join(),
								payment_num: this.mount.toString()
							},
							order_time: this.order_time,
							payment_type: this.payment_type,
						}).then(res => {
							console.log(5555)
							const live_course_num = this.courses.filter(item=>item.add_course_type === 1)
							const video_course_num = this.courses.filter(item=>item.add_course_type === 0)
							this.handleShowSuccess(coursesIn.length, live_course_num, video_course_num, 0, this.mount)
							this.$loadingOff()
						}).catch(err => {
							console.log(6666)
							this.$loadingOff()
						})
					}, 2000);
				}, 2000);
			},
			handleChangePayment(type){
				if(type === 0 && this.disabled){
					return
				}
				this.payment_type = type
				this.handleClosePick()
			},
			handleClosePick(){
				this.showPick = false
			},
			handleShowPick(){
				this.showPick = true
			}
		},
	}
</script>

<style lang="scss">
	.confirm-start{
		width: 100vw;
		box-sizing: border-box;
		padding: 36rpx 36rpx 0 36rpx;
		
		.confirm-start-title{
			width: 100%;
			font-size: 14px;
			font-weight: bold;
			color: #333;
		}
		
		.confirm-start-body{
			width: 100%;
			margin-top: 24rpx;
			
			.confirm-start-item{
				width: 100%;
				box-sizing: border-box;
				margin-bottom: 12rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 24rpx;
				border-radius: 24rpx;
				border: 1px solid #fff;
				
				&.last-one{
					margin-bottom: 0;
				}
				
				.confirm-start-item-left{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.confirm-start-item-left-img{
						width: 48rpx;
						height: 48rpx;
						margin-right: 12rpx;
					}
					
					.confirm-start-item-left-text{
						font-size: 14px;
						color: #333;
					}
				}
				
				&.active{
					border: 1px solid #4F68B0;
				}
			}
			
			.confirm-start-item-new{
				width: 100%;
				box-sizing: border-box;
				padding: 24rpx;
				margin-bottom: 12rpx;
				border-radius: 24rpx;
				border: 1px solid #fff;
				position: relative;
				
				&.last-one{
					margin-bottom: 0;
				}
				
				.confirm-start-item-top{
					width: 100%;
				}
				
				.confirm-start-item-bottom{
					font-size: 12px;
					margin-top: 12rpx;
					color: #999;
				}
				
				.confirm-start-item-left{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.confirm-start-item-left-img{
						width: 48rpx;
						height: 48rpx;
						margin-right: 12rpx;
					}
					
					.confirm-start-item-left-text{
						font-size: 14px;
						color: #333;
					}
				}
				
				
				&.active{
					border: 1px solid #4F68B0;
				}
				
				&.disabled{
					border: none;
					
					&::before{
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						background: rgba(0,0,0,0.1);
						display: block;
						content: ' ';
						border-radius: 24rpx;
						z-index: 1;
					}

				}
			}
		}
		
	}
	
	.payment-footer {
		position: fixed;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		width: 100%;
		z-index: 99;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px, rgba(149, 157, 165, 0.2) 0px 8px 24px inset;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		background: #fff;

		.payment-footer-in {
			width: 100%;
			box-sizing: border-box;
			padding: 12rpx 48rpx 24rpx 48rpx;

			.payment-footer-in-one {
				width: 100%;

				.payment-footer-in-one-top {
					width: 100%;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
					
					.payment-footer-in-one-top-left{
						display: flex;
						align-items: center;
						
						.payment-footer-in-one-top-left-img{
							width: 36rpx;
							height: 36rpx;
							margin-right: 8rpx;
						}
						
						.payment-footer-in-one-top-left-text{
							font-size: 14px;
							
							.payment-footer-in-one-top-left-text-in{
								font-size: 12px;
								padding-left: 12rpx;
								color: #999;
							}
						}
					}
					
					.payment-footer-in-one-top-right{
						font-size: 14px;
						color: #4F68B0;
					}
				}

				.payment-footer-in-one-bottom {
					width: 100%;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
				}

				.payment-footer-in-one-left {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					white-space: nowrap;

					.payment-footer-in-one-left-left {

						.payment-footer-in-one-left-left-in {
							font-weight: bold;
							padding: 0 4rpx;
						}
					}

					.payment-footer-in-one-left-right {
						padding-left: 8rpx;
						font-size: 14px;
					}
				}

				.payment-footer-in-one-right {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					font-weight: bold;

					.payment-footer-in-one-right-price {
						font-size: 14px;

						.in-discount {
							text-decoration: line-through;
							color: rgba(3, 3, 3, 0.4);
							font-size: 14px;
						}

						.show-discount {
							color: #333;
							padding-left: 8rpx;
						}
					}
				}

				.payment-footer-icon-select {
					display: flex;
					justify-content: center;
					align-items: center;
					box-sizing: border-box;
					border: 1px solid #B0B3BC;
					height: 32rpx;
					width: 32rpx;
					border-radius: 6rpx;

					.payment-footer-icon-select-in {
						display: none;
					}

					&.active {
						border-color: #4F68B0;
						background: #4F68B0;

						.payment-footer-icon-select-in {
							display: block;
						}
					}
				}
			}

			.payment-footer-in-two {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.payment-footer-right {
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

				.payment-footer-right-buy {
					padding-right: 0;
				}

				&.disabled {
					background: #EBEDF0;
					color: #C8C9CC;
				}
			}
		}
	}

	.payment-wrapper {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #F7F7F7;

		.payment-bottom {
			margin-top: 24rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 0 32rpx;

			.payment-bottom-title {
				width: 100%;
				font-size: 14px;
				font-weight: bold;
			}

			.payment-bottom-sub {
				margin-top: 24rpx;
				width: 100%;
				display: flex;
				align-items: center;

				.payment-bottom-sub-left {
					display: flex;
					align-items: center;
					flex-shrink: 0;
					margin-right: 24rpx;
				}

				.payment-bottom-sub-center {
					flex-grow: 1;
					height: 1px;
					box-sizing: border-box;
					border-top: 1px dashed #333;
				}

				.payment-bottom-sub-right {
					display: flex;
					align-items: center;
					flex-shrink: 0;
					margin-left: 24rpx;
				}

				.payment-bottom-sub-img {
					width: 38rpx;
					height: 38rpx;
					margin-right: 12rpx;
				}

				.payment-bottom-sub-text {
					font-size: 14px;
				}

				.payment-bottom-sub-total {
					font-size: 14px;
					padding-left: 24rpx;
				}
			}

			.payment-bottom-course-all {
				width: 100%;
				margin-top: 24rpx;
				height: 1000rpx;
			}

			.payment-bottom-equipment {
				width: 100%;

				.payment-bottom-equipment-in {
					margin-top: 24rpx;
					width: 100%;

					.payment-bottom-equipment-item {
						width: 100%;
						margin-bottom: 36rpx;
						border-radius: 24rpx;
						display: flex;
						justify-content: space-between;
						background: #fff;
						box-sizing: border-box;
						padding: 24rpx;
						position: relative;

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

								&.disabled {
									border-color: #C8C9CC;
									background: #EBEDF0;

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
								height: 130rpx;
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
								height: 130rpx;

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

								.body-item-top-right-price {
									color: #333;
									font-size: 12px;
									margin-top: 10rpx;

									.body-item-top-right-price-in {
										font-weight: bold;
										padding-left: 4rpx;
									}

									.in-discount {
										text-decoration: line-through;
										color: #999;
									}

									.show-discount {
										color: #4F68B0;
										padding-left: 16rpx;
									}
								}
							}
						}

						.body-item-bottom {
							width: 100%;
							margin-top: 24rpx;

							.body-item-bottom-title {
								width: 100%;
								font-size: 12px;
								font-weight: bold;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
							}

							.body-item-bottom-body {
								width: 100%;

								.body-item-bottom-body-item {
									width: 100%;
									margin-top: 24rpx;
									display: flex;
									justify-content: space-between;
									position: relative;

									.body-model-delete {
										width: 36rpx;
										position: absolute;
										right: 0;
										top: 0;
									}

									.body-model-left {
										width: 100rpx;
										height: 60rpx;
										border-radius: 24rpx;
										margin-right: 24rpx;
										flex-shrink: 0;

										.body-model-left-img {
											width: 100%;
											height: 100%;
											border-radius: 24rpx;
										}
									}

									.body-model-righter {
										height: 100%;
										display: flex;
										align-items: center;
										justify-content: center;
										margin-left: 32rpx;
										flex-shrink: 0;
										white-space: nowrap;
										font-size: 14px;
									}

									.body-model-right {
										flex-grow: 1;
										position: relative;

										.body-model-right-title {
											width: 100%;
											font-size: 11px;
											font-weight: bold;
											overflow: hidden;
											text-overflow: ellipsis;
											display: -webkit-box;
											-webkit-line-clamp: 1;
											-webkit-box-orient: vertical;
										}

										.body-model-right-description {
											width: 100%;
											font-size: 11px;
											overflow: hidden;
											text-overflow: ellipsis;
											display: -webkit-box;
											-webkit-line-clamp: 1;
											-webkit-box-orient: vertical;
											color: #aaa;
											margin-top: 10rpx;
										}

										.body-model-right-price {
											color: #333;
											font-size: 11px;
											margin-top: 10rpx;

											.body-model-right-price-in {
												font-weight: bold;
												padding-left: 4rpx;
											}

											.in-discount {
												text-decoration: line-through;
												color: #999;
											}

											.show-discount {
												color: #4F68B0;
												padding-left: 16rpx;
											}
										}

										.body-model-right-select {
											margin-top: 10rpx;
										}

										.body-model-right-empty {
											position: absolute;
											top: 50%;
											left: 50%;
											box-sizing: border-box;
											border: 2px solid #999;
											color: #999;
											font-size: 13px;
											border-radius: 50%;
											transform: translate(-50%, -50%) rotate(30deg);
											display: flex;
											align-items: center;
											justify-content: center;
											flex-direction: column;
											width: 100rpx;
											height: 100rpx;
											opacity: 0.9;
											z-index: 3;

											&::after {
												content: ' ';
												display: block;
												width: 80rpx;
												height: 80rpx;
												border-radius: 50%;
												border: 1px dashed #999;
												position: absolute;
												top: 50%;
												left: 50%;
												transform: translate(-50%, -50%) rotate(30deg);
											}

											.body-model-right-empty-text {
												white-space: nowrap;
												font-weight: 800;
											}
										}
									}
								}
							}
						}
					}
				}
			}

			.payment-bottom-course {
				width: 100%;

				.payment-bottom-course-in {
					margin-top: 24rpx;
					width: 100%;

					.payment-bottom-course-item {
						width: 100%;
						margin-bottom: 36rpx;
						border-radius: 24rpx;
						display: flex;
						justify-content: space-between;
						background: #fff;
						box-sizing: border-box;
						padding: 24rpx;
						position: relative;

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

								.body-item-top-right-price {
									color: #333;
									font-size: 12px;
									margin-top: 10rpx;

									.body-item-top-right-price-in {
										font-weight: bold;
										padding-left: 4rpx;
									}

									.in-discount {
										text-decoration: line-through;
										color: #999;
									}

									.show-discount {
										color: #4F68B0;
										padding-left: 16rpx;
									}
								}
							}
						}
					}
				}
			}
		}

		.payment-top {
			width: 100%;
			position: relative;
			margin-top: 12rpx;

			.payment-top-back {
				width: 100%;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 36rpx;

				.payment-top-back-in {
					width: 48rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;

					.payment-top-back-in-img {
						width: 36rpx;
						height: 36rpx;
					}
				}

				.payment-top-title {
					width: 200rpx;
					font-size: 15px;
					font-weight: bold;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.payment-top-right {
					width: 48rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;

					.payment-top-right-img {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}

		}
	}
</style>
