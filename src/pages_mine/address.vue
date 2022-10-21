<template>
	<view class="address-wrapper">
		<view class="address-top">
			<view class="top-back" @click="close">
				<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
				<text>返回</text>
			</view>
			<text class="top-title">地址管理</text>
		</view>
		<view class="address-bottom">
			<mescroll-uni ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '没有更多~', offset: 0}" :fixed="false">
				<view class="address-bottom-empty" v-if="!dataSource.length">
					<image src="@/static/images/recovery/empty-data.png" class="address-bottom-empty-img"></image>
					<text class="address-bottom-empty-text">暂无地址~</text>
					<view class="address-bottom-empty-button" @click="handleShowAddressDetail(null)">新建地址</view>
				</view>
				<view class="address-bottom-body">
					<view class="address-bottom-tip" v-if="dataSource.length">您可以左滑地址来编辑或删除</view>
					<uni-swipe-action>
						<!-- 基础用法 -->
						<uni-swipe-action-item @click="(e) => onClickItemIn(e, u)" :right-options="options" v-for="(u, index) in dataSource" :key="u.id">
							<view class="address-bottom-item">
								<view class="address-bottom-item-left" @click="handleSetDefault(u)">
									<image class="address-bottom-item-left-img" src="@/static/images/mine/active-address.png" v-if="u.id === info.default_address_id"></image>
									<image class="address-bottom-item-left-img" src="@/static/images/mine/normal-address.png" v-else></image>
								</view>
								<view class="address-bottom-item-right">
									<view class="address-bottom-item-right-top">
										<view class="address-bottom-item-right-top-name">
											<u-icon name="account-fill" color="#333" size="32rpx"></u-icon>
											<view class="address-bottom-item-right-top-name-text">{{ u.name }}</view>
										</view>
										<view class="address-bottom-item-right-top-phone">
											<u-icon name="phone-fill" color="#333" size="32rpx"></u-icon>
											<view class="address-bottom-item-right-top-phone-text">{{ u.phone }}</view>
										</view>
									</view>
									<view class="address-bottom-item-right-bottom">
										<u-icon name="car-fill" color="#333" size="32rpx"></u-icon>
										<view class="address-bottom-item-right-bottom-text">{{ u.all_text }}</view>
									</view>
								</view>
								<view class="address-bottom-item-normal" v-if="u.id === info.default_address_id">
									<image class="address-bottom-item-normal-img" src="@/static/images/mine/default-address.png"></image>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
				<view class="address-bottom-add" v-if="dataSource.length">
					<view class="address-bottom-add-button" @click="handleShowAddressDetail(null)">新建地址</view>
				</view>
			</mescroll-uni>
		</view>
		<u-modal :show="showModal" showCancelButton confirmColor="#4F68B0" @confirm="handleDeleteOneAddress"
			@cancel="handleCancelAddress" @close="handleCloseAddress" content="确定删除该地址吗？"></u-modal>
	</view>
</template>

