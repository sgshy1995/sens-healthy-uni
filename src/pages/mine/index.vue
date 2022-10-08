<template>
	<scroll-view scroll-y class="mine-wrapper">
		<!-- <u-navbar placeholder title="" leftIconSize="28" border bgColor="#fff">
			<view slot="center">
				
			</view>
			<view slot="left" class="left">
				个人中心
			</view>
			<view slot="right" class="right">
				<view class="right-item" @click="handleShowInfo">
					<u-icon name="setting" color="#333" size="22"></u-icon>
				</view>
			</view>
		</u-navbar> -->
		<view class="mine-top">
			<view class="mine-top-in" :style="userInfo.background ? `background: url('${baseUrl + userInfo.background}') 100% 100% no-repeat !important;` : ''">
				<u-status-bar></u-status-bar>
				<view class="mine-top-back"></view>
				<view class="mine-top-in-avatar">
					<view class="mine-top-icons">
						<view class="mine-top-icon" @click="handleShowAction">
							<u-icon name="photo-fill" color="#fff" size="20"></u-icon>
						</view>
						<view class="mine-top-icon" @click="handleShowInfo">
							<u-icon name="setting-fill" color="#fff" size="18"></u-icon>
						</view>
					</view>
					<view class="mine-avatar-logo">
						<image class="mine-avatar-logo-in" :src="userInfo.avatar ? baseUrl + userInfo.avatar : avatarDefault" @click="showView(userInfo.avatar)"></image>
						<image v-if="userInfo.authenticate !== null" src="@/static/images/mine/auth.png" class="mine-auth-logo"></image>
					</view>
				</view>
				<view class="mine-top-in-info">
					<view class="mine-top-in-info-name">{{ userInfo.name || '森普健康用户' }}</view>
					<view class="mine-top-in-info-username">@{{ userInfo.username }}</view>
				</view>
				<view class="mine-top-in-buttons">
					<view class="mine-top-in-button">
						<u-icon name="man-add-fill" color="rgba(79,104,176, 1)" size="18"></u-icon>
						<text class="mine-top-in-button-text text-left">0</text>
						<text class="mine-top-in-button-text">关注</text>
					</view>
					<view class="mine-top-in-button button-right">
						<u-icon name="star-fill" color="rgba(79,104,176, 1)" size="18"></u-icon>
						<text class="mine-top-in-button-text text-left">0</text>
						<text class="mine-top-in-button-text">点赞</text>
					</view>
				</view>
				<view class="mine-top-in-des">
					多年康复治疗经验，资深治疗师，擅长方向：颈椎，大腿。商务联系：18201659795。
				</view>
			</view>
			<view class="mine-top-out">
				<view class="mine-top-out-info">
					<view class="mine-top-out-info-item">
						<view class="mine-top-out-item-top">
							0
						</view>
						<view class="mine-top-out-item-bottom">
							积分
						</view>
					</view>
					<view class="mine-top-out-info-item">
						<view class="mine-top-out-item-top">
							0
						</view>
						<view class="mine-top-out-item-bottom">
							新消息
						</view>
					</view>
					<view class="mine-top-out-info-item item-last">
						<view class="mine-top-out-item-top">
							0
						</view>
						<view class="mine-top-out-item-bottom">
							余额
						</view>
					</view>
					<view class="mine-top-out-info-add">充值</view>
				</view>
				<view class="mine-top-out-record" v-if="showRecord">
					<view class="mine-info-record-body">
						<view class="record-body-top" v-if="info.injury_history">
							<view class="record-body-top-left">
								<text class="top-left-text">{{ userInfo.nickname || '森普健康用户' }}</text>
								<text class="top-left-text">{{ userInfo.gender === 1 ? '男' : '女' }}</text>
								<text class="top-left-text">{{ info.age }}岁</text>
							</view>
							<view class="record-body-top-right" @click="handleUpdateRecord">
								维护信息 >
							</view>
						</view>
					
						<view class="record-body-bottom" v-if="info.injury_history">
					
							<view class="body-bottom-item">
								<view class="body-bottom-item-title">
									既往伤病史
								</view>
								<view class="body-bottom-item-content">
									{{ info.injury_history }}
								</view>
							</view>
					
							<view class="body-bottom-item">
								<view class="body-bottom-item-title">
									近期伤病描述
								</view>
								<view class="body-bottom-item-content">
									{{ info.injury_recent }}
								</view>
							</view>
					
							<view class="body-bottom-item">
								<view class="body-bottom-item-title">
									出院小结
								</view>
								<view class="body-bottom-item-content">
									{{ info.discharge_abstract }}
								</view>
							</view>
					
							<view class="body-bottom-item">
								<view class="body-bottom-item-title">
									影像学资料
								</view>
								<view class="body-bottom-item-content">
									<u-album :urls="cover" rowCount="6" multipleSize="100rpx" singleSize="600rpx" maxCount="6">
									</u-album>
								</view>
							</view>
						</view>
						
						<view class="record-body-empty" v-if="!info.injury_history">
							<view class="record-body-empty-in" @click="handleUpdateRecord">
								<image class="record-body-empty-in-img" src="@/static/images/mine/record.png"></image>
								<text class="record-body-empty-in-text">档案维护</text>
							</view>
						</view>
					</view>
				</view>
				<view class="mine-top-out-show" @click="handleShowRecord">
					<u-badge :show="!info.injury_history" :isDot="true" type="success" bgColor="#4F68B0"></u-badge>
					<text class="mine-top-out-show-text" :class="{empty: !info.injury_history}">我的伤痛档案</text>
					<u-icon name="arrow-down" v-if="!showRecord" color="#4F68B0" size="16"></u-icon>
					<u-icon name="arrow-up" v-if="showRecord" color="#4F68B0" size="16"></u-icon>
				</view>
			</view>
		</view>
		<MineInfo @show="handleShowInfo" ref="MineInfo"></MineInfo>
		<u-action-sheet @select="selectClick" cancelText="取消" :actions="actionList" :closeOnClickOverlay="true" :closeOnClickAction="true" :show="showAction" @close="handleCloseAction"></u-action-sheet>
		<u-modal :show="showModal" showCancelButton confirmColor="#4F68B0" @confirm="handleResetBackground"
			@cancel="showModal=false" content="确定将背景重置为默认吗？您的历史背景图片将会丢失"></u-modal>
	</scroll-view>
