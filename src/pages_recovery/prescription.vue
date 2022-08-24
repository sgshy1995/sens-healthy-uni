<template>
	<view class="prescription-wrapper">
		<u-sticky :customNavHeight="`${barHeight}rpx`" bgColor="#fff">
			<view class="prescription-top" :class="{sticky: ifSticky}">
				<view style="position: fixed;"></view>
				<u-tabs v-if="!classes" :list="classifyList" lineWidth="20" lineColor="#303133" :activeStyle="{
				            color: '#303133',
				            fontWeight: 'bold',
				            transform: 'scale(1.05)'
				        }" :inactiveStyle="{
				            color: '#606266',
				            transform: 'scale(1)'
				        }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;">
					<view class="prescription-top-classify" @tap="handleShowSelect" slot="right">
						<image class="prescription-top-classify-logo" src="@/static/images/recovery/classify.png">
						</image>
						<text class="prescription-top-classify-text">所有分类</text>
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

		</u-sticky>

		<scroll-view scroll-anchoring enable-back-to-top :show-scrollbar="false" scroll-y
			class="prescription-bottom-wrapper">
			<view class="prescription-bottom">
				<view class="prescription-bottom-item" v-for="(u,index) in prescriptionList" :key="u.id">
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
		</scroll-view>

		<view class="data-picker-wrapper">
			<uni-data-picker :key="refreshKey" :itemsList="itemsList" ref="picker" placeholder="请选择班级" preload
				popup-title="请选择分类" :localdata="dataTree" v-model="classes" @change="onchange" @nodeclick="onnodeclick"
				@popupopened="onpopupopened" @popupclosed="onpopupclosed">
			</uni-data-picker>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshKey: 0,
				classes: '',
				itemsList: [
					"关节部位",
					"症状",
					"阶段"
				],
				selectedInfo: '',
				dataTree: require('@/static/json/prescription.json'),
				classifyList: [{
						name: '热门'
					},
					{
						name: '最新'
					},
					{
						name: '腰肌劳损',
					},
					{
						name: '骨盆前倾'
					},
					{
						name: '产后恢复'
					},
					{
						name: '韧带拉伸'
					},
					{
						name: '腿型矫正'
					},
					{
						name: '营养餐'
					},
					{
						name: '健康跑步'
					},
					{
						name: ' ',
						disabled: true
					},
					{
						name: ' ',
						disabled: true
					},
					{
						name: ' ',
						disabled: true
					},
					{
						name: ' ',
						disabled: true
					}
				],
				prescriptionList: [{
						id: '1',
						title: '后伸支撑位下蹲',
						difficulty: 4,
						duration: '2分30秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					},
					{
						id: '2',
						title: '双腿微蹲',
						difficulty: 2,
						duration: '3分11秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					},
					{
						id: '3',
						title: '双腿大跳',
						difficulty: 3,
						duration: '4分10秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					},
					{
						id: '4',
						title: '米字步练习',
						difficulty: 1,
						duration: '3分04秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					},
					{
						id: '5',
						title: '负重上台阶',
						difficulty: 2,
						duration: '4分11秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					},
					{
						id: '6',
						title: '坐起练习',
						difficulty: 2,
						duration: '4分03秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					},
					{
						id: '7',
						title: '俯卧撑',
						difficulty: 2,
						duration: '1分52秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					},
					{
						id: '8',
						title: '仰卧起坐',
						difficulty: 2,
						duration: '4分11秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					},
					{
						id: '9',
						title: '腹肌拉伸',
						difficulty: 1,
						duration: '43秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					},
					{
						id: '10',
						title: '单腿蹲',
						difficulty: 2,
						duration: '3分14秒',
						cover: require('@/static/images/recovery/exercise.jpeg')
					}
				]
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
		methods: {
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
			onchange(e) {
				console.log('onchange:', e);
				this.selectedInfo = e.detail.value.length ? e.detail.value.map(item => item.text).join(' / ') : ''
			},
			handleShowSelect() {
				this.$refs.picker.show()
				this.$emit('show')
			},
			handleClear() {
				this.$refs.picker.clear()
				this.refreshKey++
			}
		}
	}
</script>

<style lang="scss">
	.prescription-wrapper {
		width: 100%;
		margin-top: 24rpx;
		background: #fff;
		box-sizing: border-box;
		padding-bottom: 10rpx;

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

		.prescription-bottom-wrapper {
			width: 100%;
			overflow-anchor: none;
		}

		.prescription-bottom {
			width: 100%;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			box-sizing: border-box;
			padding: 24rpx;
			margin-top: 0;
			background: #fff;

			.prescription-bottom-item {
				width: 50%;
				box-sizing: border-box;
				padding: 0 12rpx;
				margin-bottom: 36rpx;

				.prescription-bottom-item-inner {
					width: 100%;

					.item-inner-back {
						width: 100%;
						height: 200rpx;
					}

					.item-inner-title {
						width: 100%;
						font-size: 14px;
						margin-top: 12rpx;
						margin-bottom: 12rpx;
					}

					.item-inner-info {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.item-inner-info-difficulty {
							font-size: 12px;
							color: #999;
						}

						.item-inner-info-duration {
							font-size: 12px;
							color: #999;
						}
					}
				}
			}
		}
	}
</style>
