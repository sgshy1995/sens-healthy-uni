<template>
	<view class="login-register-wrapper">
		<view class="mine-popup">
			<view class="mine-popup-top">
				<text class="mine-popup-top-text">{{ showPhoneCode ? '手机验证' : showType === 'register' ? '新用户注册' : '登录' }}</text>
				<!-- <view class="mine-popup-top-switch" v-if="showType === 'login'">
					<view class="mine-popup-top-switch-text">登录方式</view>
					<view class="mine-popup-top-switch-in" @click="handleChangeLoginType">
						<view class="mine-popup-top-switch-item">用户名</view>
						<view class="mine-popup-top-switch-item">邮箱</view>
						<view class="mine-popup-top-switch-swip" :class="{'to-right': loginType === 'email'}">{{ loginType === 'username' ? '用户名' : '邮箱' }}</view>
					</view>
				</view> -->
				<text class="mine-popup-top-text text-back" v-if="showPhoneCode" @click="handleBack">← 返回上一步</text>
			</view>
			<view class="user-form">
				<u--form border="none" abelPosition="left" :model="formModel" ref="Form" v-if="!showPhoneCode">
					<u-form-item labelWidth="74" label="手机号" prop="phone">
						<u--input type="number" maxlength="40" placeholder="请输入手机号" v-model="formModel.phone" border="bottom"></u--input>
					</u-form-item>
					<u-form-item labelWidth="74" label="验证码" prop="code">
						<view class="form-item-code">
							<u--input type="number" maxlength="40" placeholder="请输入验证码" :maxlength="4" v-model="formModel.capture" border="bottom"></u--input>
							<image :src="captureCode" @tap="tapCaptcha"></image>
						</view>
					</u-form-item>
				</u--form>
				<view class="user-form-phone" v-if="showPhoneCode">
					<view class="user-form-phone-img">
						<image class="user-form-phone-img-in" src="@/static/images/guard/note.png"></image>
					</view>
					<view class="user-form-phone-text">
						请输入您收到的验证码，进行一个简短的验证
					</view>
				</view>
				<u--form border="none" abelPosition="left" :model="formModel" ref="Form" v-if="showPhoneCode">
					<u-form-item labelWidth="84" label="手机验证码" prop="code">
						<view class="form-item-code">
							<u--input type="number" focus placeholder="请输入手机验证码" :maxlength="6" v-model="formModel.capture_phone" border="bottom"></u--input>
						</view>
					</u-form-item>
					<view class="form-item-email-code-tap" @tap="tapEmailCaptcha" :class="{disabled: email_cooling}">
						{{ email_cooling ? `${emailIntervalNum}秒后获取` : '获取验证码' }}
					</view>
				</u--form>
			</view>
			<view class="mine-popup-bottom">
				
				<view class="bottom-others" v-if="showType==='login' && !showPhoneCode">
					<view class="bottom-others-text">其他登录方式</view>
					<view class="bottom-others-icons">
						<view class="bottom-others-icon">
							<image class="bottom-others-icon-img" src="@/static/images/guard/wechat.png"></image>
						</view>
						<view class="bottom-others-icon" v-if="os === 'ios'">
							<image class="bottom-others-icon-img" src="@/static/images/guard/apple.png"></image>
						</view>
					</view>
				</view>
				<u-button v-if="!showPhoneCode" color="#4F68B0" type="primary" text="下一步" @click="handleNextLogin"></u-button>
				<u-button v-else color="#4F68B0" type="primary" text="登录" @click="handleLogin"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { isMobile } from '@/utils/validate.js'
	import Vue from 'vue';
	import {
		registerAction,
		loginAction,
		getUserInfoByUsernameAction,
		captureAction,
		capturePhoneAction
	} from '@/service/service'
	export default Vue.extend({
		data() {
			const arr = [2, 3, 4, 5, 6, 7, 8, 9];
			for (var i = 65; i < 122; i++) {

				if (i > 90 && i < 97) {

					continue;
				}
				arr.push(String.fromCharCode(i));
			}
			return {
				loginType: 'phone',
				customStyleIn: {
					width: '100vw'
				},
				showType: 'login',
				formModel: {
					username: '',
					nickname: '',
					password: '',
					capture: '',
					private_yard: '',
					email: '',
					capture_email: ''
				},
				captureCode: '',
				showPopup: false,
				formRules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: ['blur', 'change']
					}]
				},
				showPassword: false,
				capValue: "",
				capShow: true,
				character: arr,
				userInfo: {
					username: '',
					nickname: '',
					primary_key: '',
					id: 0,
					email: '',
					phone: '',
					avatar: ''
				},
				device_id: '',
				email_cooling: false,
				emailInterval: null,
				emailIntervalNum: 0,
				os: '',
				showPhoneCode: false
			}
		},
		created() {
			console.log('uni.getSystemInfoSync()', uni.getSystemInfoSync())
			this.device_id = uni.getSystemInfoSync().deviceId
			this.os = uni.getSystemInfoSync().platform
			this.tapCaptcha()
		},
		methods: {
			handleBack(){
				this.showPhoneCode = false
				this.formModel.phone = ''
				this.formModel.capture = ''
				this.tapCaptcha()
			},
			handleChangeLoginType(){
				this.loginType = this.loginType === 'username' ? 'phone' : 'username'
				this.formModel = {
					username: '',
					nickname: '',
					password: '',
					capture: '',
					private_yard: '',
					email: '',
					capture_email: ''
				}
			},
			getUserInfo(userInfo) {
				return new Promise((reslove, reject) => {
					getUserInfoByUsernameAction(userInfo).then(res => {
						this.close()
						uni.setStorageSync('SYS_USER_INFO', res.data)
						this.userInfo = res.data
						reslove()
					}).catch(() => {
						this.userInfo = {
							username: '',
							nickname: '',
							primary_key: '',
							id: 0,
							email: '',
							phone: '',
							avatar: ''
						}
						uni.removeStorageSync('SYS_USER_INFO')
						reject()
					})
				})
			},
			validateForm(ifReSend) {
				let errorMessage = ''
				if (!this.formModel.phone) {
					errorMessage = '请输入手机号'
				}else if (!isMobile(this.formModel.phone)) {
					errorMessage = '请输入正确格式的手机号'
				}
				else if (!this.formModel.capture && !ifReSend) {
					errorMessage = '请输入验证码'
				}
				return errorMessage
			},
			changeShowType(showType) {
				this.tapCaptcha();
				this.showType = showType
				this.showPassword = false
			},
			handleRegister() {
				const errorMessage = this.validateForm()
				if (errorMessage) {
					uni.showToast({
						title: errorMessage,
						icon: 'none'
					})
				} else {
					this.$loadingOn();
					registerAction({
						user: {...this.formModel},
						option: {
							capture: this.formModel.capture,
							device_id: this.device_id,
							capture_email: this.formModel.capture_email
						}
					}).then(res => {
						console.log('res', res);
						uni.setStorageSync('SYS_AUTH_TOKEN_KEY', res.data.token);
						this.close(this.formModel);
						this.$loadingOff();
						//this.getUserInfo(this.formModel)
					}).catch(err => {
						this.formModel.capture = '';
						this.tapCaptcha();
						this.$loadingOff();
					})
				}
			},
			handleNextRegister(){
				
			},
			handleLogin() {
				if (!this.formModel.capture_phone) {
					uni.showToast({
						title: '请输入短信验证码',
						icon: 'none'
					})
					return
				}
				this.$loadingOn();
				loginAction(this.device_id, this.formModel.phone, this.formModel.capture_phone).then(res => {
					console.log('res', res);
					uni.setStorageSync('SYS_AUTH_TOKEN_KEY', res.data.token);
					this.close(this.formModel);
					this.$loadingOff();
					//this.getUserInfo(this.formModel)
				}).catch(err => {
					console.log('err', err)
					this.formModel.capture = '';
					this.tapCaptcha();
					this.$loadingOff();
				})
			},
			handleNextLogin(ifReSend){
				const errorMessage = this.validateForm(ifReSend)
				if (errorMessage) {
					uni.showToast({
						title: errorMessage,
						icon: 'none'
					})
				} else {
					this.$loadingOn();
					capturePhoneAction(this.device_id, this.formModel.phone, this.formModel.capture, ifReSend).then(res=>{
						this.$loadingOff();
						this.showPhoneCode = true
						this.emailStartInterval()
					}).catch(err=>{
						console.log('err', err)
						this.$loadingOff();
						if(err && err.data && err.data.code === 409){
							this.showPhoneCode = true
							this.emailStartInterval()
						}else{
							this.formModel.capture = '';
							this.tapCaptcha();
						}
					})
				}
			},
			close(formModel) {
				if(formModel){
					uni.setStorageSync('SYS_SUCCESS_USER_INFO', formModel);
				}
				this.$emit('ok')
			},
			open() {

			},
			// 点击画布重置初始化方法，达到切换验证码效果
			tapCaptcha() {
				captureAction(this.device_id).then(res => {
					if (typeof res === 'string') {
						this.captureCode = res
					}
				}).catch(err=>{
					console.log('err',err)
				})
			},
			tapEmailCaptcha() {
				if(this.email_cooling) return
				this.handleNextLogin(true)
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
			}
		}
	})
