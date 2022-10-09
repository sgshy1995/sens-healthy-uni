<template>
	<view class="top-up-wrapper">
		<scroll-view scroll-y class="top-up">
			<view class="top-up-top">
				<view class="top-back" @click="close">
					<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
					<text>返回</text>
				</view>
				<text class="top-title">充值</text>
			</view>
			<view class="top-up-bottom">
				<view class="top-up-bottom-card">
					<view class="top-up-bottom-card-top">
						<view class="top-up-bottom-card-left">
							<image src="@/static/images/mine/balance.png" class="top-up-bottom-card-left-img"></image>
							<text class="top-up-bottom-card-left-text">账户余额</text>
						</view>
						<view class="top-up-bottom-card-right">
							<text class="top-up-bottom-card-right-text">¥{{ info.balance }}</text>
							<u-icon name="reload" color="#ACABB8" size="36rpx" @click="handleRefresh"></u-icon>
						</view>
					</view>
					<view class="top-up-bottom-card-bottom">
						账户余额只可在「森普健康」APP中用于购买课程、器材等其他消费，暂不支持提现或变现。
					</view>
				</view>
				<view class="top-up-bottom-action">
					<view class="top-up-bottom-action-title">充值金额</view>
					<view class="top-up-bottom-action-body">
						<view class="top-up-bottom-action-body-items">
							<view class="top-up-bottom-action-body-item" v-for="(u,index) in itemsList" :key="index"
								:class="{active: index === current && !ifOther}" @click="handleChangeSelect(index)">
								<text class="top-up-bottom-action-body-item-text">{{ u.name }}</text>
							</view>
						</view>
					</view>
					<view class="top-up-bottom-action-sub-title">
						<u-checkbox :key="refreshKey" v-model="ifOther" shape="square" label="" size="20" iconSize="18"
							@change="changeOther" activeColor="#4F68B0"></u-checkbox>
						<text class="top-up-bottom-action-sub-title-text" :class="{active: ifOther}">其他金额</text>
					</view>
					<view class="top-up-bottom-action-other" v-if="ifOther" @click="handleShowNumber">
						<text class="top-up-bottom-action-other-title">您可以输入其他金额</text>
						<text class="top-up-bottom-action-other-text">¥ {{ other_fee || '0' }}</text>
					</view>
					<keyboard-price max="100000" focusColor="#4F68B0" ref="keyboardPrice" type="digit" v-model="fee"
						:inputOptions="{placeholder: '请输入充值金额'}" @onDone="onDonePrice"></keyboard-price>
				</view>
				<view class="top-up-bottom-buttons">
					<view class="top-up-bottom-button" :class="{disabled}" @click="handleShowTopUp">
						立即充值
					</view>
				</view>
			</view>
		</scroll-view>
		<u-popup :show="showConfirm" @close="closeConfirm" @open="openConfirm">
			<view class="confirm-start">
				<view class="confirm-start-info">充值金额：¥{{ this.ifOther ? this.other_fee : this.now_fee }}</view>
				<view class="confirm-start-title">选择支付方式</view>
				<view class="confirm-start-body">
					<view class="confirm-start-item" @click="handleChangePayment('wechat')">
						<view class="confirm-start-item-left">
							<image src="@/static/images/payment/payment-wechat.png" class="confirm-start-item-left-img">
							</image>
							<text class="confirm-start-item-left-text">微信支付</text>
						</view>
						<view class="confirm-start-item-right">
							<u-radio-group activeColor="#4F68B0" v-model="radiovalue" placement="column" @change="groupChange">
								<u-radio activeColor="#4F68B0" label="" name="wechat"
									@change="radioChange">
								</u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="confirm-start-item last-one" @click="handleChangePayment('alipay')">
						<view class="confirm-start-item-left">
							<image src="@/static/images/payment/payment-alipay.png" class="confirm-start-item-left-img">
							</image>
							<text class="confirm-start-item-left-text">支付宝支付</text>
						</view>
						<view class="confirm-start-item-right">
							<u-radio-group activeColor="#4F68B0" v-model="radiovalue" placement="column" @change="groupChange">
								<u-radio activeColor="#4F68B0" label="" name="alipay"
									@change="radioChange">
								</u-radio>
							</u-radio-group>
						</view>
					</view>
				</view>
				<view class="confirm-start-confirm">
					<view class="confirm-start-confirm-in" @click="handleTopUp">
						确认支付
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import keyboardPrice from '@/components/liujto-keyboard/liujto-keyboard-price.vue'
	import {
		addBalanceByUserIdAction,
		getInfoByJwtAction
	} from '@/service/service'
	export default {
		data() {
			return {
				showConfirm: false,
				radiovalue: 'wechat',
				ifOther: false,
				checkboxList: [{
					name: '其他金额',
					disabled: false
				}],
				itemsList: [{
						name: '¥100',
						value: '100'
					},
					{
						name: '¥300',
						value: '300'
					},
					{
						name: '¥500',
						value: '500'
					},
					{
						name: '¥1000',
						value: '1000'
					},
					{
						name: '¥3000',
						value: '3000'
					},
					{
						name: '¥5000',
						value: '5000'
					},
					{
						name: '¥10000',
						value: '10000'
					},
					{
						name: '¥30000',
						value: '30000'
					}
				],
				current: 3,
				now_fee: '1000',
				other_fee: '',
				fee: '',
				refreshKey: 0
			}
		},
		components: {
			keyboardPrice
		},
		computed: {
			disabled() {
				return (this.ifOther && !this.other_fee) ? true : false
			},
			userInfo() {
				return this.$store.state.user.userInfo
			},
			info() {
				return this.$store.state.user.info
			}
		},
		methods: {
			groupChange(n) {
				console.log('groupChange', n);
			},
			radioChange(n) {
				console.log('radioChange', n);
			},
			closeConfirm(){
				this.showConfirm = false
				this.radiovalue = 'wechat'
			},
			openConfirm(){
				this.showConfirm = true
			},
			handleChangePayment(type){
				this.radiovalue = type
			},
			handleShowTopUp(){
				if (this.disabled) {
					return
				}
				this.showConfirm = true
			},
			handleTopUp() {
				this.$loadingOn(`模拟调取${this.radiovalue === 'wechat' ? '微信' : '支付宝'}支付API`)
				setTimeout(() => {
					this.$loadingOn('正在模拟充值')
					setTimeout(() => {
						addBalanceByUserIdAction(this.ifOther ? this.other_fee : this.now_fee).then(
						res => {
							this.other_fee = ''
							this.fee = ''
							this.loadData()
							this.$toast('充值成功')
							this.showConfirm = false
						}).catch(err => {
							this.$loadingOff()
						})
					}, 2000);
				}, 2000);
			},
			loadData() {
				this.$store.dispatch('getInfo').then(res => {
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleRefresh() {
				this.$loadingOn()
				this.loadData()
			},
			close() {
				uni.navigateBack()
			},
			handleChangeSelect(index) {
				if (this.ifOther) {
					this.ifOther = false
					this.now_fee = ''
					this.fee = ''
					this.refreshKey++
				}
				this.current = index
				this.now_fee = this.itemsList[index].value
			},
			changeOther(value) {
				console.log('value', value)
				this.ifOther = value
				if (!this.ifOther) {
					this.now_fee = ''
					this.fee = ''
				}
			},
			handleShowNumber() {
				this.$refs.keyboardPrice.open()
			},
			onDonePrice(price) {
				console.log('onDonePrice', price)
				if (!price) {
					this.fee = this.other_fee
				} else if (Number(price) < 1) {
					this.$toast('金额不能小于1');
					this.fee = this.other_fee
				} else {
					this.other_fee = this.fee
				}
			}
		}
	}
</script>

<style lang="scss">
	.confirm-start{
		width: 100vw;
		box-sizing: border-box;
		padding: 36rpx 36rpx 0 36rpx;
		
		.confirm-start-info{
			width: 100%;
			font-size: 16px;
			font-weight: bold;
			color: #333;
		}
		
		.confirm-start-title{
			width: 100%;
			font-size: 14px;
			font-weight: bold;
			color: #333;
			margin-top: 24rpx;
		}
		
		.confirm-start-body{
			width: 100%;
			margin-top: 24rpx;
			
			.confirm-start-item{
				width: 100%;
				box-sizing: border-box;
				border-bottom: 1px solid #DADBDE;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 24rpx 0;
				
				&.last-one{
					border-bottom: none;
				}
				
				.confirm-start-item-left{
					display: flex;
					align-items: center;
					
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
			}
		}
		
		.confirm-start-confirm {
			width: 100%;
			box-sizing: border-box;
			padding: 24rpx;
			margin-top: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		
			.confirm-start-confirm-in {
				box-sizing: border-box;
				border-radius: 24rpx;
				padding: 0 24rpx;
				height: 70rpx;
				width: 220rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #4F68B0;
				color: #fff;
				font-size: 14px;
				font-weight: bold;
				white-space: nowrap;
		
				&.disabled {
					background: #EBEDF0;
					color: #C8C9CC;
				}
			}
		}
	}
	
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

			.top-up-bottom-card {
				width: 100%;
				border-radius: 24rpx;
				background: #fff;
				box-sizing: border-box;
				padding: 24rpx;

				.top-up-bottom-card-top {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.top-up-bottom-card-bottom {
					margin-top: 24rpx;
					font-size: 12px;
					font-weight: bold;
					color: #ACABB8;
				}

				.top-up-bottom-card-left {
					display: flex;
					align-items: center;

					.top-up-bottom-card-left-img {
						width: 64rpx;
						height: 64rpx;
						margin-right: 24rpx;
					}

					.top-up-bottom-card-left-text {
						font-size: 13px;
						font-weight: bold;
						white-space: nowrap;
					}
				}

				.top-up-bottom-card-right {
					display: flex;
					align-items: center;

					.top-up-bottom-card-right-text {
						color: #25274E;
						font-size: 14px;
						font-weight: bold;
						white-space: nowrap;
						padding-right: 24rpx;
					}
				}
			}

			.top-up-bottom-buttons {
				width: 100%;
				border-radius: 24rpx;
				background: #fff;
				box-sizing: border-box;
				padding: 24rpx;
				margin-top: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.top-up-bottom-button {
					box-sizing: border-box;
					border-radius: 24rpx;
					padding: 0 24rpx;
					height: 80rpx;
					width: 240rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #4F68B0;
					color: #fff;
					font-size: 14px;
					font-weight: bold;
					white-space: nowrap;

					&.disabled {
						background: #EBEDF0;
						color: #C8C9CC;
					}
				}
			}

			.top-up-bottom-action {
				width: 100%;
				border-radius: 24rpx;
				background: #fff;
				box-sizing: border-box;
				padding: 24rpx;
				margin-top: 24rpx;

				.top-up-bottom-action-title {
					width: 100%;
					color: #333;
					font-size: 14px;
					font-weight: bold;
					white-space: nowrap;
				}

				.top-up-bottom-action-body {
					width: 100%;
					margin-top: 24rpx;

					.top-up-bottom-action-body-items {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;
						flex-wrap: wrap;

						.top-up-bottom-action-body-item {
							width: 140rpx;
							height: 140rpx;
							background: #F2F6FE;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 24rpx;
							margin-bottom: 24rpx;

							.top-up-bottom-action-body-item-text {
								color: #2A2B5D;
								font-size: 14px;
								font-weight: bold;
								white-space: nowrap;
							}

							&.active {
								background: #4F68B0;

								.top-up-bottom-action-body-item-text {
									color: #ffffff;
								}
							}
						}
					}
				}

				.top-up-bottom-action-sub-title {
					width: 100%;
					margin-top: 24rpx;
					display: flex;
					align-items: center;

					.top-up-bottom-action-sub-title-text {
						color: #999;
						font-size: 13px;
						font-weight: bold;
						white-space: nowrap;
						padding-left: 12rpx;

						&.active {
							color: #333;
						}
					}
				}

				.top-up-bottom-action-other {
					width: 100%;
					margin-top: 24rpx;

					.top-up-bottom-action-other-title {
						color: #999;
						font-size: 13px;
						font-weight: bold;
						white-space: nowrap;
						padding-right: 24rpx;
					}

					.top-up-bottom-action-other-text {
						color: #333;
						font-size: 24px;
						font-weight: bold;
						white-space: nowrap;
						text-decoration: underline;
					}
				}
			}
		}
	}
</style>
