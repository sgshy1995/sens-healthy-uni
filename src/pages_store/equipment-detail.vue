<template>
	<view class="equipment-detail-wrapper">
		<view class="equipment-detail-top" v-if="info.id">
			<u-status-bar></u-status-bar>
			<view class="equipment-detail-top-back">
				<view class="equipment-detail-top-back-in" @click="handleBack">
					<image class="equipment-detail-top-back-in-img" src="@/static/images/store/back.png"></image>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="equipment-detail-bottom" v-if="info.id && modelInfo.id">
			<view class="equipment-detail-title">{{ info.title }}</view>
			<view class="equipment-detail-multi" v-if="modelInfo.multi && modelInfo.multi.length" :key="refreshKey">
				<u-swiper :height="160" :list="modelInfo.multi" @change="e => currentNum = e.current" :autoplay="false" @click="handleClickSwiper"
					indicatorStyle="right: 20px">
					<view slot="indicator" class="indicator-num">
						<text class="indicator-num__text">{{ currentNum + 1 }}/{{ modelInfo.multi.length }}</text>
					</view>
				</u-swiper>
			</view>
			<view class="equipment-detail-tags">
				<text class="item-right-tag-in">
					<text class="tag-in-text">器材</text>
					<text class="tag-in-point">·</text>
				</text>
				<text class="item-right-tag-in" >
					<text class="tag-in-text">{{ info.equipment_type_show }}</text>
				</text>
			</view>
			<view class="equipment-detail-info">
				<view class="equipment-detail-info-item">
					<u-icon name="account-fill" color="#656565" size="18"></u-icon>
					<text class="equipment-detail-info-item-text">{{ modelInfo.frequency_num_show }}购买</text>
				</view>
			</view>
			<view class="equipment-detail-description">
				<s-show-more :content="info.description" :length="100"></s-show-more>
			</view>
			<view class="equipment-detail-model-title">当前选择型号： <text class="equipment-detail-model-title-in">{{ modelInfo.title }}</text></view>
			<view class="equipment-detail-model-step">
				<u-number-box v-model="selectNum" :disabled="!modelInfo.inventory" :min="modelInfo.inventory ? 1 : 0" :max="100"></u-number-box>
			</view>
			<view class="equipment-detail-models">
				<view class="equipment-detail-models-title">
					<text class="equipment-detail-models-title-left">型号列表</text>
				</view>
				<view class="equipment-detail-models-body">
					<view class="equipment-detail-models-body-item" v-for="(u,index) in models" :key="u.id" :class="{active: currentModelIndex === index, disabled: !u.inventory}" @click="handleChangeModel(index)">
						<text class="equipment-detail-models-body-item-text">{{ u.title }}</text>
					</view>
				</view>
			</view>
			<view class="equipment-detail-model-title">型号介绍</view>
			<view class="equipment-detail-description">
				<s-show-more :content="modelInfo.description" :length="100"></s-show-more>
			</view>
			<view class="equipment-detail-model-title">型号参数信息</view>
			<view class="equipment-detail-description">
				<s-show-more :content="modelInfo.parameter" :length="800"></s-show-more>
			</view>
			<view class="equipment-detail-model-big-title">器材详细介绍</view>
			<view class="equipment-detail-long">
				<image v-for="(u,index) in info.longs" :key="index" :src="u" class="equipment-detail-long-img"></image>
			</view>
			<view class="equipment-detail-zhanwei"></view>
			<u-safe-bottom></u-safe-bottom>
		</scroll-view>
		<view class="equipment-detail-footer" v-if="info.id && modelInfo.id">
			<view class="equipment-detail-footer-in">
				<view class="equipment-detail-footer-left" @click="handleAddChart">
					<u-icon name="shopping-cart-fill" color="#4F68B0" size="20"></u-icon>
					<text class="equipment-detail-footer-left-text">加入购物车</text>
				</view>
				<view class="equipment-detail-footer-right" :class="{disabled: !modelInfo.inventory}" @click="handleReBuy">
					<text class="equipment-detail-footer-right-buy" v-if="modelInfo.inventory">立即购买</text>
					<text class="equipment-detail-footer-right-price" v-if="!modelInfo.is_discount && modelInfo.inventory">¥{{ modelInfo.price }}</text>
					<text class="equipment-detail-footer-right-price" v-if="modelInfo.is_discount && modelInfo.inventory">
						<text class="in-discount">¥{{ modelInfo.price }}</text>
						<text class="show-discount">¥{{ modelInfo.discount }}</text>
					</text>
					<text class="equipment-detail-footer-right-none" v-if="!modelInfo.inventory">库存不足，无法购买</text>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
	</view>
</template>

