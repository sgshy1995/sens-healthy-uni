<template>
	<view :ref="mRef" class="flex ljt-keyboard-body">
		<slot></slot>
		<view class="flex ljt-keyboard-number-body" :style="{width:windowWidth+'px',backgroundColor:bodyBackground,padding:padding,height:keyboardHeight+'rpx'}">
			<view class=""  style="flex:3;">
				<view class="flex ljt-number-row" :style="{height:height+'rpx'}" :class="[(rowIndex==0||theme=='button')?'':'ljt-top-border']" v-for="(row,rowIndex) in keyboardCell">
					<view :style="{padding:padding,flex:cell.flex?cell.flex:1}" class="ljt-number-cell" :class="[(cellIndex==0||theme=='button')?'':'ljt-left-border',themeCellClass]" v-for="(cell,cellIndex) in row">
						<view class="ljt-number-btn" @click="onCellClick($event,cell.value)" 
						:class="[cell.id||cell.id=='0'?btnActiveClass:'',themeClass]" 
						:style="{backgroundColor:mBtnStyle.backgroundColor}">
							<template v-if="cell.value=='_close'">
								<!-- <text :class="[closeIcon.class]" class="fs-28" :style="{color:mBtnStyle.color}">{{closeIcon.icon}}</text> -->
								<image src="@/static/images/index/pack-up.png" class="ljt-number-btn-close-img"></image>
							</template>
							<template v-else-if="cell.value=='_back'">
								<text :class="[backIcon.class]" class="fs-28" :style="{color:mBtnStyle.color}">{{backIcon.icon}}</text>
							</template>
							<template v-else>
								<text class="ljt-number-text" :style="{color:mBtnStyle.color,fontWeight:mBtnStyle.fontWeight}">{{cell.text}}</text>
							</template>
						</view>
					</view>
				</view>
			</view>
			<view class="flex ljt-keyboard-right" v-if="isConfirmShow" :class="[theme!='button'?'ljt-left-border':'']" style="flex: 1;">
				<view :style="{padding:padding}" class="ljt-number-cell" :class="[themeCellClass]" style="flex: 1;">
					<view class="ljt-number-btn" @click="onCellClick($event,'_back')" :class="[btnActiveClass,themeClass]" :style="{backgroundColor:mBtnStyle.backgroundColor}">
						<text :class="[backIcon.class]" class="fs-28" :style="{color:mBtnStyle.color}">{{backIcon.icon}}</text>
					</view>
					
				</view>
				<view :style="{padding:padding}" class="ljt-number-cell border-top-1" :class="[themeCellClass]" style="flex: 1;" v-if="isCut">
					<view class="ljt-number-btn" @click="onCellClick($event,'-')" :class="[mValue.indexOf('-')<0?btnActiveClass:'',themeClass]" :style="{backgroundColor:mBtnStyle.backgroundColor}">
						<text class="fs-28" :style="{color:mBtnStyle.color}">-</text>
					</view>
					
				</view>
				<view :style="{padding:padding,flex:(isCut?2:3)}" class="ljt-number-cell confirm-btn" :class="[themeCellClass]" >
					<view class="ljt-number-btn" @click="onCellClick($event,'_done')" :class="[btnConfirmActiveClass,themeClass]" style="flex: 1;" :style="{backgroundColor:mConfirmStyle.backgroundColor}">
						<text class="ljt-number-text" :style="{color:mConfirmStyle.color,fontWeight:mConfirmStyle.fontWeight}">{{confirmText || '??????'}}</text>
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			value:{
				type:String|Number,
				default:''
			},
			/**
			 * ????????????
			 */
			theme:{
				type:String,
				default:'block',//block button
			},
			/**
			 * ?????? number ??????,digit ??????,idcard ?????????,password ?????????money??????
			 */
			type:{
				type:String,
				default:'number',
			},
			/**
			 * ??????????????????
			 */
			confirmText:{
				type:String,
				default:'??????'
			},
			/**
			 * ?????????
			 */
			backgroundColor:{
				type:String,
				default:'#ffffff'
			},
			/**
			 * ?????????????????? 0???????????????
			 */
			point:{
				type:String|Number,
				default:2
			},
			/**
			 * ????????????
			 */
			btnStyle:{
				type:Object,
				default:function(){
					return {
						backgroundColor:'#ffffff',//???????????????
						color:'rgba(0,0,0,.85)',//??????????????????
						fontWeight:400,
					}
				}
			},
			/**
			 * ??????????????????
			 */
			confirmStyle:{
				type:Object,
				default:function(){
					return {
						backgroundColor:'#FD7231',//??????????????????
						color:'#ffffff',//??????????????????
					}
				}
			},
			/**
			 * ?????????
			 */
			max:{
				type:Number|String,
				default:9999999999
			},
			/**
			 * ?????????????????????????????????????????????????????????????????????????????????
			 */
			min:{
				type:Number|String,
				default:0
			},
			/**
			 * ???????????????
			 */
			isClose:{
				type:Boolean,
				default:true
			},
			/**
			 * ???????????????
			 */
			isCut:{
				type:Boolean,
				default:false
			},
			/**
			 * ??????????????????
			 */
			backIcon:{
				type:Object,
				default:function(){
					return {
						class:'',
						icon:'??????'
					}
				}
			},
			/**
			 * ??????????????????
			 */
			closeIcon:{
				type:Object,
				default:function(){
					return {
						class:'',
						icon:'??????'
					}
				}
			}
		},
		data(){
			let _ref=this.id || 'ljtKeyboardNumber'
			return {
				sysInfo:null,
				windowWidth:375,//????????????
				cellWidth:186,//???????????????
				keyboardCell:[],
				themeClass:'',//??????????????????
				themeCellClass:'',//??????????????????
				bodyBackground:'#ffffff',//?????????,
				height:110,//????????????
				padding:'0rpx',
				mValue:'',
				mRef:_ref,
				mMax:0,
				mMin:0,
				btnActiveClass:'ljt-number-btn-ac',
				btnConfirmActiveClass:'ljt-number-btn-confirm',
				mConfirmStyle:{},
				mBtnStyle:{}
			}
		},
		watch:{
			value(_val) {
				this.mValue=_val
			},
			// H5 ?????????????????????
			showPopup(show) {
				// #ifdef H5
				// fix by mehaotian ?????? h5 ?????????????????????
				document.getElementsByTagName('body')[0].style.overflow = show ? 'hidden' : 'visible'
				// #endif
			},
			max(_val) {
				this.mMax=Number(_val)
			},
			min(_val) {
				this.mMin=Number(_val)
			},
			type(_val) {
				this.type=_val
				this.initKeyboardNumber()
			}
		},
		computed:{
			isConfirmShow(){
				return this.type!='password' &&this.type!='money'
			}
		},
		created() {
			this.mValue=this.value
			this.sysInfo=uni.getSystemInfoSync()
			this.windowWidth=this.sysInfo.windowWidth
			this.cellWidth=(this.sysInfo.windowWidth/4)-4
			this.mMax=Number(this.max)
			this.mMin=Number(this.min)
			
			this.mBtnStyle={
				backgroundColor:'#ffffff',//???????????????
				color:'rgba(0,0,0,.85)',//??????????????????
				customClass:'',//????????????
				fontWeight:400,
				...this.btnStyle,
			}
			this.mConfirmStyle={
				backgroundColor:'#FD7231',//??????????????????
				color:'#ffffff',//??????????????????
				customClass:'',//????????????
				...this.confirmStyle,
			}
			
			//???????????? ??????????????????????????????
			this.btnActiveClass= this.mBtnStyle.backgroundColor!='#ffffff'?'ljt-number-btn-ac-2':this.btnActiveClass
			this.btnConfirmActiveClass= this.mConfirmStyle.backgroundColor!='#ffffff'?'ljt-number-btn-confirm-2':this.btnConfirmActiveClass
			
			if(this.theme=='button') {
				this.bodyBackground=this.backgroundColor==='#ffffff'?'#f6f6f6':this.backgroundColor
				this.themeClass='ljt-button-theme'
				this.themeCellClass='ljt-button-theme-cell'
				this.height=100
				this.padding='10rpx'
			}
			this.keyboardHeight=this.height*4
			
			this.initKeyboardNumber()
		},
		methods:{
			//?????????????????????
			initKeyboardNumber(){
				let _list=[
						[{id:1,text:1,value:1},{id:2,text:2,value:2},{id:3,text:3,value:3}],
						[{id:4,text:4,value:4},{id:5,text:5,value:5},{id:6,text:6,value:6}],
						[{id:7,text:7,value:7},{id:8,text:8,value:8},{id:9,text:9,value:9}],
						[{id:0,text:0,value:0}]
					]
				this.keyboardCell=this[[this.type]+'Keyboard'](_list)
			},
			//????????????
			numberKeyboard(_list){
				//????????????
				if(this.isClose) {
					_list[3][0]['flex']=2
					_list[3].push({id:'_close',text:'',value:'_close',flex:1})
				} else {
					_list[3][0]['flex']=1
				}
				return _list
			},
			//???????????????
			idcardKeyboard(_list){
				//?????????
				_list[3].unshift({id:'X',text:'X',value:'X'})
				if(this.isClose) {
					_list[3][0]['flex']=1
					_list[3][1]['flex']=1
					_list[3].push({id:'_close',text:'',value:'_close',flex:1})
				} else {
					_list[3][0]['flex']=1
					_list[3][1]['flex']=2
				}
				return _list
			},
			//???????????????
			digitKeyboard(_list){
				_list[3].unshift({id:'.',text:'.',value:'.'})//???????????????
				if(this.isClose) {
					_list[3][0]['flex']=1
					_list[3][1]['flex']=1
					_list[3].push({id:'_close',text:'',value:'_close',flex:1})
				} else {
					_list[3][0]['flex']=1
					_list[3][1]['flex']=2
				}
				return _list;
			},
			//????????????
			passwordKeyboard(_list) {
				if(this.isClose) {
					_list[3].unshift({id:'_close',text:'',value:'_close'})//????????????
				} else {
					//??????0????????????flex2
					_list[3][0]['flex']=2
				}
				
				//??????????????????
				_list[3].push({id:'_back',text:'',value:'_back',flex:1})
				return _list
			},
			//????????????
			moneyKeyboard(_list) {
				_list[3].unshift({id:'.',text:'.',value:'.'})//???????????????
				
				//??????????????????
				_list[3].push({id:'_back',text:'',value:'_back',flex:1})
				return _list
			},
			onCellClick(e,_val){
				e.stopPropagation()
				
				_val=_val+''
				let _text=this.mValue+''//???????????????
				
				if(_val=='_close') {
					//??????
					this.$emit('onClose',_text)
					return
				}
				if(_val=='_done') {
					//??????
					this.$emit('onDone',_text)
					return
				}
				if(_val=='_back') {
					//??????
					if(_text.length>0) {
						_text=_text.substring(0,_text.length-1)
					}
				} else if(_val=='.') {
					//????????? ???????????????????????????????????????????????????????????????
					if(_text.length<=0||_text.indexOf('.')>=0) {
						return
					}
					_text+='.'
				} else if(_val=='-') {
					if(_text.indexOf('-')>=0) {
						return
					}
					_text+='-'
				} else if(_val=='X'){
					//?????????
					if(_text.indexOf('X')>=0) {
						return
					}
					_text+='X'
				} else {
					if(this.type=='idcard') {
						if(_text.length==18) {
							return
						}
						_text+=_val
					} else if(this.type=='password') {
						_text+=_val
					} else {
						if(this.mMax && Number(this.mValue)>=this.mMax) {
							return
						}
						//???????????????????????????
						let _point=Number(this.point) || 0
						if(_point) {
							let _arr=_text.split('.')
							if(_arr.length==2) {
								if(_arr[1].length>=(_point)) {
									return
								}
							}
						}
						//????????????
						if(this.mMax && Number(this.mValue+_val)>this.mMax) {
							_text=this.mMax+''
						} else {
							_text+=_val
						}
						//00????????????
						if(_text.indexOf('00')==0) {
							_text='0'
						}
						if(_text.indexOf('0')==0&&_text.indexOf('0.')<0) {
							_text=Number(_text)+''
						}
					}
				}
				_text=_text+''
				this.$emit('input',_text)
				
			}
		}
	} 
