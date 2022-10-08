<template>
	<view class="store-wrapper" :class="{hiden: visible}">
		<u-status-bar></u-status-bar>
		<view class="banner-top">
			<view class="index-switch">
				<view class="index-switch-section" @click="handleChangeType">
					<view class="index-switch-section-item">课程商城</view>
					<view class="index-switch-section-item">器材商城</view>
					<view class="index-switch-section-wipe" :class="{'to-right': showType === 'equipment'}">{{ showType === 'course' ? '课程商城' : '器材商城' }}</view>
				</view>
			</view>
		</view>
		<Course :courseCharts="courseCharts" v-show="showType === 'course'" ref="Course" />
		<Equipment :equipmentCharts="equipmentCharts" v-show="showType === 'equipment'" ref="Equipment" />
	</view>
	
</template>

<script>
	import Course from '@/pages_store/course.vue'
	import Equipment from '@/pages_store/equipment.vue'
	import {
		getCourseChartListAction,
		getEquipmentChartListAction
	} from '@/service/service'
	export default {
		components: {
			Course,
			Equipment
		},
		data() {
			return {
				ifSticky: false,
				visible: false,
				itemStyle: {
					height: '38px',
					fontWeight: 'bold',
					fontSize: '18px'
				},
				listTitle: [
					{
						name: '智能处方',
					},
					{
						name: '康复评估'
					}
				],
				menuBaseUrl: 'https://cdn.uviewui.com/uview/menu/',
				title: 'Hello',
				current: 0,
				message: 998,
				showType: 'course',
				courseCharts: 0,
				equipmentCharts: 0
			}
		},
		onShow(){
			this.getCourseChart()
			this.getEquipmentChart()
		},
		methods: {
			getCourseChart(){
				return new Promise((resolve, reject) => {
					getCourseChartListAction().then(res=>{
						const data = res.data ? [...res.data] : []
						this.courseCharts = data.length
						resolve(data)
					}).catch(err=>{
						reject(err)
					})
				})
			},
			getEquipmentChart(){
				return new Promise((resolve, reject) => {
					getEquipmentChartListAction().then(res=>{
						const data = res.data ? [...res.data] : []
						const outerList = []
						data.map(item=>{
							if(!outerList.find(itemIn=>itemIn.id===item.equipment_id)){
								outerList.push({
									id: item.equipment_id
								})
							}
						})
						this.equipmentCharts = outerList.length
						resolve(data)
					}).catch(err=>{
						reject(err)
					})
				})
			},
			showCamera(){
				
			},
			changeTabs(info){
				console.log('info', info)
				this.current = info.index
			},
			handleShowTips() {
				const that = this
				uni.navigateTo({
					url: "/pages_index/painQAPublish"
				})
			},
			handleShowPrescription(){
				console.log('显示弹窗')
				this.visible = true
			},
			handleHidePrescription(){
				console.log('关闭弹窗')
				this.visible = false
			},
			onPageScroll(res) {
				this.ifSticky = res.scrollTop >= 14
			},
			handleChangeType(){
				this.showType = this.showType === 'equipment' ? 'course' : 'equipment'
			}
		}
	}
</script>

<style lang="scss">
	
	.store-wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		position: relative;
		background: #fff;
		overflow: hidden;
		
		.banner-top{
			width: 100%;
			
			.index-switch{
				width: 100%;
				box-sizing: border-box;
				padding: 24rpx;
				
				.index-switch-section{
					width: 260rpx;
					height: 60rpx;
					border-radius: 30rpx;
					background: #F3F3F6;
					position: relative;
					display: flex;
					align-items: center;
					
					.index-switch-section-item{
						width: 50%;
						height: 100%;
						color: #B0B3BC;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						white-space: nowrap;
					}
					
					.index-switch-section-wipe{
						width: 130rpx;
						height: 60rpx;
						box-sizing: border-box;
						border: 2px solid #fff;
						border-radius: 30rpx;
						box-shadow: rgba(79,104,176, 0.3) 0px 14px 24px, rgba(79,104,176, 0.22) 0px 9px 8px;
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
						
						&.to-right{
							left: 50%;
						}
					}
				}
			}
		}
	}

</style>
