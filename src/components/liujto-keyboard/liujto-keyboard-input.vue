<template>
	<view class="flex">
		<view class="ljt-input-body flex" @click="onClick" :style="{height:mOptions.height+'rpx'}">
			<view class="" style="padding-bottom: 10rpx;"  v-if="mOptions.label">
				<text class="ljt-label">{{mOptions.label}}</text>
			</view>
			<view class="flex ljt-input-body" style="flex-direction: row; align-items: center;" 
			:style="{height:mOptions.height+'rpx','paddingBottom':mOptions.priceUnit?'10rpx':'0'}">
				<text class="ljt-input-value-unit-text" v-if="mOptions.beforeUnit" :style="{color:mValue?'rgba(0,0,0,.85)':'rgba(0,0,0,.5)',fontSize:mOptions.fontSize+'rpx'}">{{mOptions.beforeUnit}}</text>
				<text class="ljt-input-value-text" :style="{fontSize:mOptions.fontSize+'rpx'}" :class="[mOptions.valueClass]">{{valueText}}</text>
				<!-- 光标  -->
				<view class="ljt-input-cursor flex" v-if="mFocus && mValue" :style="{height:cursorStyle.height+'rpx',backgroundColor:mOptions.focusColor}" ref="ljt-input-cursor"></view>
				<text class="ljt-input-value-unit-text" :style="{fontSize:mOptions.fontSize+'rpx'}" v-if="mValue">{{mOptions.afterUnit}}</text>
				<text class="ljt-input-value-placeholder-text" :style="{fontSize:mOptions.fontSize+'rpx'}" v-if="!mValue">{{mOptions.placeholder || '请输入赏金金额'}}</text>
				<view class="ljt-input-price-unit" v-if="mOptions.priceUnit">
					<text class="ljt-input-price-unit-text">{{priceUnitText}}</text>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	// #ifdef APP-NVUE
	const nvueAnimation = uni.requireNativePlugin('animation')
	// #endif
	
	export default {
		props:{
			value:{
				type:String|Number,
				default:''
			},
			options:{
				type:Object,
				default:function(){
					return {}
				}
			},
			/**
			 * 出现光标
			 */
			focus:{
				type:Boolean,
				default:true
			},
		},
		data(){
			return {
				cursorStyle:{
					height:10,
					opacity:1
				},
				mValue:'',
				mFocus:false,
				mOptions:{
					label:'',//文字前的文案
					type:'number',
					height:70,
					fontSize:28,
					valueClass:'',//value额外的class
					beforeUnit:'',//在数字前面的单位
					afterUnit:'',//在数字后面的单位
					priceUnit:'',//金额单位 money(人民币大写) number(数字单位)
					focusColor:'#FD7231',
					placeholder:'',//占位符
				}
			}
		},
		computed:{
			priceUnitText(){
				if(this.mOptions.priceUnit=='money') {
					return this.convertCurrency(Number(this.mValue) || 0)
				} else if(this.mOptions.priceUnit=='number'){
					return this.numberUnit(Number(this.mValue) || 0)
				}
			},
			valueText(){
				return this.money(this.mValue)
			}
		},
		watch:{
			value(_val) {
				this.mValue=_val
			},
			focus(_val) {
				this.mFocus=_val
				if(this.mFocus) {
					// #ifdef APP-NVUE
					setTimeout(()=>{
						this.cursorAnimation()
					},100)
					// #endif
				}
			}
		},
		created() {
			this.mOptions={
				...this.mOptions,
				...this.options,
			}
			
			this.mFocus=this.focus
			this.mValue=this.value
			this.cursorStyle={
				height:this.mOptions.height/2,
				opacity:1
			}
			
			// #ifdef APP-NVUE
			setTimeout(()=>{
				this.cursorAnimation()
			},200)
			// #endif
			
		},
		methods:{
			cursorAnimation(){
				//nvue 动画
				let that=this;
				var _name='ljt-input-cursor'
				var _ref=this.$refs[_name];//ref
				if(!_ref) {
					return
				}
				nvueAnimation.transition(_ref, {
					styles: { opacity:that.cursorStyle.opacity==1?0:1 },
					duration: 100, //ms
					timingFunction: 'linear',
					delay: 500 //ms 延迟
				},function(){
					that.cursorStyle.opacity=that.cursorStyle.opacity==1?0:1;
					that.cursorAnimation()
				})
				
			},
			onClick(e) {
				e.stopPropagation()
				uni.hideKeyboard()
				this.$emit('click',e)
			},
			money(s) {
				if (!s || (/[^0-9\.]/.test(s)) || !s || s == "null" || s == "" ) {
					return s
				}
				if((s+'').indexOf('.')==(s+'').length-1) {
					return s
				}
				//获取小数部分 
				let _arr=(s+'').split('.')
				let _float=_arr.length>0?_arr[1]:''
				s=_arr[0]//只格式化整数部分
				
			    //处理精度问题
			    s=Number(s).toFixed(2)
				var f=false;
				//判断是否为负数
			    if(s<0) {
			        f=true;
			        s=(s+'').replace('-','')
			    }
			    
			    s = s.toString().replace(/^(\d*)$/, "$1.");
			    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
			    s = s.replace(".", ",");
			    var re = /(\d)(\d{3},)/;
			    while (re.test(s)) {
					s = s.replace(re, "$1,$2");
				}
			    s = s.replace(/,(\d\d)$/, ".$1");
				return s.replace('.00','')+(_float?'.'+_float:'')
			},
			numberUnit(s) {
				s=Number(s) || 0
				if(s>=1000000000) return '十亿'
				if(s>=100000000) return '亿'
				if(s>=10000000) return '千万'
				if(s>=1000000) return '百万'
				if(s>=100000) return '十万'
				if(s>=10000) return '万'
				if(s>=1000) return '千'
				return ''
			},
			convertCurrency (money) {
			  //汉字的数字
			  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
			  //基本单位
			  var cnIntRadice = new Array('', '拾', '佰', '仟');
			  //对应整数部分扩展单位
			  var cnIntUnits = new Array('', '万', '亿', '兆');
			  //对应小数部分单位
			  var cnDecUnits = new Array('角', '分', '毫', '厘');
			  //整数金额时后面跟的字符
			  var cnInteger =''// '整';
			  //整型完以后的单位
			  var cnIntLast =''// '元';
			  //最大处理的数字
			  var maxNum = 999999999999999.9999;
			  //金额整数部分
			  var integerNum;
			  //金额小数部分
			  var decimalNum;
			  //输出的中文金额字符串
			  var chineseStr = '';
			  //分离金额后用的数组，预定义
			  var parts;
			  if (money == '') { return ''; }
			  money = parseFloat(money);
			  if (money >= maxNum) {
			    //超出最大处理数字
			    return '';
			  }
			  if (money == 0) {
			    chineseStr = cnNums[0] + cnIntLast + cnInteger;
			    return chineseStr;
			  }
			  //转换为字符串
			  money = money.toString();
			  if (money.indexOf('.') == -1) {
			    integerNum = money;
			    decimalNum = '';
			  } else {
			    parts = money.split('.');
			    integerNum = parts[0];
			    decimalNum = parts[1].substr(0, 4);
			  }
			  //获取整型部分转换
			  if (parseInt(integerNum, 10) > 0) {
			    var zeroCount = 0;
			    var IntLen = integerNum.length;
			    for (var i = 0; i < IntLen; i++) {
			      var n = integerNum.substr(i, 1);
			      var p = IntLen - i - 1;
			      var q = p / 4;
			      var m = p % 4;
			      if (n == '0') {
			        zeroCount++;
			      } else {
			        if (zeroCount > 0) {
			          chineseStr += cnNums[0];
			        }
			        //归零
			        zeroCount = 0;
			        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
			      }
			      if (m == 0 && zeroCount < 4) {
			        chineseStr += cnIntUnits[q];
			      }
			    }
			    chineseStr += cnIntLast;
			  }
			  //小数部分
			  if (decimalNum != '') {
			    var decLen = decimalNum.length;
			    for (var i = 0; i < decLen; i++) {
			      var n = decimalNum.substr(i, 1);
			      if (n != '0') {
			        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
			      }
			    }
			  }
			  if (chineseStr == '') {
			    chineseStr += cnNums[0] + cnIntLast + cnInteger;
			  } else if (decimalNum == '') {
			    chineseStr += cnInteger;
			  }
			  return chineseStr;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		display: flex;position: relative;
		overflow: hidden;flex-direction: column;
		box-sizing: border-box;
		width: 100vw;
	}
	.ljt-input-body {
		/* #ifndef APP-NVUE */
		width:100%;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding-left: 0;
		flex: 1;
	}
	.ljt-input-value-text {font-size: 32rpx;width: 100%;text-align: right;}
	.ljt-input-value-placeholder-text {font-size: 32rpx;color: rgba(0,0,0,.3);white-space: nowrap;}
	.ljt-input-value-unit-text {font-size: 28rpx;color: rgba(0,0,0,.5);margin-left: 5rpx;}
	.ljt-input-cursor {width: 4rpx;border-radius: 10rpx;margin-left: 5rpx;background-color: #ccc;}
	.ljt-input-price-unit {position: absolute;left: 0;bottom: 0;}
	.ljt-input-price-unit-text {font-size: 20rpx;color: rgba(0,0,0,.5);}
	.ljt-label {font-size: 30rpx;color: rgba(0,0,0,.85);margin-right: 10rpx;}
</style>