<script>
	import {
		getEquipmentByIdAction,
		getModelsByEquipmentIdAction,
		createEquipmentChartAction,
		getEquipmentsWithModelsAction
	} from '@/service/service'
	import SShowMore from '@/components/show-more/s-show-more'
	import moment from 'moment'
	export default {
		data(){
			return {
				id: '',
				show_type: '',
				info: {},
				modelInfo: {},
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				models: [],
				models_pick: [],
				models_pick_ids: [],
				currentModelIndex: 0,
				currentNum: 0,
				refreshKey: 0,
				selectNum: 1,
				showModelPick: false
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
				if (data.record) that.id = data.record.id
				that.$loadingOn()
				that.getEquipmentDetailInfo()
				that.getDetailModelsInfo()
				that.$nextTick(() => {
					
				})
			})
		},
		methods: {
			handleShowModelPick(){
				this.showModelPick = true
			},
			handleCloseModelPick(){
				this.showModelPick = false
			},
			handleReBuy(){
				if(!this.modelInfo.inventory){
					return
				}
				this.$loadingOn()
				getEquipmentsWithModelsAction(this.info.id).then(res=>{
					const equipments = res.data ? [...res.data] : []
					let origin_equipments = [{...this.info, models: [{...this.modelInfo, add_num: this.selectNum}]}]
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
						this.$toast('器材已下架，请刷新重试')
						this.$loadingOff()
						return
					}else if(no_inventory_symbol){
						this.$toast('该型号已售罄，请刷新重试')
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
			handleAddChart(){
				this.$loadingOn()
				createEquipmentChartAction({
					equipment_id: this.info.id,
					equipment_model_id: this.modelInfo.id,
					add_num: this.selectNum
				}).then(res=>{
					this.$loadingOff()
					this.$toast('已加入购物车~')
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleChangeModel(index){
				if(index !== this.currentModelIndex){
					this.$loadingOn()
					this.currentModelIndex = index
					this.getEquipmentDetailInfo()
					this.getDetailModelsInfo()
				}
			},
			handleClickSwiper(index){
				// 预览图片
				uni.previewImage({
					urls: this.modelInfo.multi,
					current: index,
					indicator: 'number'
				});
			},
			getEquipmentDetailInfo() {
				getEquipmentByIdAction(this.id).then(res => {
					this.info = {
						...res.data
					}
					this.info.frequency_total_num_show = (this.info.frequency_total_num > 1000 && this.info.frequency_total_num <=
							10000) ? `${Math.floor(this.info.frequency_total_num / 1000)}k+` : (this.info
							.frequency_total_num > 10000 && this.info.frequency_total_num <= 100000) ?
						`${Math.floor(this.info.frequency_total_num / 10000)}k+` : this.info.frequency_total_num
					const equipment_type_map = ['康复训练器材', '康复理疗设备', '康复治疗师工具']
					this.info.equipment_type_show = equipment_type_map[this.info.equipment_type]
					this.info.longs = this.info.long_figure.split(',').map(url=>this.baseUrl+url)
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			getDetailModelsInfo() {
				getModelsByEquipmentIdAction(this.id).then(res => {
					this.models = res.data ? [...res.data] : [],
					this.models.map(item=>{
						item.multi = item.multi_figure.split(',').map(url=>this.baseUrl+url)
						item.frequency_num_show = (item.frequency_num > 1000 && item.frequency_num <=
								10000) ? `${Math.floor(item.frequency_num / 1000)}k+` : (item.frequency_num > 10000 && item.frequency_num <= 100000) ?
							`${Math.floor(item.frequency_num / 10000)}k+` : item.frequency_num
					})
					this.modelInfo = this.models[this.currentModelIndex] || {}
					this.selectNum = this.modelInfo.inventory ? 1 : 0
					this.currentNum = 0
					this.refreshKey ++
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleBack() {
				uni.navigateBack()
			}
		}
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
		
		.confirm-start-footer{
			width: 100%;
			margin-top: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.confirm-start-footer-in{
				width: 160rpx;
				height: 60rpx;
				white-space: nowrap;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #4F68B0;
				color: #fff;
				font-weight: bold;
				font-size: 12px;
			}
		}
		
		.confirm-start-body-model{
			width: 100%;
			margin-top: 24rpx;
			
			.confirm-start-body-model-item{
				width: 100%;
				margin-bottom: 24rpx;
				display: flex;
				justify-content: space-between;
				position: relative;
				box-sizing: border-box;
				border: 2rpx solid #fff;
				border-radius: 12rpx;
				
				&.active{
					border: 2rpx solid #4F68B0;
				}
				
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
	
	.equipment-detail-footer{
		position: fixed;
		left: 0;
		bottom: 0;
		background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 100%);
		box-sizing: border-box;
		width: 100%;
		z-index: 99;
		
		.equipment-detail-footer-in{
			width: 100%;
			box-sizing: border-box;
			padding: 60rpx 48rpx 24rpx 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.equipment-detail-footer-left{
				border-radius: 24rpx;
				padding: 0 24rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				border: 1px solid #4F68B0;	
				margin-right: 36rpx;
				
				.equipment-detail-footer-left-text{
					color: #4F68B0;
					font-size: 12px;
					font-weight: bold;
					padding-left: 4rpx;
				}
			}
			
			.equipment-detail-footer-right{
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
				
				.equipment-detail-footer-right-buy{
					padding-right: 16rpx;
				}
				
				.equipment-detail-footer-right-price{
					
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
				
				&.disabled{
					background: #E3E0E1;
					color: #999;
					
					.equipment-detail-footer-right-none{
						color: #999;
					}
				}
			}
		}
	}
	
	.equipment-detail-wrapper{
		width: 100vw;
		height: 100vh;
		
		.equipment-detail-top{
			width: 100%;
			position: relative;
			
			.equipment-detail-top-back{
				width: 100%;
				box-sizing: border-box;
				padding-left: 32rpx;
				padding-top: 24rpx;
				padding-bottom: 12rpx;
				
				.equipment-detail-top-back-in{
					width: 48rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #fff;
					border-radius: 50%;
					
					.equipment-detail-top-back-in-img{
						width: 32rpx;
						height: 32rpx;
					}
				}
			}
			
		}
		
		.equipment-detail-bottom{
			height: calc(100vh - 100rpx);
			width: 100%;
			background: #fff;
			box-sizing: border-box;
			padding: 24rpx 36rpx;
			
			.equipment-detail-title{
				font-size: 20px;
				font-weight: bold;
				color: #333;
			}
			
			.equipment-detail-model-title{
				margin-top: 24rpx;
				font-size: 12px;
				font-weight: bold;
				color: #333;
				
				.equipment-detail-model-title-in{
					font-weight: normal;
				}
			}
			
			.equipment-detail-model-big-title{
				margin-top: 24rpx;
				font-size: 14px;
				font-weight: bold;
				color: #333;
			}
			
			.equipment-detail-long{
				margin-top: 24rpx;
				width: 100%;
				display: flex;
				flex-direction: column;
				
				.equipment-detail-long-img{
					width: 100%;
				}
			}
			
			.equipment-detail-multi{
				width: 100%;
				margin-top: 32rpx;
				
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
			}
			
			.equipment-detail-tags{
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
			
			.equipment-detail-info{
				width: 100%;
				margin-top: 12rpx;
				display: flex;
				align-items: center;
				
				.equipment-detail-info-item{
					display: flex;
					align-items: center;
					margin-right: 32rpx;
					
					.equipment-detail-info-item-text{
						font-size: 11px;
						color: #656565;
						font-weight: 700;
						padding-left: 4rpx;
					}
				}
			}
			
			.equipment-detail-zhanwei{
				width: 100%;
				height: 168rpx;
			}
			
			.equipment-detail-description{
				width: 100%;
				margin-top: 24rpx;
			}
			
			.equipment-detail-model-step{
				margin-top: 24rpx;
			}
			
			.equipment-detail-models{
				width: 100%;
				margin-top: 24rpx;
				
				.equipment-detail-models-title{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.equipment-detail-models-title-left{
						font-size: 14px;
						font-weight: bold;
						color: #333;
					}
					
					.equipment-detail-models-title-right{
						font-size: 12px;
						color: #656565;
						font-weight: 700;
					}
				}
				
				.equipment-detail-models-body{
					margin-top: 24rpx;
					width: 100%;
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					
					.equipment-detail-models-body-text{
						font-size: 13px;
						margin-bottom: 16rpx;
						
						.equipment-detail-models-body-text-in{
							font-weight: bold;
						}
					}
					
					.equipment-detail-models-body-item{
						box-sizing: border-box;
						padding: 4rpx 12rpx;
						border-radius: 12rpx;
						margin-right: 24rpx;
						flex-shrink: 0;
						border: 1px solid #E3E0E1;
						
						.equipment-detail-models-body-item-text{
							font-size: 12px;
							color: #333;
							font-weight: bold;
							white-space: nowrap;
						}
						
						&.disabled{
							text-decoration:line-through;
							color: #999;
							
							.equipment-detail-models-body-item-text{
								color: #999;
							}
						}
						
						&.active{
							border: none;
							background: #4F68B0;
							
							.equipment-detail-models-body-item-text{
								color: #fff;
							}
							
							&.disabled{
								text-decoration:line-through;
								color: #999;
								border: 1px solid #4F68B0;
								background: #fff;
								
								.equipment-detail-models-body-item-text{
									color: #999;
								}
							}
						}
					}
				}
			}
		}
	}
</style>