<template>
	<view class="prescription-wrapper">
		<view class="prescription-top" :class="{sticky: sticky}">
			<u-tabs v-if="!classes" :list="classifyList" lineWidth="20" lineColor="#303133" :activeStyle="{
			            color: '#303133',
			            fontWeight: 'bold',
			            transform: 'scale(1.05)'
			        }" :inactiveStyle="{
			            color: '#606266',
			            transform: 'scale(1)'
			        }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" @change="changeTabs">
				<view class="prescription-top-classify" @tap="handleShowSelect" slot="right">
					<image class="prescription-top-classify-logo" src="@/static/images/recovery/classify.png">
					</image>
					<text class="prescription-top-classify-text">精准定位</text>
				</view>
			</u-tabs>

			<view class="ready-select" v-if="classes">
				<view class="ready-select-inner" @click="handleShowSelect">
					<view class="inner-left">
						<text class="ready-select-inner-tip">已选择：</text>
						<text class="ready-select-inner-text">{{ selectedInfo }}</text>
					</view>
					<view class="inner-right" @click.stop="handleClear">
						<text>x</text>
						<text>清空选择</text>
					</view>
				</view>
			</view>
		</view>

		<view class="prescription-bottom-wrapper">
			<mescroll-uni @init="mescrollInit" ref="mescroll" @scroll="handleScroll" :fixed="false"
				@down="handleRefreshDown" @up="handleRefreshUp" :down="{onScroll: false, use: true, auto: false}"
				:up="{onScroll: true, use: true, auto: false, page: pageOptions, noMoreSize: 8, textNoMore: '没有更多数据', offset: 0}">
				<view class="prescription-bottom-empty" v-if="!dataSource.length">
					<image src="@/static/images/recovery/empty-data.png" class="prescription-bottom-empty-img"></image>
					<text class="prescription-bottom-empty-text">暂无处方信息</text>
				</view>
				<view class="prescription-bottom" v-show="dataSource.length">
					<view class="prescription-bottom-item" @click="handleShowDetail(u)" v-for="(u,index) in dataSource"
						:key="u.id">
						<view class="prescription-bottom-item-inner">
							<image class="item-inner-back" :src="baseUrl + u.cover"></image>
							<view class="item-inner-title">{{ u.title }}</view>
							<view class="item-inner-description">{{ u.description }}</view>
							<view class="item-inner-info">
								<view class="item-inner-info-difficulty">难度 {{ u.difficulty }}</view>
								<view class="item-inner-info-duration">预计耗时 {{ u.time_length }}</view>
							</view>
							<view class="item-inner-watch" :class="{hot: u.watch_num > 1000}">
								<u-icon name="eye-fill" :color="u.watch_num > 1000 ? '#FF5D54' : '#999'" size="14">
								</u-icon>
								<text class="item-inner-watch-text">{{ u.show_watch_num }}</text>
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
			<u-safe-bottom></u-safe-bottom>
		</view>

		<!-- <scroll-view enable-back-to-top :show-scrollbar="false" scroll-y @scroll="handleScroll"
			class="prescription-bottom-wrapper" refresher-enabled="true" :refresher-triggered="triggered"
            :refresher-threshold="100" refresher-background="lightgreen">
			<view class="prescription-bottom">
				<view class="prescription-bottom-item" v-for="(u,index) in dataSource" :key="u.id">
					<view class="prescription-bottom-item-inner">
						<image class="item-inner-back" :src="u.cover"></image>
						<view class="item-inner-title">{{ u.title }}</view>
						<view class="item-inner-info">
							<text class="item-inner-info-difficulty">难度：{{ u.difficulty }}</text>
							<text class="item-inner-info-duration">{{ u.duration }}</text>
						</view>
					</view>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</scroll-view> -->

		<view class="data-picker-wrapper">
			<uni-data-picker :key="refreshKey" :itemsList="itemsList" ref="picker" placeholder="请选择班级" preload
				popup-title="请选择分类" :localdata="dataTree" v-model="classes" @change="onchange" @nodeclick="onnodeclick"
				@popupopened="onpopupopened" @popupclosed="onpopupclosed">
			</uni-data-picker>
		</view>
	</view>
</template>