</template>

<script>
	import MineInfo from '@/pages_mine/mineInfo.vue'
	import {
		backgroundUploadAction,
		updateUserAction
	} from '@/service/service'
	export default {
		components: {
			MineInfo
		},
		data() {
			return {
				showModal: false,
				showRecord: false,
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
				message: 998,
				avatarDefault: require('@/static/images/avatar-default.png'),
				backgroundDefault: require('@/static/images/mine/back1.jpeg'),
				cover: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				showAction: false,
				actionList: [
					{
						name: '选择图片',
						index: 0
					},
					{
						name: '查看背景',
						index: 1
					},
					{
						name: '恢复默认',
						index: 2
					}
				],
				tempFilePath: ''
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			},
			info(){
				return this.$store.state.user.info
			}
		},
		watch: {
			info: {
				handler(){
					if(this.info.image_data){
						const pathList = this.info.image_data.split(',')
						this.cover = pathList.map(path=>this.baseUrl+path)
					}
				},
				deep: true,
				immediate: true
			}
		},
		onShow(){
			if (uni.getStorageSync('SYS_AUTH_TOKEN_KEY')) {
				this.$store.dispatch('getUserInfo')
				this.$store.dispatch('getInfo')
			}
		},
		onHide(){
			this.handleCloseAction()
		},
		methods: {
			selectClick(item){
				if(item.index === 0){
					this.uploadImage()
				}else if(item.index === 1){
					this.userInfo.background ? this.showView(this.userInfo.background) : uni.previewImage({
						urls: [this.backgroundDefault],
						indicator: 'none'
					});
				}else if(item.index === 2){
					this.showModal = true
				}
			},
			handleResetBackground(){
				this.$loadingOn();
				updateUserAction({id: this.userInfo.id, background: null}).then(res=>{
					this.$loadingOff();
					this.showModal = false
					this.$store.dispatch('getUserInfo')
					this.$toast(res.message || '保存成功');
				}).catch(err=>{
					this.$loadingOff();
				})
			},
			uploadImage() {
				const that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(result) {
						console.log('result path', result.tempFilePaths)
						const imgUrl = result.tempFilePaths[0]
						that.tempFilePath = imgUrl
						this.$loadingOn();
						backgroundUploadAction(that.tempFilePath).then(res => {
							console.log('res', res)
							this.$loadingOff();
							that.tempFilePath = ''
							that.$emit('change')
							that.$toast(res.message || '保存成功');
							that.$store.dispatch('getUserInfo');
						}).catch(err => {
							console.log('err', err)
							this.$loadingOff();
						})
					}.bind(this)
				})
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
			handleShowRecord(){
				this.showRecord = !this.showRecord
			},
			handleShowAction(){
				this.showAction = true
			},
			handleCloseAction(){
				this.showAction = false
			},
			showView(url) {
				if(!url) return
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + url],
					indicator: 'none'
				});
			},
			showCamera(){
				
			},
			changeTabs(info){
				console.log('info', info)
				this.current = info.index
			},
			handleShowPublish() {
				const that = this
				uni.navigateTo({
					url: "/pages_index/painQAPublish"
				})
			},
			handleShowNotice() {
				const that = this
				uni.navigateTo({
					url: "/pages_index/noticePage"
				})
			},
			handleShowInfo() {
				const that = this
				uni.navigateTo({
					url: "/pages_mine/userInfo",
					success: function(res) {
					    // 通过eventChannel向被打开页面传送数据
					    //res.eventChannel.emit('show', { userInfo: that.userInfo })
					}
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
			handleUpdateRecord() {
				const that = this
				uni.navigateTo({
					url: "/pages_mine/updateRecord"
				})
			},
		}
	}
</script>

<style lang="scss">
	.mine-wrapper {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		position: relative;
		
		.mine-top{
			width: 100%;
			position: relative;
			
			.mine-top-back{
				width: 100%;
				height: 100%;
				position: absolute;
				z-index: 1;
				background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8));
				top: 0;
				left: 0;
			}
			
			.mine-top-in{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				position: relative;
				background: url('@/static/images/mine/back1.jpeg') 100% 100% no-repeat;
				z-index: 2;
				box-sizing: border-box;
				padding-bottom: 24rpx;
				padding-top: 24rpx;
				background-size: cover;
				
				.mine-top-icons{
					position: absolute;
					z-index: 2;
					top: 0;
					right: 24rpx;
					display: flex;
					align-items: center;
					
					.mine-top-icon{
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
						margin-left: 32rpx;
						//background: rgba(123, 121, 255, 1);
						background: #4F68B0;
						display: flex;
						align-items: center;
						justify-content: center;
						transform: translateY(4rpx);
					}
				}
				
				.mine-top-in-avatar{
					width: 100%;
					position: relative;
					z-index: 2;
					display: flex;
					align-items: center;
					justify-content: center;
					
					.mine-avatar-logo{
						position: relative;
						
						.mine-avatar-logo-in{
							width: 100rpx;
							height: 100rpx;
							border-radius: 50%;
						}
						
						.mine-auth-logo{
							width: 36rpx;
							height: 36rpx;
							position: absolute;
							bottom: 6rpx;
							right: 6rpx;
							z-index: 3;
						}
					}
				}
				
				.mine-top-in-info{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					position: relative;
					z-index: 2;
					
					.mine-top-in-info-name{
						font-size: 14px;
						font-weight: 800;
						color: #fff;
						margin-top: 12rpx;
					}
					
					.mine-top-in-info-username{
						font-size: 12px;
						color: #BDB6BF;
						margin-top: 12rpx;
					}
				}
				
				.mine-top-in-buttons{
					width: 100%;
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					z-index: 2;
					
					.mine-top-in-button{
						width: 160rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 24rpx;
						border: 1px solid #4F68B0;
						box-sizing: border-box;
						box-shadow: rgba(79,104,176, 0.3) 0px 14px 24px, rgba(79,104,176, 0.22) 0px 9px 8px;
						
						.mine-top-in-button-text{
							padding-left: 2rpx;
							color: #4F68B0;
							font-size: 13px;
							font-weight: 800;
							
							&.text-left{
								padding-left: 6rpx;
							}
						}
						
						&.button-right{
							margin-left: 24rpx;
						}
					}
				}
				
				.mine-top-in-des{
					width: 70%;
					font-size: 12px;
					color: #fff;
					margin-top: 24rpx;
					position: relative;
					z-index: 2;
				}
			}
		
			.mine-top-out{
				width: 100%;
				background: #fff;
				position: relative;
				z-index: 2;
				box-shadow: rgba(0, 0, 0, 0.45) 0px 10px 20px -20px;
				box-sizing: border-box;
				padding-top: 24rpx;
				padding-bottom: 24rpx;
				
				.mine-top-out-info{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					position: relative;
					
					.mine-top-out-info-item{
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						margin-right: 64rpx;
						
						&.item-last{
							margin-right: 0;
						}
						
						.mine-top-out-item-top{
							color: #4F68B0;
							font-weight: 800;
							font-size: 16px;
							margin-bottom: 6rpx;
						}
						
						.mine-top-out-item-bottom{
							color: #BABABA;
							font-size: 13px;
						}
					}
					
					.mine-top-out-info-add{
						position: absolute;
						top: 50%;
						right: 36rpx;
						transform: translateY(-50%);
						box-sizing: border-box;
						padding: 2rpx 8rpx;
						display: flex;
						align-items: center;
						border: 1px solid #4F68B0;
						border-radius: 12rpx;
						background: #4F68B0;
						font-size: 12px;
						color: #fff;
					}
				}
				
				.mine-top-out-record {
					width: 100%;
					box-sizing: border-box;
					padding: 24rpx;
					border-top: 1px solid #eee;
					margin-top: 24rpx;
				
					.mine-info-record-title {
						font-size: 14px;
						font-weight: 700;
						margin-bottom: 24rpx;
					}
				
					.mine-info-record-body {
						width: 100%;
						border-radius: 18rpx;
						background: #fff;
						box-sizing: border-box;
						padding: 12rpx 24rpx;
				
						.record-body-top {
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: space-between;
				
							.record-body-top-left {
				
								.top-left-text {
									font-size: 13px;
									font-weight: 700;
									padding-right: 24rpx;
								}
							}
				
							.record-body-top-right {
								font-size: 13px;
								color: #999;
							}
						}
				
						.record-body-bottom {
							width: 100%;
							margin-top: 12rpx;
				
							.body-bottom-item {
								width: 100%;
								border-top: 1px solid #999;
								box-sizing: border-box;
								padding-top: 12rpx;
								margin-bottom: 12rpx;
				
								.body-bottom-item-title {
									font-size: 12px;
									font-weight: 700;
									color: #999;
									margin-bottom: 12rpx;
								}
				
								.body-bottom-item-content {
									font-size: 12px;
								}
							}
						}
						
						.record-body-empty{
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
							box-sizing: border-box;
							padding-top: 16rpx;
							
							.record-body-empty-in{
								box-sizing: border-box;
								padding: 6rpx 12rpx;
								display: flex;
								align-items: center;
								border: 1px solid #4F68B0;
								border-radius: 12rpx;
								
								.record-body-empty-in-img{
									width: 32rpx;
									height: 32rpx;
								}
								
								.record-body-empty-in-text{
									font-size: 13px;
									color: #4F68B0;
								}
							}
						}
					}
				}
				
				.mine-top-out-show{
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 24rpx;
					box-sizing: border-box;
					padding-top: 24rpx;
					border-top: 1px solid #eee;
					
					.mine-top-out-show-text{
						color: #494949;
						font-size: 12px;
						font-weight: 800;
						padding-right: 12rpx;
						
						&.empty{
							padding-left: 4rpx;
						}
					}
				}
			}
		}
		
		.left{
			font-size: 14px;
			color: #333;
		}
		
		.right{
			display: flex;
			align-items: center;
		}
		
		.right-item{
			flex-shrink: 0;
			margin-left: 52rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 10px;
			flex-direction: column;
			position: relative;
			
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
