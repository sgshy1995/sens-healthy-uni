<template>
	<view class="authenticate-manage-wrapper">
		<view class="authenticate-manage-box">
			<view class="authenticate-manage-top">
				<view class="top-back" @click="leftClick">
					<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
					<text>返回</text>
				</view>
				<text class="top-title">认证管理</text>
			</view>
			<view class="authenticate-manage-body-outer">
				<mescroll-uni ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
					<view class="authenticate-manage-body">
						<view class="authenticate-manage-body-title">{{ form.id ? '有认证记录' : '暂无认证记录' }}</view>
						<view class="authenticate-manage-body-item" v-if="form.id">
							<view class="authenticate-manage-body-item-time">提交时间: {{ form.created_at_show }}</view>
							<view class="authenticate-manage-body-item-status">状态: <text class="authenticate-manage-body-item-status-in" :class="[`status-${form.status}`]"> {{ form.status_show }}</text></view>
							<view class="authenticate-manage-body-item-audit" v-if="form.status === 3 && form.validity_time">有效期: {{ form.validity_time_show }}</view>
							<view class="authenticate-manage-body-item-audit" v-if="(form.status === 1 || form.status === 3) && form.audit_info">审核意见: {{ form.audit_info }}</view>
						</view>
						<view class="authenticate-manage-body-add">
							<view class="authenticate-manage-body-add-button" v-if="!form.id || (form.id && form.status === 0)" @click="handleShowAuthenticateDetail(null)">提交认证</view>
							<view class="authenticate-manage-body-add-button" v-if="form.id && form.status === 1" @click="handleShowAuthenticateDetail('reback')">重新提交认证</view>
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		findOneAuthenticateByUserIdAction
	} from '@/service/service'
	import moment from 'moment'
	export default {
		data() {
			return {
				form: {},
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/'
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.user.userInfo
			},
			info() {
				return this.$store.state.user.info
			}
		},
		onLoad(){
			this.$loadingOn()
		},
		onShow(){
			this.$loadingOn()
			this.getData().then(res => {
				this.form = res ? {...res} : {}
				this.$loadingOff()
			}).catch(err=>{
				this.$loadingOff()
			})
		},
		methods: {
			handleShowAuthenticateDetail(reback){
				const that = this
				uni.navigateTo({
					url: "/pages_mine/updateAuthenticate",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							reback
						})
					}
				})
			},
			getData(){
				return new Promise((resolve, reject) => {
					findOneAuthenticateByUserIdAction().then(res=>{
						const data = res.data ? {...res.data} : null
						if(data){
							const status_map = ['失效', '驳回', '待审核', '审核通过']
							data.status_show = status_map[data.status]
							data.created_at_show = moment(new Date(data.created_at), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
							data.validity_time_show = moment(new Date(data.validity_time), 'YYYY-MM-DD').format('YYYY-MM-DD')
						}
						resolve(data)
					}).catch(err=>{
						reject(err)
					})
				})
			},
			leftClick() {
				this.close()
			},
			close() {
				uni.navigateBack()
			},
			handleRefreshDown(mescroll) {
				this.getData().then(res=>{
					this.form = res ? {...res} : {}
					mescroll.endSuccess(1, false)
				}).catch(err=>{
					mescroll.endErr()
				})
			}
		}

	}
</script>

<style lang="scss">
	.authenticate-manage-wrapper {
		width: 100vw;
		height: 100vh;
		
		.agree-title{
			font-size: 14px;
			font-weight: bold;
		}
		
		.agree-h6{
			font-size: 14px;
			box-sizing: border-box;
			margin-top: 24rpx;
			
			.agree-h6-point{
				padding-right: 6rpx;
				font-weight: bold;
			}
		}
		
		.agree-button{
			margin-top: 24rpx;
			box-sizing: border-box;
			padding-bottom: 12rpx;
		}

		.authenticate-manage-box {
			width: 100%;
			height: 100%;

			.slot-right {
				background: #fff;
				color: #4F68B0;
				padding: 0 20rpx;
				box-sizing: border-box;
				font-size: 14px;
				height: 44rpx;
				border-radius: 22rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		
		.authenticate-manage-top {
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
		
		.authenticate-manage-body-outer{
			width: 100%;
			height: 1200rpx;
		}

		.authenticate-manage-body {
			width: 100%;
			box-sizing: border-box;
			padding: 0 24rpx;

			.authenticate-manage-body-title{
				width: 100%;
				font-size: 14px;
				margin-bottom: 24rpx;
			}
			
			.authenticate-manage-body-item{
				width: 100%;
				border-radius: 12rpx;
				box-sizing: border-box;
				padding: 24rpx;
				box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
				margin-bottom: 48rpx;
				
				.authenticate-manage-body-item-time{
					font-size: 14px;
				}
				
				.authenticate-manage-body-item-status{
					font-size: 14px;
					margin-top: 24rpx;
					
					.authenticate-manage-body-item-status-in{
						font-weight: bold;
						padding-left: 4rpx;
						
						&.status-0{
							color: #ABB2BF;
						}
						
						&.status-1{
							color: #E45658;
						}
						
						&.status-2{
							color: #F2A442;
						}
						
						&.status-3{
							color: #5AC138;
						}
					}
				}
				
				.authenticate-manage-body-item-audit{
					font-size: 14px;
					margin-top: 24rpx;
				}
			}
			
			.authenticate-manage-body-add{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 24rpx;
				
				.authenticate-manage-body-add-button{
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
		}
	}
</style>
