<template>
	<view class="update-wrapper-wrapper">
		<scroll-view scroll-y class="update-record-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0" :title="id ? '编辑地址信息' : '新建地址'" leftIconColor="#fff"
				:titleStyle="{color: '#fff'}" @leftClick="leftClick" leftText="返回">
				<view class="slot-right" slot="right" @click="handlePublish">
					保存
				</view>
			</u-navbar>
			<view class="update-record-body">
				<uni-section lineColor="#4F68B0" title="联系人"
					subTitle="配送联系人" type="line" padding>
					<uni-easyinput type="text" v-model="form.name" placeholder="请输入联系人" :clearable="!!form.name"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="联系电话"
					subTitle="配送联系电话, 手机号" type="line" padding>
					<uni-easyinput type="number" v-model="form.phone" placeholder="请输入联系电话" :clearable="!!form.phone"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="省/市/区"
					subTitle="配送省/市/区地址" type="line" padding>
					<view @click="handleShowPickerAddress">
						<uni-easyinput type="text" disabled v-model="form.detail_text" placeholder="请选择省/市/区" :clearable="false"></uni-easyinput>
					</view>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="详细地址" subTitle="配送详细地址, 精确到街道、小区、门牌号" type="line"
					padding>
					<uni-easyinput type="text" v-model="info_text" placeholder="请输入详细地址" :clearable="!!info_text"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="标签" subTitle="您可以通过为地址添加标签进行标记" type="line"
					padding>
					<view class="update-record-body-tags">
						<view v-for="(u,index) in tagsList" :key="index" class="update-record-body-tag" @click="handleChangeTag(u)" :class="{active: form.tag === u}">{{ u }}</view>
					</view>
				</uni-section>
			</view>
		</scroll-view>
		<simple-address ref="SimpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#4F68B0"></simple-address>
	</view>
</template>

<script>
	import SimpleAddress from '@/components/simple-address/simple-address.vue';
	import {
		getAddressByIdAction,
		createAddressAction,
		updateAddressAction
	} from '@/service/service'
	import { isMobile } from '@/utils/validate.js'
	export default {
		components: {
			SimpleAddress
		},
		data() {
			return {
				id: '',
				form: {
					name: '',
					phone: '',
					detail_text: '',
					tag: ''
				},
				tagsList: ['家', '公司', '学校', '商场'],
				info_text: '',
				fileListData: [],
				ifOffer: false,
				consulting_fee: '',
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				cityPickerValueDefault: [0,0,0]
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
				if (data.id) {
					console.log('data.id', data.id)
					that.id = data.id
					that.$loadingOn()
					that.loadData()
				}
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
			handleChangeTag(tag){
				if(this.form.tag === tag){
					this.form.tag = ''
				}else{
					this.form.tag = tag
				}
			},
			loadData(){
				getAddressByIdAction(this.id).then(res=>{
					this.form = res.data ? Object.assign(this.form, res.data) : this.form
					this.info_text = this.form.all_text.split(this.form.detail_text)[1]
					this.$loadingOff()
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleShowPickerAddress(){
				// 根据value 获取
				if(this.id){
					const index = this.$refs.SimpleAddress.queryIndex([this.form.province_code, this.form.city_code, this.form.area_code], 'value');
					this.cityPickerValueDefault = index.index;
				}else{
					this.cityPickerValueDefault = [0, 0, 0];
				}
				this.$refs.SimpleAddress.open();
			},
			onConfirm(e) {
				console.log('eeeeee', e)
			    this.form.detail_text = e.labelArr.join('');
				this.form.province_code = e.provinceCode;
				this.form.city_code = e.cityCode;
				this.form.area_code = e.areaCode;
			},
			handlePublish() {
				if (!this.form.name) {
					this.$toast('请输入联系人');
				} else if (!this.form.phone) {
					this.$toast('请输入联系电话');
				} else if (!this.form.detail_text) {
					this.$toast('请选择省/市/区');
				} else if (!this.info_text) {
					this.$toast('请输入详细地址');
				} else if (this.form.name.length > 12) {
					this.$toast('联系人最多输入12个字符');
				} else if(!isMobile(this.form.phone)){
					this.$toast('请输入正确的手机号');
				} else if (this.info_text.length > 50) {
					this.$toast('详细地址最多输入50个字符');
				} else {
					this.$loadingOn()
					if(this.id){
						updateAddressAction({
							...this.form,
							all_text: this.form.detail_text + this.info_text,
							user_id: this.userInfo.id
						}).then(res => {
							this.$loadingOff()
							this.close()
						}).catch(err => {
							this.$loadingOff()
						})
					}else{
						createAddressAction({
							...this.form,
							all_text: this.form.detail_text + this.info_text
						}).then(res => {
							this.$loadingOff()
							this.close()
						}).catch(err => {
							this.$loadingOff()
						})
					}
				}
			},
			close() {
				uni.navigateBack()
			},
			leftClick() {
				this.close()
			},
		}

	}
</script>

<style lang="scss">
	.update-wrapper-wrapper {
		width: 100vw;
		height: 100vh;

		.update-record-box {
			width: 100%;
			box-sizing: border-box;
			padding-bottom: 24rpx;

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

		.update-record-body {
			width: 100%;
			
			.uni-easyinput__content.is-disabled{
				border-color: #dcdfe6 !important;
				background-color: #fff !important;
				color: #333 !important;
				
				.uni-easyinput__placeholder-class{
					color: #999 !important;
				}
			}
			
			.update-record-body-tags{
				width: 100%;
				display: flex;
				align-items: center;
				
				.update-record-body-tag{
					margin-right: 24rpx;
					box-sizing: border-box;
					padding: 4rpx 12rpx;
					border-radius: 12rpx;
					border: 2rpx solid #333;
					color: #333;
					font-weight: bold;
					font-size: 12px;
					
					&.active{
						border: 2rpx solid #4F68B0;
						background: #4F68B0;
						color: #fff;
					}
				}
			}
		}

		.uni-section-body {
			width: 100%;
			display: flex;
			align-items: center;

			.uni-section-body-in {
				width: 100%;
				font-size: 14px;

				.uni-section-body-title {
					padding-right: 12rpx;
					color: #777;
				}

				.uni-section-body-text {
					color: #4F68B0;
					font-weight: bold;
				}
			}

			.u-switch {
				margin-right: 24rpx;
				margin-left: 24rpx;
			}
		}
	}
</style>
