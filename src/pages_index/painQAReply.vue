<template>
	<u-popup :show="show" @close="close" @open="open">
	    <view class="pain-qa-reply-wrapper">
	    	<scroll-view scroll-y class="pain-qa-reply-box">
	    		<view class="update-record-body">
	    			<uni-easyinput type="textarea" focus v-model="form.reply_content" placeholder="请输入内容"></uni-easyinput>
					<view class="update-record-body-tip">为了您的回答更具权威性、更准确，建议上传相关影像资料</view>
	    			<u-upload :fileList="fileListData" @afterRead="afterRead" @delete="deletePic" name="Data" multiple
	    				:maxCount="9"></u-upload>
	    		</view>
				<view class="update-record-bottom">
					<view class="publish-button" @click="handlePublish">发布答复</view>
				</view>
	    	</scroll-view>
	    </view>	
	</u-popup>
</template>

<script>
	import keyboardPrice from '@/components/liujto-keyboard/liujto-keyboard-price.vue'
	import {
		replyUploadAction,
		createReplyAction
	} from '@/service/service'
	export default {
		components: {
			keyboardPrice
		},
		data() {
			return {
				show: false,
				form: {
					reply_content: ''
				},
				fileListData: [],
				ifOffer: false,
				consulting_fee: '',
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/'
			}
		},
		props: {
			info: {
				type: Object,
				default(){
					return {}
				}
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
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		methods: {
			open() {
			    // console.log('open');
				this.show = true
			},
			close(ifClear) {
			    this.show = false
				if(ifClear){
					this.form.reply_content = ''
					this.fileListData = []
				}
			    // console.log('close');
			},
			handlePublish() {
				if (!this.form.reply_content) {
					this.$toast('请输入答复内容');
				} else {
					this.$loadingOn()
					Promise.all(this.fileListData.filter(item => !item.message).map(item => {
						return replyUploadAction(item.url)
					})).then(responses => {
						createReplyAction({
							...this.form,
							user_id: this.userInfo.id,
							question_id: this.info.id,
							image_data: this.fileListData.filter(item => item.message).map(item => item.source).concat(responses.map(res => JSON.parse(res.data).data)).join()
						}).then(res => {
							this.$loadingOff()
							this.close(true)
							this.$emit('ok')
							this.$toast(res.message || '发布成功');
						}).catch(err => {
							this.$loadingOff()
						})
					})
				}
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
	.pain-qa-reply-wrapper {
		width: 100vw;

		.pain-qa-reply-box {
			width: 100%;
			box-sizing: border-box;

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
			box-sizing: border-box;
			padding: 24rpx;
			
			.u-upload{
				margin-top: 24rpx;
			}
			
			.update-record-body-tip{
				margin-top: 24rpx;
				font-size: 12px;
				color: #777;
			}
		}
		
		.update-record-bottom{
			width: 100%;
			box-sizing: border-box;
			padding: 0 24rpx;
			
			.publish-button{
				font-size: 13px;
				background: #4F68B0;
				color: #fff;
				font-weight: bold;
				box-sizing: border-box;
				width: 150rpx;
				padding: 6rpx;
				text-align: center;
				border-radius: 12rpx;
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