</script>

<style lang="scss">
	.login-register-wrapper{
		width: 100vw;
	}
	
	.user-form {
		box-sizing: border-box;
		width: 100%;
		padding-left: 70rpx;
		padding-right: 70rpx;
		
		.user-form-phone{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			margin-bottom: 48rpx;
			margin-top: 48rpx;
			
			.user-form-phone-img{
				margin-bottom: 24rpx;
				box-sizing: border-box;
				width: 84rpx;
				height: 84rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: rgba(141,220,243, 0.5);
				border-radius: 50%;
				
				.user-form-phone-img-in{
					width: 44rpx;
					height: 44rpx;
				}
			}
			
			.user-form-phone-text{
				font-weight: 700;
				font-size: 14px;
				color: #8F91A0;
			}
		}
		
		.form-item-code{
			width: 100%;
			display: flex;
			align-items: center;
			
			image{
				width: 178rpx; 
				height: 88rpx;
				margin-left: 20rpx;
				margin-bottom: 12rpx;
			}
		}
		
		.form-item-email-code{
			width: 100%;
		}
		
		.form-item-email-code-tap{
			display: inline-block;
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
	}

	.mine-popup {
		box-sizing: border-box;
		padding-top: 48rpx;

		.mine-popup-top {
			width: 100%;
			margin-bottom: 24rpx;
			box-sizing: border-box;
			padding: 0 70rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.mine-popup-top-text{
				font-weight: 800;
				font-size: 20px;
				
				&.text-back{
					font-size: 12px;
					color: #555;
				}
			}
			
			.mine-popup-top-switch{
				display: flex;
				align-items: center;
				flex-shrink: 0;
				
				.mine-popup-top-switch-text{
					font-size: 12px;
				}
				
				.mine-popup-top-switch-in{
					margin-left: 12rpx;
					display: flex;
					align-items: center;
					position: relative;
					width: 180rpx;
					height: 48rpx;
					border-radius: 24rpx;
					background: #eee;
					
					.mine-popup-top-switch-item{
						width: 50%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						color: #999;
					}
					
					.mine-popup-top-switch-swip{
						width: 50%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						color: #fff;
						font-weight: 700;
						background: rgba(255,187,0,1);
						position: absolute;
						top: 0;
						left: 0;
						transition: all 0.3s;
						box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
						border-radius: 24rpx;
						
						&.to-right{
							left: 50%;
						}
					}
				}
			}
		}

		.mine-popup-bottom {
			padding: 30rpx 60rpx;
			
			.bottom-others{
				margin-bottom: 48rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.bottom-others-text{
					font-size: 12px;
					color: #333;
					padding-right: 24rpx;
				}
				
				.bottom-others-icons{
					display: flex;
					align-items: center;
					
					.bottom-others-icon{
						margin-right: 24rpx;
						box-sizing: border-box;
						width: 72rpx;
						height: 72rpx;
						border-radius: 50%;
						background: #fff;
						box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
						display: flex;
						align-items: center;
						justify-content: center;
						
						.bottom-others-icon-img{
							width: 48rpx;
							height: 48rpx;
						}
					}
				}
			}
		}
	}
</style>
