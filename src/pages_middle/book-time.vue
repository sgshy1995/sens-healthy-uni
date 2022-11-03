<template>
	<view class="calendar-wrapper">
		<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0" leftIconColor="#fff" :titleStyle="{color: '#fff'}" :title="(chooseInfo.book_info && chooseInfo.book_info.id) ? '修改预约时间' : '预约时间'" @leftClick="close" leftText="返回">
		</u-navbar>
		<view class="calendar-body">
			<view class="calendar-tip">
				<view>选择课程<text class="calendar-tip-course">{{ chooseInfo.course_info.title }}</text>. 最多可预约2个周内的时间.</view>
				<view v-if="chooseInfo.book_info && chooseInfo.book_info.id" class="calendar-tip-in">注意: 您仅有一次无责修改预约时间机会.</view>
			</view>
			<view class="calendar-in" v-show="upOrDown === 'down'">
				<uni-calendar 
					:selected="selected"
					:insert="true"
					:lunar="true"
					@change="clickDate"
					:end-date="timeToday"
					 />
			</view>
			<u-divider text="开放时间" textSize="12"></u-divider>
			<view class="history-list">
				<view class="history-title">
					<view class="history-title-in"><text>{{ pickDate }}</text><text>{{ ` 当天可预约时间段总数: ${showList.length} ` }}</text></view>
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
								<uni-swipe-action-item disabled v-for="(u, index) in showList" :key="u.id">
									<view class="cell-item" @click="(e) => handleClickItem(e, u)">
										<view class="cell-item-border"></view>
										<view class="cell-item-top">
											<view class="cell-item-top-one">已开放预约时间</view>
											<view class="cell-item-top-two">
												<u-icon name="clock" color="#333" size="32rpx"></u-icon>
												<text class="cell-item-top-two-text">{{ `${u.start_time_show} ~ ${u.end_time_show}` }}</text>
											</view>
										</view>
										<view class="cell-item-bottom" v-if="u.if_booked">
											<view class="cell-item-bottom-left">
												<image :src="baseUrl + u.course_info.url" class="cell-item-bottom-left-img"></image>
											</view>
											<view class="cell-item-bottom-right">
												<view class="cell-item-bottom-right-title">{{ u.course_info.title }}</view>
												<view class="cell-item-bottom-right-description">{{ u.course_info.description }}</view>
												<view class="cell-item-bottom-right-num">{{ `1/${u.course_info.live_num}` }}</view>
											</view>
										</view>
									</view>
								</uni-swipe-action-item>
							</uni-swipe-action>
						</view>
						<u-empty text="当天没有预约时间" v-if="!showList.length" :show="!showList.length" mode="history" icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
						<u-safe-bottom></u-safe-bottom>
					</mescroll-uni>
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
		<u-popup :overlayStyle="{zIndex: 9999}" zIndex="10000" :show="showPopup" :closeOnClickOverlay="false" @close="handleClosePopup" @open="handleShowPopup">
			<view class="popup-wrpper">
				<text class="popup-wrpper-close" @click="handleClosePopup">取消</text>
				<view class="popup-wrpper-title">
					<image src="@/static/images/mine/popup.png" class="popup-wrpper-title-img"></image>
					<text class="popup-wrpper-title-text">{{ (chooseInfo.book_info && chooseInfo.book_info.id) ? '修改预约时间' : '为课程预约时间' }}</text>
				</view>
				<view class="popup-wrpper-course">
					{{ chooseInfo.course_info.title }}
				</view>
				<view class="popup-wrpper-before" v-if="chooseInfo.book_info && chooseInfo.book_info.id">
					<view class="popup-wrpper-before-title">之前预约时间</view>
					<view class="popup-wrpper-before-time">{{ `${chooseInfo.book_info.book_start_time_show} ~ ${chooseInfo.book_info.book_end_time_show}` }}</view>
				</view>
				<view class="popup-wrpper-body">
					<view class="popup-wrpper-body-top">
						<image class="popup-wrpper-body-top-img" src="@/static/images/mine/popup-date.png"></image>
						<text class="popup-wrpper-body-top-text">预约日期: <text class="popup-wrpper-body-top-text-in">{{ pickDate }}</text></text>
					</view>
					<view class="popup-wrpper-body-bottom">
						<image class="popup-wrpper-body-bottom-img" src="@/static/images/mine/popup-time.png"></image>
						<text class="popup-wrpper-body-bottom-text">预约开始时间: 
							<text class="popup-wrpper-body-bottom-text-in" v-if="start_time">{{ start_time }}</text>
							<text class="popup-wrpper-body-bottom-text-empty" v-else>请选择 ></text>
						</text>
					</view>
					<view class="popup-wrpper-body-ready">
						<image class="popup-wrpper-body-ready-img" src="@/static/images/mine/popup-range.png"></image>
						<text class="popup-wrpper-body-ready-text">直播时间: 
							<text class="popup-wrpper-body-ready-text-in">{{ `${real_start_time} ~ ${real_end_time}` }}</text>
						</text>
					</view>
				</view>
				<view class="popup-wrpper-footer">
					<view class="popup-wrpper-footer-in" @click="handleConfirmEdit" v-if="chooseInfo.book_info && chooseInfo.book_info.id">确认修改预约</view>
					<view class="popup-wrpper-footer-in" @click="handleConfirmAdd" v-else>确认预约</view>
				</view>
				<view class="popup-wrpper-tip">
					<mescroll-uni ref="mescroll" :down="{onScroll:false, use: false}" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
						<uni-card :is-shadow="false" is-full>
							<view class="agree-title">
								面对面康复课程预约时间说明
							</view>
							<view class="agree-h6"><text class="agree-h6-point">·</text>面对面康复课程预约时间说明是森普健康提供的一项服务，针对已购买面对面康复系列课程的用户，可以预约管理自己的上课时间。</view>
							<view class="agree-h6"><text class="agree-h6-point">·</text>用户在购买面对面康复系列课程后，可以选择专业认证医师已经开放的预约时间进行预约。</view>
							<view class="agree-h6"><text class="agree-h6-point">·</text>每次预约时间为1小时，每两次预约时间间隔需不小于30分钟（上一次的结束时间到下一次的开始时间）。</view>
							<view class="agree-h6"><text class="agree-h6-point">·</text>用户在成功预约时间后，每个课程有一次的无责取消机会，每次预约时间有一次无责修改机会。</view>
							<view class="agree-h6"><text class="agree-h6-point">·</text>用户在成功预约时间后，如果因用户本人原因无法准时参加直播授课，产生的时长损失由用户本人承担；若因用户本人原因错过课程直播时间，则自动扣除用户的一个直播课时。</view>
							<view class="agree-button">
								<u-checkbox-group v-model="checkboxValue" placement="column" activeColor="#4F68B0" @change="checkboxChange">
									<u-checkbox :customStyle="{marginBottom: '8px', fontWeight: 'bold'}" v-for="(item, index) in checkboxList"
										:key="index" :label="item.name" :name="item.name">
									</u-checkbox>
								</u-checkbox-group>
							</view>
						</uni-card>
					</mescroll-uni>
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
		getLecturerTimesCanBeBookedListAction,
		createBookAction,
		updateBookAction,
		updateLecturerTimeAction,
		deleteLecturerTimeAction
	} from '@/service/service';
	export default {
		data() {
			return {
				upOrDown: 'down',
				showDeleteModal: false,
				checkboxValue: [],
				// 基本案列数据
				checkboxList: [
					{
						name: '已阅读并同意以上说明',
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
				timeToday: moment(new Date(), 'YYYY-MM-DD').add(2, 'weeks').format('YYYY-MM-DD'),
				pickDate: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				showType: 'spend',
				chooseInfo: {
					course_info: {},
					book_info: {}
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
				editId: ''
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
						}else{
							this.selected.push({
								date: itemTime,
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
			handleClickItem(e, record){
				console.log('record', record)
				const now = moment(new Date(`${this.pickDate} 00:00:00`), 'YYYY-MM-DD').format('YYYY-MM-DD')
				this.editId = record.id
				this.start_time = moment(new Date(record.start_time), 'HH:mm').format('HH:mm')
				this.real_start_time = `${now} ${this.start_time}`
				this.real_end_time = moment(new Date(`${now} ${this.start_time}:00`)).add('hours', 1).format('YYYY-MM-DD HH:mm')
				this.handleShowPopup()
			},
			handleShowDeleteModal(){
				this.showDeleteModal = true
			},
			handleCancelDeleteModal(){
				this.showDeleteModal = false
				this.handleClosePopup()
			},
			checkboxChange(n) {
			    console.log('change', n);
				console.log('checkboxValue', this.checkboxValue)
				this.checkboxValue = n
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
					getLecturerTimesCanBeBookedListAction().then(res => {
						const data = res.data ? [...res.data] :[]
						data.map(item => {
							item.start_time_show = moment(new Date(item.start_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
							item.end_time_show = moment(new Date(item.end_time), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
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
			handleClosePopup(){
				this.showPopup = false
				this.start_time = ''
				this.real_start_time = ''
				this.real_end_time = ''
				this.checkboxValue = []
				this.editId = ''
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
				if (!this.checkboxValue.length) {
					this.$toast('请勾选同意预约时间说明');
					return
				}
				this.$loadingOn()
				createBookAction({
					lecturer_time_id: this.editId,
					patient_course_id: this.chooseInfo.id
				}).then(res => {
					this.$toast(res.message || '预约成功')
					this.getData()
					this.handleClosePopup()
					this.$loadingOff()
					this.close()
				}).catch(err => {
					this.$loadingOff()
				})
			},
			handleConfirmEdit(){
				if (!this.checkboxValue.length) {
					this.$toast('请勾选同意预约时间说明');
					return
				}
				this.$loadingOn()
				updateBookAction({
					id: this.chooseInfo.book_info.id,
					lecturer_time_id: this.editId,
					patient_course_id: this.chooseInfo.id
				}).then(res => {
					this.$toast(res.message || '修改预约成功')
					this.getData()
					this.handleClosePopup()
					this.$loadingOff()
					this.close()
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
		
		.popup-wrpper-course{
			width: 100%;
			margin-top: 24rpx;
			font-size: 14px;
			font-weight: bold;
			color: #4F68B0;
		}
		
		.popup-wrpper-before{
			width: 100%;
			margin-top: 24rpx;
			
			.popup-wrpper-before-title{
				font-size: 14px;
				color: #E06C75;
				font-weight: bold;
			}
			
			.popup-wrpper-before-time{
				font-size: 14px;
				color: #E06C75;
				font-weight: bold;
				margin-top: 12rpx;
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
			height: 400rpx;
			
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
		
		.calendar-tip-course{
			font-weight: bold;
			padding: 0 6rpx;
			color: #4F68B0;
		}
		
		.calendar-tip-in{
			color: #E06C75;
			padding-left: 6rpx;
			font-weight: bold;
			margin-top: 12rpx;
		}
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
			height: 460rpx;
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
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;
				
				.cell-item-border{
					position: absolute;
					left: 12rpx;
					top: 24rpx;
					height: 80rpx;
					width: 6rpx;
					background: #4F68B0;
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
					display: flex;
					align-items: center;
					width: 100%;
					margin-top: 16rpx;
					box-sizing: border-box;
					padding-left: 24rpx;
					
					.cell-item-bottom-left{
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 24rpx;
						
						.cell-item-bottom-left-img{
							width: 84rpx;
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
							font-size: 12px;
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