</script>

<style lang="scss" scoped>
	.flex {
		display: flex;
		overflow: hidden;
		box-sizing: border-box;
	}
	.ljt-keyboard-body {
		/* #ifndef APP-NVUE */
		z-index: 999;
		width:100%;
		/* #endif */
		// position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		background: #fff;
	}
	.ljt-keyboard-number-body {
		flex-direction: row;
		background: #fff;
	}
	.ljt-keyboard-right {
		display: flex;
		flex-direction: column;
	}
	.ljt-number-row {
		flex: 1;
		flex-direction: row;
	}
	.ljt-number-cell {flex: 1;display: flex;align-items: center;justify-content: center;}
	.ljt-number-cell.confirm-btn{background: #4F68B0;}
	.ljt-number-cell.confirm-btn .ljt-number-btn{background: #4F68B0 !important;}
	.ljt-number-btn {flex: 1;align-items: center;justify-content: center;display: flex;width: 100%;height: 100%;}
	.ljt-number-btn .ljt-number-btn-close-img{width: 56rpx;height: 56rpx;}
	.ljt-number-text {font-size: 36rpx;color:rgba(0,0,0,.85);}
	.ljt-number-cell.confirm-btn .ljt-number-text{color: #fff;}
	
	.ljt-number-btn-ac:active {background-color: #e5e5e5 !important;}
	.ljt-number-btn-ac-2:active {opacity: .7 !important;}
	.ljt-number-btn-confirm:active {background-color: #f9f9f9 !important;}
	.ljt-number-btn-confirm-2:active {opacity: .7 !important;}
	
	.ljt-button-theme {border-width: 0rpx !important;border-radius: 10rpx;}
	
	.ljt-left-border {border-color: #f5f5f5;border-left-width: 1px;border-style: solid;border-right: 0;border-top: 0;border-bottom: 0;}
	.ljt-right-border {border-color: #f5f5f5;border-right-width: 1px;border-style: solid;border-left: 0;border-top: 0;border-bottom: 0;}
	.ljt-bottom-border{border-color: #f5f5f5;border-bottom-width:1px;border-style: solid;border-top: 0;border-left: 0;border-right: 0;}
	.ljt-top-border {border-color: #f5f5f5;border-top-width:1px;border-style: solid;border-bottom: 0;border-left: 0;border-right: 0;}
</style>