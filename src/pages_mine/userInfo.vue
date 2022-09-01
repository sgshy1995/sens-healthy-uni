<template>
	<view class="user-info-wrapper">
		<scroll-view scroll-y class="mine-popup">
			<view class="mine-popup-top">
				<view class="top-back" @click="close">
					<u-icon name="arrow-left" color="#fff" size="18"></u-icon>
					<text>返回</text>
				</view>
				<text class="top-title">个人信息</text>
			</view>
			<u-divider text="个人信息只用于内部展示和记录,不对外公开"></u-divider>
			<view class="user-avatar">
				<view class="left">
					<u-icon name="photo-fill" color="#606266" size="22"></u-icon>用户头像
				</view>
				<view class="right" v-if="userInfo.avatar">
					<u-icon name="camera-fill" color="#606266" @click="uploadImage" size="30"></u-icon>
					<image v-if="userInfo.avatar" @click="showAvatarView" :src="baseUrl + userInfo.avatar">
					</image>
				</view>
				<u-avatar v-else icon="camera-fill" @click="uploadImage" fontSize="20"></u-avatar>
			</view>
			<u-divider text="用户信息"></u-divider>
			<u-cell-group>
				<u-cell icon="info-circle-fill" title="用户名" :value="userInfo.username"></u-cell>
				<u-cell icon="account-fill" title="昵称/姓名">
					<view slot="value" class="user-info-item" @click="handleShowName">
						<text class="in-text"
							:class="{empty: !userInfo.name}">{{ userInfo.name || '未填写' }}</text>
						<text class="in-icon">></text>
					</view>
				</u-cell>
				<u-cell icon="phone-fill" title="手机">
					<view slot="value" class="user-info-item" @click="handleShowPhone">
						<text class="in-text" :class="{empty: !userInfo.phone}">{{ userInfo.phone || '未填写' }}</text>
						<text class="in-icon">></text>
					</view>
				</u-cell>
				<u-cell icon="man-add-fill" title="性别">
					<view slot="value" class="user-info-item" @click="handleShowPickerGender">
						<text class="in-text"
							:class="{empty: !userInfo.hasOwnProperty('gender')}">{{ !userInfo.hasOwnProperty('gender') ? '未设置' : userInfo.gender === 1 ? '男' : '女' }}</text>
						<text class="in-icon">></text>
					</view>
				</u-cell>
			</u-cell-group>
			<view class="userinfo-bottom">
				<u-button color="#4F68B0" type="primary" text="退出登录" @click="handleShowModal"></u-button>
			</view>
		</scroll-view>
		<u-modal :show="showModal" showCancelButton confirmColor="#4F68B0" @confirm="handleLogout"
			@cancel="showModal=false" content="确定退出登录吗？"></u-modal>
		<TeamManageModal @ok="$emit('change')" :userInfo="userInfo" ref="TeamManageModal"></TeamManageModal>
		<image-cropper :crop-width="200" :crop-height="200" :show-reset-btn="false" :show-rotate-btn="false"
			:src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
		<u-modal title="修改昵称" :show="showModalName" showCancelButton confirmColor="#4F68B0"
			@confirm="handleUpdateName" @cancel="handleHideName">
			<view class="modal-in">
				<view class="nickname-info">修改昵称需要经过人工审核，请勿使用非法字符</view>
				<u--input placeholder="请输入昵称" border="bottom" maxlength="12" v-model="name"></u--input>
			</view>
		</u-modal>
		<u-modal :title="ifInCode ? '短信验证码验证' : '修改手机号'" :show="showModalPhone" showCancelButton confirmColor="#4F68B0" @confirm="handleUpdatePhone"
			@cancel="handleHidePhone" :confirmText="ifInCode ? '确定' : '下一步'">
			<view class="modal-in">
				<view v-if="!ifInCode" class="nickname-info">请输入要修改的大陆手机号</view>
				<view v-else class="nickname-info">请验证尾号为 {{ this.phone.substring(this.phone.length-4) }} 的手机号的短信验证码</view>
				<u--input v-if="!ifInCode" type="number" placeholder="请输入新手机号" maxlength="11" border="bottom" v-model="phone"></u--input>
				<u--input v-if="ifInCode" type="number" focus placeholder="请输入手机验证码" :maxlength="6" v-model="phone_capture" border="bottom"></u--input>
				<text v-if="ifInCode" class="form-item-email-code-tap" @tap="tapPhoneCaptcha" :class="{disabled: email_cooling}">
					{{ email_cooling ? `${emailIntervalNum}秒后获取` : '获取验证码' }}
				</text>
			</view>
		</u-modal>
		<u-picker @cancel="showPickerGender=false" @confirm="handleUpdateGender" :singleIndex="singleIndex"
			:show="showPickerGender" confirmColor="#4F68B0" :columns="columnsGender"></u-picker>
	</view>
