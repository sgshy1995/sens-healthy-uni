<template>
	<view class="course-wrapper">
		<!-- <view class="course-top">
			<view class="course-top-left" @click="handleChangeType('course')">
				<image class="course-top-left-icon" src="@/static/images/store/switch-course.png"></image>
				<text class="course-top-left-text">课程</text>
			</view>
			<view class="course-top-center">
				器材商城
			</view>
			<view class="course-top-right">
				zhanwei
			</view>
		</view> -->
		<view class="equ-search" v-if="!classes">
			<u-search v-model="keyword" @search="handleSearch" @clear="handleClearSearch" shape="square"
				:show-action="false"></u-search>
			<view class="equ-icon">
				<!-- <image class="equ-icon-img" src="@/static/images/store/order.png"></image> -->
				<u-icon name="order" color="#333" size="22"></u-icon>
				<view class="badge-box" :class="{'less99': orders <= 99 && orders >= 10, 'less10': orders <10}"
					v-if="orders">
					<u-badge numberType="overflow" type="error" max="99" :value="orders"></u-badge>
				</view>
			</view>
		</view>
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
			<view class="equ-icon">
				<!-- <image class="equ-icon-img" src="@/static/images/store/order.png"></image> -->
				<u-icon name="order" color="#333" size="22"></u-icon>
				<view class="badge-box" :class="{'less99': orders <= 99 && orders >= 10, 'less10': orders <10}"
					v-if="orders">
					<u-badge numberType="overflow" type="error" max="99" :value="orders"></u-badge>
				</view>
			</view>
		</view>
		<view class="course-recommend" v-if="shufflingList.length" v-show="!classes && !keywordIn">
			<view class="course-recommend-body">
				<u-swiper :list="shufflingList" @change="e => currentNum = e.current" :autoplay="true"
					indicatorStyle="right: 20px" @click="handleClickSwiper">
					<view slot="indicator" class="indicator-num">
						<text class="indicator-num__text">{{ currentNum + 1 }}/{{ shufflingList.length }}</text>
					</view>
				</u-swiper>
			</view>
		</view>
		<view class="equ-all-title" v-if="classes || keywordIn">
			搜索结果共 {{ totalCount }} 器材
		</view>
		<view class="equ-all">
			<scroll-view scroll-x class="equ-all-swip">
				<view class="equ-all-swip-in">
					<view class="equ-all-swip-item" @click="handleChangeSwitchType(index)"
						v-for="(u,index) in switchList" :key="index" :class="{active: index === switchType}">
						<text class="equ-all-swip-item-text">{{ u }}</text>
					</view>
					<view class="equ-all-swip-item last-item" @click="handleShowSelect">
						<image class="equ-all-swip-item-logo" src="@/static/images/recovery/classify.png">
							<text class="equ-all-swip-item-text">筛选</text>
					</view>
				</view>
			</scroll-view>
			<view class="equ-all-shops">
				<mescroll-uni @init="mescrollInit" ref="mescroll" :fixed="false" @down="handleRefreshDown"
					@up="handleRefreshUp" :down="{onScroll: false, use: true, auto: false}"
					:up="{onScroll: true, use: true, auto: false, page: pageOptions, noMoreSize: 16, textNoMore: '没有更多数据', offset: 0}">
					<view class="equ-all-shops-empty" v-if="!recommendList.length">
						<image src="@/static/images/recovery/empty-data.png" class="equ-all-shops-empty-img"></image>
						<text class="equ-all-shops-empty-text">暂无器材信息</text>
					</view>
					<view class="equ-all-shops-body" v-show="recommendList.length">
						<view class="equ-all-shops-item" v-for="(u,index) in recommendList" :key="u.id"
							@click="handleShowDetail(u)">
							<image :src="u.url" class="equ-all-shops-item-img"></image>
							<view class="equ-all-shops-item-info">
								<view class="equ-all-shops-item-info-left">
									<view class="equ-all-shops-item-info-name">
										{{ u.title }}
									</view>
									<view class="equ-all-shops-item-info-price">
										<text>{{ u.equipment_type_show }}</text>
									</view>
									<view class="equ-all-shops-item-info-sales">
										已售：{{ u.frequency_total_num_show }}
									</view>
								</view>
								<view class="equ-all-shops-item-info-right" @click.stop>
									<u-icon name="shopping-cart" color="#333" size="24"></u-icon>
								</view>
							</view>
							<view class="equ-all-shops-item-hot" v-if="u.frequency_total_num > 100">
								<image class="equ-all-shops-item-hot-img" src="@/static/images/store/hot-white.png"></image>
							</view>
							<view class="equ-all-shops-item-discount" v-if="u.has_discount">
								有折扣
							</view>
						</view>
					</view>
				</mescroll-uni>

			</view>
		</view>
		<view class="shopping-cart" @click="handleShowChart">
			<u-icon name="shopping-cart-fill" color="#fff" size="26"></u-icon>
			<view class="badge-box" :class="{'less99': equipmentCharts <= 99 && equipmentCharts >= 10, 'less10': equipmentCharts <10}"
				v-if="equipmentCharts">
				<u-badge numberType="overflow" type="error" max="99" :value="equipmentCharts"></u-badge>
			</view>
		</view>
		<view class="data-picker-wrapper">
			<uni-data-picker :key="refreshKey" :itemsList="itemsList" ref="picker" placeholder="请选择分类" preload
				popup-title="请选择分类" :localdata="dataTree" v-model="classes" @change="onchange" @nodeclick="onnodeclick"
				@popupopened="onpopupopened" @popupclosed="onpopupclosed">
			</uni-data-picker>
		</view>
	</view>
