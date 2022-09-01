<template>
	<uni-popup type="bottom" :isMaskClick="isMaskClick" background-color="#eee" ref="ljtKeyBoardNumberPopup" :mask-background-color="maskBackgroundColor" @change="onChange">
		<ljt-keyboard-number
			:value="mValue" 
			:isCut="isCut"
			:theme="theme" 
			:confirmStyle="confirmStyle" 
			:confirmText="confirmText"
			:backgroundColor="backgroundColor"
			:backIcon="backIcon"
			:closeIcon="closeIcon"
			:point="point"
			:btnStyle="btnStyle"
			:isClose="isClose"
			:max="max"
			:type="type"
			@input="onInput"
			@onDone="onDone"
			@onClose="onClose"
			>
			<slot></slot>
		</ljt-keyboard-number>
		<!-- H5底部bar适配 -->
		<view class="safe-area" style="height: calc(var(--window-bottom))" ></view>
	</uni-popup>
</template>

<script>
	import ljtKeyboardNumber from './liujto-keyboard-number.vue'
	export default {
		components:{
			ljtKeyboardNumber
		},
		props:{
			value:{
				type:String|Number,
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
			 * 是否带负号
			 */
			isCut:{
				type:Boolean,
				default:false
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
			/**
			 * 最大值
			 */
			max:{
				type:String|Number,
				default:9999999999
			},
			/**
			 * 回退按钮图片
			 */
			backIcon:{
				type:Object,
				default:function(){
					return {
						class:'',
						icon:'回退'
					}
				}
			},
			/**
			 * 关闭按钮图标
			 */
			closeIcon:{
				type:Object,
				default:function(){
					return {
						class:'',
						icon:'关闭'
					}
				}
			},
			/**
			 * 点击mask关闭弹窗
			 */
			isMaskClick:{
				type:Boolean,
				default:true
			},
			/**
			 * 弹窗mask背景
			 */
			maskBackgroundColor:{
				type:String,
				default:'rgba(0,0,0,.3)'
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
				this.$refs['ljtKeyBoardNumberPopup'].open();
			},
			close(){
				uni.hideKeyboard()
				this.$refs['ljtKeyBoardNumberPopup'].close()
			},
			onInput(e) {
				this.mValue=e
				this.$emit('input',e)
			},
			onChange(e) {
				this.$emit('onChange',e)
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

<style lang="scss" scoped></style>

<style lang="scss">
	.safe-area{
		background: #eee;
	}
</style>