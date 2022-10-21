<template>
	<view class="mineinfo-equipment-order">
		<mescroll-uni ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
			<view class="mineinfo-equipment-order-empty" v-if="!dataSource.length">
				<image src="@/static/images/recovery/empty-data.png" class="mineinfo-equipment-order-empty-img"></image>
				<text class="mineinfo-equipment-order-empty-text">暂无订单信息~</text>
			</view>
			<view class="mineinfo-equipment-order-item-wrapper" v-if="dataSource.length">
				<view class="mineinfo-equipment-order-item" v-for="(u,index) in dataSource" :key="index" @click="handleShowDetail(u)"
					:class="{'last-item': index === dataSource.length - 1}">
					<view class="mineinfo-equipment-order-item-status">{{ u.status_show }}</view>
					<view class="mineinfo-equipment-order-item-middle">
						<view class="mineinfo-equipment-order-item-middle-body">
							<scroll-view scroll-x class="mineinfo-equipment-order-item-middle-body-left">
								<view class="mineinfo-equipment-order-item-middle-body-left-in">
									<view class="mineinfo-equipment-order-item-middle-body-left-item" v-for="(u1,index1) in u.equipment" @click.stop="handleShowEquipmentDetail(u1)">
										<image class="mineinfo-equipment-order-item-middle-body-left-item-img" :src="u1.cover_show"></image>
										<view class="mineinfo-equipment-order-item-middle-body-left-item-text">{{ u1.title }}</view>
										<view class="mineinfo-equipment-order-item-middle-body-left-item-body">
											<view class="mineinfo-equipment-order-item-middle-body-left-item-body-item" v-for="(u2,index2) in u1.models" :key="u2.id">
												<view class="mineinfo-equipment-order-item-middle-body-left-item-body-item-text">{{ u2.title }}</view>
												<view class="mineinfo-equipment-order-item-middle-body-left-item-body-item-num">×{{ u2.add_num }}</view>
											</view>
										</view>
									</view>
								</view>
								
							</scroll-view>
							<view class="mineinfo-equipment-order-item-middle-body-right">
								<view class="mineinfo-equipment-order-item-middle-body-right-top">¥{{ u.payment_num }}</view>
								<view class="mineinfo-equipment-order-item-middle-body-right-bottom">共{{ u.equipment.length }}种</view>
							</view>
						</view>
					</view>
					<view class="mineinfo-equipment-order-item-courier" v-if="u.status > 2">
						<view class="mineinfo-equipment-order-item-courier-in">
							<text class="mineinfo-equipment-order-item-courier-in-time">{{ u.courier_info.courier_content_object.list[0].time }}</text>
							<text class="mineinfo-equipment-order-item-courier-in-status">{{ u.courier_info.courier_content_object.list[0].status }}</text>
						</view>
					</view>
					<view class="mineinfo-equipment-order-item-bottom">
						<view class="mineinfo-equipment-order-item-bottom-left">
							下单于 {{ u.payment_time_show }}
						</view>
						<view class="mineinfo-equipment-order-item-bottom-right">
							<view class="mineinfo-equipment-order-item-bottom-right-button-one" @click.stop="handleShowDetail(u)">查看详情</view>
							<view class="mineinfo-equipment-order-item-bottom-right-button-two" @click.stop="handleReBuy(u)">再次购买</view>
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
		findManyEquipmentOrdersByUserIdAction,
		getEquipmentsWithModelsAction
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
			handleReBuy(record){
				this.$loadingOn()
				getEquipmentsWithModelsAction(record.equipment.map(equipment => equipment.id).join()).then(res=>{
					const equipments = res.data ? [...res.data] : []
					let origin_equipments = [...record.equipment]
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
					findManyEquipmentOrdersByUserIdAction().then(res=>{
						this.dataSource = res.data || []
						this.dataSource.map(item => {
							item.equipment.map(equipment=>{
								equipment.cover_show = this.baseUrl + equipment.cover
								equipment.models.map(model=>{
									model.multi_figure_show = this.baseUrl + model.multi_figure.split(',')[0]
								})
							})
							item.courier_info.courier_content_object = item.courier_info.courier_content ? JSON.parse(item.courier_info.courier_content) : {}
							item.payment_time_show = moment(new Date(item.payment_time), 'YYYY-MM-DD').format('YYYY-MM-DD')
							const status_map = ['取消/关闭', '待支付', '待发货', '已发货', '已收货', '退货中', '已退货']
							item.status_show = status_map[item.status]
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
				console.log('handleShowDetail')
				const that = this
				uni.navigateTo({
					url: "/pages_mine/mineInfo-equipment-order-detail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							order_no: record.order_no
						})
					}
				})
			},
			handleShowShipping(record){
				
			}
		}
	}
</script>

<style lang="scss">
	.mineinfo-equipment-order{
		width: 100%;
		height: 700rpx;
		background: #f6f6f6;
		
		.mineinfo-equipment-order-empty {
			width: 100%;
			padding: 48rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			margin-top: 64rpx;
		
			.mineinfo-equipment-order-empty-img {
				width: 64rpx;
				height: 64rpx;
				margin-bottom: 24rpx;
			}
		
			.mineinfo-equipment-order-empty-text {
				font-size: 13px;
				color: #DAE1F4;
			}
		}
		
		.mineinfo-equipment-order-item-wrapper{
			width: 100%;
			border-radius: 24rpx;
			box-sizing: border-box;
			padding: 0 24rpx;
			
			.mineinfo-equipment-order-item{
				width: 100%;
				background: #fff;
				border-radius: 12rpx;
				box-sizing: border-box;
				padding: 24rpx;
				margin-top: 24rpx;
				position: relative;
				
				&.last-item{
					margin-bottom: 24rpx;
				}
				
				.mineinfo-equipment-order-item-top{
					width: 100%;
					font-size: 12px;
				}
				
				.mineinfo-equipment-order-item-status{
					position: absolute;
					top: 24rpx;
					right: 24rpx;
					font-size: 13px;
					white-space: nowrap;
				}
				
				.mineinfo-equipment-order-item-middle{
					width: 100%;
					margin-top: 12rpx;
					
					.mineinfo-equipment-order-item-middle-title{
						width: 100%;
						font-size: 12px;
						color: #999;
					}
					
					.mineinfo-equipment-order-item-middle-body{
						width: 100%;
						display: flex;
						align-items: center;
						margin-top: 12rpx;
						
						.mineinfo-equipment-order-item-middle-body-left{
							width: calc(100% - 120rpx);
							
							.mineinfo-equipment-order-item-middle-body-left-in{
								width: 100%;
								display: flex;
								align-items: center;
								flex-direction: row;
								flex-wrap: nowrap;
							}
							
							.mineinfo-equipment-order-item-middle-body-left-item{
								width: 140rpx;
								margin-right: 36rpx;
								
								.mineinfo-equipment-order-item-middle-body-left-item-img{
									width: 140rpx;
									height: 90rpx;
									border-radius: 12rpx;
								}
								
								.mineinfo-equipment-order-item-middle-body-left-item-text{
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
								
								.mineinfo-equipment-order-item-middle-body-left-item-body{
									width: 100%;
									
									.mineinfo-equipment-order-item-middle-body-left-item-body-item{
										width: 100%;
										display: flex;
										align-items: center;
										justify-content: space-between;
										margin-top: 12rpx;
										
										.mineinfo-equipment-order-item-middle-body-left-item-body-item-text{
											max-width: 70%;
											overflow: hidden;
											text-overflow: ellipsis;
											display: -webkit-box;
											-webkit-line-clamp: 1;
											-webkit-box-orient: vertical;
											font-size: 12px;
										}
										
										.mineinfo-equipment-order-item-middle-body-left-item-body-item-num{
											font-size: 12px;
										}
									}
								}
							}
						}
						
						.mineinfo-equipment-order-item-middle-body-right{
							width: 120rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
							flex-shrink: 0;
							
							.mineinfo-equipment-order-item-middle-body-right-top{
								font-size: 13px;
								font-weight: bold;
								margin-bottom: 12rpx;
							}
							
							.mineinfo-equipment-order-item-middle-body-right-bottom{
								font-size: 12px;
							}
						}
					}
				}
				
				.mineinfo-equipment-order-item-courier{
					width: 100%;
					margin-top: 12rpx;
					display: flex;
					align-items: center;
					box-sizing: border-box;
					border-radius: 12rpx;
					padding: 12rpx;
					background: #F9F9F9;
					
					.mineinfo-equipment-order-item-courier-in{
						color: #333;
						font-size: 12px;
						box-sizing: border-box;
						padding: 12rpx;
						
						.mineinfo-equipment-order-item-courier-in-time{
							padding-right: 12rpx;
						}
					}
				}
				
				.mineinfo-equipment-order-item-bottom{
					width: 100%;
					margin-top: 12rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.mineinfo-equipment-order-item-bottom-left{
						font-size: 12px;
					}
					
					.mineinfo-equipment-order-item-bottom-right{
						display: flex;
						align-items: center;
						
						.mineinfo-equipment-order-item-bottom-right-button-one{
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
							margin-right: 24rpx;
						}
						
						.mineinfo-equipment-order-item-bottom-right-button-two{
							width: 130rpx;
							height: 50rpx;
							border-radius: 12rpx;
							display: flex;
							align-items: center;
							justify-content: center;
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