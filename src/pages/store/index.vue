<template>
	<view class="store-wrapper" :class="{hiden: visible}">
		<u-status-bar></u-status-bar>
		<Course @changeType="handleChangeType" v-show="showType === 'course'" ref="Course" />
		<Equipment @changeType="handleChangeType" v-show="showType === 'equipment'" ref="Equipment" />
	</view>
	
</template>

<script>
	import Course from '@/pages_store/course.vue'
	import Equipment from '@/pages_store/equipment.vue'
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
				showType: 'course'
			}
		},
		methods: {
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
			handleChangeType(type){
				this.showType = type
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
		
		
	}

</style>
