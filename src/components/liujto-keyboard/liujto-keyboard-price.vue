<template>
	<ljt-keyboard-popup
		ref="ljtKeyBoardPopup"
		:isCut="isCut"
		:value="mValue" 
		:theme="theme" 
		:confirmStyle="confirmStyle" 
		:confirmText="confirmText"
		:backgroundColor="backgroundColor"
		:backIcon="backIcon"
		:closeIcon="closeIcon"
		:point="point"
		:btnStyle="btnStyle"
		:isClose="isClose"
		:beforeUnit="beforeUnit"
		:afterUnit="afterUnit"
		:max="max"
		:type="type"
		@input="onInput"
		@onDone="onDone"
		@onClose="onClose"
		>
		<view class="flex liujt-keyboard-price-body" :style="{'border-top-right-radius':borderRadius+'rpx','border-top-left-radius':borderRadius+'rpx'}">
			<view class="" v-if="title">
				<text class="liujt-keyboard-price-title">{{title}}</text>
			</view>
			<view class="flex" style="flex-direction: row;">
				<ljt-keyboard-input :options="inputOptions" type="number" :value="mValue"></ljt-keyboard-input>
			</view>
			
		</view>
	</ljt-keyboard-popup>
</template>

<script>
	import ljtKeyboardPopup from './liujto-keyboard-popup.vue'
	import ljtKeyboardInput from './liujto-keyboard-input.vue'
	export default {
		components:{
			ljtKeyboardPopup,
			ljtKeyboardInput
		},
		props:{
			value:{
				type:String|Number,
				default:''
			},
			inputOptions:{
				type:Object,
				default:function(){
					return {}
				}
			},
			/**
			 * 显示标题
			 */
			title:{
				type:String,
				default:''
			},
			/**
			 * 如果有标题的话，圆角数
			 */
			borderRadius:{
				type:String|Number,
				default:30
			},
			/**
			 * 是否带负号
			 */
			isCut:{
				type:Boolean,
				default:false
			},
			/**
			 * 在数字前面的单位
			 */
			beforeUnit:{
				type:String,
				default:''
			},
			/**
			 * 跟在数字后的单位
			 */
			afterUnit:{
				type:String,
				default:''
			},
			/**
			 * 模式 number 整数,digit 小数,idcard 身份证
			 */
			type:{
				type:String,
				default:'number',
			},
			/**
			 * 主题模式
			 */
			theme:{
				type:String,
				default:'block',//block button
			},
			/**
			 * 提交按钮文案
			 */
			confirmText:{
				type:String,
				default:'完成'
			},
			/**
			 * 背景色
			 */
			backgroundColor:{
				type:String,
				default:'#ffffff'
			},
			/**
			 * 保留小数位数 0为整数模式
			 */
			point:{
				type:String|Number,
				default:2
			},
			/**
			 * 按钮样式
			 */
			btnStyle:{
				type:Object,
				default:function(){
					return {
						backgroundColor:'#ffffff',//按钮背景色
						color:'rgba(0,0,0,.85)',//按钮文字颜色
						customClass:'',//额外类名
						fontWeight:400,
					}
				}
			},
			/**
			 * 提交按钮样式
			 */
			confirmStyle:{
				type:Object,
				default:function(){
					return {
						backgroundColor:'#FD7231',//按钮背景颜色
						color:'#ffffff',//按钮文字颜色
						customClass:'',//额外类名
					}
				}
			},
			/**
			 * 是否可关闭
			 */
			isClose:{
				type:Boolean|String,
				default:true
			},
			/**
			 * 是否开启动画
			 */
			animation:{
				type:Boolean,
				default:true
			},
			max:{
				type:String|Number,
				default:9999999999
			},
			backIcon:{
				type:Object,
				default:function(){
					return {
						class:'',
						icon:'回退'
					}
				}
			},
			closeIcon:{
				type:Object,
				default:function(){
					return {
						class:'',
						icon:'关闭'
					}
				}
			},
			isMaskClick:{
				type:Boolean,
				default:true
			},
			maskBackgroundColor:{
				type:String,
				default:'rgba(0,0,0,.1)'
			}
		},
		data(){
			return {
				mValue:''
			}
		},
		watch:{
			value(_val) {
				this.mValue=_val
			}
		},
		created() {
			this.mValue=this.value
		},
		methods:{
			open(){
				uni.hideKeyboard()
				this.$refs['ljtKeyBoardPopup'].open();
			},
			close(){
				uni.hideKeyboard()
				this.$refs['ljtKeyBoardPopup'].close()
			},
			onInput(e) {
				this.mValue=e
				this.$emit('input',e)
			},
			onDone(e) {
				if(this.isClose) {
					this.close()
				}
				this.$emit('onDone',e)
			},
			onClose(e) {
				//关闭
				this.close()
				this.$emit('onClose',e)
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
	.liujt-keyboard-price-body {background-color: #ffffff;border-bottom: 1px solid #f5f5f5;padding:0 20rpx;padding-top: 20rpx;flex-direction: column;}
	.liujt-keyboard-price-title {font-size: 28rpx;color: rgba(0,0,0,.3);}
</style>