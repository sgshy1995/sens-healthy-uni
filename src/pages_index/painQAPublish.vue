<template>
	<view class="update-wrapper-wrapper">
		<scroll-view scroll-y class="update-record-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0" title="发布问答" leftIconColor="#fff"
				:titleStyle="{color: '#fff'}" @leftClick="leftClick" leftText="返回">
				<view class="slot-right" slot="right" @click="handlePublish">
					发布
				</view>
			</u-navbar>
			<view class="update-record-body">
				<uni-section lineColor="#4F68B0" title="伤痛类型"
					subTitle="伤痛类型，如受伤部位、受伤类型等" type="line" padding>
					<uni-easyinput type="text" v-model="form.pain_type" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="问题描述"
					subTitle="伤病情况介绍，受伤时间，受伤过程，受伤部位，症状描述，受伤部位活动功能是否受影响，日常生活活动是否受影响等" type="line" padding>
					<uni-easyinput type="textarea" v-model="form.description" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="诊疗史" subTitle="什么时间在哪里做过什么治疗，治疗效果如何，是否有明确诊断为何病" type="line"
					padding>
					<uni-easyinput type="textarea" v-model="form.injury_history" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="上传照片或视频" subTitle="影像资料，诊断报告，受伤部位等资料，最多上传9张" type="line"
					padding>
					<u-upload :fileList="fileListData" @afterRead="afterRead" @delete="deletePic" name="Data" multiple
						:maxCount="9"></u-upload>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="匿名提问" subTitle="发布者可以选择匿名提问，发布者的个人信息将得到匿名保护，但是可能会对问题的关注度造成影响" type="line" padding>
					<view class="uni-section-body">
						<u-switch activeColor="#4F68B0" v-model="anonymity" @change="changeAnonymity" size="24"></u-switch>
					</view>
				</uni-section>
				<!-- <uni-section lineColor="#4F68B0" title="问题赏金" subTitle="发布者可以选择提供问题赏金，以鼓励获得更多的专业回答" type="line" padding>
					<view class="uni-section-body">
						<u-switch activeColor="#4F68B0" v-model="ifOffer" @change="changeOffer" size="24"></u-switch>
						<view v-if="ifOffer" class="uni-section-body-in" @click="handleShowNumber">
							<text class="uni-section-body-title">赏金金额： </text>
							<text
								class="uni-section-body-text">{{ form.consulting_fee ? '¥ ' + form.consulting_fee : '请输入赏金金额' }}</text>
						</view>
						<keyboard-price max="10000" focusColor="#4F68B0" ref="keyboardPrice" type="digit"
							v-model="consulting_fee" @onDone="onDonePrice"></keyboard-price>
					</view>
				</uni-section> -->
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import keyboardPrice from '@/components/liujto-keyboard/liujto-keyboard-price.vue'
	import {
		createQuestionsAction,
		questionUploadAction
	} from '@/service/service'
	export default {
		components: {
			keyboardPrice
		},
		data() {
			return {
				form: {
					pain_type: '',
					description: '',
					injury_history: '',
					consulting_fee: '',
					anonymity: 0
				},
				fileListData: [],
				ifOffer: false,
				consulting_fee: '',
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				anonymity: false
			}
		},
		watch: {
			fileList1: {
				handler() {
					console.log('fileList1 change', this.fileList1)
				},
				deep: true
			}
		},
		methods: {
			handlePublish() {
				if (!this.form.pain_type) {
					this.$toast('请输入伤痛类型');
				} else if (!this.form.description) {
					this.$toast('请输入问题描述');
				} else if (!this.form.injury_history) {
					this.$toast('请输入诊疗史');
				} else {
					this.$loadingOn()
					Promise.all(this.fileListData.filter(item => !item.message).map(item => {
						return questionUploadAction(item.url)
					})).then(responses => {
						createQuestionsAction({
							...this.form,
							image_data: this.fileListData.filter(item => item.message).map(item => item.source).concat(responses.map(res => JSON.parse(res.data).data)).join()
						}).then(res => {
							this.$loadingOff()
							this.close()
							this.$toast(res.message || '发布成功');
						}).catch(err => {
							this.$loadingOff()
						})
					})
				}
			},
			close() {
				uni.navigateBack()
			},
			leftClick() {
				this.close()
			},
			onDonePrice(price) {
				console.log('onDonePrice', price)
				if (!price) {
					this.consulting_fee = this.form.consulting_fee
				} else if (Number(price) < 1) {
					this.$toast('金额不能小于1');
					this.consulting_fee = this.form.consulting_fee
				} else {
					this.form.consulting_fee = this.consulting_fee
				}
			},
			showView(url) {
				// 预览图片
				uni.previewImage({
					urls: [url],
					indicator: 'none'
				});
			},
			changeAnonymity(value) {
				this.form.anonymity = value ? 1 : 0
			},
			changeOffer(value) {
				this.consulting_fee = ''
				this.form.consulting_fee = ''
			},
			handleShowNumber() {
				this.$refs.keyboardPrice.open()
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
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
