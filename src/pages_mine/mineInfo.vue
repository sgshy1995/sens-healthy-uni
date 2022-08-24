<template>
	<view class="mine-info">
		
		<view class="mine-info-top">
			<view class="mine-info-top-left">
				<u-icon name="list-dot" color="#606266" size="22"></u-icon>
				<u-icon name="grid" color="#606266" size="22"></u-icon>
			</view>
			<view class="mine-info-top-right">
				<u-tabs
				        :list="listItems"
				        lineWidth="30"
				        lineColor="#4F68B0"
				        :activeStyle="{
				            color: '#303133',
				            fontWeight: 'bold',
				            transform: 'scale(1.05)'
				        }"
				        :inactiveStyle="{
				            color: '#606266',
				            transform: 'scale(1)'
				        }"
				        itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
				    >
				    </u-tabs>
			</view>
		</view>
		
		<view class="mine-info-bottom">
			
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				listItems: [
					{
						name: '我的问答'
					},
					{
						name: '我的收藏'
					},
					{
						name: '康复处方'
					},
					{
						name: '我的订单'
					}
				],
				avatarDefault: require('@/static/images/avatar-default.png'),
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/'
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		methods: {
			showView(url) {
				if(!url) return
				// 预览图片
				uni.previewImage({
					urls: [url],
					indicator: 'none'
				});
			},
			handleShowInfo() {
				const that = this
				uni.navigateTo({
					url: "/pages_mine/userInfo",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							userInfo: that.userInfo
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.mine-info {
		width: 100%;
		
		.mine-info-top{
			width: 100%;
			display: flex;
			align-items: center;
			margin-top: 24rpx;
			margin-bottom: 24rpx;
			
			.mine-info-top-left{
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 0 24rpx;
				border-right: 1px solid #606266;
			}
			
			.mine-info-top-right{
				
			}
		}

		.mine-info-items {
			width: 100%;
			margin-top: 36rpx;
			box-sizing: border-box;
			padding: 0 24rpx;

			.mine-info-items-inner {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 24rpx 48rpx;
				background: #fff;
				border-radius: 18rpx;
			}

			.items-item {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				.items-item-icon {
					width: 40rpx;
					height: 40rpx;
					margin-bottom: 24rpx;

				}

				.items-item-text {
					font-size: 13px;
				}
			}
		}

	}
</style>
