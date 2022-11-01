<template>
	<view class="calendar-wrapper">
		<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0" leftIconColor="#fff" :titleStyle="{color: '#fff'}" title="预约时间管理" @leftClick="close" leftText="返回">
		</u-navbar>
		<view class="calendar-body">
			<view class="calendar-tip">
				选择日期以查看记录, 点击 "+" 添加新的预约时间; 最多可预约1个月内的时间.
			</view>
			<view class="calendar-in">
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
					<text>{{ pickDate }}</text><text>{{ ` 总数: ${showList.length} ` }}</text><text>{{ ` 已预约: ${0} ` }}</text>
				</view>
				<view class="in-body">
					<mescroll-uni ref="mescroll" @down="handleRefreshDown" :up="{onScroll:false, use: false, noMoreSize: 8, textNoMore: '', offset: 0}" :fixed="false">
						<view class="cell-group" v-if="showList.length">
							<uni-swipe-action>
								<!-- 基础用法 -->
								<uni-swipe-action-item @click="(e) => onClickItemIn(e, u)" :right-options="u.if_booked ? optionsOne : options" v-for="(u, index) in showList" :key="u.id">
									<view class="cell-item">
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
				timeToday: moment(new Date(), 'YYYY-MM-DD').add(1, 'months').format('YYYY-MM-DD'),
				pickDate: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				showType: 'spend',
				chooseInfo: {
					id: 0,
					name: '',
					src: '',
					money: 0
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
					
				}
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
					getLecturerTimesListAction().then(res => {
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
			font-size: 12px;
			color: #909399;
			padding: 0 20rpx 40rpx 20rpx;
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
