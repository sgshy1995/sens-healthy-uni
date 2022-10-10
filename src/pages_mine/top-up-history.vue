<template>
	<view class="top-up-wrapper">
		<scroll-view scroll-y class="top-up">
			<view class="top-up-top">
				<view class="top-back" @click="close">
					<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
					<text>返回</text>
				</view>
				<text class="top-title">充值历史记录</text>
			</view>
			<view class="top-up-bottom">
				<view class="top-up-bottom-top">
					<u-tabs @change="handleChangeTabs" :list="listItems" lineWidth="30" lineColor="#4F68B0"
						:activeStyle="{
					            color: '#303133',
					            fontWeight: 'bold',
					            transform: 'scale(1.05)'
					        }" :inactiveStyle="{
					            color: '#606266',
					            transform: 'scale(1)'
					        }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;">
					</u-tabs>
				</view>
				<view class="top-up-bottom-center">
					<text class="top-up-bottom-center-one" :class="{active: sort === 'desc'}" @click="handleChangeSort('desc')">倒序</text>
					<text class="top-up-bottom-center-two">/</text>
					<text class="top-up-bottom-center-three" :class="{active: sort === 'asc'}" @click="handleChangeSort('asc')">正序</text>
				</view>
				<view class="top-up-bottom-bottom">
					<view class="top-up-bottom-bottom-empty" v-if="!dataSource.length">
						<image src="@/static/images/recovery/empty-data.png" class="top-up-bottom-bottom-empty-img"></image>
						<text class="top-up-bottom-bottom-empty-text">暂无充值订单信息</text>
					</view>
					<view class="top-up-bottom-bottom-item" v-for="(u,index) in dataSource" :key="u.id" :class="{'last-one': index === dataSource.length - 1}">
						<view class="top-up-bottom-bottom-item-title">
							<text class="top-up-bottom-bottom-item-title-left">单笔充值<text class="top-up-bottom-bottom-item-title-left-in">¥{{ u.payment_num }}</text></text>
						</view>
						<view class="top-up-bottom-bottom-item-payment-time">{{ u.payment_time_show }}</view>
						<view class="top-up-bottom-bottom-item-order-no">订单号：{{ u.order_no }}</view>
						<view class="top-up-bottom-bottom-item-payment-no">交易流水号：{{ u.payment_no }}</view>
						<view class="top-up-bottom-bottom-item-payment-type">充值方式：{{ u.payment_type === 1 ? '微信支付' : u.payment_type === 2 ? '支付宝支付' : 'Apple Pay' }}</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getTopUpOrdersByUserIdAction
	} from '@/service/service'
	import moment from 'moment'
	export default {
		data() {
			return {
				listItems: [{
						name: '按时间排序'
					},
					{
						name: '按金额排序'
					}
				],
				dataSource: [],
				sort: 'desc',
				sort_type: 'payment_time'
			}
		},
		onShow(){
			this.$loadingOn()
			this.getData()
		},
		methods: {
			close() {
				uni.navigateBack()
			},
			getData(){
				getTopUpOrdersByUserIdAction(this.sort_type, this.sort).then(res=>{
					this.dataSource = res.data ? [...res.data] : []
					this.dataSource.map(item=>{
						item.payment_time_show = moment(new Date(item.payment_time), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
					})
					this.$loadingOff()
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleChangeSort(sort){
				if(this.sort === sort){
					return
				}
				this.sort = sort
				this.$loadingOn()
				this.getData()
			},
			handleChangeTabs(e) {
				if(this.sort_type === (e.index === 0 ? 'payment_time' : 'payment_num')){
					return
				}
				this.sort_type = e.index === 0 ? 'payment_time' : 'payment_num'
				this.$loadingOn()
				this.getData()
			}
		},
	}
</script>

<style lang="scss">
	.top-up-wrapper {
		width: 100vw;
		height: 100vh;

		.top-up {
			width: 100%;
			height: 100%;
			background: #F9F9F9;
		}

		.top-up-top {
			box-sizing: border-box;
			width: 100%;
			height: 200rpx;
			margin-bottom: 40rpx;
			display: flex;
			align-items: flex-end;
			padding-bottom: 30rpx;
			position: relative;
			background: #4F68B0;

			.top-back {
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				left: 20rpx;
				bottom: 30rpx;
				font-size: 16px;
				color: #fff;
			}

			.top-right {
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				right: 20rpx;
				bottom: 30rpx;
				font-size: 16px;
				color: #fff;
			}

			.top-title {
				text-align: center;
				width: 100%;
				font-size: 16px;
				color: #fff;
			}
		}

		.top-up-bottom {
			margin-top: 24rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 24rpx;
			
			.top-up-bottom-top{
				width: 100%;
				box-sizing: border-box;
			}
			
			.top-up-bottom-center{
				width: 100%;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				margin-top: 24rpx;
				padding-left: 24rpx;
				
				.top-up-bottom-center-one, .top-up-bottom-center-three{
					font-size: 14px;
					color: #999;
					
					&.active{
						color: #333;
						font-weight: bold;
					}
				}
				
				.top-up-bottom-center-two{
					color: #333;
					font-size: 14px;
					padding: 0 24rpx;
				}
			}
			
			.top-up-bottom-bottom{
				width: 100%;
				box-sizing: border-box;
				margin-top: 24rpx;
				padding: 0 24rpx;
				
				.top-up-bottom-bottom-empty {
					width: 100%;
					margin-top: 24rpx;
					margin-bottom: 24rpx;
				}
				
				.top-up-bottom-bottom-empty {
					width: 100%;
					padding: 48rpx 0;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					box-sizing: border-box;
					margin-top: 100rpx;
				
					.top-up-bottom-bottom-empty-img {
						width: 100rpx;
						height: 100rpx;
						margin-bottom: 24rpx;
					}
				
					.top-up-bottom-bottom-empty-text {
						font-size: 13px;
						color: #DAE1F4;
					}
				}
				
				.top-up-bottom-bottom-item{
					width: 100%;
					box-sizing: border-box;
					padding: 24rpx 0;
					border-bottom: 1px solid #DAE1F4;
					
					&.last-one{
						border-bottom: none;
					}
					
					.top-up-bottom-bottom-item-title{
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						.top-up-bottom-bottom-item-title-left{
							font-size: 13px;
							
							.top-up-bottom-bottom-item-title-left-in{
								padding-left: 8rpx;
							}
						}
						
						.top-up-bottom-bottom-item-title-right{
							font-size: 13px;
						}
					}
					
					.top-up-bottom-bottom-item-payment-time{
						width: 100%;
						font-size: 11px;
						font-color: #aaa;
						margin-top: 12rpx;
					}
					
					.top-up-bottom-bottom-item-order-no{
						width: 100%;
						font-size: 11px;
						font-color: #aaa;
						margin-top: 12rpx;
					}
					
					.top-up-bottom-bottom-item-payment-no{
						width: 100%;
						font-size: 11px;
						font-color: #aaa;
						margin-top: 12rpx;
					}
					
					.top-up-bottom-bottom-item-payment-type{
						width: 100%;
						font-size: 11px;
						font-color: #aaa;
						margin-top: 12rpx;
					}
				}
			}
		}
	}
</style>
