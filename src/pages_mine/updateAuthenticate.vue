<template>
	<view class="pain-q-a-wrapper">
		<scroll-view scroll-y class="pain-q-a-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0" title="认证专业医师" leftIconColor="#fff"
				:titleStyle="{color: '#fff'}" @leftClick="leftClick" leftText="返回">
				<view class="slot-right" slot="right" @click="handleShowConfirmUpdate">
					{{ reback ? '重新提交' : '提交' }}
				</view>
			</u-navbar>
			<view class="pain-q-a-body">
				<uni-section lineColor="#4F68B0" title="姓名" subTitle="认证姓名，最多14字" type="line" padding>
					<uni-easyinput :styles="form.name.length > 14 ? errorStyles : {}" type="text" trim="all" v-model="form.name" placeholder="请输入姓名"
						:clearable="!!form.name"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="联系电话" subTitle="认证联系电话，大陆手机号11位" type="line" padding>
					<uni-easyinput :styles="(form.phone.length && form.phone.length !== 11) ? errorStyles : {}" type="number" trim="all" v-model="form.phone" placeholder="请输入联系电话"
						:clearable="!!form.phone"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="性别" subTitle="认证性别" type="line" padding>
					<text class="choose-age"
						@click="handleShowPickerGender">{{ form.gender ? columnsGender[0][form.gender] : '请选择性别 >' }}</text>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="机构组织" subTitle="认证机构组织，最多24字" type="line" padding>
					<uni-easyinput :styles="form.organization.length > 24 ? errorStyles : {}" type="text" trim="all" v-model="form.organization" placeholder="请输入机构组织"
						:clearable="!!form.organization"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="简介" subTitle="认证简介，该文字将会展示在您的个人主页中，最多60字" type="line" padding>
					<uni-easyinput :styles="form.fcc.length > 60 ? errorStyles : {}" type="textarea" autoHeight trim="all" v-model="form.fcc" placeholder="请输入认证简介"
						:clearable="!!form.fcc"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="上传身份证正面照" subTitle="身份证正面照，请保持人像照和个人信息清晰可见" type="line"
					padding>
					<u-upload :fileList="fileListCardFront" @afterRead="afterReadCardFront" @delete="deletePicCardFront" name="CardFront" :multiple="false"
						:maxCount="1" width="250rpx" height="150rpx">
						<image src="@/static/images/mine/card-front.png" mode="widthFix" style="width: 250rpx;height: 150rpx;"></image>
					</u-upload>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="上传身份证反面照" subTitle="身份证反面照，请保持国徽、有效期和颁发机关清晰可见" type="line"
					padding>
					<u-upload :fileList="fileListCardBack" @afterRead="afterReadCardBack" @delete="deletePicCardBack" name="CardBack" :multiple="false"
						:maxCount="1" width="250rpx" height="150rpx">
						<image src="@/static/images/mine/card-back.png" mode="widthFix" style="width: 250rpx;height: 150rpx;"></image>
					</u-upload>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="上传执业证照" subTitle="执业证照，请保持个人信息和人像等清晰可见" type="line"
					padding>
					<u-upload :fileList="fileListCertificate" @afterRead="afterReadCertificate" @delete="deletePicCertificate" name="Certificate" :multiple="false"
						:maxCount="1" width="250rpx" height="150rpx">
					</u-upload>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="上传工作证照" subTitle="工作证照，请保持个人信息和人像等清晰可见" type="line"
					padding>
					<u-upload :fileList="fileListEmployeeCard" @afterRead="afterReadEmployeeCard" @delete="deletePicEmployeeCard" name="EmployeeCard" :multiple="false"
						:maxCount="1" width="250rpx" height="150rpx">
					</u-upload>
				</uni-section>
				<uni-card :is-shadow="false" is-full>
					<view class="agree-title">
						专业医师认证说明
					</view>
					<view class="agree-h6"><text class="agree-h6-point">·</text>专业医师认证是森普健康提供的一项服务，针对持有执业证和工作证的医师，认证通过后可以享受医师角色的权限。</view>
					<view class="agree-h6"><text class="agree-h6-point">·</text>请您在认证过程中，务必保证您提供的资料属实无误；在您提交后，森普健康的专业人员将会对您的资料进行审核，确认无误后即可通过审核。</view>
					<view class="agree-h6"><text class="agree-h6-point">·</text>森普健康承诺，会对您的资料进行保密，只用于专业认证审核和记录。未经过您的允许，不用于其他任何用途。</view>
					<view class="agree-button">
						<u-checkbox-group v-model="checkboxValue" placement="column" activeColor="#4F68B0" @change="checkboxChange">
							<u-checkbox :customStyle="{marginBottom: '8px', fontWeight: 'bold'}" v-for="(item, index) in checkboxList"
								:key="index" :label="item.name" :name="item.name">
							</u-checkbox>
						</u-checkbox-group>
					</view>
				</uni-card>
			</view>
		</scroll-view>
		<u-picker :key="refreshKeyGender" confirmColor="#4F68B0" :defaultIndex="defaultIndexGender"
			:show="showPickerGender" ref="uPicker" :loading="loading" :columns="columnsGender"
			@confirm="handleConfirmPickerGender" @cancel="handleClosePickerGender">
		</u-picker>
		<u-modal :show="showModal" showCancelButton confirmColor="#4F68B0" @confirm="handleConfirmUpdate"
			@cancel="showModal=false" content="认证信息一经提交无法修改, 确定提交认证吗？"></u-modal>
	</view>
