<template>
	<view class="doctor-wrapper">
		<view class="doctor-wrapper-top">
			<u-status-bar></u-status-bar>
			<view class="doctor-wrapper-top-one"></view>
			<view class="doctor-wrapper-top-two"></view>
			<view class="doctor-wrapper-top-three"></view>
			<view class="doctor-wrapper-top-four"></view>
			<image src="@/static/images/mine/doctor-img.png" class="doctor-wrapper-top-five"></image>
			<view class="doctor-wrapper-top-info">
				<view class="doctor-wrapper-top-info-left">
					<image class="doctor-wrapper-top-info-left-img" :src="userInfo.avatar ? baseUrl + userInfo.avatar : avatarDefault" @click="showView(userInfo.avatar)"></image>
					<image v-if="userInfo.authenticate === 2" src="@/static/images/mine/auth.png" class="doctor-wrapper-top-info-left-auth"></image>
				</view>
				<view class="doctor-wrapper-top-info-right">
					<u-icon name="bell" color="#212024" size="36rpx"></u-icon>
				</view>
			</view>
			<view class="doctor-wrapper-top-last">
				<view class="doctor-wrapper-top-last-welcome">欢迎您！</view>
				<view class="doctor-wrapper-top-last-name">
					<text class="doctor-wrapper-top-last-name-in">{{ userInfo.authenticate_info.name }}</text>
					<image v-if="userInfo.authenticate_info.gender === 1" src="@/static/images/mine/doctor-male.png" class="doctor-wrapper-top-last-name-img"></image>
					<image v-else-if="userInfo.authenticate_info.gender === 0" src="@/static/images/mine/doctor-famale.png" class="doctor-wrapper-top-last-name-img"></image>
				</view>
				<view class="doctor-wrapper-top-last-organization">@{{ userInfo.authenticate_info.organization }}</view>
				<view class="doctor-wrapper-top-last-button">
					查看个人资料
				</view>
			</view>
		</view>
		<view class="doctor-wrapper-bottom">
			<view class="doctor-wrapper-bottom-service">
				<view class="doctor-wrapper-bottom-service-title">
					医师服务
				</view>
				<scroll-view scroll-x class="doctor-wrapper-bottom-service-body">
					<view class="doctor-wrapper-bottom-service-body-item" @click="handleShowBookManage">
						<view class="doctor-wrapper-bottom-service-body-item-top">
							<image src="@/static/images/mine/book-time.png" class="doctor-wrapper-bottom-service-body-item-top-img"></image>
						</view>
						<view class="doctor-wrapper-bottom-service-body-item-bottom">
							预约时间
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="doctor-wrapper-bottom-course">
				<view class="doctor-wrapper-bottom-course-title">
					已预约课程{{ recentList.length ? ` · ${recentList.length}` : '' }}
				</view>
				<view class="doctor-wrapper-bottom-course-body">
					<mescroll-uni style="width: 100%" ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
						<view class="doctor-wrapper-bottom-course-body-empty" v-if="!recentList.length">
							<image src="@/static/images/recovery/empty-data.png" class="doctor-wrapper-bottom-course-body-empty-img"></image>
							<text class="doctor-wrapper-bottom-course-body-empty-text">暂无预约课程，刷新下看看吧~</text>
						</view>
						<uni-swipe-action>
							<!-- 基础用法 -->
							<uni-swipe-action-item @click="(e) => onClickItemIn(e, u)" :right-options="optionsOne" v-for="(u, index) in recentList" :key="u.id">
								<view class="doctor-wrapper-bottom-course-body-item" :class="{'last-one': index === recentList.length - 1}">
									<view class="cell-item-border" :class="{active: u.if_booked}"></view>
									<view class="cell-item-top">
										<view class="cell-item-top-one">已开放预约时间</view>
										<view class="cell-item-top-two">
											<u-icon name="clock" color="#333" size="32rpx"></u-icon>
											<text class="cell-item-top-two-text">{{ `${u.start_time_show} ~ ${u.end_time_show}` }}</text>
										</view>
									</view>
									<view class="cell-item-bottom" v-if="u.if_booked" @click.stop="handleShowPopupDetail(u)">
										<view class="cell-item-bottom-total-left">
											<view class="cell-item-bottom-left">
												<image :src="u.course_info.url" class="cell-item-bottom-left-img"></image>
											</view>
											<view class="cell-item-bottom-right">
												<view class="cell-item-bottom-right-title">{{ u.course_info.title }}</view>
												<view class="cell-item-bottom-right-num">{{ `第 ${u.patient_course_info.learn_num + 1} / ${u.patient_course_info.course_live_num} 课时` }}</view>
											</view>
										</view>
										<view class="cell-item-bottom-total-right">
											<image class="cell-item-bottom-total-right-img" src="@/static/images/mine/time-view.png"></image>
										</view>
									</view>
								</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
						<u-safe-bottom></u-safe-bottom>
					</mescroll-uni>
				</view>
			</view>
		</view>
		<u-modal :show="showCancelModal" showCancelButton confirmColor="#E06C75" @confirm="handleConfirmOkCancel" @cancel="handleCancelCancelModal">
			<view class="slot-content modal-cancel-time">
				<view class="modal-cancel-time-tip">
					<image class="modal-cancel-time-tip-img" src="@/static/images/mine/popup-range.png"></image>
					<text class="modal-cancel-time-tip-text">{{ `${real_start_time} ~ ${real_end_time}` }}</text>
				</view>
				<view class="modal-cancel-time-times">
					是否无则取消: {{ (totalInfo.canceled_reason || (totalInfo.book_info && totalInfo.book_info.outer_canceled_reason)) ? '否' : '是' }}
				</view>
				<view class="modal-cancel-time-in" v-if="totalInfo.canceled_reason || (totalInfo.book_info && totalInfo.book_info.outer_canceled_reason)">请您在取消之前和预约用户提前沟通。<text class="modal-cancel-time-in-in">因为您之前已取消过一次，本次取消您将承担违约责任，平台将会赠送预约用户一次直播课时，且由您来承担。确认取消预约吗？</text></view>
				<view class="modal-cancel-time-in" v-else>请您在取消之前和预约用户提前沟通。您有一次无责取消机会，确定取消该预约吗？</view>
				<view class="modal-cancel-time-agree-button">
					<u-checkbox-group labelSize="13px" labelColor="#333" v-model="checkboxValueCancel" placement="column" activeColor="#E06C75" @change="checkboxChangeCancel">
						<u-checkbox labelSize="13px" labelColor="#333" :customStyle="{fontWeight: 'bold', fontSize: '14px', color: '#333'}" v-for="(item, index) in checkboxListCancel"
							:key="index" :label="item.name" :name="item.name">
						</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
		</u-modal>
		<u-popup :overlayStyle="{zIndex: 9999}" zIndex="10000" :show="showPopupDetail" :closeOnClickOverlay="true" @close="handleClosePopupDetail" @open="handleShowPopupDetail">
			<view class="popup-detail-wrpper">
				<text class="popup-detail-wrpper-close" @click="handleClosePopupDetail">关闭</text>
				<view class="popup-detail-wrpper-title">
					<image src="@/static/images/mine/popup.png" class="popup-detail-wrpper-title-img"></image>
					<text class="popup-detail-wrpper-title-text">预约详情</text>
				</view>
				<view class="popup-detail-wrpper-body">
					<view class="popup-detail-wrpper-body-ready">
						<image class="popup-detail-wrpper-body-ready-img" src="@/static/images/mine/popup-date.png"></image>
						<text class="popup-detail-wrpper-body-ready-text">预约时间</text>
					</view>
					<view class="popup-detail-wrpper-body-time">
						{{ `${real_start_time} ~ ${real_end_time}` }}
					</view>
				</view>
				<view class="popup-detail-wrpper-course">
					<view class="popup-detail-wrpper-course-title">
						<image class="popup-detail-wrpper-course-title-img" src="@/static/images/mine/popup-course.png"></image>
						<text class="popup-detail-wrpper-course-title-text">课程信息</text>
					</view>
					<view class="popup-detail-wrpper-course-body" v-if="totalInfo && totalInfo.course_info && totalInfo.course_info.id" @click="handleShowCourseDetail(totalInfo.course_info, 'live')">
						<view class="chart-right-content">
							<view class="body-item-top">
								<view class="body-item-top-left">
									<image class="body-item-top-left-img" :src="totalInfo.course_info.url">
									</image>
								</view>
								<view class="body-item-top-right">
									<view class="body-item-top-right-title">{{ totalInfo.course_info.title }}</view>
									<view class="body-item-top-right-tag">
										<text class="item-right-tag-in">
											<text class="tag-in-text">{{ totalInfo.course_info.course_type_show }}</text>
											<text class="tag-in-point">·</text>
										</text>
										<text class="item-right-tag-in">
											<text class="tag-in-text">{{ `共${totalInfo.patient_course_info.course_live_num}次直播` }}</text>
										</text>
									</view>
									<view class="body-item-top-right-description">
										{{ totalInfo.course_info.description }}
									</view>
									<view class="body-item-top-right-manage">
										<view>课时: <text class="body-item-top-right-manage-in">{{ `第 ${totalInfo.patient_course_info.learn_num + 1} / ${totalInfo.patient_course_info.course_live_num} 课时` }}</text></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="popup-detail-wrpper-user">
					<view class="popup-detail-wrpper-user-title">
						<image class="popup-detail-wrpper-user-title-img" src="@/static/images/mine/popup-user.png"></image>
						<text class="popup-detail-wrpper-user-title-text">患者信息</text>
					</view>
					<view class="popup-detail-wrpper-user-body">
						<view class="popup-detail-wrpper-user-body-left">
							<image @click="showAvatarView(totalInfo.user_info.avatar)" :src="totalInfo.user_info.avatar ? baseUrl + totalInfo.user_info.avatar : avatarDefault" class="popup-detail-wrpper-user-body-left-img"></image>
						</view>
						<view class="popup-detail-wrpper-user-body-right">
							<view class="popup-detail-wrpper-user-body-right-name">
								<text class="popup-detail-wrpper-user-body-right-name-text">{{ totalInfo.user_info.name ? totalInfo.user_info.name : '森普健康用户' }}</text>
								<image src="@/static/images/mine/male.png" class="popup-detail-wrpper-user-body-right-name-gender" v-if="totalInfo.user_info.gender"></image>
								<image src="@/static/images/mine/female.png" class="popup-detail-wrpper-user-body-right-name-gender" v-else></image>
							</view>
							<view class="popup-detail-wrpper-user-body-right-phone">
								<u-icon name="phone-fill" color="#333" size="28rpx"></u-icon>
								<u-tooltip :text="totalInfo.user_info.phone" overlay></u-tooltip>
							</view>
						</view>
					</view>
				</view>
				<view class="popup-detail-wrpper-user-info">
					<view class="popup-detail-wrpper-user-info-title">
						<image class="popup-detail-wrpper-user-info-title-img" src="@/static/images/mine/popup-record.png"></image>
						<text class="popup-detail-wrpper-user-info-title-text">患者病历档案</text>
					</view>
					<view class="popup-detail-wrpper-user-info-body">
						<view class="popup-detail-wrpper-user-info-body-empty" v-if="!totalInfo.user_info_info.injury_history">暂无信息</view>
						<view class="popup-detail-wrpper-user-info-body-in" v-else>
							<mescroll-uni ref="mescroll" :down="{onScroll:false, use: false}" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
								<view class="body-bottom-item">
									<view class="body-bottom-item-title">
										既往伤病史
									</view>
									<view class="body-bottom-item-content">
										{{ totalInfo.user_info_info.injury_history }}
									</view>
								</view>
													
								<view class="body-bottom-item">
									<view class="body-bottom-item-title">
										近期伤病描述
									</view>
									<view class="body-bottom-item-content">
										{{ totalInfo.user_info_info.injury_recent }}
									</view>
								</view>
													
								<view class="body-bottom-item">
									<view class="body-bottom-item-title">
										出院小结
									</view>
									<view class="body-bottom-item-content">
										{{ totalInfo.user_info_info.discharge_abstract }}
									</view>
								</view>
													
								<view class="body-bottom-item">
									<view class="body-bottom-item-title">
										影像学资料
									</view>
									<view class="body-bottom-item-content">
										<u-album :urls="covers" rowCount="6" multipleSize="100rpx" singleSize="600rpx" maxCount="6">
										</u-album>
									</view>
								</view>
							</mescroll-uni>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import moment from 'moment';
	import {lunar} from "@/utils/lunar";
	import {
		getLecturerTimesListAction,
		deleteLecturerTimeAction
	} from '@/service/service';
	export default {
		data(){
			return {
				checkboxValueCancel: [],
				avatarDefault: require('@/static/images/avatar-default.png'),
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				recentList: [],
				optionsOne: [
					{
						text: '取消预约',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				checkboxListCancel: [
					{
						name: '我已明白相关责任',
						disabled: false
					}
				],
				editId: '',
				totalInfo: {
					book_info: {},
					patient_course_info: {},
					course_info: {},
					user_info: {},
					user_info_info: {}
				},
				start_time: '',
				real_start_time: '',
				real_end_time: '',
				pickDate: '',
				showPopup: false,
				showCancelModal: false,
				showPopupDetail: false,
				covers: []
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			},
			info(){
				return this.$store.state.user.info
			},
			authStatus(){
				return this.$store.state.auth.authStatus
			}
		},
		onLoad(){
			this.$loadingOn()
		},
		onShow(){
			this.$loadingOn()
			this.getData().then(res => {
				this.$loadingOff()
			}).catch(err => {
				this.$loadingOff()
			})
		},
		methods: {
			handleShowDoctorTime(){
				const that = this
				uni.navigateTo({
					url: "/pages_mine/doctor-time",
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('show', {
							
						})
					}
				})
			},
			handleConfirmOkCancel(){
				if (!this.checkboxValueCancel.length) {
					this.$toast('请勾选同意选项');
					return
				}
				this.$loadingOn()
				deleteLecturerTimeAction(this.editId, '讲师自主取消').then(res => {
					this.$toast(res.message || '删除成功')
					this.getData()
					this.handleCancelCancelModal()
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleShowCourseDetail(record, type) {
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
			showAvatarView(url) {
				if(!url) return
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + url],
					indicator: 'none'
				});
			},
			close() {
				uni.navigateBack()
			},
			showView(url) {
				if(!url) return
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + url],
					indicator: 'none'
				});
			},
			checkboxChangeCancel(n) {
				this.checkboxValueCancel = n
			},
			handleShowBookManage(){
				if (!this.userInfo.identity || this.userInfo.authenticate !== 2 || !this.userInfo.if_lecture_auth) {
					this.$toast('您还没有讲师权限哦~')
					return
				}
				this.handleShowDoctorTime()
			},
			handleRefreshDown(mescroll) {
				this.getData().then(res=>{
					mescroll.endSuccess(res.length, false)
				}).catch(err=>{
					mescroll.endErr()
				})
			},
			getData(){
				return new Promise((resolve, reject) => {
					getLecturerTimesListAction({if_booked: 1}).then(res => {
						const data = res.data ? [...res.data] :[]
						data.map(item => {
							item.start_time_show = moment(new Date(item.start_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
							item.end_time_show = moment(new Date(item.end_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
							if (item.course_info){
								item.course_info.url = this.baseUrl + item.course_info.cover
							}
						})
						this.recentList = data ? [...data] :[],
						resolve(data)
					}).catch(err => {
						reject(err)
					})
				})
			},
			onClickItemIn(e, record){
				console.log('eeee', e)
				// e.index
				if (e.content.text === '取消预约'){
					this.totalInfo = {...record}
					this.editId = record.id
					this.start_time = moment(new Date(record.start_time), 'HH:mm').format('HH:mm')
					this.pickDate = moment(new Date(record.start_time), 'YYYY-MM-DD').format('YYYY-MM-DD')
					const now = moment(new Date(`${this.pickDate} 00:00:00`), 'YYYY-MM-DD').format('YYYY-MM-DD')
					this.real_start_time = `${now} ${this.start_time}`
					this.real_end_time = moment(new Date(`${now} ${this.start_time}:00`)).add('hours', 1).format('YYYY-MM-DD HH:mm')
					this.handleShowCancelModal()
				}
			},
			handleShowCancelModal(){
				this.showCancelModal = true
			},
			handleCancelCancelModal(){
				this.showCancelModal = false
				this.handleClosePopup()
			},
			handleShowPopup(){
				this.showPopup = true
			},
			handleClosePopup(){
				this.showPopup = false
				this.start_time = ''
				this.real_start_time = ''
				this.real_end_time = ''
				this.checkboxValueCancel = []
				this.pickDate = ''
				this.editId = ''
				this.totalInfo = {
					book_info: {},
					patient_course_info: {},
					course_info: {},
					user_info: {},
					user_info_info: {}
				}
				this.covers = []
			},
			handleShowPopupDetail(record){
				if(record) {
					this.totalInfo = {...record}
					if (this.totalInfo.patient_course_info){
						this.totalInfo.patient_course_info.validity_time_show = moment(new Date(this.totalInfo.patient_course_info.validity_time), 'YYYY-MM-DD').format('YYYY-MM-DD')
					}
					if (this.totalInfo.course_info){
						const course_type_map = ['运动康复', '神经康复', '产后康复', '术后康复']
						this.totalInfo.course_info.course_type_show = course_type_map[this.totalInfo.course_info.course_type]
						this.totalInfo.course_info.url = this.baseUrl + this.totalInfo.course_info.cover
					}
					if (this.totalInfo.book_info){
						this.totalInfo.book_info.book_start_time_show = moment(new Date(this.totalInfo.book_info.book_start_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
						this.totalInfo.book_info.book_end_time_show = moment(new Date(this.totalInfo.book_info.book_end_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
					}
					if (this.totalInfo.user_info_info.image_data){
						const pathList = this.totalInfo.user_info_info.image_data.split(',')
						this.covers = pathList.map(path => this.baseUrl + path)
					}
					this.start_time = moment(new Date(record.start_time), 'HH:mm').format('HH:mm')
					this.pickDate = moment(new Date(record.start_time), 'YYYY-MM-DD').format('YYYY-MM-DD')
					const now = moment(new Date(`${this.pickDate} 00:00:00`), 'YYYY-MM-DD').format('YYYY-MM-DD')
					this.real_start_time = `${now} ${this.start_time}`
					this.real_end_time = moment(new Date(`${now} ${this.start_time}:00`)).add('hours', 1).format('YYYY-MM-DD HH:mm')
				}
				this.showPopupDetail = true
			},
			handleClosePopupDetail(){
				this.showPopupDetail = false
				this.handleClosePopup()
			},
		}
	}
</script>

<style lang="scss">
	.popup-detail-wrpper{
		width: 100vw;
		box-sizing: border-box;
		padding: 24rpx;
		position: relative;
		
		.popup-detail-wrpper-close{
			position: absolute;
			top: 24rpx;
			right: 24rpx;
			font-size: 14px;
			color: #999;
		}
		
		.popup-detail-wrpper-title{
			width: 100%;
			display: flex;
			align-items: center;
			
			.popup-detail-wrpper-title-img{
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
			}
			
			.ppopup-detail-wrpper-title-text{
				font-size: 13px;
				font-weight: bold;
			}
		}
		
		.popup-detail-wrpper-body{
			width: 100%;
			margin-top: 24rpx;
			
			.popup-detail-wrpper-body-ready{
				display: flex;
				align-items: center;
				width: 100%;
				margin-top: 24rpx;
				
				.popup-detail-wrpper-body-ready-img{
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
				}
				
				.popup-detail-wrpper-body-ready-text{
					font-size: 13px;
					color: #333;
					font-weight: bold;
				}
			}
			
			.popup-detail-wrpper-body-time{
				font-size: 13px;
				margin-top: 24rpx;
			}
		}
		
		.popup-detail-wrpper-user{
			width: 100%;
			margin-top: 24rpx;
			
			.popup-detail-wrpper-user-title{
				width: 100%;
				display: flex;
				align-items: center;
				
				.popup-detail-wrpper-user-title-img{
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
				}
				
				.popup-detail-wrpper-user-title-text{
					font-size: 13px;
					font-weight: bold;
				}
			}
			
			.popup-detail-wrpper-user-body{
				margin-top: 24rpx;
				width: 100%;
				display: flex;
				align-items: center;
				
				.popup-detail-wrpper-user-body-left{
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 24rpx;
					
					.popup-detail-wrpper-user-body-left-img{
						width: 84rpx;
						height: 84rpx;
						border-radius: 50%;
					}
				}
				
				.popup-detail-wrpper-user-body-right{
					
					.popup-detail-wrpper-user-body-right-name{
						display: flex;
						align-items: center;
						
						.popup-detail-wrpper-user-body-right-name-text{
							font-size: 13px;
							padding-right: 24rpx;
						}
						
						.popup-detail-wrpper-user-body-right-name-gender{
							width: 28rpx;
							height: 28rpx;
						}
					}
					
					.popup-detail-wrpper-user-body-right-phone{
						margin-top: 12rpx;
						display: flex;
						align-items: center;
						
						.u-tooltip__wrapper__text{
							font-size: 13px !important;
							color: #333 !important;
							padding-left: 12rpx !important;
						}
					}
				}
			}
		}
		
		.popup-detail-wrpper-user-info{
			width: 100%;
			margin-top: 24rpx;
			
			.popup-detail-wrpper-user-info-title{
				width: 100%;
				display: flex;
				align-items: center;
				
				.popup-detail-wrpper-user-info-title-img{
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
				}
				
				.popup-detail-wrpper-user-info-title-text{
					font-size: 13px;
					font-weight: bold;
				}
			}
			
			.popup-detail-wrpper-user-info-body{
				margin-top: 24rpx;
				width: 100%;
				
				.popup-detail-wrpper-user-info-body-empty{
					font-size: 12px;
					color: #ccc;
				}
				
				.popup-detail-wrpper-user-info-body-in {
					width: 100%;
					height: 400rpx;
								
					.body-bottom-item {
						width: 100%;
						border-top: 1px solid #999;
						box-sizing: border-box;
						padding-top: 12rpx;
						margin-bottom: 12rpx;
								
						.body-bottom-item-title {
							font-size: 12px;
							font-weight: 700;
							color: #999;
							margin-bottom: 12rpx;
						}
								
						.body-bottom-item-content {
							font-size: 12px;
						}
					}
				}
			}
		}
		
		.popup-detail-wrpper-course{
			width: 100%;
			margin-top: 24rpx;
			box-sizing: border-box;
			
			.popup-detail-wrpper-course-title{
				width: 100%;
				display: flex;
				align-items: center;
				
				.popup-detail-wrpper-course-title-img{
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
				}
				
				.popup-detail-wrpper-course-title-text{
					font-size: 13px;
					font-weight: bold;
				}
			}
			
			.popup-detail-wrpper-course-body {
				width: 100%;
				display: flex;
				justify-content: space-between;
				background: #fff;
				box-sizing: border-box;
				position: relative;
				margin-top: 24rpx;
			
				.chart-left-icon-delete {
					margin-top: 24rpx;
					width: 32rpx;
					position: absolute;
					right: 24rpx;
					top: 0;
				}
			
				.chart-left-icon {
					width: 32rpx;
					box-sizing: border-box;
					margin-right: 24rpx;
					flex-shrink: 0;
					margin-top: 12rpx;
			
					.chart-left-icon-select {
						display: flex;
						justify-content: center;
						align-items: center;
						box-sizing: border-box;
						border: 1px solid #B0B3BC;
						height: 32rpx;
						border-radius: 6rpx;
			
						.chart-left-icon-select-in {
							display: none;
						}
			
						&.active {
							border-color: #4F68B0;
							background: #4F68B0;
			
							.chart-left-icon-select-in {
								display: block;
							}
						}
					}
			
				}
			
				.chart-right-content {
					flex-grow: 1;
				}
			
				.body-item-top {
					width: 100%;
					display: flex;
					align-items: center;
			
					.body-item-top-left {
						width: 220rpx;
						height: 160rpx;
						border-radius: 24rpx;
						flex-shrink: 0;
						margin-right: 24rpx;
						overflow: hidden;
			
						.body-item-top-left-img {
							width: 100%;
							height: 100%;
						}
					}
			
					.body-item-top-right {
						flex-grow: 1;
						height: 160rpx;
			
						.body-item-top-right-title {
							width: calc(100% - 32rpx);
							font-size: 12px;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
			
						.body-item-top-right-tag {
							width: 100%;
							margin-top: 6rpx;
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
			
						.body-item-top-right-description {
							font-size: 8px;
							width: 100%;
							margin-top: 6rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							color: #aaa;
						}
			
						.body-item-top-right-manage {
							color: #333;
							font-size: 12px;
							margin-top: 10rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
			
							.body-item-top-right-manage-in {
								padding-left: 6rpx;
							}
							
						}
			
					}
				}
			}
			
		}
	}
	
	.modal-cancel-time{
		width: 100%;
		
		.modal-cancel-time-tip{
			font-size: 14px;
			color: #4F68B0;
			font-weight: bold;
			margin-bottom: 12rpx;
			display: flex;
			align-items: center;
			
			.modal-cancel-time-tip-img{
				width: 32rpx;
				height: 32rpx;
				margin-right: 12rpx;
			}
		}
		
		.modal-cancel-time-times{
			width: 100%;
			font-size: 14px;
			font-weight: bold;
			color: #E06C75;
			margin-bottom: 12rpx;
		}
		
		.modal-cancel-time-in{
			width: 100%;
			font-size: 14px;
			color: #333;
			font-weight: bold;
			
			.modal-cancel-time-in-in{
				color: #E06C75;
			}
		}
		
		.modal-cancel-time-agree-button{
			margin-top: 24rpx;
			box-sizing: border-box;
		}
	}
	
	.doctor-wrapper{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		
		.doctor-wrapper-top{
			width: 100%;
			height: 636rpx;
			position: relative;
			
			.doctor-wrapper-top-info{
				margin-top: 24rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 36rpx;
				position: relative;
				z-index: 6;
				
				.doctor-wrapper-top-info-left{
					position: relative;
					width: 84rpx;
					height: 84rpx;
					
					.doctor-wrapper-top-info-left-img{
						width: 84rpx;
						height: 84rpx;
						border-radius: 50%;
					}
					
					.doctor-wrapper-top-info-left-auth{
						width: 36rpx;
						height: 36rpx;
						position: absolute;
						bottom: 0;
						right: 0;
					}
				}
				
				.doctor-wrapper-top-info-right{
					position: relative;
					width: 64rpx;
					height: 64rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background :#fff;
					border-radius: 50%;
				}
			}
			
			.doctor-wrapper-top-last{
				margin-top: 48rpx;
				width: 100%;
				box-sizing: border-box;
				padding: 0 36rpx;
				position: relative;
				z-index: 6;
				
				.doctor-wrapper-top-last-welcome{
					font-size: 20px;
					font-weight: bold;
					color: #1D1E24;
				}
				
				.doctor-wrapper-top-last-name{
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					
					.doctor-wrapper-top-last-name-in{
						font-size: 20px;
						font-weight: bold;
						color: #1D1E24;
						white-space: nowrap;
					}
					
					.doctor-wrapper-top-last-name-img{
						width: 48rpx;
						height: 48rpx;
						margin-left: 24rpx;
					}
				}
				
				.doctor-wrapper-top-last-organization{
					font-size: 14px;
					color: #8998A7;
					margin-top: 12rpx;
				}
				
				.doctor-wrapper-top-last-button{
					margin-top: 48rpx;
					width: 200rpx;
					height: 60rpx;
					border-radius: 24rpx;
					background: #4F68B0;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					font-weight: bold;
					color: #fff;
				}
			}
			
			.doctor-wrapper-top-one{
				background: radial-gradient(#B9EAFD 0, #F8F8FC 70%);
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
			}
			
			.doctor-wrapper-top-two{
				background-image: linear-gradient(to right, #F5F9FC 0%, #D8F2FD 30%, #D3F1FD 100%);
				width: 600rpx;
				height: 600rpx;
				position: absolute;
				border-radius: 50%;
				top: -250rpx;
				left: 100rpx;
				z-index: 2;
			}
			
			.doctor-wrapper-top-three{
				background: radial-gradient(#BDD8FD 0, #C9EEFC 70%);
				width: 600rpx;
				height: 600rpx;
				position: absolute;
				border-radius: 50%;
				top: -200rpx;
				left: 250rpx;
				z-index: 3;
			}
			
			.doctor-wrapper-top-four{
				background-image: linear-gradient(to right, #F8F8FC 0%, #BDD8FD 100%);
				width: 400rpx;
				height: 400rpx;
				position: absolute;
				border-radius: 50%;
				top: -200rpx;
				left: 100rpx;
				z-index: 4;
			}
			
			.doctor-wrapper-top-five{
				width: 200rpx;
				height: 200rpx;
				position: absolute;
				bottom: 96rpx;
				right: 48rpx;
				z-index: 5;
			}
		}
		
		.doctor-wrapper-bottom{
			width: 100%;
			margin-top: -48rpx;
			height: calc(100vh - 588rpx);
			border-top-left-radius: 48rpx;
			border-top-right-radius: 48rpx;
			background: #fff;
			box-sizing: border-box;
			padding: 48rpx 36rpx 0 36rpx;
			position: relative;
			z-index: 7;
			
			.doctor-wrapper-bottom-service{
				width: 100%;
				
				.doctor-wrapper-bottom-service-title{
					font-size: 14px;
					font-weight: bold;
				}
				
				.doctor-wrapper-bottom-service-body{
					font-size: 14px;
					margin-top: 24rpx;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					box-sizing: border-box;
					flex-wrap: nowrap;
					padding: 0 12rpx;
					
					.doctor-wrapper-bottom-service-body-item{
						display: inline-flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						margin-right: 48rpx;
						
						.doctor-wrapper-bottom-service-body-item-top{
							width: 96rpx;
							height: 96rpx;
							border-radius: 50%;
							box-sizing: border-box;
							border: 2rpx solid #F6F6F7;
							display: flex;
							align-items: center;
							justify-content: center;
							
							.doctor-wrapper-bottom-service-body-item-top-img{
								width: 64rpx;
								height: 54rpx;
							}
						}
						
						.doctor-wrapper-bottom-service-body-item-bottom{
							margin-top: 12rpx;
							font-size: 13px;
							white-space: nowrap;
						}
					}
				}
			}
			
			.doctor-wrapper-bottom-course{
				width: 100%;
				margin-top: 36rpx;
				
				.doctor-wrapper-bottom-course-title{
					font-size: 14px;
					font-weight: bold;
				}
				
				.doctor-wrapper-bottom-course-body{
					width: 100%;
					font-size: 14px;
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					box-sizing: border-box;
					padding: 0 12rpx;
					height: 700rpx;
					
					.doctor-wrapper-bottom-course-body-empty {
						width: 100%;
						margin-top: 24rpx;
						margin-bottom: 24rpx;
					}
					
					.doctor-wrapper-bottom-course-body-empty {
						width: 100%;
						padding: 48rpx 0;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						box-sizing: border-box;
						margin-top: 100rpx;
					
						.doctor-wrapper-bottom-course-body-empty-img {
							width: 160rpx;
							height: 160rpx;
							margin-bottom: 24rpx;
						}
					
						.doctor-wrapper-bottom-course-body-empty-text {
							font-size: 13px;
							color: #DAE1F4;
						}
					}
					
					.doctor-wrapper-bottom-course-body-item{
						width: 100%;
						box-sizing: border-box;
						padding: 24rpx;
						position: relative;
						
						.cell-item-border{
							position: absolute;
							left: 12rpx;
							top: 24rpx;
							height: 80rpx;
							width: 6rpx;
							background: #4F68B0;
							
							&.active{
								background: #61C63D;
							}
						}
						
						.cell-item-top{
							width: 100%;
							box-sizing: border-box;
							padding-left: 24rpx;
							
							.cell-item-top-one{
								width: 100%;
								color: #9D9D9F;
								font-size: 12px;
							}
							
							.cell-item-top-two{
								width: 100%;
								display: flex;
								align-items: center;
								margin-top: 12rpx;
								
								.cell-item-top-two-text{
									color: #333;
									font-size: 13px;
									font-weight: bold;
									padding-left: 8rpx;
								}
							}
						}
						
						.cell-item-bottom{
							width: 100%;
							margin-top: 16rpx;
							padding-top: 16rpx;
							box-sizing: border-box;
							padding-left: 24rpx;
							border-top: 2rpx dashed #999;
							display: flex;
							align-items: center;
							
							.cell-item-bottom-total-left{
								flex-grow: 1;
								display: flex;
								align-items: flex-start;
							}
							
							.cell-item-bottom-total-right{
								width: 36rpx;
								height: 36rpx;
								margin-left: 24rpx;
								flex-shrink: 0;
								
								.cell-item-bottom-total-right-img{
									width: 36rpx;
									height: 36rpx;
								}
							}
							
							.cell-item-bottom-left{
								display: flex;
								align-items: center;
								justify-content: center;
								margin-right: 24rpx;
								
								.cell-item-bottom-left-img{
									width: 96rpx;
									height: 64rpx;
									border-radius: 16rpx;
								}
							}
							
							.cell-item-bottom-right{
								width: calc(100% - 120rpx);
								
								.cell-item-bottom-right-title{
									width: 100%;
									color: #333;
									font-size: 12px;
									font-weight: bold;
								}
								
								.cell-item-bottom-right-num{
									width: 100%;
									color: #333;
									margin-top: 6rpx;
									font-size: 11px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>