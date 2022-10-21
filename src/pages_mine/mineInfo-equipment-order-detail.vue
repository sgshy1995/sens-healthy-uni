<template>
	<view class="mineinfo-equipment-order-detail">
		<view class="mineinfo-equipment-order-detail-top">
			<u-status-bar></u-status-bar>
			<view class="mineinfo-equipment-order-detail-top-in">
				<view class="top-back" @click="close">
					<u-icon name="arrow-left" color="#333" size="18"></u-icon>
				</view>
				<text class="top-title" v-if="order_info.status_show">订单{{ order_info.status_show }}</text>
				<text class="top-title" v-else>订单查询中</text>
				<view class="top-right">
					<u-icon name="arrow-left" color="#333" size="18"></u-icon>
				</view>
			</view>
		</view>
		<view class="mineinfo-equipment-order-detail-bottom">
			<mescroll-uni ref="mescroll" :down="{onScroll:false, use: false}" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
				<view class="mineinfo-equipment-order-detail-bottom-courier" v-if="order_info.status > 2 && order_info.courier_info">
					<view class="mineinfo-equipment-order-detail-bottom-courier-title">物流信息</view>
					<view class="mineinfo-equipment-order-detail-bottom-courier-info">
						<image :src="order_info.courier_info.courier_content_object.logo" class="mineinfo-equipment-order-detail-bottom-courier-info-img"></image>
						<text class="mineinfo-equipment-order-detail-bottom-courier-info-name">{{ order_info.courier_info.courier_content_object.expName }}</text>
						<u-tooltip :text="order_info.courier_number" overlay></u-tooltip>
					</view>
					<view class="mineinfo-equipment-order-detail-bottom-courier-status">
						状态: {{ statusMap[order_info.courier_info.status.toString()] }}
					</view>
					<view class="mineinfo-equipment-order-detail-bottom-courier-body">
						<u-steps current="0" direction="column" dot v-show="!ifCourierOpen">
							<u-steps-item activeColor="4F68B0" :title="u.status" :desc="u.time" v-for="(u,index) in order_info.courier_info.courier_content_object.list.slice(0, 1)"></u-steps-item>
						</u-steps>
						<u-steps current="0" direction="column" dot v-show="ifCourierOpen">
							<u-steps-item activeColor="4F68B0" :title="u.status" :desc="u.time" v-for="(u,index) in order_info.courier_info.courier_content_object.list"></u-steps-item>
						</u-steps>
					</view>
					<view @click="ifCourierOpen = true" class="mineinfo-equipment-order-detail-bottom-courier-button" v-if="!ifCourierOpen && order_info.courier_info.courier_content_object.list.length > 1">
						<u-icon name="arrow-down" color="#333" size="28rpx"></u-icon>
						<text class="mineinfo-equipment-order-detail-bottom-courier-button-text">显示全部</text>
					</view>
					<view @click="ifCourierOpen = false" class="mineinfo-equipment-order-detail-bottom-courier-button" v-if="ifCourierOpen && order_info.courier_info.courier_content_object.list.length > 1">
						<u-icon name="arrow-up" color="#333" size="28rpx"></u-icon>
						<text class="mineinfo-equipment-order-detail-bottom-courier-button-text">收起</text>
					</view>
				</view>
				<view class="mineinfo-equipment-order-detail-bottom-item" v-for="(u, index) in dataSource" :key="index" @click="handleShowEquipmentDetail(u)">
					<view class="chart-right-content">
						<view class="body-item-top">
							<view class="body-item-top-left">
								<image class="body-item-top-left-img" :src="u.url"></image>
							</view>
							<view class="body-item-top-right">
								<view class="body-item-top-right-title">{{ u.title }}</view>
								<view class="body-item-top-right-tag">
									<text class="item-right-tag-in" >
										<text class="tag-in-text">{{ u.equipment_type_show }}</text>
									</text>
								</view>
								<view class="body-item-top-right-description">{{ u.description }}</view>
							</view>
						</view>
						<view class="body-item-bottom">
							<view class="body-item-bottom-title">已购买型号</view>
							<view class="body-item-bottom-body">
								<view class="body-item-bottom-body-item" v-for="(u1, index1) in u.models" :key="u1.id">
									<view class="body-model-left">
										<image class="body-model-left-img" :src="u1.url"></image>
									</view>
									<view class="body-model-right">
										<view class="body-model-right-title">{{ u1.title }}</view>
										<view class="body-model-right-description">{{ u1.description }}</view>
										<view class="body-model-right-price">
											<text class="body-model-right-price-in">¥ {{ u1.price }}</text>
										</view>
									</view>
									<view class="body-model-righter">
										×{{ u1.add_num }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="mineinfo-equipment-order-detail-bottom-info" v-if="dataSource.length">
					<view class="mineinfo-equipment-order-detail-bottom-info-item">
						<text class="mineinfo-equipment-order-detail-bottom-info-item-left">
							订单编号:
						</text>
						<u-tooltip :text="order_info.order_no" overlay></u-tooltip>
					</view>
					<view class="mineinfo-equipment-order-detail-bottom-info-item">
						<text class="mineinfo-equipment-order-detail-bottom-info-item-left">
							支付流水号:
						</text>
						<u-tooltip :text="order_info.payment_no" overlay></u-tooltip>
					</view>
					<view class="mineinfo-equipment-order-detail-bottom-info-item">
						<text class="mineinfo-equipment-order-detail-bottom-info-item-left">
							下单时间:
						</text>
						<text class="mineinfo-equipment-order-detail-bottom-info-item-right">
							{{ order_info.order_time_show }}
						</text>
					</view>
					<view class="mineinfo-equipment-order-detail-bottom-info-item">
						<text class="mineinfo-equipment-order-detail-bottom-info-item-left">
							支付时间:
						</text>
						<text class="mineinfo-equipment-order-detail-bottom-info-item-right">
							{{ order_info.payment_time_show }}
						</text>
					</view>
					<view class="mineinfo-equipment-order-detail-bottom-info-item">
						<text class="mineinfo-equipment-order-detail-bottom-info-item-left">
							支付类型:
						</text>
						<text class="mineinfo-equipment-order-detail-bottom-info-item-right">
							{{ order_info.payment_type_show }}
						</text>
					</view>
					<view class="mineinfo-equipment-order-detail-bottom-info-item last-one">
						<text class="mineinfo-equipment-order-detail-bottom-info-item-left">
							支付总金额:
						</text>
						<text class="mineinfo-equipment-order-detail-bottom-info-item-right">
							¥{{ order_info.payment_num }}
						</text>
					</view>
				</view>
				<u-safe-bottom></u-safe-bottom>
			</mescroll-uni>
		</view>
		<view class="mine-detail-footer" v-if="order_info.id">
			<view class="mine-detail-footer-in">
				<view class="mine-detail-footer-in-one">{{ order_info.status_show || ' ' }}</view>
				<view class="mine-detail-footer-in-two">
					<view class="mine-detail-footer-left" @click="handleAfterBuy">
						<text class="mine-detail-footer-left-buy">售后服务</text>
					</view>
					<view class="mine-detail-footer-right" @click="handleShowOkReceive" v-if="order_info.status === 3">
						<text class="mine-detail-footer-right-buy">确认收货</text>
					</view>
					<view class="mine-detail-footer-right" @click="handleBeginReBuy">
						<text class="mine-detail-footer-right-buy">再次购买</text>
					</view>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
		<u-modal :show="showModal" showCancelButton confirmColor="#4F68B0" @confirm="handleConfirmOkReceive" @cancel="showModal=false">
			<view class="slot-content modal-receive">
				<view class="modal-receive-tip" v-if="order_info.courier_info && order_info.courier_info.status < 3">注意: 物流信息显示您的快件还未签收。</view>
				<view class="modal-receive-in">确定收货吗？</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		findEquipmentOrderByOrderNoAction,
		getEquipmentsWithModelsAction,
		receiveOrderShipmentAction
	} from '@/service/service'
	import moment from 'moment'
	export default {
		data(){
			return {
				dataSource: [],
				order_info: {},
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				order_no: '',
				ifCourierOpen: false,
				statusMap: {
				    "0": "揽件",
				    "1": "在途中",
				    "2": "正在派件",
				    "3": "已签收",
				    "4": "派送失败",
				    "5": "疑难件",
				    "6": "退件签收"
				},
				showModal: false
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
			handleShowEquipmentDetail(record) {
				const that = this
				uni.navigateTo({
					url: "/pages_store/equipment-detail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							record
						})
					}
				})
			},
			handleShowOkReceive(){
				this.showModal = true
			},
			handleConfirmOkReceive(){
				this.$loadingOn()
				receiveOrderShipmentAction(this.order_info.order_no).then(res=>{
					this.$toast(res.message || '收货成功')
					this.showModal = false
					this.getData()
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleBeginReBuy(){
				this.$loadingOn()
				getEquipmentsWithModelsAction(this.dataSource.map(equipment => equipment.id).join()).then(res=>{
					const equipments = res.data ? [...res.data] : []
					let origin_equipments = [...this.dataSource]
					let no_inventory_symbol = false
					origin_equipments.map(equipment => {
						equipment.url = this.baseUrl + equipment.cover
						const equipmentFind = equipments.find(item => item.id === equipment.id)
						if(equipmentFind){
							equipment.models.map(model => {
								model.url = this.baseUrl + model.multi_figure.split(',')[0]
								const modelFind = equipmentFind.models.find(item => item.id === model.id)
								if(modelFind && modelFind.inventory && modelFind.inventory >= model.add_num){
									model.ok = true
								}else{
									no_inventory_symbol = true
									model.ok = false
								}
							})
							equipment.models = equipment.models.filter(model => model.ok)
							equipment.ok = true
						}else{
							no_inventory_symbol = true
							equipment.ok = false
						}
					})
					origin_equipments = origin_equipments.filter(equipment => equipment.ok)
					if(!origin_equipments.length){
						this.$toast('所有器材均已下架，无法购买')
						this.$loadingOff()
						return
					}else if(no_inventory_symbol){
						this.$toast('有器材型号发生变化，请核对')
					}
					const mount = origin_equipments.map(equipment=>equipment.models).flat().map(model => model.is_discount ? (Number(model.discount) * Number(model.add_num)) : (Number(model.price) * Number(model.add_num))).reduce((a,b) => a + b)
					const total_num = origin_equipments.map(equipment=>equipment.models).flat().map(model => model.add_num).reduce((a,b) => a + b)
					const that = this
					uni.navigateTo({
						url: "/pages_store/payment-equipment",
						success: function(res) {
							// 通过eventChannel向被打开页面传送数据
							res.eventChannel.emit('show', {
								totalInfo: {
									equipment: origin_equipments.length
								},
								equipments: [...(origin_equipments.map(equipment => { return {equipment, models: equipment.models} }))],
								real_equipments: [...origin_equipments],
								mount,
								total_num,
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
					findEquipmentOrderByOrderNoAction(this.order_no).then(res=>{
						console.log('data', res.data)
						const data = res.data ? {...res.data} : {}
						const status_map = ['取消/关闭', '待支付', '待发货', '已发货', '已收货', '退货中', '已退货']
						data.status_show = status_map[data.status]
						data.courier_info.courier_content_object = data.courier_info.courier_content ? JSON.parse(data.courier_info.courier_content) : {}
						data.order_time_show = moment(data.order_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
						data.payment_time_show = moment(data.payment_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
						const payment_typ_map = ['余额支付', '微信支付', '支付宝支付', 'Apple支付']
						data.payment_type_show = payment_typ_map[data.payment_type]
						const equipment_type_map = ['康复训练器材', '康复理疗设备', '康复治疗师工具']
						data.equipment.map(equipment=>{
							equipment.equipment_type_show = equipment_type_map[equipment.equipment_type]
							equipment.url = this.baseUrl + equipment.cover
							equipment.models.map(model => {
								model.url = this.baseUrl + model.multi_figure.split(',')[0]
							})
						})
						this.dataSource = [...data.equipment]
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
				
			}
		}
	}
</script>

<style lang="scss">
	.modal-receive{
		width: 100%;
		
		.modal-receive-tip{
			font-size: 14px;
			color: #E06C75;
			font-weight: bold;
			margin-bottom: 12rpx;
		}
		
		.modal-receive-in{
			font-size: 14px;
			color: #333;
		}
	}
	
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
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.mine-detail-footer-in-one{
				font-size: 13px;
			}
			
			.mine-detail-footer-in-two{
				display: flex;
				align-items: center;
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
				margin-left: 36rpx;
			}
		}
	}
	
	
	.mineinfo-equipment-order-detail{
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		background: #f6f6f6;
		
		.mineinfo-equipment-order-detail-top {
			box-sizing: border-box;
			width: 100%;
			padding-top: 12rpx;
			padding-bottom: 48rpx;
			background: #f6f6f6;
			
			.mineinfo-equipment-order-detail-top-in{
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
		
		.mineinfo-equipment-order-detail-bottom{
			width: 100%;
			height: 1300rpx;
			box-sizing: border-box;
			padding: 0 24rpx;
			
			.mineinfo-equipment-order-detail-bottom-courier{
				width: 100%;
				border-radius: 12rpx;
				background: #fff;
				box-sizing: border-box;
				padding: 24rpx;
				margin-bottom: 24rpx;
				
				.mineinfo-equipment-order-detail-bottom-courier-title{
					width: 100%;
					font-size: 14px;
					font-weight: bold;
					margin-bottom: 12rpx;
				}
				
				.mineinfo-equipment-order-detail-bottom-courier-info{
					width: 100%;
					display: flex;
					align-items: center;
					
					.mineinfo-equipment-order-detail-bottom-courier-info-img{
						width: 100rpx;
						height: 50rpx;
						margin-right: 24rpx;
					}
					
					.mineinfo-equipment-order-detail-bottom-courier-info-name{
						font-size: 12px;
						font-weight: bold;
						padding-right: 24rpx;
					}
					
					.mineinfo-equipment-order-detail-bottom-courier-info-number{
						font-size: 12px;
						font-weight: bold;
					}
					
					.u-tooltip__wrapper__text{
						font-size: 12px !important;
						font-weight: bold !important;
						color: #333 !important;
					}
				}
				
				.mineinfo-equipment-order-detail-bottom-courier-status{
					width: 100%;
					font-size: 12px;
					font-weight: bold;
					margin-top: 24rpx;
				}
				
				.mineinfo-equipment-order-detail-bottom-courier-body{
					width: 100%;
					margin-top: 24rpx;
				}
				
				.mineinfo-equipment-order-detail-bottom-courier-button{
					width: 100%;
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					
					.mineinfo-equipment-order-detail-bottom-courier-button-text{
						font-size: 14px;
						padding-left: 12rpx;
						color: #333;
					}
				}
			}
			
			.mineinfo-equipment-order-detail-bottom-info{
				width: 100%;
				border-radius: 12rpx;
				background: #fff;
				box-sizing: border-box;
				padding: 24rpx;
				
				.mineinfo-equipment-order-detail-bottom-info-item{
					margin-bottom: 12rpx;
					width: 100%;
					display: flex;
					align-items: center;
					
					.mineinfo-equipment-order-detail-bottom-info-item-left{
						font-size: 13px;
						padding-right: 12rpx;
					}
					
					.mineinfo-equipment-order-detail-bottom-info-item-right{
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
			
			.mineinfo-equipment-order-detail-bottom-item{
				width: 100%;
				margin-bottom: 36rpx;
				border-radius: 24rpx;
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
						
						&.disabled{
							border-color: #C8C9CC;
							background: #EBEDF0;
							
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
						height: 130rpx;
						border-radius: 24rpx;
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
						height: 130rpx;
						
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
							font-size: 12px;
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
				
				.body-item-bottom{
					width: 100%;
					margin-top: 24rpx;
					
					.body-item-bottom-title{
						width: 100%;
						font-size: 12px;
						font-weight: bold;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}
					
					.body-item-bottom-body{
						width: 100%;
						
						.body-item-bottom-body-item{
							width: 100%;
							margin-top: 24rpx;
							display: flex;
							justify-content: space-between;
							position: relative;
							
							.body-model-delete{
								width: 36rpx;
								position: absolute;
								right: 0;
								top: 0;
							}
							
							.body-model-left{
								width: 100rpx;
								height: 60rpx;
								border-radius: 24rpx;
								margin-right: 24rpx;
								flex-shrink: 0;
								
								.body-model-left-img{
									width: 100%;
									height: 100%;
									border-radius: 24rpx;
								}
							}
							
							.body-model-righter{
								margin-left: 12rpx;
								font-size: 13px;
							}
							
							.body-model-right{
								flex-grow: 1;
								position: relative;
								
								.body-model-right-title{
									width: 100%;
									font-size: 11px;
									font-weight: bold;
									overflow: hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 1;
									-webkit-box-orient: vertical;
								}
								
								.body-model-right-description{
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
								
								.body-model-right-price{
									color: #333;
									font-size: 11px;
									margin-top: 10rpx;
									
									.body-model-right-price-in{
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
								
								.body-model-right-select{
									margin-top: 10rpx;
								}
								
								.body-model-right-empty{
									position: absolute;
									top: 50%;
									left: 50%;
									box-sizing: border-box;
									border: 2px solid #999;
									color: #999;
									font-size: 13px;
									border-radius: 50%;
									transform: translate(-50%,-50%) rotate(30deg);
									display: flex;
									align-items: center;
									justify-content: center;
									flex-direction: column;
									width: 100rpx;
									height: 100rpx;
									opacity: 0.9;
									z-index: 3;
									
									&::after{
										content: ' ';
										display: block;
										width: 80rpx;
										height: 80rpx;
										border-radius: 50%;
										border: 1px dashed #999;
										position: absolute;
										top: 50%;
										left: 50%;
										transform: translate(-50%,-50%) rotate(30deg);
									}
									
									.body-model-right-empty-text{
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
</style>