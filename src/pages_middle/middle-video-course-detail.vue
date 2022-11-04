<template>
	<view class="prescription-detail">
		<view class="prescription-detail__top">
			<!-- <video show-mute-btn :title="info.title" v-if="autoplay" @fullscreenchange="fullscreenchange"
				:autoplay="autoplay" class="prescription-detail__top__video" id="myVideo"
				:src="baseUrl + info.prescription_video" @error="videoErrorCallback"></video> -->
			<video :key="refreshKey" :poster="baseUrl + currentInfo.cover" id="myVideo" class="prescription-detail__top__video" :initial-time="initialTime" @timeupdate="timeupdate"
				:src="baseUrl + currentInfo.source" @play="handlePlayVideo" @pause="handlePauseVideo" @ended="handleEndVideo" @error="videoErrorCallback" @fullscreenchange="fullscreenchange" controls>
			</video>
		</view>
		<view class="prescription-detail__middle">
			<view class="prescription-detail__middle__course_title" v-if="info.course_info && info.course_info.title">{{ info.course_info.title }}</view>
			<view class="prescription-detail__middle__course_description" v-if="info.course_info && info.course_info.description">
				<mescroll-uni ref="mescroll" :down="{onScroll:false, use: false}" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
					<rich-text style="color: #fff;font-size: 13px;" :nodes="info.course_info.description"></rich-text>
				</mescroll-uni>
			</view>
			<view class="prescription-detail__middle__title" v-if="currentInfo.title">{{ currentInfo.title }}</view>
			<view class="prescription-detail__middle__tabs" v-if="videosList.length">
				<view class="prescription-detail__middle__tabs__item" @click="handleChangeCurrent(index)" v-for="(u, index) in videosList" :key="index" :class="{active: index === current}">
					<text class="prescription-detail__middle__tabs__item__text">{{ index + 1 }}</text>
				</view>
			</view>
		</view>
		<view class="prescription-detail__bottom">
			<view class="prescription-detail__bottom__description" v-if="currentInfo.description">
				<mescroll-uni ref="mescroll" :down="{onScroll:false, use: false}" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
					<rich-text style="color: #fff;font-size: 13px;" :nodes="currentInfo.description"></rich-text>
					<u-safe-bottom></u-safe-bottom>
				</mescroll-uni>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getMajortCourseByIdAction,
		getCourseInVideoByIdAction,
		updateMajortCourseAction
	} from '@/service/service'
	import {formatSecond} from "@/utils/util";
	export default {
		data() {
			return {
				danmuList: [
					{
						text: '卧槽, 厉害了啊',
						color: '#E06C75',
						time: 1
					},
					{
						text: '66666',
						color: '#61AFEF',
						time: 3
					},
					{
						text: '来niao一口',
						color: '#D19A66',
						time: 11
					}
				],
				info: { course_info: {videos: []} },
				videosList: [],
				current: 0,
				initialTime: 0,
				currentInfo: {},
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
				fullscreen: false,
				playing: false,
				current_play: '',
				current_play_history: '',
				current_history: null,
				refreshKey: 'x'
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
				if (data.current) that.current = data.current
				if (data.history) {
					const timeList = data.history.split(':').map(item => Number(item))
					console.log('timeList', timeList)
					if(timeList.length === 3){
						that.initialTime = timeList[0]*3600 + timeList[1]*60 + timeList[2]
					}else if(timeList.length === 2){
						that.initialTime = timeList[0]*60 + timeList[1]
					}else if(timeList.length === 1){
						that.initialTime = timeList[0]
					}
				}
				that.$loadingOn()
				that.getDetailInfo()
				that.$nextTick(() => {
					that.videoContext = uni.createVideoContext('myVideo')
					that.videoContext.seek(that.initialTime)
				})
			})
		},
		beforeDestroy(){
			this.handleSaveHistoryToStore()
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
			handleSaveHistoryToStore(){
				if (this.playing){
					console.log('handleSaveHistory --------- if')
					this.$store.dispatch('changeHistoryInfo', {
						id: this.info.id,
						recent_num: this.current,
						recent_progress: this.current_play
					})
				}else if(this.current_history !== null){
					console.log('handleSaveHistory --------- else if')
					this.$store.dispatch('changeHistoryInfo', {
						id: this.info.id,
						recent_num: this.current_history,
						recent_progress: this.current_play_history
					})
				}
			},
			handlePlayVideo(){
				this.playing = true
				this.current_play_history = ''
				this.current_history = null
			},
			handlePauseVideo(){
				this.playing = false
				this.current_play_history = this.current_play
				this.current_history = this.current
			},
			handleEndVideo(){
				this.playing = false
				this.current_play_history = this.current_play
				this.current_history = this.current
			},
			handleChangeCurrent(index){
				if (this.current === index) return
				this.$loadingOn()
				this.current = index
				this.initialTime = 0
				this.getVideoDetailInfo()
			},
			getDetailInfo() {
				getMajortCourseByIdAction(this.id).then(res => {
					this.info = {
						...res.data
					}
					this.videosList = this.info.course_info.videos ? [...this.info.course_info.videos] : []
					if (!this.videosList.length){
						this.$toast('没有可供播放的视频, 请联系客服')
						this.handleBack()
					}
					this.getVideoDetailInfo()
				}).catch(err => {
					this.$loadingOff()
					this.$toast(err.message || '资源未找到或没有播放权限')
					this.handleBack()
				})
			},
			getVideoDetailInfo(){
				if (!this.videosList[this.current] || !this.videosList[this.current].id) {
					this.$toast('资源未找到或没有播放权限')
					this.handleBack()
					return
				}
				getCourseInVideoByIdAction(this.videosList[this.current].id).then(res => {
					this.currentInfo = {...res.data}
					this.playing = false
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
					this.playing = false
					this.$toast(err.message || '资源未找到或没有播放权限')
					this.handleBack()
				})
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
			timeupdate(event){
				this.current_play = formatSecond(event.detail.currentTime)
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
			background: #0B0E17;
			box-sizing: border-box;
			border-bottom: 1px solid #33394A;
			
			&__course_title{
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
			
			&__course_description{
				width: 100%;
				box-sizing: border-box;
				padding: 0 24rpx;
				margin-top: 24rpx;
				height: 200rpx;
			}

			&__title {
				width: 100%;
				white-space: nowrap;
				box-sizing: border-box;
				padding: 0 24rpx;
				font-size: 14px;
				font-weight: 800;
				color: #FAC046;
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
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				box-sizing: border-box;
				padding: 24rpx;
				
				&__item{
					width: 48rpx;
					height: 48rpx;
					border: 2rpx solid #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 8rpx;
					margin-right: 24rpx;
					
					&__text{
						color: #fff;
						font-size: 14px;
						font-weight: bold;
					}
					
					&.active{
						border: 2rpx solid #FAC046;
						
						&__text{
							color: #FAC046;
						}
					}
				}
			}
		}

		&__bottom {
			width: 100%;
			background-image: radial-gradient(#0C2A38, #05080F);

			&__description {
				box-sizing: border-box;
				height: 100%;
				padding: 24rpx;
				color: #fff;
				height: 700rpx;
			}
		}
	}
</style>
