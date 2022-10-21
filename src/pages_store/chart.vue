<template>
	<view class="chart-wrapper">
		<view class="chart-top">
			<u-status-bar></u-status-bar>
			<view class="chart-top-back">
				<view class="chart-top-back-in" @click="handleBack">
					<image class="chart-top-back-in-img" src="@/static/images/store/back.png"></image>
				</view>
				<view class="chart-top-title">
					<text>我的购物车</text>
				</view>
				<view class="chart-top-right" v-if="showType === 'course'" @click="handleShowClearCourse">
					<image class="chart-top-right-img" src="@/static/images/store/clear.png"></image>
				</view>
				<view class="chart-top-right" v-else @click="handleShowClearEquipment">
					<image class="chart-top-right-img" src="@/static/images/store/clear.png"></image>
				</view>
			</view>
		</view>
		<view class="chart-switch">
			<view class="index-switch">
				<view class="index-switch-section" @click="handleChangeType">
					<view class="index-switch-section-item">课程</view>
					<view class="index-switch-section-item">器材</view>
					<view class="index-switch-section-wipe" :class="{'to-right': showType === 'equipment'}">
						{{ showType === 'course' ? '课程' : '器材' }}</view>
				</view>
			</view>
		</view>
		<chart-course @change="handleChangeSelectCourse" @load="loadCourse" :userInfo="userInfo" v-show="showType === 'course'" ref="ChartCourse"></chart-course>
		<chart-equipment @change="handleChangeSelectEquipment" @load="loadEquipment" :userInfo="userInfo" v-show="showType === 'equipment'" ref="ChartEquipment"></chart-equipment>
		<u-modal :show="showModalCourse" showCancelButton confirmColor="#4F68B0" @confirm="handleClearCourse"
			@cancel="showModalCourse=false" content="确定清空课程购物车吗？"></u-modal>
		<u-modal :show="showModalEquipment" showCancelButton confirmColor="#4F68B0" @confirm="handleClearEquipment"
			@cancel="showModalEquipment=false" content="确定清空器材购物车吗？"></u-modal>
		<view class="chart-footer" v-if="totalInfo.course_num && showType === 'course'">
			<view class="chart-footer-in">
				<view class="chart-footer-in-one">
					<view class="chart-footer-in-one-top">
						<text class="chart-footer-in-one-left">选择全部</text>
						<view class="chart-footer-in-one-right">
							<view class="chart-footer-icon-select" @click="handleSelectAllCourse" :class="{active: ifSelectAllCourse && totalInfo.course_num}">
								<view class="chart-footer-icon-select-in">
									<u-icon name="checkbox-mark" color="#fff" size="28rpx"></u-icon>
								</view>
							</view>
						</view>
					</view>
					<view class="chart-footer-in-one-bottom">
						<text class="chart-footer-in-one-left">
							<text class="chart-footer-in-one-left-left">共<text class="chart-footer-in-one-left-left-in"> {{ totalInfo.course }} </text>件商品</text>
							<text class="chart-footer-in-one-left-right">({{ totalInfo.course }}课程)</text>
						</text>
						<text class="chart-footer-in-one-right">
							<text class="chart-footer-in-one-right-price" v-if="totalInfo.originCourseTotal === totalInfo.discountCourseTotal">¥ {{ totalInfo.originCourseTotal }}</text>
							<view class="chart-footer-in-one-right-price" v-else>
								<text class="in-discount">¥ {{ totalInfo.originCourseTotal }}</text>
								<text class="show-discount">¥ {{ totalInfo.discountCourseTotal }}</text>
							</view>
						</text>
					</view>
					
				</view>
				<view class="chart-footer-in-two">
					<view class="chart-footer-right" :class="{disabled: !totalCount}" @click="handleBeginBuyCourse">
						<text class="chart-footer-right-buy">立即下单</text>
					</view>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
		<view class="chart-footer" v-if="totalInfo.equipment_num && showType === 'equipment'">
			<view class="chart-footer-in">
				<view class="chart-footer-in-one">
					<view class="chart-footer-in-one-top">
						<text class="chart-footer-in-one-left">选择全部</text>
						<view class="chart-footer-in-one-right">
							<view class="chart-footer-icon-select" @click="handleSelectAllEquipment" :class="{active: ifSelectAllEquipment && totalInfo.equipment_num}">
								<view class="chart-footer-icon-select-in">
									<u-icon name="checkbox-mark" color="#fff" size="28rpx"></u-icon>
								</view>
							</view>
						</view>
					</view>
					<view class="chart-footer-in-one-bottom">
						<text class="chart-footer-in-one-left">
							<text class="chart-footer-in-one-left-left">共<text class="chart-footer-in-one-left-left-in"> {{ totalInfo.equipment }} </text>件商品</text>
							<text class="chart-footer-in-one-left-right">({{ totalInfo.equipment }}器材)</text>
						</text>
						<text class="chart-footer-in-one-right">
							<text class="chart-footer-in-one-right-price" v-if="totalInfo.originEquipmentTotal === totalInfo.discountEquipmentTotal">¥ {{ totalInfo.originEquipmentTotal }}</text>
							<view class="chart-footer-in-one-right-price" v-else>
								<text class="in-discount">¥ {{ totalInfo.originEquipmentTotal }}</text>
								<text class="show-discount">¥ {{ totalInfo.discountEquipmentTotal }}</text>
							</view>
						</text>
					</view>
					
				</view>
				<view class="chart-footer-in-two">
					<view class="chart-footer-right" :class="{disabled: !totalCount}" @click="handleBeginBuyEquipment">
						<text class="chart-footer-right-buy">立即下单</text>
					</view>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
	</view>
