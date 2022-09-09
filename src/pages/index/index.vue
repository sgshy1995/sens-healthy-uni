<template>
	<view class="index-wrapper">
		<u-status-bar></u-status-bar>
		<view class="index-wrapper-in">
			<view class="index-top">
				<view class="index-top-left">
					<view class="index-top-left-logo">
						<image class="index-top-left-logo-icon" src="@/static/images/logo.png"></image>
						<text class="index-top-left-logo-text">Sens康复</text>
					</view>
				</view>
				<view class="index-top-right">
					<view class="right-item" @click="handleShowNotice">
						<u-icon name="chat" color="#333" size="24"></u-icon>
						<view class="badge-box" :class="{'less99': message <= 99 && message >= 10, 'less10': message <10}" v-if="message">
							<u-badge numberType="overflow" type="error" max="99" :value="message"></u-badge>
						</view>
					</view>
					
					<view class="right-item" @click="handleScan">
						<u-icon name="scan" color="#333" size="24"></u-icon>
					</view>
					
					<view class="right-item avatar" @click="handleShowInfo">
						<image class="right-item-avatar" :src="userInfo.avatar ? baseUrl + userInfo.avatar : avatarDefault"></image>
					</view>
				</view>
			</view>
			<view class="index-switch">
				<view class="index-switch-section" @click="handleChangeSwitch">
					<view class="index-switch-section-item">伤痛问答</view>
					<view class="index-switch-section-item">康复资讯</view>
					<view class="index-switch-section-wipe" :class="{'to-right': switchType === 1}">{{ switchType === 0 ? '伤痛问答' : '康复资讯' }}</view>
				</view>
			</view>
		</view>
		<!-- <u-navbar placeholder title="" leftIconSize="28" border bgColor="#fff" @leftClick="showCamera" leftIcon="camera">
			<view slot="center">
				<u-tabs :current="current" @change="changeTabs" :list="listTitle" :itemStyle="itemStyle" lineColor="#4F68B0"></u-tabs>
			</view>
			<view slot="right" class="right">
				<view class="right-item" @click="handleShowNotice">
					<image class="msg-icon" src="../../static/images/home/message.png"></image>
					<text>消息</text>
					<view class="badge-box" :class="{'less99': message <= 99 && message >= 10, 'less10': message <10}" v-if="message">
						<u-badge numberType="overflow" type="error" max="99" :value="message"></u-badge>
					</view>
				</view>
				<view class="right-item" @click="handleShowPublish">
					<image class="add-icon" src="../../static/images/home/publish.png"></image>
					<text>发布</text>
				</view>
			</view>
		</u-navbar> -->
		<PainQA ref="PainQA" v-show="switchType === 0"></PainQA>
		<RehabilitationInformation v-show="switchType === 1"></RehabilitationInformation>
	</view>
</template>

<script>
	import PainQA from '@/pages_index/painQA.vue'
	import RehabilitationInformation from '@/pages_index/rehabilitationInformation.vue'
	export default {
		components: {
			PainQA,
			RehabilitationInformation
		},
		data() {
			return {
				switchType: 0,
				itemStyle: {
					height: '38px',
					fontWeight: 'bold',
					fontSize: '18px'
				},
				listTitle: [
					{
						name: '伤痛问答',
						badge: {
							isDot: true
						}
					},
					{
						name: '康复资讯'
					},
				],
				menuBaseUrl: 'https://cdn.uviewui.com/uview/menu/',
				title: 'Hello',
				current: 0,
				message: 998,
				avatarDefault: require('@/static/images/avatar-default.png'),
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/'
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		onShow() {
			if (uni.getStorageSync('SYS_AUTH_TOKEN_KEY')) {
				this.$store.dispatch('getUserInfo')
				this.$store.dispatch('getInfo')
			}
			this.$nextTick(()=>{
				if(this.$refs.PainQA){
					this.$refs.PainQA.getQuestionsList()
				}
			})
		},
		methods: {
			handleChangeSwitch(){
				this.switchType = this.switchType === 0 ? 1 : 0
				this.$nextTick(()=>{
					if(this.$refs.PainQA){
						this.$refs.PainQA.getQuestionsList()
					}
				})
			},
			showCamera(){
				
			},
			changeTabs(info){
				console.log('info', info)
				this.current = info.index
			},
			handleShowNotice() {
				const that = this
				uni.navigateTo({
					url: "/pages_index/noticePage"
				})
			},
			handleScan(){
				// 调起条码扫描
				uni.scanCode({
					scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
					success: function (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						uni.showToast({
							icon: 'none',
							title: res.result
						})
					}
				});
			},
			handleShowInfo() {
				const that = this
				uni.navigateTo({
					url: "/pages_mine/userInfo",
					success: function(res) {
					    // 通过eventChannel向被打开页面传送数据
					    res.eventChannel.emit('show', { userInfo: that.userInfo })
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.index-wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		position: relative;
		background: #fff;
		overflow: hidden;
		
		.index-wrapper-in{
			width: 100%;
			
			.index-top{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 12rpx;
				box-sizing: border-box;
				padding: 0 24rpx;
				
				.index-top-left{
					width: 100%;
					display: flex;
					align-items: center;
					
					.index-top-left-logo{
						display: flex;
						align-items: center;
						
						.index-top-left-logo-icon{
							width: 44rpx;
							height: 44rpx;
							margin-right: 12rpx;
						}
						
						.index-top-left-logo-text{
							color: #4F68B0;
							font-size: 16px;
							font-weight: 700;
						}
					}
				}
				
				.index-top-right{
					display: flex;
					align-items: center;
				}
			}
		
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
						
						&.to-right{
							left: 50%;
						}
					}
				}
			}
		}
		
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
			
			&.avatar{
				border-radius: 50%;
				border: 2px solid #fff;
				box-sizing: border-box;
				box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
				
				.right-item-avatar{
					width: 58rpx;
					height: 58rpx;
					border-radius: 50%;
				}
			}
			
			.badge-box{
				position: absolute;
				right: -36rpx;
				top: -12rpx;
				
				&.less99{
					right: -24rpx;
				}
				
				&.less10{
					right: -12rpx;
				}
			}
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
