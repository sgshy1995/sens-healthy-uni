<template>
	<view class="pain-q-a-wrapper">
		<scroll-view scroll-y class="pain-q-a-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0" title="伤痛档案" leftIconColor="#fff"
				:titleStyle="{color: '#fff'}" @leftClick="leftClick" leftText="返回">
				<view class="slot-right" slot="right" @click="handleConfirmUpdate">
					更新
				</view>
			</u-navbar>
			<view class="pain-q-a-body">
				<uni-section lineColor="#4F68B0" title="年龄"
					subTitle="年龄，周岁" type="line" padding>
					<text class="choose-age" @click="handleShowPicker">{{ form.age ? `${form.age}岁` : '请选择年龄 >' }}</text>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="既往伤病史"
					subTitle="什么时间在哪里做过什么治疗，治疗效果如何，是否有明确诊断为何病" type="line" padding>
					<uni-easyinput type="textarea" v-model="form.injury_history" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="近期伤病描述" subTitle="近期伤病情况介绍，受伤时间，受伤过程，受伤部位，症状描述，受伤部位活动功能是否受影响，日常生活活动是否受影响等" type="line"
					padding>
					<uni-easyinput type="textarea" v-model="form.injury_recent" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="出院小结"
					subTitle="何时出院，治疗结果，医生嘱托，后续治疗方案" type="line" padding>
					<uni-easyinput type="textarea" v-model="form.discharge_abstract" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
				<uni-section lineColor="#4F68B0" title="上传照片或视频" subTitle="影像资料，诊断报告，受伤部位等资料，最多上传9张" type="line"
					padding>
					<u-upload :fileList="fileListData" @afterRead="afterRead" @delete="deletePic" name="Data" multiple
						:maxCount="9"></u-upload>
				</uni-section>
			</view>
		</scroll-view>
		<u-picker :key="refreshKey" confirmColor="#4F68B0" :defaultIndex="defaultIndexAge" :show="showPicker"
			ref="uPicker" :loading="loading" :columns="columnsAge" @confirm="handleConfirmPicker" @cancel="handleClosePicker">
		</u-picker>
	</view>
</template>

<script>
	import {
		updateInfoByUserIdAction,
		infoUploadAction
	} from '@/service/service'
	export default {
		data() {
			return {
				form: {
					age: 0,
					injury_history: '',
					injury_recent: '',
					discharge_abstract: ''
				},
				fileListData: [],
				showPicker: false,
				loading: false,
				columnsAge: [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100]],
				defaultIndexAge: [],
				refreshKey: 0,
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/'
			}
		},
		watch: {
			fileListData: {
				handler() {
					console.log('fileListData change', this.fileListData)
				},
				deep: true
			},
			info: {
				handler(){
					this.form.age = this.info.age
					this.form.injury_history = this.info.injury_history
					this.form.injury_recent = this.info.injury_recent
					this.form.discharge_abstract = this.info.discharge_abstract
					this.defaultIndexAge = [this.info.age ? this.info.age - 1 : 0]
					this.refreshKey ++
					this.fileListData = []
					if(this.info.image_data){
						const pathList = this.info.image_data.split(',')
						console.log('pathList',pathList)
						pathList.map(path=>{
							this.fileListData.push({
								size: 0,
								type: 'image',
								url: this.baseUrl + path,
								thumb: this.baseUrl + path,
								source: path,
								status: '',
								message: 'exist'
							})
						})
					}
				},
				deep: true,
				immediate: true
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			},
			info(){
				return this.$store.state.user.info
			}
		},
		methods: {
			handleConfirmUpdate(){
				if(!this.form.age || !this.form.injury_history || !this.form.injury_recent || !this.form.discharge_abstract){
					this.$toast('请完善信息');
					return
				}
				this.$loadingOn();
				Promise.all(this.fileListData.filter(item=>!item.message).map(item=>{
					return infoUploadAction(item.url)
				})).then(responses=>{
					console.log('responses', responses)
					updateInfoByUserIdAction(this.userInfo.id, {
						...this.form,
						image_data: this.fileListData.filter(item=>item.message).map(item=>item.source).concat(responses.map(res=>JSON.parse(res.data).data)).join()
					}).then(res1=>{
						this.close()
					}).catch(err1=>{
						this.$loadingOff();
					})
				}).catch(err=>{
					this.$loadingOff();
				})
			},
			handleConfirmPicker(e) {
				console.log('e', e)
				this.defaultIndexWeek = e.indexs
				this.form.age = e.value[0]
				this.handleClosePicker()
			},
			handleShowPicker() {
				this.showPicker = true
			},
			handleClosePicker() {
				this.showPicker = false
			},
			close() {
				uni.navigateBack()
			},
			leftClick() {
				this.close()
			},
			showView(url) {
				// 预览图片
				uni.previewImage({
					urls: [url],
					indicator: 'none'
				});
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: '',
						message: ''
					})
				})
			}
		}

	}
</script>

<style lang="scss">
	.pain-q-a-wrapper {
		width: 100vw;
		height: 100vh;

		.pain-q-a-box {
			width: 100%;
			height: 100%;
			
			.slot-right{
				background: #fff;
				color: #4F68B0;
				padding: 0 20rpx;
				box-sizing: border-box;
				font-size: 14px;
				height: 44rpx;
				border-radius: 22rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.pain-q-a-body {
			width: 100%;
			
			.choose-age{
				font-size: 12px;
				color: #444;
				padding-left: 24rpx;
			}
			
			.u-upload__deletable{
				width: 32rpx;
				height: 32rpx;
				border-bottom-left-radius: 16rpx;
			}
		}
	}
</style>
