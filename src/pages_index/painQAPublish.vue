<template>
	<view class="update-wrapper-wrapper">
		<scroll-view scroll-y class="update-record-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0" title="发布问答" leftIconColor="#fff"
				:titleStyle="{color: '#fff'}" @leftClick="leftClick" leftText="返回">
				<view class="slot-right" slot="right">
					发布
				</view>
			</u-navbar>
			<view class="update-record-body">
				<uni-section lineColor="#4F68B0" title="问题描述"
					subTitle="伤病情况介绍，受伤时间，受伤过程，受伤部位，症状描述，受伤部位活动功能是否受影响，日常生活活动是否受影响等" type="line" padding>
					<uni-easyinput type="textarea" v-model="form.description" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="诊疗史" subTitle="什么时间在哪里做过什么治疗，治疗效果如何，是否有明确诊断为何病" type="line"
					padding>
					<uni-easyinput type="textarea" v-model="form.history" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="上传照片或视频" subTitle="影像资料，诊断报告，受伤部位等资料，最多上传9张" type="line"
					padding>
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="9"></u-upload>
				</uni-section>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					description: '',
					history: ''
				},
				fileList1: []
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
			close() {
				uni.navigateBack()
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
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://localhost:8080/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						},
						fail: (err) => {
							console.log('err', err)
							setTimeout(() => {
								resolve(url)
							}, 1000)
						}
					});
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
			height: 100%;
			
			.slot-right{
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
	}
</style>
