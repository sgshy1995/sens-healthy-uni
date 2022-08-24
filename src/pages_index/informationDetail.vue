<template>
	<web-view class="information-detail" :webview-styles="webviewStyles"
		:src="loadUrl"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				loadUrl: '',
				loading: true,
				webviewStyles: {
					progress: {
						color: '#4F68B0'
					},
					marginTop: '300rpx'
				}
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
			    console.log(data)
				if(data.loadUrl) that.loadUrl = data.loadUrl
				that.$nextTick(() => {
					this.getData()
				})
			})
			
		},
		methods: {
			getData() {
				this.loading = true
				setTimeout(()=>{
					this.loading = false
				},1000)
				// uni.request({
				// 	url: 'https://mp.weixin.qq.com/s/ta0dVQ3ct84zmpWfh28vLA', //仅为示例，并非真实接口地址。
				// 	success: (res) => {
				// 		console.log('get成功');
				// 		this.innerHtml = res.data
				// 		this.loading = false
				// 	},
				// 	fail: (res) => {
				// 		console.log('get失败');
				// 		this.loading = false
				// 	}
				// });
			},
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
		}
	}
</script>

<style lang="scss">
	.information-detail {
		width: 100vw;
	}
</style>