<script>
	import {
		getAddressListByJWTAction,
		updateInfoByUserIdAction,
		deleteAddressByIdAction
	} from '@/service/service'
	export default {
		data(){
			return {
				showModal: false,
				dataSource: [],
				options: [
					{
						text: '编辑',
						style: {
							backgroundColor: '#007aff'
						}
					}, 
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				deleting_id: ''
			}
		},
		onShow() {
			this.$loadingOn()
			Promise.all([
				this.getData(),
				this.$store.dispatch('getInfo')
			]).then(()=>{
				this.$loadingOff()
			})
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			},
			info(){
				return this.$store.state.user.info
			}
		},
		methods: {
			onClickItemIn(e, record){
				console.log('eeee', e)
				// e.index
				if(e.index === 0){
					this.handleShowAddressDetail(record.id)
				}else if(e.index === 1){
					this.deleting_id = record.id
					this.handleShowDeleteAddress()
				}
			},
			handleSetDefault(record){
				console.log('record', record)
				if(record.id === this.info.default_address_id) {
					return
				}
				this.$loadingOn()
				updateInfoByUserIdAction(this.userInfo.id, {default_address_id: record.id}).then(res=>{
					Promise.all([
						this.getData(),
						this.$store.dispatch('getInfo')
					]).then(()=>{
						this.$loadingOff()
					})
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			close() {
				uni.navigateBack()
			},
			handleShowDeleteAddress(){
				this.showModal = true
			},
			handleCancelAddress(){
				this.showModal = false
				this.deleting_id = ''
			},
			handleCloseAddress(){
				this.showModal = false
				this.deleting_id = ''
			},
			handleDeleteOneAddress(){
				this.$loadingOn()
				deleteAddressByIdAction(this.deleting_id).then(res=>{
					Promise.all([
						this.getData(),
						this.$store.dispatch('getInfo')
					]).then(()=>{
						this.$loadingOff()
						this.deleting_id = ''
						this.showModal = false
					})
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleShowAddressDetail(id){
				const that = this
				uni.navigateTo({
					url: "/pages_mine/address-detail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							id
						})
					}
				})
			},
			handleRefreshDown(mescroll) {
				this.getData().then(res=>{
					mescroll.endSuccess(res.length, false)
				}).catch(err=>{
					mescroll.endErr()
				})
			},
			getData(){
				return new Promise((resolve, reject) => {
					getAddressListByJWTAction().then(res=>{
						const data = res.data ? [...res.data] : []
						this.dataSource = [...data]
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
	.address-wrapper{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		
		.address-top {
			box-sizing: border-box;
			width: 100%;
			height: 200rpx;
			background: #4F68B0;
			margin-bottom: 40rpx;
			display: flex;
			align-items: flex-end;
			padding-bottom: 30rpx;
			position: relative;
		
			.top-back {
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				left: 20rpx;
				bottom: 30rpx;
				font-size: 16px;
				color: #fff;
			}
		
			.top-title {
				text-align: center;
				width: 100%;
				font-size: 16px;
				color: #fff;
			}
		}
		
		.address-bottom{
			height: calc(100vh - 200rpx);
			width: 100%;
			box-sizing: border-box;
			padding: 24rpx;
			
			.address-bottom-empty {
				width: 100%;
				margin-top: 24rpx;
				margin-bottom: 24rpx;
			}
			
			.address-bottom-empty {
				width: 100%;
				padding: 48rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				box-sizing: border-box;
				margin-top: 100rpx;
			
				.address-bottom-empty-img {
					width: 160rpx;
					height: 160rpx;
					margin-bottom: 24rpx;
				}
			
				.address-bottom-empty-text {
					font-size: 13px;
					color: #DAE1F4;
				}
				
				.address-bottom-empty-button{
					margin-top: 96rpx;
					font-size: 14px;
					color: #fff;
					background: #4F68B0;
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					white-space: nowrap;
					width: 180rpx;
					height: 60rpx;
				}
			}
			
			.address-bottom-tip{
				font-size: 12px;
				color: #999;
				margin-bottom: 24rpx;
			}
			
			.address-bottom-add{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 24rpx;
				
				.address-bottom-add-button{
					margin-top: 96rpx;
					font-size: 14px;
					color: #fff;
					background: #4F68B0;
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					white-space: nowrap;
					width: 180rpx;
					height: 60rpx;
				}
			}
			
			.address-bottom-body{
				width: 100%;
				
				.uni-swipe{
					margin-bottom: 24rpx !important;
				}
				
				.address-bottom-item{
					width: 100%;
					display: flex;
					position: relative;
					box-sizing: border-box;
					padding: 24rpx 0;
					
					.address-bottom-item-normal{
						width: 72rpx;
						height: 72rpx;
						position: absolute;
						right: 0;
						top: 0;
						
						.address-bottom-item-normal-img{
							width: 72rpx;
							height: 72rpx;
						}
					}
					
					.address-bottom-item-left{
						width: 48rpx;
						height: 48rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 24rpx;
						
						.address-bottom-item-left-img{
							width: 48rpx;
							height: 48rpx;
						}
					}
					
					.address-bottom-item-right{
						width: calc(100% - 48rpx);
						
						.address-bottom-item-right-top{
							width: 100%;
							display: flex;
							align-items: center;
							
							.address-bottom-item-right-top-name{
								display: flex;
								align-items: center;
								margin-right: 24rpx;
								
								.address-bottom-item-right-top-name-text{
									font-size: 12px;
								}
							}
							
							.address-bottom-item-right-top-phone{
								display: flex;
								align-items: center;
								margin-right: 24rpx;
								
								.address-bottom-item-right-top-phone-text{
									font-size: 12px;
								}
							}
						}
						
						.address-bottom-item-right-bottom{
							width: 100%;
							display: flex;
							align-items: center;
							margin-top: 12rpx;
							
							.address-bottom-item-right-bottom-text{
								font-size: 12px;
							}
						}
					}
				}
			}
		}
	}
</style>