</template>

<script>
	import Vue from 'vue';
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	import {
		logoutAction,
		avatarUploadAction,
		captureNewPhoneAction,
		updateUserAction
	} from '@/service/service'
	import { isMobile } from '@/utils/validate.js'
	export default Vue.extend({
		components: {
			ImageCropper
		},
		data() {
			return {
				ifInCode: false,
				showModal: false,
				showModalName: false,
				showModalPhone: false,
				showModalEmail: false,
				showPickerGender: false,
				customStyleIn: {
					width: '100vw'
				},
				showPopup: false,
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				tempFilePath: '',
				cropFilePath: '',
				name: '',
				phone: '',
				email: '',
				columnsGender: [
					['女', '男']
				],
				singleIndex: 0,
				device_id: '',
				email_cooling: false,
				emailIntervalNum: 0,
				emailInterval: null,
				phone_capture: ''
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		created() {
			this.device_id = uni.getSystemInfoSync().deviceId
		},
		methods: {
			getUserInfo(){
				this.$store.dispatch('getUserInfo')
			},
			handleShowPickerGender() {
				this.showPickerGender = true
				this.singleIndex = this.userInfo.gender || 0
			},
			handleUpdateGender(e) {
				this.$loadingOn();
				updateUserAction({id: this.userInfo.id, gender: e.indexs[0]}).then(res=>{
					this.$loadingOff();
					this.$store.dispatch('getUserInfo')
					this.$toast('信息已更新');
					this.showPickerGender = false
				}).catch(err=>{
					this.$loadingOff();
				})
			},
			handleUpdateName() {
				if(!this.name){
					this.$toast('请输入昵称/姓名');
				}else if(this.name.length > 8){
					this.$toast('昵称/姓名不能超过8位');
				}else{
					this.$loadingOn();
					updateUserAction({id: this.userInfo.id, name: this.name}).then(res=>{
						this.$loadingOff();
						this.handleHideName()
						this.$store.dispatch('getUserInfo')
						this.$toast('信息已更新');
					}).catch(err=>{
						this.$loadingOff();
					})
				}
			},
			handleShowName() {
				this.name = this.userInfo.name
				this.showModalName = true
			},
			handleHideName() {
				this.showModalName = false
				this.name = ''
			},
			handleUpdatePhone() {
				if(!this.ifInCode){
					if(!this.phone){
						this.$toast('请输入新的手机号');
					}else if(!isMobile(this.phone)){
						this.$toast('请输入正确的手机号');
					}else if(this.phone === this.userInfo.phone){
						this.$toast('请输入新手机号');
					}else{
						this.$loadingOn();
						this.tapPhoneCaptcha()
					}
				}else{
					if(!this.phone_capture || this.phone_capture.length !== 6){
						this.$toast('请输入短信验证码');
					}else{
						this.$loadingOn();
						updateUserAction({id: this.userInfo.id, phone: this.phone}, this.device_id, this.phone_capture).then(res=>{
							this.$store.dispatch('getUserInfo')
							this.$loadingOff();
							this.showModalPhone = false
							this.phone= ''
							this.phone_capture = ''
							this.ifInCode = false
							this.emailInterval && clearInterval(this.emailInterval)
							this.email_cooling = false
							this.emailIntervalNum = 0
							this.$toast('信息已更新');
						}).catch(err=>{
							this.$loadingOff();
						})
					}
				}
			},
			tapPhoneCaptcha(){
				this.$loadingOn();
				captureNewPhoneAction(this.device_id, this.phone, this.userInfo.username).then(res=>{
					this.$loadingOff();
					this.ifInCode = true
					this.emailStartInterval()
				}).catch(err=>{
					this.$loadingOff();
					if(err && err.data && err.data.code === 409){
						this.ifInCode = true
						this.emailStartInterval()
					}
				})
			},
			emailStartInterval() {
				this.email_cooling = true
				this.emailInterval && clearInterval(this.emailInterval)
				this.emailIntervalNum = 60
				this.emailInterval = setInterval(()=>{
					if(this.emailIntervalNum === 1){
						this.emailInterval && clearInterval(this.emailInterval)
						this.emailIntervalNum = 0
						this.email_cooling = false
					}else{
						this.emailIntervalNum -= 1
					}
				}, 1000)
			},
			handleShowPhone() {
				this.showModalPhone = true
			},
			handleUpdateEmail() {
				
			},
			handleShowEmail() {
				this.email = this.userInfo.email
				this.showModalEmail = true
			},
			handleHidePhone(){
				this.showModalPhone = false
				this.phone= ''
				this.phone_capture = ''
				this.ifInCode = false
				this.emailInterval && clearInterval(this.emailInterval)
				this.email_cooling = false
				this.emailIntervalNum = 0
			},
			close() {
				console.log('close')
				uni.navigateBack()
			},
			open() {

			},
			showTeamModal() {
				this.$refs.TeamManageModal.show();
			},
			showAvatarView() {
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + this.userInfo.avatar],
					indicator: 'none'
				});
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
					}.bind(this)
				})
			},
			confirm(e) {
				this.tempFilePath = ''
				this.cropFilePath = e.detail.tempFilePath
				avatarUploadAction(this.cropFilePath).then(res => {
					console.log('res', res)
					this.cropFilePath = ''
					this.$emit('change')
					this.$toast(res.message || '保存成功');
					this.getUserInfo();
				}).catch(err => {
					console.log('err', err)
				})
			},
			cancel() {
				this.tempFilePath = ''
			},
			handleShowModal() {
				this.showModal = true
			},
			handleLogout() {
				logoutAction(this.userInfo).then(res => {
					this.showModal = false
					uni.removeStorageSync('SYS_USER_INFO')
					uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
					uni.removeStorageSync('SYS_SWITCH_TYPE')
					this.$emit('change')
					uni.reLaunch({
						url: "/pages/guard/index?notAuth=1"
					})
				}).catch(err => {
				})
			}
		}
	})
