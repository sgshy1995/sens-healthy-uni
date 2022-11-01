<template>
	<view class="course-wrapper">
		<view class="course-search" v-if="!classes">
			<u-search v-model="keyword" @search="handleSearch" @clear="handleClearSearch" shape="square" :show-action="false"></u-search>
			<view class="course-search-icon" @click.stop="handleShowSelect">
				<image class="course-search-icon-img" src="@/static/images/store/filter.png"></image>
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
		</view>
		<view class="course-recommend" v-if="shufflingList.length" v-show="!classes && !keywordIn">
			<view class="course-recommend-body">
				<u-swiper :height="160" :list="shufflingList" previousMargin="30" nextMargin="30" circular :autoplay="true"
					radius="5" :interval="5000" indicatorActiveColor="#4F68B0" bgColor="#ffffff" @click="handleClickSwiper"></u-swiper>
			</view>
		</view>
		<view class="course-type">
			<view class="course-type-body">
				<view class="course-type-item" @click="handleChangeCourseType('live')" :class="{active: showType === 'live'}">
					<image src="@/static/images/store/live-white.png" class="course-type-item-img" v-if="showType === 'live'"></image>
					<image src="@/static/images/store/live.png" class="course-type-item-img" v-else></image>
					<text class="course-type-item-text">面对面康复指导</text>
				</view>
				<view class="course-type-item" @click="handleChangeCourseType('cf')" :class="{active: showType === 'cf'}">
					<image src="@/static/images/store/cf-white.png" class="course-type-item-img" v-if="showType === 'cf'"></image>
					<image src="@/static/images/store/cf.png" class="course-type-item-img" v-else></image>
					<text class="course-type-item-text">专业能力提升</text>
				</view>
			</view>
		</view>
		<view class="course-all" v-show="showType === 'cf'">
			<view class="course-all-title" v-if="classes || keywordIn">
				搜索结果共 {{ totalCount }} 课程
			</view>
			<view class="course-all-title" v-else>
				课程列表
			</view>
			<view class="course-all-wrapper" :class="{search: classes || keywordIn || !shufflingList.length}">
				<mescroll-uni @init="mescrollInit" ref="mescroll" :fixed="false"
					@down="handleRefreshDown" @up="handleRefreshUp" :down="{onScroll: false, use: true, auto: false}"
					:up="{onScroll: true, use: true, auto: false, page: pageOptions, noMoreSize: 8, textNoMore: '没有更多数据', offset: 0}">
					<view class="course-all-empty" v-if="!recommendList.length">
						<image src="@/static/images/recovery/empty-data.png" class="course-all-empty-img"></image>
						<text class="course-all-empty-text">暂无课程信息</text>
					</view>
					<view class="course-all-body" v-show="recommendList.length">
						<view class="course-all-item" v-for="(item, index) in recommendList" :key="index"
							@click="handleShowDetail(item, 'video')">
							<view class="course-all-item-add-chart" @click.stop="handleAddChart(item, 'video')">
								<u-icon name="shopping-cart" color="#333" size="48rpx"></u-icon>
							</view>
							<view class="course-all-item-left">
								<image class="course-all-item-left-img" :src="item.url"></image>
							</view>
							<view class="course-all-item-right">
								<view class="item-right-tag">
									<text class="item-right-tag-in">
										<text class="tag-in-text">专业能力提升</text>
										<text class="tag-in-point">·</text>
									</text>
									<text class="item-right-tag-in" >
										<text class="tag-in-text">{{ item.course_type_show }}</text>
										<text class="tag-in-point">·</text>
									</text>
									<text class="item-right-tag-in">
										<text class="tag-in-text">{{ item.video_num }}节</text>
									</text>
								</view>
								<view class="item-right-title">{{ item.title }}</view>
								<view class="item-right-description">{{ item.description }}</view>
								<text class="item-right-info-left">
									售价: <text class="item-right-info-left-in" v-if="!item.is_discount">¥ {{ item.price }}</text>
									<text class="item-right-info-left-in" v-else>
										<text class="in-discount">¥ {{ item.price }}</text>
										<text class="show-discount">¥ {{ item.discount }}</text>
									</text>
								</text>
								<text class="item-right-info-right-go">
									已售: {{ item.frequency_num_show }}
								</text>
							</view>
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
		<view class="course-all" v-show="showType === 'live'">
			<view class="course-all-title" v-if="classes || keywordIn">
				搜索结果共 {{ totalCountLive }} 课程
			</view>
			<view class="course-all-title" v-else>
				课程列表
			</view>
			<view class="course-all-wrapper" :class="{search: classes || keywordIn || !shufflingList.length}">
				<mescroll-uni @init="mescrollInitLive" ref="mescrollLive" :fixed="false"
					@down="handleRefreshDownLive" @up="handleRefreshUpLive" :down="{onScroll: false, use: true, auto: false}"
					:up="{onScroll: true, use: true, auto: false, page: pageOptionsLive, noMoreSize: 8, textNoMore: '没有更多数据', offset: 0}">
					<view class="course-all-empty" v-if="!recommendListLive.length">
						<image src="@/static/images/recovery/empty-data.png" class="course-all-empty-img"></image>
						<text class="course-all-empty-text">暂无课程信息</text>
					</view>
					<view class="course-all-body" v-show="recommendListLive.length">
						<view class="course-all-item" v-for="(item, index) in recommendListLive" :key="index"
							@click="handleShowDetail(item, 'live')">
							<view class="course-all-item-add-chart" @click.stop="handleAddChart(item, 'live')">
								<u-icon name="shopping-cart" color="#333" size="48rpx"></u-icon>
							</view>
							<view class="course-all-item-left">
								<image class="course-all-item-left-img" :src="item.url"></image>
							</view>
							<view class="course-all-item-right">
								<view class="item-right-tag">
									<text class="item-right-tag-in">
										<text class="tag-in-text">面对面康复指导</text>
										<text class="tag-in-point">·</text>
									</text>
									<text class="item-right-tag-in" >
										<text class="tag-in-text">{{ item.course_type_show }}</text>
										<text class="tag-in-point">·</text>
									</text>
									<text class="item-right-tag-in">
										<text class="tag-in-text">{{ item.live_num }}次</text>
									</text>
								</view>
								<view class="item-right-title">{{ item.title }}</view>
								<view class="item-right-description">{{ item.description }}</view>
								<text class="item-right-info-left">
									售价: <text class="item-right-info-left-in" v-if="!item.is_discount">¥ {{ item.price }}</text>
									<text class="item-right-info-left-in" v-else>
										<text class="in-discount">¥ {{ item.price }}</text>
										<text class="show-discount">¥ {{ item.discount }}</text>
									</text>
								</text>
								<text class="item-right-info-right-go">
									已售: {{ item.frequency_num_show }}
								</text>
							</view>
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
		<view class="shopping-cart" @click="handleShowChart">
			<u-icon name="shopping-cart-fill" color="#fff" size="26"></u-icon>
			<view class="badge-box" :class="{'less99': courseCharts <= 99 && courseCharts >= 10, 'less10': courseCharts <10}"
				v-if="courseCharts">
				<u-badge numberType="overflow" type="error" max="99" :value="courseCharts"></u-badge>
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
		getCarouselCoursesAction,
		getVideoCourseAction,
		getLiveCourseAction,
		createCourseChartAction
	} from '@/service/service'
	export default {
		data() {
			return {
				showType: 'live',
				shufflingList: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				recommendList: [],
				recommendListLive: [],
				mescroll: null,
				mescrollLive: null,
				sticky: false,
				isDown: false,
				isDownLive: false,
				pageNo: 1,
				pageNoLive: 1,
				totalCount: 0,
				totalCountLive: 0,
				canDown: false,
				canDownLive: false,
				pageOptions: {
					num: 0,
					size: 8,
					time: null
				},
				pageOptionsLive: {
					num: 0,
					size: 8,
					time: null
				},
				classes: '',
				refreshKey: 0,
				itemsList: [
					"课程类型"
				],
				dataTree: [
					{
						text: '运动康复',
						value: '1'
					},
					{
						text: '神经康复',
						value: '2'
					},
					{
						text: '产后康复',
						value: '3'
					},
					{
						text: '术后康复',
						value: '4'
					}
				],
				hotOrder: false,
				hotOrderLive: false,
				chooseInfo: {
					course_type: undefined
				},
				selectedInfo: '',
				keyword: '',
				keywordIn: ''
			}
		},
		props: {
			courseCharts: {
				type: Number,
				default: 0
			}
		},
		mounted(){
			this.getCarouselData()
			this.$loadingOn();
			this.getData().then(res => {
				this.recommendList = [...res.data]
			})
			this.getDataLive().then(res => {
				this.recommendListLive = [...res.data]
			})
		},
		methods: {
			handleAddChart(record, type){
				this.$loadingOn()
				createCourseChartAction({
					course_id: record.id,
					add_course_type: type === 'live' ? 1 : 0
				}).then(res=>{
					this.$emit('chart')
					this.$loadingOff()
					this.$toast('已加入购物车~')
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleShowChart(){
				const that = this
				uni.navigateTo({
					url: "/pages_store/chart",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							showType: 'course'
						})
					}
				})
			},
			handleClickSwiper(index){
				this.handleShowDetail(this.shufflingList[index], this.shufflingList[index].video_num ? 'video' : 'live')
			},
			handleShowDetail(record, type) {
				const that = this
				uni.navigateTo({
					url: "/pages_store/course-detail",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							record,
							type
						})
					}
				})
			},
			handleSearch(e){
				this.keywordIn = this.keyword
				this.$loadingOn()
				this.getData().then(res => {
					this.pageNo = 1
					this.recommendList = [...res.data]
					console.log('刷新成功')
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0,0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendList = []
					this.mescroll.endErr()
					this.mescroll.scrollTo(0,0)
				})
				this.getDataLive().then(res => {
					this.pageNoLive = 1
					this.recommendListLive = [...res.data]
					console.log('刷新成功')
					this.mescrollLive.resetUpScroll()
					this.mescrollLive.scrollTo(0,0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendListLive = []
					this.mescrollLive.endErr()
					this.mescrollLive.scrollTo(0,0)
				})
			},
			handleClearSearch(){
				this.keywordIn = ''
				this.$loadingOn()
				this.getData().then(res => {
					this.pageNo = 1
					this.recommendList = [...res.data]
					console.log('刷新成功')
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0,0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendList = []
					this.mescroll.endErr()
					this.mescroll.scrollTo(0,0)
				})
				this.getDataLive().then(res => {
					this.pageNoLive = 1
					this.recommendListLive = [...res.data]
					console.log('刷新成功')
					this.mescrollLive.resetUpScroll()
					this.mescrollLive.scrollTo(0,0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendListLive = []
					this.mescrollLive.endErr()
					this.mescrollLive.scrollTo(0,0)
				})
			},
			/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			mescrollInitLive(mescroll) {
				this.mescrollLive = mescroll;
			},
			onchange(e) {
				console.log('onchange:', e);
				this.keyword = ''
				this.keywordIn = ''
				this.hotOrder = false
				if(e.detail.value.length){
					this.selectedInfo = e.detail.value.length ? e.detail.value.map(item => item.text).join(' / ') : ''
					this.chooseInfo.course_type = e.detail.value[0].value - 1
				}else{
					this.chooseInfo.course_type = undefined
				}
				this.$loadingOn()
				this.getData().then(res => {
					this.pageNo = 1
					this.recommendList = [...res.data]
					console.log('刷新成功')
					this.mescroll.resetUpScroll()
					this.mescroll.scrollTo(0,0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendList = []
					this.mescroll.endErr()
					this.mescroll.scrollTo(0,0)
				})
				this.getDataLive().then(res => {
					this.pageNoLive = 1
					this.recommendListLive = [...res.data]
					console.log('刷新成功')
					this.mescrollLive.resetUpScroll()
					this.mescrollLive.scrollTo(0,0)
				}).catch(err => {
					console.log('刷新失败', err)
					this.recommendListLive = []
					this.mescrollLive.endErr()
					this.mescrollLive.scrollTo(0,0)
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
				mescroll.lockUpScroll( true )
				this.getData().then(res => {
					this.pageNo = 1
					this.recommendList = [...res.data]
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
			handleRefreshDownLive(mescroll) {
				this.isDownLive = true
				console.log('下拉刷新', mescroll)
				mescroll.lockDownScroll(true)
				mescroll.lockUpScroll( true )
				this.getDataLive().then(res => {
					this.pageNoLive = 1
					this.recommendListLive = [...res.data]
					console.log('刷新成功')
					mescroll.endSuccess(8, res.totalPage > this.pageNoLive, new Date())
					mescroll.lockDownScroll(false)
					setTimeout(()=>{
						mescroll.lockUpScroll( false )
						this.isDownLive = false
					},1000)
				}).catch(err => {
					mescroll.endErr()
					console.log('刷新失败')
					mescroll.lockDownScroll(false)
					setTimeout(()=>{
						mescroll.lockUpScroll( false )
						this.isDownLive = false
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
			handleRefreshUpLive(mescroll) {
				console.log('上拉刷新', mescroll)
				mescroll.lockUpScroll(true)
				if(this.isDownLive){
					console.log('此刻正在下拉刷新，本次是无效的')
					mescroll.endErr()
					mescroll.lockUpScroll(false)
				}else{
					this.getDataLive({pageNo: this.pageNoLive+1, pageSize: 8}).then(res => {
						this.pageNoLive += 1
						mescroll.endSuccess(8, res.totalPage > this.pageNoLive, new Date())
						this.recommendListLive = [...this.recommendListLive, ...res.data]
						console.log('刷新成功')
						mescroll.lockUpScroll(false)
					}).catch(err => {
						mescroll.endErr()
						console.log('刷新失败')
						mescroll.lockUpScroll(false)
					})
				}
			},
			handleChangeType(type) {
				this.$emit('changeType', type)
			},
			handleChangeCourseType(type){
				this.showType = type
			},
			getData(query = {}) {
				console.log('1111111111')
				const that = this
				return new Promise((reslove, reject) => {
					getVideoCourseAction({
						...query,
						...this.chooseInfo,
						keyword: this.keywordIn,
						status: 1
					}).then(res => {
						const result = {
							...res.data
						}
						const dataIn = [...(result.data || [])]
						dataIn.map(item => {
							item.frequency_num_show = (item.frequency_num > 1000 && item.frequency_num <=
									10000) ? `${Math.floor(item.frequency_num / 1000)}k+` : (item
									.frequency_num > 10000 && item.frequency_num <= 100000) ?
								`${Math.floor(item.frequency_num / 10000)}k+` : item.frequency_num
							const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
							item.course_type_show = course_type_map[item.course_type]
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
			getDataLive(query = {}) {
				console.log('1111111111')
				const that = this
				return new Promise((reslove, reject) => {
					getLiveCourseAction({
						...query,
						...this.chooseInfo,
						keyword: this.keywordIn,
						status: 1
					}).then(res => {
						const result = {
							...res.data
						}
						const dataIn = [...(result.data || [])]
						dataIn.map(item => {
							item.frequency_num_show = (item.frequency_num > 1000 && item.frequency_num <=
									10000) ? `${Math.floor(item.frequency_num / 1000)}k+` : (item
									.frequency_num > 10000 && item.frequency_num <= 100000) ?
								`${Math.floor(item.frequency_num / 10000)}k+` : item.frequency_num
							const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
							item.course_type_show = course_type_map[item.course_type]
							item.url = this.baseUrl + item.cover
						})
						result.data = [...dataIn]
						that.totalCountLive = result.totalCount
						that.$loadingOff();
						reslove(result)
					}).catch(err => {
						console.log('err ------------ err', err)
						that.$loadingOff();
						reject(err)
					})
				})
			},
			getCarouselData(){
				getCarouselCoursesAction().then(res=>{
					const shufflingList = res.data ? [...res.data] : []
					shufflingList.map(item=>{
						item.url = this.baseUrl + item.cover
					})
					this.shufflingList = [...shufflingList]
				})
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
		height: 100vh;
		
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
			z-index: 3;
		
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

		.course-search {
			width: 100%;
			box-sizing: border-box;
			padding: 0 24rpx;
			margin-top: 36rpx;
			position: relative;
			display: flex;
			align-items: center;
			
			.course-search-icon{
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
				
				.course-search-icon-img{
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
		
		.ready-select {
			width: 100%;
			height: 86rpx;
			box-sizing: border-box;
			padding: 12rpx 24rpx;
			margin-top: 24rpx;
		
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
			}
		}
		
		.course-search-result-show{
			width: 100%;
			margin-top: 36rpx;
			font-weight: bold;
			font-size: 13px;
		}
		
		.course-type{
			width: 100%;
			margin-top: 36rpx;
			
			.course-type-title{
				width: 100%;
				font-size: 14px;
				color: #333;
				font-weight: 700;
				color: #2F3A4C;
				box-sizing: border-box;
				padding: 0 24rpx;
			}
			
			.course-type-body{
				margin-top: 24rpx;
				width: 100%;
				box-sizing: border-box;
				padding: 0 24rpx;
				display: flex;
				align-items: center;
			}
			
			.course-type-item{
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 8rpx 14rpx;
				border-radius: 16rpx;
				background: #fff;
				box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
				margin-right: 24rpx;
				
				.course-type-item-img{
					width: 36rpx;
					height: 36rpx;
					margin-right: 8rpx;
				}
				
				.course-type-item-text{
					font-size: 13px;
					font-weight: bold;
					color: #333;
				}
				
				&.active{
					background: #4F68B0;
					
					.course-type-item-text{
						color: #fff;
					}
				}
			}
		}

		.course-all {
			width: 100%;
			margin-top: 24rpx;

			.course-all-title {
				width: 100%;
				font-size: 14px;
				color: #333;
				font-weight: 700;
				color: #2F3A4C;
				box-sizing: border-box;
				padding: 0 24rpx;
			}
			
			.course-all-wrapper {
				width: 100%;
				flex-grow: 1;
				height: 800rpx;
				box-sizing: border-box;
				padding-bottom: 90rpx;
				position: relative;
				
				&.search{
					height: 1300rpx;
				}
			}
			
			.course-all-empty {	
				width: 100%;
				margin-top: 24rpx;
				margin-bottom: 24rpx;
			}
			
			.course-all-empty {
				width: 100%;
				padding: 48rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				box-sizing: border-box;
				margin-top: 100rpx;
			
				.course-all-empty-img {
					width: 100rpx;
					height: 100rpx;
					margin-bottom: 24rpx;
				}
			
				.course-all-empty-text {
					font-size: 13px;
					color: #DAE1F4;
				}
			}

			.course-all-body {
				margin-top: 24rpx;
				width: 100%;
				box-sizing: border-box;
				padding: 0 24rpx;

				.course-all-item {
					width: 100%;
					display: flex;
					align-items: center;
					height: 240rpx;
					box-sizing: border-box;
					box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
					margin-bottom: 24rpx;
					border-radius: 16rpx;
					overflow: hidden;
					position: relative;
					z-index: 1;
					
					.course-all-item-add-chart {
						width: 60rpx;
						height: 60rpx;
						background: #F2F2F2;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						position: absolute;
						top: 12rpx;
						right: 12rpx;
						z-index: 2;
					}

					.course-all-item-left {
						width: 280rpx;
						height: 100%;
						flex-shrink: 0;
						box-sizing: border-box;
						padding: 12rpx;

						.course-all-item-left-img {
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
						}
					}

					.course-all-item-right {
						width: calc(100% - 280rpx);
						height: 100%;
						box-sizing: border-box;
						padding: 0 12rpx;
						position: relative;

						.item-right-tag {

							width: 100%;
							margin-top: 12rpx;
							display: flex;
							align-items: center;

							.item-right-tag-in {
								font-size: 11px;
								color: #333;
								font-weight: 700;
								color: #aaa;

								.tag-in-point {
									box-sizing: border-box;
									padding: 0 6rpx;
								}
							}
						}

						.item-right-title {
							width: 100%;
							margin-top: 12rpx;
							box-sizing: border-box;
							font-size: 15px;
							color: #333;
							font-weight: 700;
							color: #2F3A4C;
						}

						.item-right-description {
							width: 100%;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							margin-top: 6rpx;
							box-sizing: border-box;
							font-size: 12px;
							color: #333;
						}

						.item-right-info-left{
							color: #333;
							font-size: 12px;
							position: absolute;
							bottom: 12rpx;
							left: 12rpx;
							
							.item-right-info-left-in{
								font-weight: bold;
								font-size: 13px;
								padding-left: 4rpx;
							}
							
							.in-discount{
								text-decoration:line-through;
								color: #999;
							}
							
							.show-discount{
								color: #4F68B0;
								padding-left: 12rpx;
							}
						}
						
						.item-right-info-right-go{
							color: #aaa;
							font-size: 12px;
							position: absolute;
							bottom: 12rpx;
							right: 12rpx;
							padding-right: 12rpx;
							white-space: nowrap;
							text-align: right;
							box-sizing: border-box;
						}
					}
				}
			}
		}
	}
</style>