</template>

<script>
	import {
		getCarouselEquipmentsAction,
		getEquipmentsAction
	} from '@/service/service'
	export default {
		data() {
			return {
				switchType: 0,
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				switchList: ['新品', '折扣', '热销', '全部'],
				orders: 12,
				charts: 0,
				currentNum: 0,
				recommendList: [],
				shufflingList: [],
				mescroll: null,
				isDown: false,
				pageNo: 1,
				totalCount: 0,
				canDown: false,
				pageOptions: {
					num: 0,
					size: 16,
					time: null
				},
				classes: '',
				refreshKey: 0,
				itemsList: [
					"器材类型"
				],
				dataTree: [{
						text: '康复训练器材',
						value: '1'
					},
					{
						text: '康复理疗设备',
						value: '2'
					},
					{
						text: '康复治疗师工具',
						value: '3'
					}
				],
				hotOrder: false,
				hasDiscount: false,
				chooseInfo: {
					equipment_type: undefined
				},
				selectedInfo: '',
				keyword: '',
				keywordIn: ''
			}
		},
		props: {
			equipmentCharts: {
				type: Number,
				default: 0
			}
		},
		mounted() {
			this.getCarouselData()
			this.$loadingOn();
			this.getData().then(res => {
				this.recommendList = [...res.data]
			})
		},
		methods: {
			handleShowChart(){
				const that = this
				uni.navigateTo({
					url: "/pages_store/chart",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							showType: 'equipment'
						})
					}
				})
			},
			handleClickSwiper(index){
				this.handleShowDetail(this.shufflingList[index])
			},
			handleShowDetail(record) {
				const that = this
				uni.navigateTo({
					url: "/pages_store/equipment-detail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							record
						})
					}
				})
			},
			handleSearch(e) {
				this.keywordIn = this.keyword
				this.$loadingOn()
				this.getData().then(res => {
					this.pageNo = 1
					this.recommendList = [...res.data]
					console.log('刷新成功')
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0, 0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendList = []
					this.mescroll.endErr()
					this.mescroll.scrollTo(0, 0)
				})
			},
			handleClearSearch() {
				this.keywordIn = ''
				this.$loadingOn()
				this.getData().then(res => {
					this.pageNo = 1
					this.recommendList = [...res.data]
					console.log('刷新成功')
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0, 0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendList = []
					this.mescroll.endErr()
					this.mescroll.scrollTo(0, 0)
				})
			},
			/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			handleChangeType(type) {
				this.$emit('changeType', type)
			},
			handleChangeSwitchType(index) {
				this.switchType = index
				if (index === 1) {
					this.hotOrder = false
					this.hasDiscount = true
				}else if (index === 2) {
					this.hotOrder = true
					this.hasDiscount = false
				}  else {
					this.hotOrder = false
					this.hasDiscount = false
				}
				this.getData().then(res => {
					this.pageNo = 1
					this.recommendList = [...res.data]
					console.log('刷新成功')
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0, 0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendList = []
					this.mescroll.endErr()
					this.mescroll.scrollTo(0, 0)
				})
			},
			getCarouselData() {
				getCarouselEquipmentsAction().then(res => {
					const shufflingList = res.data ? [...res.data] : []
					shufflingList.map(item => {
						item.url = this.baseUrl + item.cover
					})
					this.shufflingList = [...shufflingList]
				})
			},
			getData(query = {}) {
				const that = this
				const customQuery = {
						...query,
						...this.chooseInfo,
						keyword: this.keywordIn,
						status: 1
				}
				if(this.hasDiscount){
					customQuery.has_discount = 1
				}
				if(this.hotOrder){
					customQuery.hot_order = 1
				}
				return new Promise((reslove, reject) => {
					getEquipmentsAction(customQuery).then(res => {
						const result = {
							...res.data
						}
						const dataIn = [...(result.data || [])]
						dataIn.map(item => {
							item.frequency_total_num_show = (item.frequency_total_num > 1000 && item
									.frequency_total_num <=
									10000) ? `${Math.floor(item.frequency_total_num / 1000)}k+` : (item
									.frequency_total_num > 10000 && item.frequency_total_num <= 100000) ?
								`${Math.floor(item.frequency_total_num / 10000)}k+` : item.frequency_total_num
							const equipment_type_map = ['康复训练器材', '康复理疗设备', '康复治疗师工具']
							item.equipment_type_show = equipment_type_map[item.equipment_type]
							item.url = this.baseUrl + item.cover
						})
						result.data = [...dataIn]
						that.totalCount = result.totalCount
						that.$loadingOff();
						reslove(result)
					}).catch(err => {
						console.log('err ------------ err', err)
						that.$loadingOff();
						reject(err)
					})
				})
			},
			onchange(e) {
				console.log('onchange:', e);
				this.keyword = ''
				this.keywordIn = ''
				if (e.detail.value.length) {
					this.selectedInfo = e.detail.value.length ? e.detail.value.map(item => item.text).join(' / ') : ''
					this.chooseInfo.equipment_type = e.detail.value[0].value - 1
				} else {
					this.chooseInfo.equipment_type = undefined
				}
				this.$loadingOn()
				this.getData().then(res => {
					this.pageNo = 1
					this.recommendList = [...res.data]
					console.log('刷新成功')
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0, 0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendList = []
					this.mescroll.endErr()
					this.mescroll.scrollTo(0, 0)
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
			handleRefreshDown(mescroll) {
				this.isDown = true
				console.log('下拉刷新', mescroll)
				mescroll.lockDownScroll(true)
				mescroll.lockUpScroll(true)
				this.getData().then(res => {
					this.pageNo = 1
					this.recommendList = [...res.data]
					console.log('刷新成功')
					mescroll.endSuccess(16, res.totalPage > this.pageNo, new Date())
					mescroll.lockDownScroll(false)
					setTimeout(() => {
						mescroll.lockUpScroll(false)
						this.isDown = false
					}, 1000)
				}).catch(err => {
					mescroll.endErr()
					console.log('刷新失败')
					mescroll.lockDownScroll(false)
					setTimeout(() => {
						mescroll.lockUpScroll(false)
						this.isDown = false
					}, 1000)
				})
			},
			handleRefreshUp(mescroll) {
				console.log('上拉刷新', mescroll)
				mescroll.lockUpScroll(true)
				if (this.isDown) {
					console.log('此刻正在下拉刷新，本次是无效的')
					mescroll.endErr()
					mescroll.lockUpScroll(false)
				} else {
					this.getData({
						pageNo: this.pageNo + 1,
						pageSize: 16
					}).then(res => {
						this.pageNo += 1
						mescroll.endSuccess(16, res.totalPage > this.pageNo, new Date())
						this.recommendList = [...this.recommendList, ...res.data]
						console.log('刷新成功')
						mescroll.lockUpScroll(false)
					}).catch(err => {
						mescroll.endErr()
						console.log('刷新失败')
						mescroll.lockUpScroll(false)
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.popup-view {
		width: 100%;
		background: #fff;

		.popup-view-in {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 24rpx;

			.popup-view-in-button {
				width: 40%;
			}
		}
	}

	.course-wrapper {
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 110rpx;

		.data-picker-wrapper {
			width: 0;
			height: 0;
			overflow: hidden;
		}

		.shopping-cart {
			position: fixed;
			right: 24rpx;
			bottom: 190rpx;
			width: 80rpx;
			height: 80rpx;
			background: #4F68B0;
			box-shadow: rgba(79, 104, 176, 0.3) 0px 14px 24px, rgba(79, 104, 176, 0.22) 0px 9px 8px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.badge-box {
				position: absolute;
				right: -16rpx;
				top: 6rpx;

				&.less99 {
					right: -4rpx;
				}

				&.less10 {
					right: 8rpx;
				}
			}
		}

		.course-top {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 24rpx;
			position: sticky;
			top: 0;

			.course-top-left {
				width: 80rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2px solid #969696;
				border-radius: 16rpx;
				flex-direction: column;

				.course-top-left-icon {
					width: 36rpx;
					height: 36rpx;
					margin-bottom: 6rpx;
				}

				.course-top-left-text {
					font-size: 10px;
					font-weight: 700;
				}
			}

			.course-top-center {
				font-size: 16px;
				color: #333;
				font-weight: 700;
				color: #2F3A4C;
			}

			.course-top-right {
				width: 80rpx;
				font-size: 16px;
				color: #fff;
			}
		}

		.equ-search {
			width: 100%;
			box-sizing: border-box;
			padding: 0 24rpx;
			margin-top: 36rpx;
			position: relative;
			display: flex;
			align-items: center;

			.equ-icon {
				width: 64rpx;
				height: 64rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 12rpx;
				box-sizing: border-box;
				//border: 1px solid #333;
				margin-left: 24rpx;
				position: relative;
				background: #f2f2f2;

				.equ-icon-img {
					width: 36rpx;
					height: 36rpx;
				}

				.badge-box {
					position: absolute;
					right: -24rpx;
					top: -6rpx;

					&.less99 {
						right: -12rpx;
					}

					&.less10 {
						right: 0rpx;
					}
				}
			}

			.course-search-icon {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				top: 50%;
				right: 36rpx;
				transform: translateY(-50%);
				z-index: 1;
			}
		}

		.ready-select {
			width: 100%;
			height: 86rpx;
			box-sizing: border-box;
			padding: 12rpx 24rpx;
			margin-top: 12rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.equ-icon {
				width: 64rpx;
				height: 64rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 12rpx;
				box-sizing: border-box;
				//border: 1px solid #333;
				margin-left: 24rpx;
				position: relative;
				background: #f2f2f2;
				flex-shrink: 0;
			
				.equ-icon-img {
					width: 36rpx;
					height: 36rpx;
				}
			
				.badge-box {
					position: absolute;
					right: -24rpx;
					top: -6rpx;
			
					&.less99 {
						right: -12rpx;
					}
			
					&.less10 {
						right: 0rpx;
					}
				}
			}

			.ready-select-inner {
				flex-grow: 1;
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

		.equ-all-title {
			width: 100%;
			font-size: 14px;
			color: #333;
			font-weight: 700;
			color: #2F3A4C;
			box-sizing: border-box;
			padding: 0 24rpx;
			margin-top: 24rpx;
		}

		.course-recommend {
			width: 100%;
			margin-top: 36rpx;

			.course-recommend-title {
				width: 100%;
				font-size: 14px;
				color: #333;
				font-weight: 700;
				color: #2F3A4C;
				box-sizing: border-box;
				padding: 0 24rpx;
			}

			.course-recommend-body {
				margin-top: 24rpx;
				box-sizing: border-box;
				padding: 0 24rpx;

				.indicator-num {
					padding: 2px 0;
					background-color: rgba(0, 0, 0, 0.35);
					border-radius: 100px;
					width: 35px;
					display: flex;
					justify-content: center;

					&__text {
						color: #FFFFFF;
						font-size: 12px;
					}
				}

				.course-recommend-item {
					margin-right: 48rpx;
					box-sizing: border-box;
					padding: 24rpx 24rpx 36rpx 24rpx;
					box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
					margin-bottom: 36rpx;
					margin-top: 24rpx;
					border-radius: 16rpx;
					width: 528rpx;

					&.first {
						margin-left: 24rpx;
					}

					.course-recommend-item-img {
						width: 480rpx;
						height: 288rpx;

						.course-recommend-item-img-in {
							width: 100%;
							height: 100%;
							border-radius: 24rpx;
						}
					}

					.course-recommend-item-tag {
						width: 100%;
						margin-top: 12rpx;
						display: flex;
						align-items: center;

						.course-recommend-item-tag-in {
							font-size: 11px;
							color: #333;
							font-weight: 700;
							color: #aaa;

							.tag-in-point {
								box-sizing: border-box;
								padding: 0 12rpx;
							}
						}
					}

					.course-recommend-item-title {
						width: 100%;
						margin-top: 12rpx;
						box-sizing: border-box;
						font-size: 15px;
						color: #333;
						font-weight: 700;
						color: #2F3A4C;
					}

					.course-recommend-item-description {
						width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						margin-top: 6rpx;
						box-sizing: border-box;
						font-size: 12px;
						color: #aaa;
					}

					.course-recommend-item-info {
						width: 100%;
						display: flex;
						align-items: center;
						box-sizing: border-box;
						margin-top: 26rpx;

						.item-info-avatar {
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
							margin-right: 12rpx;
						}

						.item-info-author {
							font-size: 13px;
							color: #333;
							color: #2F3A4C;
							margin-right: 24rpx;
						}

						.item-info-view {
							font-size: 12px;
							color: #999;
							display: flex;
							align-items: center;

							.item-info-view-text {
								padding-left: 12rpx;
							}
						}
					}
				}
			}
		}

		.equ-all {
			width: 100%;
			margin-top: 24rpx;

			.equ-all-swip {
				width: 100%;
				box-sizing: border-box;
				padding: 0 24rpx;

				.equ-all-swip-in {
					width: 100%;
					display: flex;
					align-items: center;

					.equ-all-swip-item {
						width: 180rpx;
						height: 60rpx;
						border: 1px solid #F6F6F6;
						border-radius: 12rpx;
						font-size: 12px;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 24rpx;
						transition: all 0.3s;
						font-weight: 700;

						&.active {
							border-color: #4F68B0;
							background: #4F68B0;
							color: #fff;
						}

						&.last-item {
							border-color: #333;

							.equ-all-swip-item-logo {
								width: 30rpx;
								height: 30rpx;
								margin-right: 12rpx;
							}
						}
					}
				}
			}

			.equ-all-shops {
				width: 100%;
				margin-top: 24rpx;
				background: #fff;
				box-sizing: border-box;
				height: 800rpx;

				&.search {
					height: 1300rpx;
				}

				.equ-all-shops-body {
					width: 100%;
					box-sizing: border-box;
					padding: 0 24rpx;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					align-items: center;
				}

				.equ-all-shops-empty {
					width: 100%;
					margin-top: 24rpx;
					margin-bottom: 24rpx;
				}

				.equ-all-shops-empty {
					width: 100%;
					padding: 48rpx 0;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					box-sizing: border-box;
					margin-top: 100rpx;

					.equ-all-shops-empty-img {
						width: 100rpx;
						height: 100rpx;
						margin-bottom: 24rpx;
					}

					.equ-all-shops-empty-text {
						font-size: 13px;
						color: #DAE1F4;
					}
				}

				.equ-all-shops-item {
					width: 47%;
					margin-bottom: 24rpx;
					position: relative;
					overflow: hidden;

					.equ-all-shops-item-hot {
						position: absolute;
						top: 0;
						left: 0;
						width: 0;
						height: 0;
						border: 40rpx solid;
						border-color: #F4595B transparent transparent #F4595B;
						display: flex;
						align-items: center;
						justify-content: center;
						border-top-left-radius: 24rpx;
						z-index: 2;

						.equ-all-shops-item-hot-img {
							width: 32rpx;
							height: 32rpx;
							position: absolute;
							top: -30rpx;
							left: -30rpx;
						}
					}

					.equ-all-shops-item-new {
						position: absolute;
						top: 0;
						left: 0;
						width: 0;
						height: 0;
						border: 40rpx solid;
						border-color: #44D292 transparent transparent #44D292;
						display: flex;
						align-items: center;
						justify-content: center;
						border-top-left-radius: 24rpx;
						z-index: 1;

						.equ-all-shops-item-new-img {
							width: 32rpx;
							height: 32rpx;
							position: absolute;
							top: -30rpx;
							left: -30rpx;
						}
					}

					.equ-all-shops-item-discount {
						position: absolute;
						top: 12rpx;
						right: 12rpx;
						background: #F4595B;
						border-radius: 6rpx;
						box-sizing: border-box;
						padding: 2rpx 6rpx;
						font-size: 10px;
						color: #fff;
						font-weight: 700;
					}

					.equ-all-shops-item-img {
						width: 100%;
						border-radius: 24rpx;
						height: 200rpx;
					}

					.equ-all-shops-item-info {
						margin-top: 12rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.equ-all-shops-item-info-left {
							display: flex;
							flex-direction: column;

							.equ-all-shops-item-info-name {
								font-size: 14px;
								font-weight: 700;
								flex-shrink: 0;
								white-space: nowrap;
							}

							.equ-all-shops-item-info-price {
								font-size: 12px;
								font-weight: 700;
								flex-shrink: 0;
								white-space: nowrap;
								color: #999;
							}

							.equ-all-shops-item-info-sales {
								font-size: 10px;
								color: #999;
								flex-shrink: 0;
								white-space: nowrap;
							}
						}

						.equ-all-shops-item-info-right {
							width: 60rpx;
							height: 60rpx;
							background: #F2F2F2;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							opacity: 0;
						}
					}
				}
			}
		}
	}
</style>
