<template>
	<u-popup :show="show" @close="close" @open="open">
	    <view class="pain-qa-comment-wrapper">
	    	<scroll-view scroll-y class="pain-qa-comment-box">
	    		<view class="update-record-body">
					<view class="update-record-body-tip" v-if="!comment.id">对该答复 <text class="update-record-body-tip-in">“{{ `${reply.name}说：${reply.reply_content ? reply.reply_content.slice(0,8) : ''}...` }}”</text> 发表评论</view>
					<view class="update-record-body-tip" v-else>对该评论 <text class="update-record-body-tip-in">“{{ `${comment.name}说：${comment.comment_content ? comment.comment_content.slice(0,8) : ''}...` }}”</text> 发表评论</view>
	    			<uni-easyinput type="textarea" focus v-model="form.comment_content" placeholder="请输入评论内容"></uni-easyinput>
	    		</view>
				<view class="update-record-bottom">
					<view class="publish-button" @click="handlePublish">发表评论</view>
				</view>
	    	</scroll-view>
	    </view>	
	</u-popup>
</template>

<script>
	import keyboardPrice from '@/components/liujto-keyboard/liujto-keyboard-price.vue'
	import {
		createCommentAction
	} from '@/service/service'
	export default {
		components: {
			keyboardPrice
		},
		data() {
			return {
				show: false,
				form: {
					comment_content: ''
				},
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				reply: {},
				comment: {}
			}
		},
		props: {
			info: {
				type: Object,
				default(){
					return {}
				}
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		methods: {
			open(reply, comment) {
			    // console.log('open');
				if(reply){
					this.reply = {...reply}
				}
				if(comment){
					this.comment = {...comment}
				}
				this.show = true
			},
			close() {
			    this.show = false
				this.form.comment_content = ''
				this.comment = {}
				this.reply = {}
			    // console.log('close');
			},
			handlePublish() {
				if (!this.form.comment_content) {
					this.$toast('请输入评论内容');
				} else {
					this.$loadingOn()
					createCommentAction({
						...this.form,
						user_id: this.userInfo.id,
						question_id: this.info.id,
						reply_id: this.reply.id,
						comment_id: this.comment.id || undefined,
						comment_to_user_id: this.comment.id ? this.comment.user_id : this.reply.user_id
					}).then(res => {
						this.$loadingOff()
						this.close()
						this.$emit('ok')
						this.$toast(res.message || '已发表评论');
					}).catch(err => {
						this.$loadingOff()
					})
				}
			}
		}

	}
</script>

<style lang="scss">
	.pain-qa-comment-wrapper {
		width: 100vw;

		.pain-qa-comment-box {
			width: 100%;
			box-sizing: border-box;

			.slot-right {
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

		.update-record-body {
			width: 100%;
			box-sizing: border-box;
			padding: 24rpx;
			
			.u-upload{
				margin-top: 24rpx;
			}
			
			.update-record-body-tip{
				margin-top: 24rpx;
				margin-bottom: 24rpx;
				font-size: 12px;
				color: #999;
				
				.update-record-body-tip-in{
					color: #777;
					font-weight: 800;
					padding: 0 4rpx;
				}
			}
		}
		
		.update-record-bottom{
			width: 100%;
			box-sizing: border-box;
			padding: 0 24rpx;
			
			.publish-button{
				font-size: 13px;
				background: #4F68B0;
				color: #fff;
				font-weight: bold;
				box-sizing: border-box;
				width: 150rpx;
				padding: 6rpx;
				text-align: center;
				border-radius: 12rpx;
			}
		}

		.uni-section-body {
			width: 100%;
			display: flex;
			align-items: center;

			.uni-section-body-in {
				width: 100%;
				font-size: 14px;

				.uni-section-body-title {
					padding-right: 12rpx;
					color: #777;
				}

				.uni-section-body-text {
					color: #4F68B0;
					font-weight: bold;
				}
			}

			.u-switch {
				margin-right: 24rpx;
				margin-left: 24rpx;
			}
		}
	}
</style>