<script>
	import {
		getPrescriptionAction
	} from '@/service/service'
	export default {
		data() {
			return {
				refreshKey: 0,
				pageOptions: {
					num: 0,
					size: 8,
					time: null
				},
				classes: '',
				itemsList: [
					"关节部位",
					"症状",
					"阶段"
				],
				triggered: false,
				refreshing: false,
				selectedInfo: '',
				sticky: false,
				dataTree: require('@/static/json/prescription.json'),
				classifyList: [
					{
						name: '👀最新'
					},
					{
						name: '🔥热门'
					},
					{
						name: '肩关节',
					},
					{
						name: '肘关节'
					},
					{
						name: '腕关节'
					},
					{
						name: '髋关节'
					},
					{
						name: '膝关节'
					},
					{
						name: '踝关节'
					},
					{
						name: '脊柱'
					},
					{
						name: ' ',
						disabled: true
					}
				],
				dataSource: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				isDown: false,
				pageNo: 1,
				canDown: false,
				chooseInfo: {
					part: undefined,
					symptoms: undefined,
					phase: undefined
				},
				mescroll: null,
				hotOrder: false
			}
		},
		props: {
			ifSticky: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			barHeight() {
				console.log('barHeight ===========', this.$store.state.global.barHeight)
				return this.$store.state.global.barHeight
			}
		},
		mounted() {
			this.$loadingOn();
			this.getData().then(res => {
				this.dataSource = [...res.data]
			})
		},
		watch: {
			dataSource: {
				handler(){
					//console.log('dataSource change', this.dataSource)
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			getData(query = {}) {
				console.log('1111111111')
				const that = this
				return new Promise((reslove, reject) => {
					getPrescriptionAction({
						...query,
						...this.chooseInfo,
						hot_order: this.hotOrder ? 'hot' : '',
						status: 1
					}).then(res => {
						const result = {
							...res.data
						}
						const dataIn = [...(result.data || [])]
						dataIn.map(item => {
							item.show_watch_num = (item.watch_num > 1000 && item.watch_num <=
									10000) ? `${Math.floor(item.watch_num / 1000)}k+` : (item
									.watch_num > 10000 && item.watch_num <= 100000) ?
								`${Math.floor(item.watch_num / 10000)}k+` : item.watch_num
						})
						result.data = [...dataIn]
						that.$loadingOff();
						reslove(result)
					}).catch(err => {
						console.log('err ------------ err', err)
						that.$loadingOff();
						reject(err)
					})
				})
			},
			onnodeclick(e) {
				console.log(e);
			},
			onpopupopened(e) {
				console.log('popupopened');
			},
			onpopupclosed(e) {
				console.log('popupclosed');
				this.$emit('hide')
				this.refreshKey++
			},
			changeTabs(e){
				console.log('change tabs', e)
				this.hotOrder = false
				this.chooseInfo.part = undefined
				this.chooseInfo.symptoms = undefined
				this.chooseInfo.phase = undefined
				if(e.index === 1){
					this.hotOrder = true
				}else if(e.index > 1){
					this.chooseInfo.part = e.index - 2
				}
				this.$loadingOn()
				this.getData().then(res => {
					this.pageNo = 1
					this.dataSource = [...res.data]
					console.log('刷新成功')
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0,0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.dataSource = []
					this.mescroll.endErr()
					this.mescroll.scrollTo(0,0)
				})
			},
			onchange(e) {
				console.log('onchange:', e);
				this.hotOrder = false
				if(e.detail.value.length){
					this.selectedInfo = e.detail.value.length ? e.detail.value.map(item => item.text).join(' / ') : ''
					this.chooseInfo.part = e.detail.value[0].value - 1
					this.chooseInfo.symptoms = e.detail.value[1].value[e.detail.value[1].value.length - 1] - 1
					this.chooseInfo.phase = e.detail.value[2].value[e.detail.value[2].value.length - 1] - 1
				}else{
					this.chooseInfo.part = undefined
					this.chooseInfo.symptoms = undefined
					this.chooseInfo.phase = undefined
				}
				this.$loadingOn()
				this.getData().then(res => {
					this.pageNo = 1
					this.dataSource = [...res.data]
					console.log('刷新成功')
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0,0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.dataSource = []
					this.mescroll.endErr()
					this.mescroll.scrollTo(0,0)
				})
			},
			handleShowSelect() {
				this.$refs.picker.show()
				this.$emit('show')
			},
			handleClear() {
				this.$refs.picker.clear()
				this.refreshKey++
			},
			handleScroll(mescroll) {
				this.sticky = mescroll.scrollTop > 0
			},
			handleRefreshDown(mescroll) {
				this.isDown = true
				console.log('下拉刷新', mescroll)
				mescroll.lockDownScroll(true)
				mescroll.lockUpScroll( true )
				this.getData().then(res => {
					this.pageNo = 1
					this.dataSource = [...res.data]
					console.log('刷新成功')
					mescroll.endSuccess(8, res.totalPage > this.pageNo, new Date())
					mescroll.lockDownScroll(false)
					setTimeout(()=>{
						mescroll.lockUpScroll( false )
						this.isDown = false
					},1000)
				}).catch(err => {
					mescroll.endErr()
					console.log('刷新失败')
					mescroll.lockDownScroll(false)
					setTimeout(()=>{
						mescroll.lockUpScroll( false )
						this.isDown = false
					},1000)
				})
			},
			handleRefreshUp(mescroll) {
				console.log('上拉刷新', mescroll)
				mescroll.lockUpScroll(true)
				if(this.isDown){
					console.log('此刻正在下拉刷新，本次是无效的')
					mescroll.endErr()
					mescroll.lockUpScroll(false)
				}else{
					this.getData({pageNo: this.pageNo+1, pageSize: 8}).then(res => {
						this.pageNo += 1
						mescroll.endSuccess(8, res.totalPage > this.pageNo, new Date())
						this.dataSource = [...this.dataSource, ...res.data]
						console.log('刷新成功')
						mescroll.lockUpScroll(false)
					}).catch(err => {
						mescroll.endErr()
						console.log('刷新失败')
						mescroll.lockUpScroll(false)
					})
				}
			},
			handleShowDetail(record) {
				const that = this
				uni.navigateTo({
					url: "/pages_recovery/prescription-detail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							record
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.prescription-wrapper {
		width: 100%;
		flex-grow: 1;
		overflow: hidden;
		background: #fff;
		box-sizing: border-box;
		padding-bottom: 10rpx;
		display: flex;
		flex-direction: column;

		.data-picker-wrapper {
			width: 0;
			height: 0;
			overflow: hidden;
		}

		.prescription-top {
			width: 100%;
			position: relative;
			background: #fff;
			box-sizing: border-box;
			padding-top: 24rpx;
			padding-bottom: 12rpx;
			transition: all 0.3s;
			z-index: 222;

			&.sticky {
				box-shadow: rgba(0, 0, 0, 0.24) 0 5px 4px -4px;
			}

			.ready-select {
				width: 100%;
				height: 86rpx;
				box-sizing: border-box;
				padding: 12rpx 24rpx;

				.ready-select-inner {
					width: 100%;
					height: 100%;
					background: #F2F2F2;
					border-radius: 31rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
					padding: 0 24rpx;

					.inner-left {
						display: flex;
						align-items: center;
					}

					.inner-right {
						box-sizing: border-box;
						font-size: 10px;
						padding: 3rpx 6rpx;
						background: #999;
						color: #fff;
						border-radius: 8rpx;
						display: flex;
						align-items: center;
					}

					.ready-select-inner-tip {
						font-size: 12px;
						color: #777;
					}

					.ready-select-inner-text {
						font-size: 12px;
					}
				}
			}


			.prescription-top-classify {

				display: flex;
				align-items: center;
				background: #fff;
				height: 62rpx;
				box-sizing: border-box;
				box-shadow: rgba(0, 0, 0, 0.05) -1px 0px 0px, rgba(0, 0, 0, 0.04) -2px 0px 0px, rgba(0, 0, 0, 0.03) -3px 0px 0px, rgba(0, 0, 0, 0.02) -4px 0px 0px, rgba(0, 0, 0, 0.01) -5px 0px 0px;
				width: 180rpx;
				justify-content: center;
				well-change: scroll-position;
				-webkit-overflow-scrolling: touch;
				z-index: 999;


				.prescription-top-classify-logo {
					width: 36rpx;
					height: 36rpx;
					margin-right: 12rpx;
				}

				.prescription-top-classify-text {
					font-size: 14px;
				}
			}
		}

		.prescription-bottom-empty {
			width: 100%;
			margin-top: 24rpx;
			margin-bottom: 24rpx;
		}

		.prescription-bottom-empty {
			width: 100%;
			padding: 48rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			box-sizing: border-box;
			margin-top: 100rpx;

			.prescription-bottom-empty-img {
				width: 100rpx;
				height: 100rpx;
				margin-bottom: 24rpx;
			}

			.prescription-bottom-empty-text {
				font-size: 13px;
				color: #DAE1F4;
			}
		}

		.prescription-bottom-wrapper {
			width: 100%;
			flex-grow: 1;
			height: 800rpx;
			box-sizing: border-box;
			padding-bottom: 120rpx;
			position: relative;
		}

		.refresh-down {
			position: absolute;
			width: 100%;
			box-sizing: border-box;
			padding: 12rpx;
			display: flex;
			align-items: center;
			bottom: 100%;
			left: 50%;
			transform: translateX(-50%);

			.refresh-down-text {
				font-size: 13px;
				padding-left: 6rpx;
			}
		}

		.prescription-bottom {
			width: 100%;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 24rpx;
			margin-top: 0;
			background: #fff;

			.prescription-bottom-item {
				width: calc((100% - 24rpx) / 2);
				box-sizing: border-box;
				padding: 0 12rpx;
				margin-bottom: 36rpx;
				box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
				border-radius: 24rpx;
				padding-top: 12rpx;

				.prescription-bottom-item-inner {
					width: 100%;
					position: relative;

					.item-inner-back {
						width: 100%;
						height: 200rpx;
						border-radius: 24rpx;
					}

					.item-inner-title {
						width: 100%;
						font-size: 14px;
						margin-top: 12rpx;
						margin-bottom: 12rpx;
					}

					.item-inner-description {
						font-size: 12px;
						color: #999;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						box-sizing: border-box;
						margin-bottom: 12rpx;
					}

					.item-inner-info {
						width: 100%;
						margin-bottom: 12rpx;

						.item-inner-info-difficulty {
							font-size: 10px;
							color: #999;
						}

						.item-inner-info-duration {
							font-size: 10px;
							color: #999;
							margin-top: 12rpx;
						}
					}

					.item-inner-watch {
						display: flex;
						align-items: center;
						position: absolute;
						bottom: 0;
						right: 0;

						.item-inner-watch-text {
							padding-left: 2rpx;
							font-size: 10px;
							color: #999;
						}

						&.hot .item-inner-watch-text {
							color: #FF5D54;
						}
					}
				}
			}
		}
	}
</style>
