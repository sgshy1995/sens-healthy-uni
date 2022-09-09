<template>
	<view class="prescription-detail">
		<view class="prescription-detail__top">
			<!-- <video show-mute-btn :title="info.title" v-if="autoplay" @fullscreenchange="fullscreenchange"
				:autoplay="autoplay" class="prescription-detail__top__video" id="myVideo"
				:src="baseUrl + info.prescription_video" @error="videoErrorCallback"></video> -->
			<video :poster="baseUrl + info.cover" id="myVideo" class="prescription-detail__top__video"
				:src="baseUrl + info.prescription_video"
				@error="videoErrorCallback" :danmu-list="danmuList" @fullscreenchange="fullscreenchange" enable-danmu
				danmu-btn controls>
			</video>
		</view>
		<view class="prescription-detail__middle">
			<view class="prescription-detail__middle__title" v-if="info.title">{{ info.title }}</view>
			<view class="prescription-detail__middle__watch" v-if="info.watch_num !== undefined">
				<u-icon name="eye" color="#CBCCD5" size="22"></u-icon>
				<text class="prescription-detail__middle__watch__text">{{ info.watch_num }}</text>
			</view>
			<view class="prescription-detail__middle__tabs" v-if="info.title">
				<u-tabs :list="tabsList" lineColor="#FAC046" :inactiveStyle="{color: '#D1D2DB', fontSize: '13px'}"
					:activeStyle="{color: '#FAC046', fontSize: '13px'}"></u-tabs>
			</view>
		</view>
		<view class="prescription-detail__bottom">
			<scroll-view scroll-y class="prescription-detail__bottom__description" v-if="info.description">
				<u-read-more :shadowStyle="shadowStyle" :toggle="true" :showHeight="300" color="#D1D2DB">
					<rich-text style="color: #fff;" :nodes="info.description"></rich-text>
				</u-read-more>
			</scroll-view>
			<u-safe-bottom></u-safe-bottom>
		</view>
	</view>
</template>

<script>
	import {
		getPrescriptionByIdAction,
		addPrescriptionWatchNumAction
	} from '@/service/service'
	export default {
		data() {
			return {
				danmuList: [
					{
						text: '这个处方666了',
						color: '#D19A66',
						time: 1
					},
					{
						text: '这个准确吗？靠谱吗？',
						color: '#61AFEF',
						time: 3
					}
				],
				info: {},
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				autoplay: false,
				videoContext: null,
				id: '',
				tabsList: [{
					name: '介绍'
				}],
				shadowStyle: {
					backgroundImage: "linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)",
					paddingTop: "100px",
					marginTop: "-100px",
				},
				fullscreen: false
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
				if (data.record) that.id = data.record.id
				that.$loadingOn()
				that.getDetailInfo()
				that.addWatchNum()
				that.$nextTick(() => {
					that.videoContext = uni.createVideoContext('myVideo')
				})
			})
		},
		onHide() {
			if (this.videoContext) {
				this.videoContext.exitFullScreen()
				console.log('onHide')
			}
		},
		onShow() {
			plus.screen.unlockOrientation();
		},
		methods: {
			getDetailInfo() {
				getPrescriptionByIdAction(this.id).then(res => {
					this.info = {
						...res.data
					}
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			addWatchNum() {
				addPrescriptionWatchNumAction(this.id)
			},
			handleFullScreen() {
				this.fullscreen = true
				setTimeout(() => {
					this.videoContext.requestFullScreen()
				}, 1000)
			},
			fullscreenclick() {
				this.fullscreen = true
			},
			fullscreenchange(event) {
				console.log('event', event)
				if (event.detail.direction === 'vertical') {
					//this.videoContext.requestFullScreen({ direction: 0 })
					//this.videoContext.exitFullScreen()
					this.fullscreen = false
					plus.screen.lockOrientation("portrait-primary");
				} else {
					plus.screen.unlockOrientation();
				}
			},
			handlePlay() {
				this.autoplay = true
				this.$nextTick(() => {
					this.videoContext = uni.createVideoContext('myVideo')
				})
			},
			handleBack() {
				uni.navigateBack()
			},
			videoErrorCallback(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
		}
	}
</script>

<style lang="scss">
	.prescription-detail {
		width: 100vw;
		height: 100vh;
		overflow: hidden;

		&__top {
			width: 100%;
			height: 500rpx;
			background: #999;
			box-sizing: border-box;
			position: relative;
			display: flex;

			&__icons {
				position: absolute;
				z-index: 999;
				top: 64rpx;
				right: 48rpx;
			}

			&__cover {
				width: 100%;
				height: 100%;
				position: relative;

				&__in {
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.45);
					position: absolute;
					top: 0;
					left: 0;
					z-index: 2;
				}

				&__image {
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.6);
					position: absolute;
					top: 0;
					left: 0;
					z-index: 1;
				}

				&__icon {
					width: 80rpx;
					height: 80rpx;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					z-index: 3;
				}
			}

			&__back {
				position: absolute;
				top: 64rpx;
				left: 48rpx;
				z-index: 999;
			}

			&__video {
				width: 750rpx;
				height: 500rpx;
			}
		}

		&__middle {
			width: 100%;
			height: 216rpx;
			background: #0B0E17;
			box-sizing: border-box;
			border-bottom: 1px solid #33394A;

			&__title {
				width: 100%;
				white-space: nowrap;
				box-sizing: border-box;
				padding: 0 24rpx;
				font-size: 14px;
				font-weight: 800;
				color: #fff;
				background: #0B0E17;
				padding-top: 24rpx;
			}

			&__watch {
				margin-top: 24rpx;
				width: 100%;
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 0 24rpx;

				&__text {
					color: #CBCCD5;
					padding-left: 6rpx;
				}
			}

			&__tabs {
				width: 100%;
			}
		}

		&__bottom {
			width: 100%;
			height: calc(100vh - 716rpx);
			background-image: radial-gradient(#0C2A38, #05080F);

			&__description {
				box-sizing: border-box;
				height: 100%;
				padding: 24rpx;
				color: #fff;
			}
		}
	}
</style>