</script>

<style lang="scss">
	.modal-in{
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.nickname-info{
		font-size: 12px;
		color: #ccc;
		margin-bottom: 12rpx;
	}
	.form-item-email-code-tap{
		box-sizing: border-box;
		padding: 4rpx 8rpx;
		font-size: 12px;
		border: 1px solid #999;
		border-radius: 12rpx;
		margin-top: 12rpx;
		background: rgba(79,104,176,0.7);
		
		&.disabled{
			background: #ddd;
			color: #999;
		}
	}
	
	.user-info-wrapper{
		width: 100vw;
		height: 100vh;
	}
	.mine-popup {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding-bottom: 40rpx;

		.user-team {
			box-sizing: border-box;
			width: 100%;

			.user-team-value {
				display: flex;
				align-items: center;

				.team-info {
					font-size: 14px;
					color: #999999;
				}

				.manage {
					display: flex;
					align-items: center;
					font-size: 12px;
					flex-direction: row;
					margin-right: 10rpx;
					margin-left: 30rpx;
				}
			}
		}

		.user-avatar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 28rpx;
			height: 100rpx;

			.left {
				display: flex;
				flex-direction: row;
				font-size: 14px;
				flex-shrink: 0;
				color: #333;
				justify-content: center;
				align-items: center;
			}

			.right {
				display: flex;
				align-items: center;

				image {
					width: 76rpx;
					height: 76rpx;
					border-radius: 50%;
					flex-shrink: 0;
					margin-left: 30rpx;
				}
			}
		}


		.mine-popup-top {
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

		.mine-popup-bottom {
			padding: 30rpx 60rpx;

			.bottom-lisence {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				margin-bottom: 20rpx;

				.a-lisence {
					text-decoration: underline;
					color: #808080;
					padding-left: 2rpx;
				}
			}
		}
	}

	.user-info-item {
		display: flex;
		align-items: center;

		.in-text {
			color: #333;

			&.empty {
				color: #bec4c9;
			}
		}

		.in-icon {
			color: #bec4c9;
			padding-left: 20rpx;
		}
	}

	.userinfo-bottom {
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 40rpx;
	}
</style>
