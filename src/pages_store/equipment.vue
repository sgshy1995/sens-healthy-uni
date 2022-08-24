<template>
	<scroll-view scroll-y class="course-wrapper">
		<view class="course-top">
			<view class="course-top-left" @click="handleChangeType('course')">
				<image class="course-top-left-icon" src="@/static/images/store/switch.png"></image>
				<text class="course-top-left-text">课程</text>
			</view>
			<view class="course-top-center">
				器材商城
			</view>
			<view class="course-top-right">
				zhanwei
			</view>
		</view>
		<view class="equ-search">
			<u-search shape="square" :show-action="false"></u-search>
			<view class="equ-icon">
				<!-- <image class="equ-icon-img" src="@/static/images/store/order.png"></image> -->
				<u-icon name="order" color="#333" size="22"></u-icon>
				<view class="badge-box" :class="{'less99': orders <= 99 && orders >= 10, 'less10': orders <10}" v-if="orders">
					<u-badge numberType="overflow" type="error" max="99" :value="orders"></u-badge>
				</view>
			</view>
		</view>
		<view class="course-recommend">
			<view class="course-recommend-body">
				<u-swiper :list="list6" @change="e => currentNum = e.current" :autoplay="true"
					indicatorStyle="right: 20px">
					<view slot="indicator" class="indicator-num">
						<text class="indicator-num__text">{{ currentNum + 1 }}/{{ list6.length }}</text>
					</view>
				</u-swiper>
			</view>
		</view>
		<view class="equ-all">
			<scroll-view scroll-x class="equ-all-swip">
				<view class="equ-all-swip-in">
					<view class="equ-all-swip-item" @click="handleChangeSwitchType(index)" v-for="(u,index) in switchList" :key="index" :class="{active: index === switchType}">
						<text class="equ-all-swip-item-text">{{ u }}</text>
					</view>
					<view class="equ-all-swip-item last-item">
						<image class="equ-all-swip-item-logo" src="@/static/images/recovery/classify.png">
						<text class="equ-all-swip-item-text">筛选</text>
					</view>
				</view>
			</scroll-view>
			<view class="equ-all-shops" v-if="switchType === 0">
				<view class="equ-all-shops-item" v-for="(u,index) in commodityHotList" :key="u.id">
					<image :src="u.thumb" class="equ-all-shops-item-img"></image>
					<view class="equ-all-shops-item-info">
						<view class="equ-all-shops-item-info-left">
							<view class="equ-all-shops-item-info-name">
								{{ u.title }}
							</view>
							<view class="equ-all-shops-item-info-price">
								<text v-if="!u.if_discount">¥ {{ u.price }}</text>
								<text v-else>
									<text class="in-discount">¥ {{ u.price }}</text>
									<text class="show-discount">¥ {{ u.discount_price }}</text>
								</text>
							</view>
							<view class="equ-all-shops-item-info-sales">
								已售：{{ u.sales }}
							</view>
						</view>
						<view class="equ-all-shops-item-info-right">
							<u-icon name="shopping-cart" color="#333" size="24"></u-icon>
						</view>
					</view>
					<view class="equ-all-shops-item-hot" v-if="u.if_hot">
						<image class="equ-all-shops-item-hot-img" src="@/static/images/store/hot-white.png"></u-icon>
					</view>
					<view class="equ-all-shops-item-discount" v-if="u.if_discount">
						-{{ u.discount }}
					</view>
				</view>
			</view>
			
			<view class="equ-all-shops" v-if="switchType === 1">
				<view class="equ-all-shops-item" v-for="(u,index) in commodityDiscountList" :key="u.id">
					<image :src="u.thumb" class="equ-all-shops-item-img"></image>
					<view class="equ-all-shops-item-info">
						<view class="equ-all-shops-item-info-left">
							<view class="equ-all-shops-item-info-name">
								{{ u.title }}
							</view>
							<view class="equ-all-shops-item-info-price">
								<text v-if="!u.if_discount">¥ {{ u.price }}</text>
								<text v-else>
									<text class="in-discount">¥ {{ u.price }}</text>
									<text class="show-discount">¥ {{ u.discount_price }}</text>
								</text>
							</view>
							<view class="equ-all-shops-item-info-sales">
								已售：{{ u.sales }}
							</view>
						</view>
						<view class="equ-all-shops-item-info-right">
							<u-icon name="shopping-cart" color="#333" size="24"></u-icon>
						</view>
					</view>
					<view class="equ-all-shops-item-hot" v-if="u.if_hot">
						<image class="equ-all-shops-item-hot-img" src="@/static/images/store/hot-white.png"></u-icon>
					</view>
					<view class="equ-all-shops-item-new" v-if="u.if_new">
						<image class="equ-all-shops-item-new-img" src="@/static/images/store/new-white.png"></u-icon>
					</view>
					<view class="equ-all-shops-item-discount" v-if="u.if_discount">
						-{{ u.discount }}
					</view>
				</view>
			</view>
			
			<view class="equ-all-shops" v-if="switchType === 2">
				<view class="equ-all-shops-item" v-for="(u,index) in commodityNewList" :key="u.id">
					<image :src="u.thumb" class="equ-all-shops-item-img"></image>
					<view class="equ-all-shops-item-info">
						<view class="equ-all-shops-item-info-left">
							<view class="equ-all-shops-item-info-name">
								{{ u.title }}
							</view>
							<view class="equ-all-shops-item-info-price">
								<text v-if="!u.if_discount">¥ {{ u.price }}</text>
								<text v-else>
									<text class="in-discount">¥ {{ u.price }}</text>
									<text class="show-discount">¥ {{ u.discount_price }}</text>
								</text>
							</view>
							<view class="equ-all-shops-item-info-sales">
								已售：{{ u.sales }}
							</view>
						</view>
						<view class="equ-all-shops-item-info-right">
							<u-icon name="shopping-cart" color="#333" size="24"></u-icon>
						</view>
					</view>
					<view class="equ-all-shops-item-new" v-if="u.if_new">
						<image class="equ-all-shops-item-new-img" src="@/static/images/store/new-white.png"></u-icon>
					</view>
					<view class="equ-all-shops-item-discount" v-if="u.if_discount">
						-{{ u.discount }}
					</view>
				</view>
			</view>
			
			<view class="equ-all-shops" v-if="switchType === 3">
				<view class="equ-all-shops-item" v-for="(u,index) in commodityAllList" :key="u.id">
					<image :src="u.thumb" class="equ-all-shops-item-img"></image>
					<view class="equ-all-shops-item-info">
						<view class="equ-all-shops-item-info-left">
							<view class="equ-all-shops-item-info-name">
								{{ u.title }}
							</view>
							<view class="equ-all-shops-item-info-price">
								<text v-if="!u.if_discount">¥ {{ u.price }}</text>
								<text v-else>
									<text class="in-discount">¥ {{ u.price }}</text>
									<text class="show-discount">¥ {{ u.discount_price }}</text>
								</text>
							</view>
							<view class="equ-all-shops-item-info-sales">
								已售：{{ u.sales }}
							</view>
						</view>
						<view class="equ-all-shops-item-info-right">
							<u-icon name="shopping-cart" color="#333" size="24"></u-icon>
						</view>
					</view>
					<view class="equ-all-shops-item-hot" v-if="u.if_hot">
						<image class="equ-all-shops-item-hot-img" src="@/static/images/store/hot-white.png"></u-icon>
					</view>
					<view class="equ-all-shops-item-new" v-if="u.if_new">
						<image class="equ-all-shops-item-new-img" src="@/static/images/store/new-white.png"></u-icon>
					</view>
					<view class="equ-all-shops-item-discount" v-if="u.if_discount">
						-{{ u.discount }}
					</view>
				</view>
			</view>
		</view>
		<view class="shopping-cart">
			<u-icon name="shopping-cart-fill" color="#fff" size="26"></u-icon>
			<view class="badge-box" :class="{'less99': charts <= 99 && charts >= 10, 'less10': charts <10}" v-if="charts">
				<u-badge numberType="overflow" type="error" max="99" :value="charts"></u-badge>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				switchType: 0,
				switchList: ['热销', '折扣', '新品', '全部'],
				orders: 12,
				charts: 8,
				currentNum: 0,
				commodityHotList: [{
						id: '1',
						thumb: require('@/static/images/store/sport/1.jpeg'),
						tags: ['运动康复', '腰椎'],
						title: '弹力绳',
						avatar: require('@/static/images/index/lidashi.jpg'),
						description: '骨关节术后/运动损伤康复套餐，1次一对一评估，6次在线康复指导',
						author: '李大师',
						sales: 3306,
						price: '1130',
						discount: '50%',
						discount_price: '565',
						if_discount: 1,
						if_hot: 1
					},
					{
						id: '2',
						thumb: require('@/static/images/store/sport/2.jpeg'),
						tags: ['运动康复', '头部'],
						title: '瑜伽砖',
						description: '脑卒中康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 1198,
						price: '2000',
						discount: '20%',
						discount_price: '1600',
						if_discount: 1,
						if_hot: 1
					},
					{
						id: '3',
						thumb: require('@/static/images/store/sport/3.jpeg'),
						tags: ['运动康复', '腹部'],
						title: '瑜伽垫',
						description: '产后康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 309,
						price: '3000',
						discount: '',
						discount_price: '',
						if_discount: 0,
						if_hot: 1
					},
					{
						id: '4',
						thumb: require('@/static/images/store/sport/4.jpeg'),
						tags: ['运动康复', '其他'],
						title: '跳绳',
						description: '风湿病运动治疗，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 1109,
						price: '1199',
						discount: '',
						discount_price: '',
						if_discount: 0,
						if_hot: 1
					},
					{
						id: '5',
						thumb: require('@/static/images/store/sport/5.jpeg'),
						tags: ['运动康复', '骨盆'],
						title: '哑铃（一对）',
						description: '骨盆前倾改善，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 1109,
						price: '999',
						discount: '',
						discount_price: '',
						if_discount: 0,
						if_hot: 1
					},
					{
						id: '6',
						thumb: require('@/static/images/store/sport/6.jpeg'),
						tags: ['运动康复', '骨盆'],
						title: '健身环',
						description: '骨盆前倾改善，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 389,
						price: '199',
						discount: '',
						discount_price: '',
						if_discount: 0,
						if_hot: 1
					},
					{
						id: '7',
						thumb: require('@/static/images/store/sport/7.jpeg'),
						tags: ['运动康复', '骨盆'],
						title: '健腹轮',
						description: '骨盆前倾改善，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 208,
						price: '310',
						discount: '',
						discount_price: '',
						if_discount: 0,
						if_new: 1
					}
				],
				commodityNewList: [{
						id: '1',
						thumb: require('@/static/images/store/sport/1.jpeg'),
						tags: ['运动康复', '腰椎'],
						title: '弹力绳',
						avatar: require('@/static/images/index/lidashi.jpg'),
						description: '骨关节术后/运动损伤康复套餐，1次一对一评估，6次在线康复指导',
						author: '李大师',
						sales: 3306,
						price: '1130',
						discount: '50%',
						discount_price: '565',
						if_discount: 1,
						if_new: 1
					},
					{
						id: '2',
						thumb: require('@/static/images/store/sport/2.jpeg'),
						tags: ['运动康复', '头部'],
						title: '瑜伽砖',
						description: '脑卒中康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 1198,
						price: '2000',
						discount: '20%',
						discount_price: '1600',
						if_discount: 1,
						if_new: 1
					},
					{
						id: '3',
						thumb: require('@/static/images/store/sport/3.jpeg'),
						tags: ['运动康复', '腹部'],
						title: '瑜伽垫',
						description: '产后康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 309,
						price: '3000',
						discount: '',
						discount_price: '',
						if_discount: 0,
						if_new: 1
					}
				],
				commodityDiscountList: [{
						id: '1',
						thumb: require('@/static/images/store/sport/1.jpeg'),
						tags: ['运动康复', '腰椎'],
						title: '弹力绳',
						avatar: require('@/static/images/index/lidashi.jpg'),
						description: '骨关节术后/运动损伤康复套餐，1次一对一评估，6次在线康复指导',
						author: '李大师',
						sales: 3306,
						price: '1130',
						discount: '50%',
						discount_price: '565',
						if_discount: 1,
						if_new: 1,
						if_hot: 1
					},
					{
						id: '2',
						thumb: require('@/static/images/store/sport/2.jpeg'),
						tags: ['运动康复', '头部'],
						title: '瑜伽砖',
						description: '脑卒中康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 1198,
						price: '2000',
						discount: '20%',
						discount_price: '1600',
						if_discount: 1,
						if_new: 1,
						if_hot: 0
					},
					{
						id: '3',
						thumb: require('@/static/images/store/sport/3.jpeg'),
						tags: ['运动康复', '腹部'],
						title: '瑜伽垫',
						description: '产后康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 309,
						price: '3000',
						discount: '30%',
						discount_price: '2100',
						if_discount: 1,
						if_new: 0,
						if_hot: 0
					}
				],
				commodityAllList: [{
						id: '1',
						thumb: require('@/static/images/store/sport/1.jpeg'),
						tags: ['运动康复', '腰椎'],
						title: '弹力绳',
						avatar: require('@/static/images/index/lidashi.jpg'),
						description: '骨关节术后/运动损伤康复套餐，1次一对一评估，6次在线康复指导',
						author: '李大师',
						sales: 3306,
						price: '1130',
						discount: '50%',
						discount_price: '565',
						if_discount: 1,
						if_new: 1,
						if_hot: 1
					},
					{
						id: '2',
						thumb: require('@/static/images/store/sport/2.jpeg'),
						tags: ['运动康复', '头部'],
						title: '瑜伽砖',
						description: '脑卒中康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 1198,
						price: '2000',
						discount: '',
						discount_price: '',
						if_discount: 0,
						if_new: 1,
						if_hot: 0
					},
					{
						id: '3',
						thumb: require('@/static/images/store/sport/3.jpeg'),
						tags: ['运动康复', '腹部'],
						title: '瑜伽垫',
						description: '产后康复套餐，1次一对一评估，6次在线康复指导',
						avatar: require('@/static/images/index/lidashi.jpg'),
						author: '李大师',
						sales: 309,
						price: '3000',
						discount: '30%',
						discount_price: '2100',
						if_discount: 1,
						if_new: 0,
						if_hot: 0
					},
					{
							id: '4',
							thumb: require('@/static/images/store/sport/4.jpeg'),
							tags: ['运动康复', '腰椎'],
							title: '健身环',
							avatar: require('@/static/images/index/lidashi.jpg'),
							description: '骨关节术后/运动损伤康复套餐，1次一对一评估，6次在线康复指导',
							author: '李大师',
							sales: 3306,
							price: '1130',
							discount: '50%',
							discount_price: '565',
							if_discount: 1,
							if_new: 1,
							if_hot: 1
						},
						{
							id: '5',
							thumb: require('@/static/images/store/sport/5.jpeg'),
							tags: ['运动康复', '头部'],
							title: '回弹盘',
							description: '脑卒中康复套餐，1次一对一评估，6次在线康复指导',
							avatar: require('@/static/images/index/lidashi.jpg'),
							author: '李大师',
							sales: 1198,
							price: '2000',
							discount: '20%',
							discount_price: '1600',
							if_discount: 1,
							if_new: 1,
							if_hot: 0
						},
						{
							id: '6',
							thumb: require('@/static/images/store/sport/6.jpeg'),
							tags: ['运动康复', '腹部'],
							title: '腹肌撕裂者',
							description: '产后康复套餐，1次一对一评估，6次在线康复指导',
							avatar: require('@/static/images/index/lidashi.jpg'),
							author: '李大师',
							sales: 309,
							price: '3000',
							discount: '30%',
							discount_price: '2100',
							if_discount: 1,
							if_new: 0,
							if_hot: 0
						}
				],
				list6: [
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				]
			}
		},
		methods: {
			handleShowItem(record) {

			},
			handleChangeType(type) {
				this.$emit('changeType', type)
			},
			handleChangeSwitchType(index){
				this.switchType = index
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
		
		.shopping-cart{
			position: fixed;
			right: 24rpx;
			bottom: 140rpx;
			width: 80rpx;
			height: 80rpx;
			background: #4F68B0;
			box-shadow: rgba(79,104,176, 0.3) 0px 14px 24px, rgba(79,104,176, 0.22) 0px 9px 8px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.badge-box{
				position: absolute;
				right: -16rpx;
				top: 6rpx;
				
				&.less99{
					right: -4rpx;
				}
				
				&.less10{
					right: 8rpx;
				}
			}
		}

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

		.equ-search {
			width: 100%;
			box-sizing: border-box;
			padding: 0 24rpx;
			margin-top: 36rpx;
			position: relative;
			display: flex;
			align-items: center;
			
			.equ-icon{
				width: 64rpx;
				height: 64rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 12rpx;
				box-sizing: border-box;
				//border: 1px solid #333;
				margin-left: 24rpx;
				position: relative;
				background: #f2f2f2;
				
				.equ-icon-img{
					width: 36rpx;
					height: 36rpx;
				}
				
				.badge-box{
					position: absolute;
					right: -24rpx;
					top: -6rpx;
					
					&.less99{
						right: -12rpx;
					}
					
					&.less10{
						right: 0rpx;
					}
				}
			}

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
				box-sizing: border-box;
				padding: 0 24rpx;
				
				.indicator-num {
					padding: 2px 0;
					background-color: rgba(0, 0, 0, 0.35);
					border-radius: 100px;
					width: 35px;
					display: flex;
					justify-content: center;
				
					&__text {
						color: #FFFFFF;
						font-size: 12px;
					}
				}

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

		.equ-all {
			width: 100%;
			margin-top: 24rpx;
			
			.equ-all-swip{
				width: 100%;
				box-sizing: border-box;
				padding: 0 24rpx;
				
				.equ-all-swip-in{
					width: 100%;
					display: flex;
					align-items: center;
					
					.equ-all-swip-item{
						width: 180rpx;
						height: 60rpx;
						border: 1px solid #F6F6F6;
						border-radius: 12rpx;
						font-size: 12px;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 24rpx;
						transition: all 0.3s;
						font-weight: 700;
						
						&.active{
							border-color: #4F68B0;
							background: #4F68B0;
							color: #fff;
						}
						
						&.last-item{
							border-color: #333;
							
							.equ-all-swip-item-logo{
								width: 30rpx;
								height: 30rpx;
								margin-right: 12rpx;
							}
						}
					}
				}
			}
		
			.equ-all-shops{
				width: 100%;
				margin-top: 24rpx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				align-items: center;
				background: #fff;
				box-sizing: border-box;
				padding: 0 24rpx;
				
				.equ-all-shops-item{
					width: 47%;
					margin-bottom: 24rpx;
					position: relative;
					overflow: hidden;
					
					.equ-all-shops-item-hot{
						position: absolute;
						top: 0;
						left: 0;
						width: 0;
						height: 0;
						border: 40rpx solid;
						border-color: #F4595B transparent transparent #F4595B;
						display: flex;
						align-items: center;
						justify-content: center;
						border-top-left-radius: 24rpx;
						z-index: 2;
						
						.equ-all-shops-item-hot-img{
							width: 32rpx;
							height: 32rpx;
							position: absolute;
							top: -30rpx;
							left: -30rpx;
						}
					}
					
					.equ-all-shops-item-new{
						position: absolute;
						top: 0;
						left: 0;
						width: 0;
						height: 0;
						border: 40rpx solid;
						border-color: #44D292 transparent transparent #44D292;
						display: flex;
						align-items: center;
						justify-content: center;
						border-top-left-radius: 24rpx;
						z-index: 1;
						
						.equ-all-shops-item-new-img{
							width: 32rpx;
							height: 32rpx;
							position: absolute;
							top: -30rpx;
							left: -30rpx;
						}
					}
					
					.equ-all-shops-item-discount{
						position: absolute;
						top: 12rpx;
						right: 12rpx;
						background: #F4595B;
						border-radius: 6rpx;
						box-sizing: border-box;
						padding: 2rpx 6rpx;
						font-size: 10px;
						color: #fff;
						font-weight: 700;
					}
					
					.equ-all-shops-item-img{
						width: 100%;
						border-radius: 24rpx;
						height: 200rpx;
					}
					
					.equ-all-shops-item-info{
						margin-top: 12rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						.equ-all-shops-item-info-left{
							display: flex;
							flex-direction: column;
							
							.equ-all-shops-item-info-name{
								font-size: 14px;
								font-weight: 700;
								flex-shrink: 0;
								white-space: nowrap;
							}
							
							.equ-all-shops-item-info-price{
								font-size: 14px;
								font-weight: 700;
								color: #4F68B0;
								flex-shrink: 0;
								white-space: nowrap;
								
								.in-discount{
									text-decoration:line-through;
									color: #999;
								}
								
								.show-discount{
									color: #4F68B0;
									padding-left: 12rpx;
								}
							}
							
							.equ-all-shops-item-info-sales{
								font-size: 10px;
								color: #999;
								flex-shrink: 0;
								white-space: nowrap;
							}
						}
						
						.equ-all-shops-item-info-right{
							width: 60rpx;
							height: 60rpx;
							background: #F2F2F2;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
		}
	}
</style>
