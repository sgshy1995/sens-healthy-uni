<template>
	<view class="calendar-wrapper">
		<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0" leftIconColor="#fff" :titleStyle="{color: '#fff'}" title="预约时间管理" @leftClick="close" leftText="返回">
		</u-navbar>
		<view class="calendar-body">
			<view class="calendar-tip" v-if="upOrDown === 'down'">
				选择日期以查看记录, 点击 "+" 添加新的预约时间; 最多可预约2个周内的时间.
			</view>
			<view class="calendar-in" v-show="upOrDown === 'down'">
				<uni-calendar 
					:selected="selected"
					:insert="true"
					:lunar="true"
					@change="clickDate"
					:end-date="timeToday"
					 />
				<image class="calendar-in-icon" @click="handleShowPopup" src="@/static/images/mine/add.png"></u-icon>
			</view>
			<u-divider text="预约时间记录" textSize="12"></u-divider>
			<view class="history-list">
				<view class="history-title">
					<view class="history-title-in"><text>{{ pickDate }}</text><text>{{ ` 总数: ${showList.length} ` }}</text><text :class="{ready: !!showList.find(item => item.if_booked)}">{{ ` 已预约: ${showList.filter(item => item.if_booked).length} ` }}</text></view>
					<view class="history-title-up-down" v-if="upOrDown === 'down'" @click="handleChangeUpOrDown('up')">
						<image class="history-title-up-down-img" src="@/static/images/mine/time-up.png"></image>
						<text class="history-title-up-down-text">收起</text>
					</view>
					<view class="history-title-up-down" v-else @click="handleChangeUpOrDown('down')">
						<image class="history-title-up-down-img" src="@/static/images/mine/time-down.png"></image>
						<text class="history-title-up-down-text">展开</text>
					</view>
				</view>
				<view class="in-body" :class="{long: upOrDown === 'up'}">
					<mescroll-uni ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
						<view class="cell-group" v-if="showList.length">
							<uni-swipe-action>
								<!-- 基础用法 -->
								<uni-swipe-action-item @click="(e) => onClickItemIn(e, u)" :right-options="u.if_booked ? optionsOne : options" v-for="(u, index) in showList" :key="u.id">
									<view class="cell-item">
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
													<view class="cell-item-bottom-right-description">{{ u.course_info.description }}</view>
													<view class="cell-item-bottom-right-num">{{ `第${u.patient_course_info.learn_num + 1}次 / 共${u.patient_course_info.course_live_num}次` }}</view>
												</view>
											</view>
											<view class="cell-item-bottom-total-right">
												<image class="cell-item-bottom-total-right-img" src="@/static/images/mine/time-view.png"></image>
											</view>
										</view>
									</view>
								</uni-swipe-action-item>
							</uni-swipe-action>
						</view>
						<u-empty text="当天没有预约时间,快去添加吧!" v-if="!showList.length" :show="!showList.length" mode="history" icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
						<u-safe-bottom></u-safe-bottom>
					</mescroll-uni>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
		<u-modal :show="showModal" showCancelButton @cancel="showModal = false;pickId = 0" @confirm="deleteHistoryData" confirmColor="#4F68B0"
			content="确定删除该记录吗？"></u-modal>
		<u-popup :overlayStyle="{zIndex: 9999}" zIndex="10000" :show="showPopup" :closeOnClickOverlay="false" @close="handleClosePopup" @open="handleShowPopup">
			<view class="popup-wrpper">
				<text class="popup-wrpper-close" @click="handleClosePopup">取消</text>
				<view class="popup-wrpper-title">
					<image src="@/static/images/mine/popup.png" class="popup-wrpper-title-img"></image>
					<text class="popup-wrpper-title-text">{{ editId ? '修改预约时间' : '新增预约时间' }}</text>
				</view>
				<view class="popup-wrpper-body">
					<view class="popup-wrpper-body-top">
						<image class="popup-wrpper-body-top-img" src="@/static/images/mine/popup-date.png"></image>
						<text class="popup-wrpper-body-top-text">预约日期: <text class="popup-wrpper-body-top-text-in">{{ pickDate }}</text></text>
					</view>
					<view class="popup-wrpper-body-bottom" @click="handleShowTimePick">
						<image class="popup-wrpper-body-bottom-img" src="@/static/images/mine/popup-time.png"></image>
						<text class="popup-wrpper-body-bottom-text">预约开始时间: 
							<text class="popup-wrpper-body-bottom-text-in" v-if="start_time">{{ start_time }}</text>
							<text class="popup-wrpper-body-bottom-text-empty" v-else>请选择 ></text>
						</text>
					</view>
					<view class="popup-wrpper-body-ready" v-if="start_time" @click="handleShowTimePick">
						<image class="popup-wrpper-body-ready-img" src="@/static/images/mine/popup-range.png"></image>
						<text class="popup-wrpper-body-ready-text">预约时间范围: 
							<text class="popup-wrpper-body-ready-text-in">{{ `${real_start_time} ~ ${real_end_time}` }}</text>
						</text>
					</view>
				</view>
				<view class="popup-wrpper-footer">
					<view class="popup-wrpper-footer-in" @click="handleConfirmAdd" v-if="!editId">新增预约时间</view>
					<view class="popup-wrpper-footer-in" @click="handleConfirmEdit" v-else>修改预约时间</view>
				</view>
				<view class="popup-wrpper-tip">
					<uni-card :is-shadow="false" is-full>
						<view class="agree-title">
							面对面康复课程预约时间说明
						</view>
						<view class="agree-h6"><text class="agree-h6-point">·</text>面对面康复课程预约时间说明是森普健康提供的一项服务，针对拥有授课权限的医师，可以管理自己的授课时间。</view>
						<view class="agree-h6"><text class="agree-h6-point">·</text>用户（患者）在购买面对面康复系列课程后，可以选择已经开放的预约时间进行预约。</view>
						<view class="agree-h6"><text class="agree-h6-point">·</text>每次预约时间为1小时，每两次预约时间间隔需不小于30分钟（上一次的结束时间到下一次的开始时间）。</view>
						<view class="agree-h6"><text class="agree-h6-point">·</text>医师在创建预约时间后，在没有被成功预约的情况下，可以随时取消和修改预约时间。</view>
						<view class="agree-h6"><text class="agree-h6-point">·</text>医师在创建预约时间后，在成功预约的情况下，每个预约时间可以有一次的无责取消机会。之后的每次取消，平台将免费赠送用户（患者）一课时课程，此损失将由相应医师承担。</view>
						<view class="agree-button">
							<u-checkbox-group v-model="checkboxValue" placement="column" activeColor="#4F68B0" @change="checkboxChange">
								<u-checkbox :customStyle="{marginBottom: '8px', fontWeight: 'bold'}" v-for="(item, index) in checkboxList"
									:key="index" :label="item.name" :name="item.name">
								</u-checkbox>
							</u-checkbox-group>
						</view>
					</uni-card>
				</view>
			</view>
		</u-popup>
		<u-datetime-picker confirmColor="#4F68B0" title="请选择开始时间" @cancel="handleCancelTimePick" @close="handleCancelTimePick" @confirm="handleConfirmTimePick" :show="showTimePick" v-model="start_time" mode="time" ></u-datetime-picker>
		<u-modal :show="showDeleteModal" showCancelButton confirmColor="#4F68B0" @confirm="handleConfirmOkDelete" @cancel="handleCancelDeleteModal">
			<view class="slot-content modal-delete-time">
				<view class="modal-delete-time-tip">
					<image class="modal-delete-time-tip-img" src="@/static/images/mine/popup-range.png"></image>
					<text class="modal-delete-time-tip-text">{{ `${real_start_time} ~ ${real_end_time}` }}</text>
				</view>
				<view class="modal-delete-time-in">该时间段还未被预约，确定删除吗？</view>
			</view>
		</u-modal>
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
		getDatePersonalChargeAction,
		deletePersonalChargeAction,
		getDateTeamChargeAction,
		deleteTeamChargeAction,
		getLecturerTimesListAction,
		createLecturerTimeAction,
		updateLecturerTimeAction,
		deleteLecturerTimeAction
	} from '@/service/service';
	export default {
		data() {
			return {
				showPopupDetail: false,
				upOrDown: 'down',
				showDeleteModal: false,
				showCancelModal: false,
				checkboxValue: [],
				checkboxValueCancel: [],
				// 基本案列数据
				checkboxList: [
					{
						name: '已阅读并同意以上说明',
						disabled: false
					}
				],
				checkboxListCancel: [
					{
						name: '我已明白相关责任',
						disabled: false
					}
				],
				options: [
					{
						text: '修改',
						style: {
							backgroundColor: '#007aff'
						}
					}, 
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				optionsOne: [
					{
						text: '取消预约',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				start_time: '',
				real_start_time: '',
				real_end_time: '',
				moment: moment,
				customStyleIn: {
					width: '100vw'
				},
				selected: [],
				showPopup: false,
				visible: true,
				showModal: false,
				themeColor: {
					'main-color': '#4F68B0'
				},
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				avatarDefault: require('@/static/images/avatar-default.png'),
				timeToday: moment(new Date(), 'YYYY-MM-DD').add(2, 'weeks').format('YYYY-MM-DD'),
				pickDate: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				showType: 'spend',
				chooseInfo: {
					id: 0,
					name: '',
					src: '',
					money: 0
				},
				totalInfo: {
					book_info: {},
					patient_course_info: {},
					course_info: {},
					user_info: {},
					user_info_info: {}
				},
				// id date type money remark
				historyList: [],
				historyListAll: [],
				todayMoney: 0,
				pickId: 0,
				switchType: 'personal',
				renderKey: true,
				dataSource: [],
				showList: [],
				showTimePick: false,
				editId: '',
				covers: []
			}
		},
		onLoad(){
			const that = this
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('show', function(data) {
			    console.log(data)
				if(data.showType) that.showType = data.showType
				if(data.switchType) that.switchType = data.switchType
				if(data.record) {
					that.chooseInfo = {
						...data.record
					}
				}
			})
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
		onShow(){
			this.getData()
		},
		watch: {
			chooseInfo: {
				handler(){
					if(this.chooseInfo.id){
						
					}
				},
				deep: true
			},
			dataSource:{
				handler(){
					this.selected = []
					this.dataSource.map(item => {
						const itemTime = moment(new Date(item.start_time), 'YYYY-MM-DD').format('YYYY-MM-DD')
						if(this.selected.find(itemIn=>itemIn.date === itemTime)){
							this.selected[this.selected.findIndex(itemIn=>itemIn.date === itemTime)].info += 1
							this.selected[this.selected.findIndex(itemIn=>itemIn.date === itemTime)].data.push(item)
							if (item.if_booked) {
								this.selected[this.selected.findIndex(itemIn=>itemIn.date === itemTime)].success = true
							}
						}else{
							this.selected.push({
								date: itemTime,
								success: item.if_booked ? true : false,
								info: 1,
								data: [item]
							})
						}
					})
					this.showList = this.selected.find(item => item.date === this.pickDate) ? [...this.selected.find(item => item.date === this.pickDate).data] : []
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			handleChangeUpOrDown(type){
				this.upOrDown = type
			},
			onClickItemIn(e, record){
				console.log('eeee', e)
				// e.index
				if (e.content.text === '修改'){
					this.editId = record.id
					this.start_time = moment(new Date(record.start_time), 'HH:mm').format('HH:mm')
					const now = moment(new Date(`${this.pickDate} 00:00:00`), 'YYYY-MM-DD').format('YYYY-MM-DD')
					this.real_start_time = `${now} ${this.start_time}`
					this.real_end_time = moment(new Date(`${now} ${this.start_time}:00`)).add('hours', 1).format('YYYY-MM-DD HH:mm')
					this.handleShowPopup()
				}else if (e.content.text === '删除'){
					this.editId = record.id
					this.start_time = moment(new Date(record.start_time), 'HH:mm').format('HH:mm')
					const now = moment(new Date(`${this.pickDate} 00:00:00`), 'YYYY-MM-DD').format('YYYY-MM-DD')
					this.real_start_time = `${now} ${this.start_time}`
					this.real_end_time = moment(new Date(`${now} ${this.start_time}:00`)).add('hours', 1).format('YYYY-MM-DD HH:mm')
					this.handleShowDeleteModal()
				}else if (e.content.text === '取消预约'){
					this.totalInfo = {...record}
					this.editId = record.id
					this.start_time = moment(new Date(record.start_time), 'HH:mm').format('HH:mm')
					const now = moment(new Date(`${this.pickDate} 00:00:00`), 'YYYY-MM-DD').format('YYYY-MM-DD')
					this.real_start_time = `${now} ${this.start_time}`
					this.real_end_time = moment(new Date(`${now} ${this.start_time}:00`)).add('hours', 1).format('YYYY-MM-DD HH:mm')
					this.handleShowCancelModal()
				}
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
			handleShowDeleteModal(){
				this.showDeleteModal = true
			},
			handleCancelDeleteModal(){
				this.showDeleteModal = false
				this.handleClosePopup()
			},
			handleShowCancelModal(){
				this.showCancelModal = true
			},
			handleCancelCancelModal(){
				this.showCancelModal = false
				this.handleClosePopup()
			},
			checkboxChange(n) {
				this.checkboxValue = n
			},
			checkboxChangeCancel(n) {
				this.checkboxValueCancel = n
			},
			handleRefreshDown(mescroll) {
				this.getData().then(res=>{
					mescroll.endSuccess(1, false)
				}).catch(err=>{
					mescroll.endErr()
				})
			},
			getData(){
				return new Promise((resolve, reject) => {
					getLecturerTimesListAction().then(res => {
						const data = res.data ? [...res.data] :[]
						data.map(item => {
							item.start_time_show = moment(new Date(item.start_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
							item.end_time_show = moment(new Date(item.end_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
							if (item.course_info){
								item.course_info.url = this.baseUrl + item.course_info.cover
							}
						})
						this.dataSource = data ? [...data] :[],
						resolve(data)
					}).catch(err => {
						reject(err)
					})
				})
			},
			handleShowPopup(){
				this.showPopup = true
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
			handleClosePopup(){
				this.showPopup = false
				this.start_time = ''
				this.real_start_time = ''
				this.real_end_time = ''
				this.checkboxValue = []
				this.checkboxValueCancel = []
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
			handleShowTimePick(){
				this.showTimePick = true
			},
			handleCancelTimePick(){
				this.showTimePick = false
			},
			handleConfirmTimePick(e){
				this.start_time = e.value
				const now = moment(new Date(`${this.pickDate} 00:00:00`), 'YYYY-MM-DD').format('YYYY-MM-DD')
				this.real_start_time = `${now} ${e.value}`
				this.real_end_time = moment(new Date(`${now} ${e.value}:00`)).add('hours', 1).format('YYYY-MM-DD HH:mm')
				this.handleCancelTimePick()
			},
			handleConfirmAdd(){
				if(!this.start_time){
					this.$toast('请选择预约开始时间')
					return
				}
				if (!this.checkboxValue.length) {
					this.$toast('请勾选同意预约时间说明');
					return
				}
				this.$loadingOn()
				createLecturerTimeAction({
					start_time: this.real_start_time + ':00',
					end_time: this.real_end_time + ':00'
				}).then(res => {
					this.$toast(res.message || '创建成功')
					this.getData()
					this.handleClosePopup()
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleConfirmEdit(){
				if(!this.start_time){
					this.$toast('请选择预约开始时间')
					return
				}
				if (!this.checkboxValue.length) {
					this.$toast('请勾选同意预约时间说明');
					return
				}
				this.$loadingOn()
				updateLecturerTimeAction({
					id: this.editId,
					start_time: this.real_start_time + ':00',
					end_time: this.real_end_time + ':00'
				}).then(res => {
					this.$toast(res.message || '更新成功')
					this.getData()
					this.handleClosePopup()
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleConfirmOkDelete(){
				this.$loadingOn()
				deleteLecturerTimeAction(this.editId).then(res => {
					this.$toast(res.message || '删除成功')
					this.getData()
					this.handleCancelDeleteModal()
					this.$loadingOff()
				}).catch(err => {
					this.$loadingOff()
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
			deleteHistoryData(){
				if(!this.pickId) {
					this.$toast('请选择记录');
					return
				}
				this.switchType === 'personal' ?
					deletePersonalChargeAction(this.pickId).then(res=>{
						this.$toast(res.message || '删除成功');
						this.handleOk();
						this.$store.dispatch('changeMoneyCount')
						this.showModal = false
					}) : deleteTeamChargeAction(this.pickId).then(res=>{
						this.$toast(res.message || '删除成功');
						this.handleOk();
						this.$store.dispatch('changeMoneyCount')
						this.showModal = false
					})
			},
			handleOk(){
				this.$emit('ok')
				this.$store.dispatch('changeMoneyCount')
				this.getHistoryData({charge_time: this.pickDate + ' 00:00:00', charge_type: this.chooseInfo.id});
				this.getHistoryDataAll({charge_type: this.chooseInfo.id});
				this.renderKey = false
				this.$nextTick(()=>{
					this.renderKey = true
				})
			},
			handleDelete(id){
				console.log('handleDelete', id)
				this.pickId = id
				this.showModal = true
			},
			handleEdit(id, charge_num, remark){
				this.$refs.Calculator.editInfo.id = id;
				this.$refs.Calculator.editInfo.charge_num = charge_num;
				this.$refs.Calculator.editInfo.remark = remark;
				this.$refs.Calculator.show(true);
				this.$refs.Calculator.pickDate = this.pickDate;
			},
			close() {
				uni.navigateBack()
			},
			show(record) {
				this.showPopup = true
			},
			clickDate(e) {
				this.pickDate = e.fulldate;
				this.showList = this.selected.find(item => item.date === this.pickDate) ? [...this.selected.find(item => item.date === this.pickDate).data] : []
			},
			showCalculator(){
				this.$refs.Calculator.show();
				this.$refs.Calculator.pickDate = this.pickDate;
			},
			disabledDate(date) {
				let timestamp = date.getTime();
				if (timestamp > new Date().getTime()) {
					return true
				}
				return false
			},
			showLunar(date) {
				if (!date) return;

				const lunarObj = lunar.solar2lunar(date.year, date.month, date.day);

				return lunarObj.festival || lunarObj.lunarFestival || lunarObj.IDayCn;
			}
		}
	}
</script>

<style lang="scss">
	
	.modal-delete-time{
		width: 100%;
		
		.modal-delete-time-tip{
			font-size: 14px;
			color: #4F68B0;
			font-weight: bold;
			margin-bottom: 12rpx;
			display: flex;
			align-items: center;
			
			.modal-delete-time-tip-img{
				width: 32rpx;
				height: 32rpx;
				margin-right: 12rpx;
			}
		}
		
		.modal-delete-time-in{
			width: 100%;
			font-size: 14px;
			color: #333;
			display: flex;
			align-items: center;
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
	
	.popup-wrpper{
		width: 100vw;
		box-sizing: border-box;
		padding: 24rpx;
		position: relative;
		
		.popup-wrpper-close{
			position: absolute;
			top: 24rpx;
			right: 24rpx;
			font-size: 14px;
			color: #999;
		}
		
		.popup-wrpper-title{
			width: 100%;
			display: flex;
			align-items: center;
			
			.popup-wrpper-title-img{
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
			}
			
			.popup-wrpper-title-text{
				font-size: 14px;
				font-weight: bold;
			}
		}
		
		.popup-wrpper-body{
			width: 100%;
			margin-top: 24rpx;
			
			.popup-wrpper-body-top{
				display: flex;
				align-items: center;
				width: 100%;
				
				.popup-wrpper-body-top-img{
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
				}
				
				.popup-wrpper-body-top-text{
					font-size: 13px;
					color: #333;
					
					.popup-wrpper-body-top-text-in{
						padding-left: 6rpx;
					}
				}
			}
			
			.popup-wrpper-body-bottom{
				display: flex;
				align-items: center;
				width: 100%;
				margin-top: 24rpx;
				
				.popup-wrpper-body-bottom-img{
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
				}
				
				.popup-wrpper-body-bottom-text{
					font-size: 13px;
					color: #333;
					
					.popup-wrpper-body-bottom-text-in{
						padding-left: 6rpx;
					}
					
					.popup-wrpper-body-bottom-text-empty{
						padding-left: 6rpx;
						color: #999;
					}
				}
			}
			
			.popup-wrpper-body-ready{
				display: flex;
				align-items: center;
				width: 100%;
				margin-top: 24rpx;
				
				.popup-wrpper-body-ready-img{
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
				}
				
				.popup-wrpper-body-ready-text{
					font-size: 13px;
					color: #333;
					
					.popup-wrpper-body-ready-text-in{
						padding-left: 6rpx;
					}
					
				}
			}
		}
		
		.popup-wrpper-footer{
			width: 100%;
			margin-top: 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.popup-wrpper-footer-in{
				padding: 6rpx 16rpx;
				border-radius: 16rpx;
				box-sizing: border-box;
				background: #4F68B0;
				color: #fff;
				font-size: 14px;
				font-weight: bold;
			}
		}
		
		.popup-wrpper-tip{
			width: 100%;
			margin-top: 32rpx;
			box-sizing: border-box;
			
			.agree-title{
				font-size: 14px;
				font-weight: bold;
			}
			
			.agree-h6{
				font-size: 14px;
				box-sizing: border-box;
				margin-top: 24rpx;
				
				.agree-h6-point{
					padding-right: 6rpx;
					font-weight: bold;
				}
			}
			
			.agree-button{
				margin-top: 24rpx;
				box-sizing: border-box;
				padding-bottom: 12rpx;
			}
		}
	}
	
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
	
	.calendar-wrapper{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
	
	.calendar-body{
		width: 100%;
		height: calc(100vh - 200rpx);
		display: flex;
		flex-direction: column;
	}
	
	.calendar-tip{
		padding: 20rpx;
		font-size: 12px;
		color: #909399;
		background: #f4f4f4;
	}

	.calendar-in{
		position: relative;
		z-index: 1;
		width: 100%;
		margin-bottom: 60rpx;
		background: #2C405A;
		
		.calendar-in-icon{
			width: 60rpx;
			height: 60rpx;
			box-sizing: border-box !important;
			position: absolute !important;
			z-index: 2 !important;
			bottom: 0 !important;
			left: 50% !important;
			transform: translate(-50%,125%) !important;
			background: #fff !important;
		}
	}
	
	.lunar-content {
		display: flex;
		align-items: center;
		flex-direction: column;

		.lunar {
			font-size: 12px;
			transform: scale(0.6);
			width: 10vw;
			text-align: center;
		}
	}
	
	.safe-bottom{
		height: 80rpx;
		width: 100%;
		flex-shrink: 0;
		background: #F7F7F7;
		position: relative;
		z-index: 1;
	}

	.history-list {
		width: 100%;
		box-sizing: border-box;
		padding: 10rpx 30rpx;
		
		/*  #ifndef  H5  */ 
		height: 480rpx;
		/*  #endif  */
		
		/*  #ifdef  H5  */
		height: 600rpx;
		/*  #endif  */
		
		
		.in-body{
			width: 100%;
			height: 400rpx;
			box-sizing: border-box;
			
			&.long{
				height: 1200rpx;
			}
		}
		
		.cell-group{
			width: 100%;
			
			.cell-item{
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
						height: 170rpx;
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
							width: 108rpx;
							height: 64rpx;
							border-radius: 16rpx;
						}
					}
					
					.cell-item-bottom-right{
						width: calc(100% - 108rpx);
						
						.cell-item-bottom-right-title{
							width: 100%;
							color: #333;
							font-size: 14px;
							font-weight: bold;
						}
						
						.cell-item-bottom-right-description{
							width: 100%;
							color: #979FA6;
							margin-top: 12rpx;
							font-size: 10px;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						
						.cell-item-bottom-right-num{
							width: 100%;
							color: #333;
							margin-top: 12rpx;
							font-size: 13px;
						}
					}
				}
			}
		}
		
		
		.history-title{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0 20rpx 40rpx 20rpx;
			
			.history-title-in{
				font-size: 12px;
				color: #909399;
				
				.ready{
					color: #61C63D;
				}
			}
			
			.history-title-up-down{
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 4rpx 10rpx;
				border-radius: 12rpx;
				background: #4F68B0;
				
				.history-title-up-down-img{
					width: 32rpx;
					height: 32rpx;
					margin-right: 12rpx;
				}
				
				.history-title-up-down-text{
					font-size: 14px;
					color: #fff;
				}
			}
		}
		
		.history-list-left{
			.one {
				font-size: 12px;
				padding-right: 10rpx;
			}
		}
		.history-list-right{
			display: flex;
			align-items: center;
		}
	}
</style>
