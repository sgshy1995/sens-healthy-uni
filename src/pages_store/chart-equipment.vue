<template>
	<view class="chart-inner">
		<view class="chart-select" v-if="outerList.length">
			<view class="chart-select-text">已选择 {{ selectedList.length }} 件器材商品</view>
		</view>
		<view class="chart-bottom">
			<view class="chart-bottom-body">
				<mescroll-uni ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
					<view class="chart-bottom-empty" v-if="!outerList.length">
						<image src="@/static/images/recovery/empty-data.png" class="chart-bottom-empty-img"></image>
						<text class="chart-bottom-empty-text">购物车空空如也，快去挑选商品吧~</text>
					</view>
					<view class="chart-bottom-body-item" v-for="(u, index) in outerList" :key="u.no_use_id">
						<view class="chart-left-icon-delete" @click="handleDeleteManyCharts(u)">
							<u-icon name="close" color="#676767" size="32rpx"></u-icon>
						</view>
						<view class="chart-left-icon">
							<view class="chart-left-icon-select" @click="handleSelectInfo(index)" :class="{active: selectedList.includes(u.no_use_id), disabled: u.empty}">
								<view class="chart-left-icon-select-in">
									<u-icon name="close" v-if="u.empty" color="#C8C9CC" size="28rpx"></u-icon>
									<u-icon name="checkbox-mark" v-else color="#fff" size="28rpx"></u-icon>
								</view>
							</view>
						</view>
						<view class="chart-right-content">
							<view class="body-item-top">
								<view class="body-item-top-left">
									<image class="body-item-top-left-img" :src="u.equipment.url"></image>
								</view>
								<view class="body-item-top-right">
									<view class="body-item-top-right-title">{{ u.equipment.title }}</view>
									<view class="body-item-top-right-tag">
										<text class="item-right-tag-in" >
											<text class="tag-in-text">{{ u.equipment.equipment_type_show }}</text>
										</text>
									</view>
									<view class="body-item-top-right-description">{{ u.equipment.description }}</view>
								</view>
							</view>
							<view class="body-item-bottom">
								<view class="body-item-bottom-title">已选型号</view>
								<view class="body-item-bottom-body">
									<view class="body-item-bottom-body-item" v-for="(u1, index1) in u.models" :key="u1.id">
										<view class="body-model-delete" @click="handleDeleteOneChart(u.ids[index1], u)">
											<u-icon name="trash" color="#676767" size="36rpx"></u-icon>
										</view>
										<view class="body-model-left">
											<image class="body-model-left-img" :src="u1.url"></image>
										</view>
										<view class="body-model-right">
											<view class="body-model-right-title">{{ u1.title }}</view>
											<view class="body-model-right-description">{{ u1.description }}</view>
											<view class="body-model-right-price">
												售价: <text class="body-model-right-price-in" v-if="!u1.is_discount">¥ {{ u1.price }}</text>
												<text class="body-model-right-price-in" v-else>
													<text class="in-discount">¥ {{ u1.price }}</text>
													<text class="show-discount">¥ {{ u1.discount }}</text>
												</text>
											</view>
											<view class="body-model-right-select">
												<u-number-box @change="(info) => handleChangeNumber(info, u1.add_num, u.ids[index1])" v-model="u1.add_num" :disabled="!u1.inventory" :min="u1.inventory ? 1 : 0" :max="100"></u-number-box>
											</view>
											<view class="body-model-right-empty" v-if="!u1.inventory">
												<text class="body-model-right-empty-text">售罄</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<u-safe-bottom></u-safe-bottom>
				</mescroll-uni>
			</view>
		</view>
		<view class="sale-zhanwei"></view>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	import {
		getEquipmentChartListAction,
		deleteEquipmentChartByIdAction,
		deleteEquipmentChartsByUserAction,
		deleteEquipmentChartByIdsAction,
		updateEquipmentChartAddNumAction
	} from '@/service/service'
	export default {
		data(){
			return {
				equipmentsList: [],
				outerList: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				selectedList: [],
				realySelectedList: [],
				selectedRowList: []
			}
		},
		mounted() {
			this.$loadingOn()
			this.getEquipmentChart().then(()=>{
				this.selectedList = this.outerList.filter(item=>!item.empty).map(item=>item.no_use_id)
			})
		},
		watch: {
			selectedList: {
				handler(){
					this.renderList()
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			handleChangeNumber(info, old, id){
				this.handleUpdateNum(id, info.value < old ? 'reduce' : 'add')
			},
			handleUpdateNum(id, type){
				this.$loadingOn()
				updateEquipmentChartAddNumAction(id, type).then(res=>{
					this.getEquipmentChart()
					this.renderList()
					this.$loadingOff()
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleDeleteOneChart(id, record){
				this.$loadingOn()
				deleteEquipmentChartByIdAction(id).then(res=>{
					this.$loadingOff()
					this.$toast('已从购物车搬走一件商品~');
					let findIndex = this.selectedList.indexOf(record.ids.length === 1 && record.no_use_id)
					if(findIndex > -1){
						this.selectedList.splice(findIndex, 1)
					}
					this.getEquipmentChart()
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleDeleteManyCharts(record){
				this.$loadingOn()
				deleteEquipmentChartByIdsAction(record.ids).then(res=>{
					this.$loadingOff()
					this.$toast('已从购物车搬走一件商品~');
					let findIndex = this.selectedList.indexOf(record.no_use_id)
					if(findIndex > -1){
						this.selectedList.splice(findIndex, 1)
					}
					this.getEquipmentChart()
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			renderList(){
				this.realySelectedList = this.selectedList.map(id=>this.outerList.find(item=>item.no_use_id === id).ids).flat()
				this.selectedRowList = this.realySelectedList.map(id=>this.equipmentsList.find(item=>item.id === id))
				const totalInfo = {
					num: 0,
					originTotal: 0,
					discountTotal: 0
				}
				totalInfo.num = this.selectedList.length
				this.selectedRowList.map(item=>{
					totalInfo.originTotal += (Number(item.equipment_model_info.price) * item.add_num)
					totalInfo.discountTotal += (item.equipment_model_info.is_discount ? (Number(item.equipment_model_info.discount) * item.add_num) : (Number(item.equipment_model_info.price) * item.add_num))
				})
				this.$emit('change', totalInfo)
			},
			handleSelectInfo(index){
				if(this.outerList[index].empty){
					return
				}
				let findIndex = this.selectedList.indexOf(this.outerList[index].no_use_id)
				if(findIndex > -1){
					this.selectedList.splice(findIndex, 1)
				}else{
					this.selectedList.push(this.outerList[index].no_use_id)
				}
			},
			handleSelectAll(){
				this.selectedList = this.outerList.filter(item=>!item.empty).map(item=>item.no_use_id)
			},
			handleSelectClear(){
				this.selectedList = []
			},
			handleRefreshDown(mescroll) {
				this.getEquipmentChart().then(res=>{
					mescroll.endSuccess(res.length, false)
				}).catch(err=>{
					mescroll.endErr()
				})
			},
			getEquipmentChart(){
				return new Promise((resolve, reject) => {
					getEquipmentChartListAction().then(res=>{
						const data = res.data ? [...res.data] : []
						const equipment_type_map = ['康复训练器材', '康复理疗设备', '康复治疗师工具']
						this.outerList = []
						data.map(item=>{
							item.equipment_info.equipment_type_show = equipment_type_map[item.equipment_info.equipment_type]
							item.equipment_info.url = this.baseUrl + item.equipment_info.cover
							item.equipment_model_info.url = this.baseUrl + item.equipment_model_info.multi_figure.split(',')[0]
							if(!this.outerList.find(itemIn=>itemIn.no_use_id===item.equipment_id)){
								this.outerList.push({
									no_use_id: item.equipment_id,
									title: item.equipment_info.title,
									equipment_type_show: item.equipment_info.equipment_type_show,
									equipment: item.equipment_info,
									models: [{...item.equipment_model_info, add_num: item.add_num}],
									ids: [item.id],
									empty: false
								})
							}else{
								let findIndex = this.outerList.findIndex(itemIn=>itemIn.no_use_id===item.equipment_id)
								this.outerList[findIndex].models.push({...item.equipment_model_info, add_num: item.add_num})
								this.outerList[findIndex].ids.push(item.id)
							}
						})
						this.outerList.map(item=>{
							if(!item.models.find(itemIn=>itemIn.inventory)){
								item.empty = true
							}
						})
						this.selectedList = this.selectedList.filter(id=>!this.outerList.find(item=>item.no_use_id===id).empty)
						this.equipmentsList = [...data]
						this.$emit('load', this.outerList.filter(item=>!item.empty).length)
						this.$loadingOff()
						resolve(data)
					}).catch(err=>{
						this.$loadingOff()
						reject(err)
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.chart-inner{
		width: 100%;
		
		.chart-select{
			height: 48rpx;
			line-height: 48rpx;
			box-sizing: border-box;
			padding-left: 36rpx;
			margin-top: 4rpx;
			display: flex;
			align-items: center;
			
			.chart-select-text{
				font-size: 13px;
			}
			
			.chart-select-button{
				font-size: 13px;
				font-weight: bold;
				color: #4F68B0;
				margin-left: 24rpx;
			}
		}
		
		.sale-zhanwei{
			width: 100%;
		}
		
		.chart-bottom{
			//height: calc(100vh - 248rpx);
			height: calc(100vh - 620rpx);
			width: 100%;
			box-sizing: border-box;
			padding: 24rpx 36rpx;
			
			.chart-bottom-body{
				width: 100%;
				height: 100%;
				
				.chart-bottom-body-item{
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
				
				.chart-bottom-empty {
					width: 100%;
					margin-top: 24rpx;
					margin-bottom: 24rpx;
				}
				
				.chart-bottom-empty {
					width: 100%;
					padding: 48rpx 0;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					box-sizing: border-box;
					margin-top: 100rpx;
				
					.chart-bottom-empty-img {
						width: 100rpx;
						height: 100rpx;
						margin-bottom: 24rpx;
					}
				
					.chart-bottom-empty-text {
						font-size: 13px;
						color: #DAE1F4;
					}
				}
			}
		}
	}
</style>