</template>

<script>
	import {
		updateInfoByUserIdAction,
		infoUploadAction,
		authenticateIdentityCardFrontUploadAction,
		authenticateIdentityCardBackUploadAction,
		authenticatePracticingCertificateUploadAction,
		authenticateEmployeeCardUploadAction,
		createAuthenticateAction,
		updateAuthenticateAction,
		findOneAuthenticateByUserIdAction
	} from '@/service/service'
	export default {
		data() {
			return {
				showModal: false,
				errorStyles: {
					color: '#DD5250',
					borderColor: '#DD5250'
				},
				checkboxValue: [],
				// 基本案列数据
				checkboxList: [
					{
						name: '已阅读并同意以上说明',
						disabled: false
					}
				],
				form: {
					gender: 0,
					name: '',
					phone: '',
					organization: '',
					fcc: '',
					identity_card_front: '',
					identity_card_back: '',
					practicing_certificate: '',
					employee_card: ''
				},
				fileListCardFront: [],
				fileListCardBack: [],
				fileListCertificate: [],
				fileListEmployeeCard: [],
				showPickerAge: false,
				showPickerGender: false,
				loading: false,
				columnsAge: [
					[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
						28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
						52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
						76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
						100
					]
				],
				columnsGender: [
					['女', '男']
				],
				defaultIndexAge: [],
				defaultIndexGender: [],
				refreshKey: 0,
				refreshKeyGender: 0,
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				reback: false
			}
		},
		onLoad() {
			const that = this
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('show', function(data) {
				if (data.reback) {
					that.$loadingOn()
					that.reback = true
					that.getData().then(res=>{
						that.$loadingOff()
					}).catch(err=>{
						that.$loadingOff()
					})
				}
			})
		},
		watch: {
			fileListData: {
				handler() {
					console.log('fileListData change', this.fileListData)
				},
				deep: true
			},
			info: {
				handler() {
					/* this.form.name = this.info.name
					this.form.phone = this.info.phone
					this.form.organization = this.info.organization
					this.form.fcc = this.info.fcc
					this.defaultIndexGender = [this.info.gender ? this.info.gender : 0]
					this.refreshKey++
					this.refreshKeyGender++
					this.fileListData = []
					if (this.info.image_data) {
						const pathList = this.info.image_data.split(',')
						console.log('pathList', pathList)
						pathList.map(path => {
							this.fileListData.push({
								size: 0,
								type: 'image',
								url: this.baseUrl + path,
								thumb: this.baseUrl + path,
								source: path,
								status: '',
								message: 'exist'
							})
						})
					} */
				},
				deep: true,
				immediate: true
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
		methods: {
			getData(){
				return new Promise((resolve, reject) => {
					findOneAuthenticateByUserIdAction().then(res=>{
						this.form = {...res.data}
						this.fileListCardFront.push({
							size: 0,
							type: 'image',
							url: this.baseUrl + this.form.identity_card_front,
							thumb: this.baseUrl + this.form.identity_card_front,
							source: this.form.identity_card_front,
							status: '',
							message: 'exist'
						})
						this.fileListCardBack.push({
							size: 0,
							type: 'image',
							url: this.baseUrl + this.form.identity_card_back,
							thumb: this.baseUrl + this.form.identity_card_back,
							source: this.form.identity_card_back,
							status: '',
							message: 'exist'
						})
						this.fileListCertificate.push({
							size: 0,
							type: 'image',
							url: this.baseUrl + this.form.practicing_certificate,
							thumb: this.baseUrl + this.form.practicing_certificate,
							source: this.form.practicing_certificate,
							status: '',
							message: 'exist'
						})
						this.fileListEmployeeCard.push({
							size: 0,
							type: 'image',
							url: this.baseUrl + this.form.employee_card,
							thumb: this.baseUrl + this.form.employee_card,
							source: this.form.employee_card,
							status: '',
							message: 'exist'
						})
						resolve(data)
					}).catch(err=>{
						reject(err)
					})
				})
			},
			checkboxChange(n) {
			    console.log('change', n);
				console.log('checkboxValue', this.checkboxValue)
				this.checkboxValue = n
			},
			handleShowConfirmUpdate(){
				if (this.form.gender === null || this.form.gender === undefined || !this.form.name || !this.form.phone || !this.form.fcc || !this.form.organization) {
					this.$toast('请完善信息');
					return
				}
				if (this.form.phone.length !== 11 || this.form.name.length > 14 || this.form.organization.length > 24 || this.form.fcc.length > 60) {
					this.$toast('输入有误, 请检查');
					return
				}
				if (!this.fileListCardFront.length || !this.fileListCardBack.length || !this.fileListCertificate.length || !this.fileListEmployeeCard.length) {
					this.$toast('请上传相关照片资料');
					return
				}
				if (!this.checkboxValue.length) {
					this.$toast('请勾选同意认证说明');
					return
				}
				this.showModal = true
			},
			handleConfirmUpdate() {
				this.$loadingOn();
				const promiseList = []
				if(!this.fileListCardFront[0].message){
					promiseList.push(authenticateIdentityCardFrontUploadAction(this.fileListCardFront[0].url))
				}
				if(!this.fileListCardBack[0].message){
					promiseList.push(authenticateIdentityCardBackUploadAction(this.fileListCardBack[0].url))
				}
				if(!this.fileListCertificate[0].message){
					promiseList.push(authenticatePracticingCertificateUploadAction(this.fileListCertificate[0].url))
				}
				if(!this.fileListEmployeeCard[0].message){
					promiseList.push(authenticateEmployeeCardUploadAction(this.fileListEmployeeCard[0].url))
				}
				Promise.all([...promiseList]).then(responses => {
					console.log('responses', responses)
					const formIn = {...this.form}
					const identity_card_front = responses.find(item => JSON.parse(item.data).data.indexOf('identity_card/front') > -1)
					if(identity_card_front){
						formIn.identity_card_front = JSON.parse(identity_card_front.data).data
					}
					const identity_card_back = responses.find(item => JSON.parse(item.data).data.indexOf('identity_card/back') > -1)
					if(identity_card_back){
						formIn.identity_card_back = JSON.parse(identity_card_back.data).data
					}
					const practicing_certificate = responses.find(item => JSON.parse(item.data).data.indexOf('practicing_certificate') > -1)
					if(practicing_certificate){
						formIn.practicing_certificate = JSON.parse(practicing_certificate.data).data
					}
					const employee_card = responses.find(item => JSON.parse(item.data).data.indexOf('employee_card') > -1)
					if(employee_card){
						formIn.employee_card = JSON.parse(employee_card.data).data
					}
					if(!this.reback){
						createAuthenticateAction({
							...formIn
						}).then(res1 => {
							this.handleShowSuccess()
							this.showModal = false
							this.$loadingOff();
						}).catch(err1 => {
							this.$loadingOff();
						})
					}else{
						updateAuthenticateAction({
							...formIn,
							status: 2,
							validity_time: null
						}).then(res1 => {
							this.handleShowSuccess()
							this.showModal = false
							this.$loadingOff();
						}).catch(err1 => {
							this.$loadingOff();
						})
					}
				}).catch(err => {
					this.$loadingOff();
				})
			},
			handleConfirmPickerAge(e) {
				console.log('e', e)
				this.defaultIndexAge = e.indexs
				this.form.age = e.value[0]
				this.handleClosePickerAge()
			},
			handleShowPickerAge() {
				this.showPickerAge = true
			},
			handleClosePickerAge() {
				this.showPickerAge = false
			},
			handleConfirmPickerGender(e) {
				console.log('e', e)
				this.defaultIndexGender = e.indexs
				this.form.gender = e.indexs[0]
				this.handleClosePickerGender()
			},
			handleShowPickerGender() {
				this.showPickerGender = true
			},
			handleClosePickerGender() {
				this.showPickerGender = false
			},
			close() {
				uni.navigateBack()
			},
			handleShowSuccess() {
				const that = this
				uni.redirectTo({
					url: `/pages_mine/authenticate-success`
				})
			},
			leftClick() {
				this.close()
			},
			showView(url) {
				// 预览图片
				uni.previewImage({
					urls: [url],
					indicator: 'none'
				});
			},
			// 删除图片
			deletePicCardFront(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 删除图片
			deletePicCardBack(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 删除图片
			deletePicCertificate(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 删除图片
			deletePicEmployeeCard(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterReadCardFront(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: '',
						message: ''
					})
				})
			},
			// 新增图片
			async afterReadCardBack(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: '',
						message: ''
					})
				})
			},
			// 新增图片
			async afterReadCertificate(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: '',
						message: ''
					})
				})
			},
			// 新增图片
			async afterReadEmployeeCard(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: '',
						message: ''
					})
				})
			}
		}

	}
</script>

<style lang="scss">
	.pain-q-a-wrapper {
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

		.pain-q-a-box {
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

		.pain-q-a-body {
			width: 100%;

			.choose-age {
				font-size: 12px;
				color: #444;
				padding-left: 24rpx;
			}

			.u-upload__deletable {
				width: 32rpx;
				height: 32rpx;
				border-bottom-left-radius: 16rpx;
			}
		}
	}
</style>
