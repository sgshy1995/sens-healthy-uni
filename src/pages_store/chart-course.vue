<template>
	<view class="chart-inner">
		<view class="chart-select" v-if="coursesList.length">
			<view class="chart-select-text">已选择 {{ selectedList.length }} 件课程商品</view>
		</view>
		<view class="chart-bottom">
			<view class="chart-bottom-body">
				<mescroll-uni ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
					<view class="chart-bottom-empty" v-if="!coursesList.length">
						<image src="@/static/images/recovery/empty-data.png" class="chart-bottom-empty-img"></image>
						<text class="chart-bottom-empty-text">购物车空空如也，快去挑选商品吧~</text>
					</view>
					<view class="chart-bottom-body-item" v-for="(u, index) in coursesList" :key="u.id">
						<view class="chart-left-icon-delete" @click="handleDeleteCourseChart(u)">
							<u-icon name="close" color="#676767" size="32rpx"></u-icon>
						</view>
						<view class="chart-left-icon">
							<view class="chart-left-icon-select" @click="handleSelectInfo(index)" :class="{active: selectedList.includes(u.id)}">
								<view class="chart-left-icon-select-in">
									<u-icon name="checkbox-mark" color="#fff" size="28rpx"></u-icon>
								</view>
							</view>
						</view>
						<view class="chart-right-content">
							<view class="body-item-top">
								<view class="body-item-top-left">
									<image class="body-item-top-left-img" :src="baseUrl + u.course_info.cover"></image>
								</view>
								<view class="body-item-top-right">
									<view class="body-item-top-right-title">{{ u.course_info.title }}</view>
									<view class="body-item-top-right-tag">
										<text class="item-right-tag-in">
											<text class="tag-in-text">{{ u.add_course_type ? '面对面康复指导' : '专业能力提升' }}</text>
											<text class="tag-in-point">·</text>
										</text>
										<text class="item-right-tag-in" >
											<text class="tag-in-text">{{ u.course_info.course_type_show }}</text>
											<text class="tag-in-point">·</text>
										</text>
										<text class="item-right-tag-in">
											<text class="tag-in-text">{{ u.add_course_type ? `${u.course_info.live_num}次直播` : `${u.course_info.video_num}视频` }}</text>
										</text>
									</view>
									<view class="body-item-top-right-description">{{ u.course_info.description }}</view>
									<view class="body-item-top-right-price">
										售价: <text class="body-item-top-right-price-in" v-if="!u.course_info.is_discount">¥ {{ u.course_info.price }}</text>
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
		getCourseChartListAction,
		deleteCourseChartByIdAction,
		deleteCourseChartsByUserAction
	} from '@/service/service'
	export default {
		data(){
			return {
				coursesList: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				selectedList: [],
				selectedRowList: []
			}
		},
		mounted() {
			this.$loadingOn()
			this.getCourseChart().then(()=>{
				this.selectedList = this.coursesList.map(item=>item.id)
			})
		},
		watch: {
			selectedList: {
				handler(){
					this.selectedRowList = this.selectedList.map(id=>this.coursesList.find(item=>item.id === id))
					const totalInfo = {
						num: 0,
						originTotal: 0,
						discountTotal: 0
					}
					totalInfo.num = this.selectedList.length
					this.selectedRowList.map(item=>{
						totalInfo.originTotal += Number(item.course_info.price)
						totalInfo.discountTotal += (item.course_info.is_discount ? Number(item.course_info.discount) : Number(item.course_info.price))
					})
					this.$emit('change', totalInfo)
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			handleDeleteCourseChart(record){
				this.$loadingOn()
				deleteCourseChartByIdAction(record.id).then(res=>{
					this.$loadingOff()
					this.$toast('已从购物车搬走一件商品~');
					let findIndex = this.selectedList.indexOf(record.id)
					if(findIndex > -1){
						this.selectedList.splice(findIndex, 1)
					}
					this.getCourseChart()
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleSelectInfo(index){
				let findIndex = this.selectedList.indexOf(this.coursesList[index].id)
				if(findIndex > -1){
					this.selectedList.splice(findIndex, 1)
				}else{
					this.selectedList.push(this.coursesList[index].id)
				}
			},
			handleSelectAll(){
				this.selectedList = this.coursesList.map(item=>item.id)
			},
			handleSelectClear(){
				this.selectedList = []
			},
			handleRefreshDown(mescroll) {
				this.getCourseChart().then(res=>{
					mescroll.endSuccess(res.length, false)
				}).catch(err=>{
					mescroll.endErr()
				})
			},
			getCourseChart(){
				return new Promise((resolve, reject) => {
					getCourseChartListAction().then(res=>{
						const data = res.data ? [...res.data] : []
						const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
						data.map(item=>{
							item.course_info.course_type_show = course_type_map[item.course_info.course_type]
							item.course_info.url = this.baseUrl + item.course_info.cover
						})
						this.coursesList = [...data]
						this.$emit('load', this.coursesList.length)
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