</template>

<script>
	import {
		deleteCourseChartsByUserAction,
		deleteEquipmentChartsByUserAction
	} from '@/service/service'
	import ChartCourse from '@/pages_store/chart-course'
	import ChartEquipment from '@/pages_store/chart-equipment'
	import moment from 'moment'
	export default {
		data() {
			return {
				showType: 'course',
				equipmentsList: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				showModalCourse: false,
				showModalEquipment: false,
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
				selectStatus: ''
			}
		},
		components: {
			ChartCourse,
			ChartEquipment
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
				if (data.showType) that.showType = data.showType
				that.$nextTick(() => {

				})
			})
		},
		onShow(){
			this.$loadingOn()
			this.$nextTick(()=>{
				console.log('onShow onShow onShow')
				this.$refs.ChartCourse.getCourseChart().then(()=>{
					this.$refs.ChartCourse.selectedList = this.$refs.ChartCourse.coursesList.map(item=>item.id)
				})
				this.$refs.ChartEquipment.getEquipmentChart().then(()=>{
					this.$refs.ChartEquipment.selectedList = this.$refs.ChartEquipment.outerList.filter(item=>!item.empty).map(item=>item.no_use_id)
				})
			})
		},
		computed: {
			userInfo() {
				return this.$store.state.user.userInfo
			},
			originTotal(){
				return this.totalInfo.originCourseTotal + this.totalInfo.originEquipmentTotal
			},
			discountTotal(){
				return this.totalInfo.discountCourseTotal + this.totalInfo.discountEquipmentTotal
			},
			totalCount(){
				return this.totalInfo.course + this.totalInfo.equipment
			},
			ifSelectAllCourse(){
				return this.totalInfo.course === this.totalInfo.course_num
			},
			ifSelectAllEquipment(){
				return this.totalInfo.equipment === this.totalInfo.equipment_num
			},
			ifAllEmpty(){
				return this.totalInfo.course_num + this.totalInfo.equipment_num === 0
			}
		},
		methods: {
			handleBeginBuyCourse(){
				if(!this.totalInfo.course){
					return
				}
				const that = this
				uni.navigateTo({
					url: "/pages_store/payment-course",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							totalInfo: {
								...that.totalInfo,
								totalCount: that.totalCount
							},
							courses: that.$refs.ChartCourse.selectedRowList,
							mount: that.totalInfo.originCourseTotal === that.totalInfo.discountCourseTotal ?that.totalInfo.originCourseTotal : that.totalInfo.discountCourseTotal,
							order_time: moment(new Date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
							payment_origin: 'chart'
						})
					}
				})
			},
			handleBeginBuyEquipment(){
				if(!this.totalInfo.equipment){
					return
				}
				const that = this
				uni.navigateTo({
					url: "/pages_store/payment-equipment",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						const selectedOuterRowList = [...that.$refs.ChartEquipment.selectedOuterRowList]
						selectedOuterRowList.map(outer => {
							outer.models = outer.models.filter(model => model.inventory)
						})
						res.eventChannel.emit('show', {
							totalInfo: {
								...that.totalInfo,
								totalCount: that.totalCount
							},
							equipments: selectedOuterRowList,
							real_equipments: that.$refs.ChartEquipment.selectedRowList.filter(item => item.equipment_model_info.inventory),
							mount: that.totalInfo.originEquipmentTotal === that.totalInfo.discountEquipmentTotal ?that.totalInfo.originEquipmentTotal : that.totalInfo.discountEquipmentTotal,
							order_time: moment(new Date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
							total_num: that.$refs.ChartEquipment.selectedRowList.map(item => item.add_num).reduce((a,b) => a + b),
							payment_origin: 'chart'
						})
					}
				})
			},
			handleClearCourse() {
				this.$loadingOn()
				deleteCourseChartsByUserAction().then(res => {
					this.showModalCourse = false;
					this.$loadingOff()
					this.$refs.ChartCourse.getCourseChart()
					this.$nextTick(() => {
						this.$toast('购物车已清空');
						this.$refs.ChartCourse.selectedList = []
					})
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleShowClearCourse() {
				this.showModalCourse = true
			},
			handleClearEquipment() {
				console.log('handleClearEquipment')
				this.$loadingOn()
				deleteEquipmentChartsByUserAction().then(res => {
					this.showModalEquipment = false;
					this.$loadingOff()
					this.$refs.ChartEquipment.getEquipmentChart()
					this.$nextTick(() => {
						this.$toast('购物车已清空');
						this.$refs.ChartEquipment.selectedList = []
					})
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleShowClearEquipment() {
				this.showModalEquipment = true
			},
			handleBack() {
				uni.navigateBack()
			},
			handleChangeType() {
				this.showType = this.showType === 'equipment' ? 'course' : 'equipment'
			},
			handleChangeSelectCourse(info){
				this.totalInfo.course = info.num
				this.totalInfo.originCourseTotal = info.originTotal
				this.totalInfo.discountCourseTotal = info.discountTotal
			},
			handleChangeSelectEquipment(info){
				this.totalInfo.equipment = info.num
				this.totalInfo.originEquipmentTotal = info.originTotal
				this.totalInfo.discountEquipmentTotal = info.discountTotal
			},
			loadCourse(num){
				this.totalInfo.course_num = num
			},
			loadEquipment(num){
				this.totalInfo.equipment_num = num
				console.log('loadEquipment -------- loadEquipment', num)
			},
			handleSelectAllCourse(){
				if(!this.ifSelectAllCourse){
					this.$refs.ChartCourse.handleSelectAll()
				}else{
					this.$refs.ChartCourse.handleSelectClear()
				}
			},
			handleSelectAllEquipment(){
				if(!this.ifSelectAllEquipment){
					this.$refs.ChartEquipment.handleSelectAll()
				}else{
					this.$refs.ChartEquipment.handleSelectClear()
				}
			}
		}
	}
</script>

<style lang="scss">
	.chart-footer{
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
		
		.chart-footer-in{
			width: 100%;
			box-sizing: border-box;
			padding: 12rpx 48rpx 24rpx 48rpx;
			
			.chart-footer-in-one{
				width: 100%;
				
				.chart-footer-in-one-top{
					width: 100%;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
					border-bottom: 1px dashed #F6F6F6;
				}
				
				.chart-footer-in-one-bottom{
					width: 100%;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
				}
				
				.chart-footer-in-one-left{
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 12px;
					white-space: nowrap;
					
					.chart-footer-in-one-left-left{
						
						.chart-footer-in-one-left-left-in{
							font-weight: bold;
							padding: 0 4rpx;
						}
					}
					
					.chart-footer-in-one-left-right{
						padding-left: 8rpx;
						font-size: 10px;
					}
				}
				
				.chart-footer-in-one-right{
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					font-weight: bold;
					
					.chart-footer-in-one-right-price{
						font-size: 14px;
						
						.in-discount{
							text-decoration:line-through;
							color: rgba(3,3,3,0.4);
							font-size: 12px;
						}
						
						.show-discount{
							color: #333;
							padding-left: 8rpx;
						}
					}
				}
				
				.chart-footer-icon-select{
					display: flex;
					justify-content: center;
					align-items: center;
					box-sizing: border-box;
					border: 1px solid #B0B3BC;
					height: 32rpx;
					width: 32rpx;
					border-radius: 6rpx;
					
					.chart-footer-icon-select-in{
						display: none;
					}
					
					&.active{
						border-color: #4F68B0;
						background: #4F68B0;
						
						.chart-footer-icon-select-in{
							display: block;
						}
					}
				}
			}
			
			.chart-footer-in-two{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.chart-footer-right{
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
				
				.chart-footer-right-buy{
					padding-right: 0;
				}
				
				&.disabled{
					background: #EBEDF0;
					color: #C8C9CC;
				}
			}
		}
	}
	
	.chart-wrapper {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #F7F7F7;

		.chart-top {
			width: 100%;
			position: relative;

			.chart-top-back {
				width: 100%;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 36rpx;

				.chart-top-back-in {
					width: 48rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;

					.chart-top-back-in-img {
						width: 32rpx;
						height: 32rpx;
					}
				}

				.chart-top-title {
					width: 200rpx;
					font-size: 14px;
					font-weight: bold;
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.chart-top-right {
					width: 48rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;

					.chart-top-right-img {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}

		}

		.chart-switch {
			width: 100%;
			box-sizing: border-box;
			padding-left: 36rpx;
			padding-top: 12rpx;
			padding-bottom: 24rpx;
			height: 96rpx;

			.index-switch {
				width: 100%;

				.index-switch-section {
					width: 260rpx;
					height: 60rpx;
					border-radius: 30rpx;
					background: #F3F3F6;
					position: relative;
					display: flex;
					align-items: center;

					.index-switch-section-item {
						width: 50%;
						height: 100%;
						color: #B0B3BC;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						white-space: nowrap;
					}

					.index-switch-section-wipe {
						width: 130rpx;
						height: 60rpx;
						box-sizing: border-box;
						border: 2px solid #fff;
						border-radius: 30rpx;
						box-shadow: rgba(79, 104, 176, 0.3) 0px 14px 24px, rgba(79, 104, 176, 0.22) 0px 9px 8px;
						background: #4F68B0;
						position: absolute;
						top: 0;
						left: 0;
						transition: all 0.3s;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #fff;
						font-weight: 700;
						font-size: 12px;
						white-space: nowrap;

						&.to-right {
							left: 50%;
						}
					}
				}
			}
		}


	}
</style>
