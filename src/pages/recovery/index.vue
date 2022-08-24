<template>
	<view class="index-wrapper-outer">
		<view class="index-wrapper" :class="{hiden: visible}">
			<u-navbar placeholder title="" leftIconSize="28" border bgColor="#fff">
				<view slot="left"></view>
				<view slot="center" v-if="!ifSticky">
					<u-tabs :current="current" @change="changeTabs" :list="listTitle" :itemStyle="itemStyle" lineColor="#4F68B0"></u-tabs>
				</view>
				<view slot="right" class="right" v-if="!ifSticky">
					<view class="right-item" @click="handleShowTips">
						<image class="add-icon" src="@/static/images/recovery/tips.png"></image>
					</view>
				</view>
			</u-navbar>
			<Prescription :ifSticky="ifSticky" @hide="handleHidePrescription" @show="handleShowPrescription" v-show="current === 0"></Prescription>
		</view>
	</view>
	
</template>

<script>
	import Prescription from '@/pages_recovery/prescription.vue'
	export default {
		components: {
			Prescription
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
					},
					{
						name: '专业指导'
					}
				],
				menuBaseUrl: 'https://cdn.uviewui.com/uview/menu/',
				title: 'Hello',
				current: 0,
				message: 998
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
				this.ifSticky = res.scrollTop >= 24
			},
		}
	}
</script>

<style lang="scss">
	.index-wrapper-outer{
		width: 100vw;
		height: 100vh;
	}
	
	.index-wrapper {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: relative;
		
		.right{
			display: flex;
			align-items: center;
		}
		
		.right-item{
			flex-shrink: 0;
			margin-left: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 10px;
			flex-direction: column;
			position: relative;
		}
		
		.msg-icon{
			width: 18px;
			height: 18px;
		}
		
		.add-icon{
			width: 18px;
			height: 18px;
		}
	}
	
	
	
	.home-sticky {
		top: 0 !important;
	}
</style>
