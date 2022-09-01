<template>
	<view class="pain-q-a-wrapper">
		<scroll-view scroll-y class="pain-q-a-box">
			<u-navbar placeholder leftIconSize="14" border bgColor="#4F68B0"
				title="问答详情" leftIconColor="#fff" :titleStyle="{color: '#fff'}"
				@leftClick="leftClick" leftText="返回">
				<u-icon name="share" color="#fff" size="22" slot="right"></u-icon>
			</u-navbar>
			<view class="pain-q-a-body">
				
				<view class="pain-q-a-body-top">
					<view class="pain-q-a-body-info">
						<image @click.stop="showView(info.avatar)" class="info-avatar" :src="info.anonymity ? avatarDefault : info.avatar ? baseUrl + info.avatar : avatarDefault"></image>
						<view class="info-user">
							<view class="info-user-name">
								{{ info.anonymity ? '森普健康用户(匿名)' : info.name ? info.name : '森普健康用户' }}
							</view>
							<view class="info-user-time">
								{{ info.show_question_time }}
							</view>
						</view>
					</view>
					
					<view class="pain-q-a-body-fee" v-if="info.consulting_fee">
						<image class="fee-icon" src="@/static/images/index/payment-color.png"></image>
						<text class="fee-text">¥ {{ info.consulting_fee }} 咨询费</text>
					</view>
					
					<view class="pain-q-a-body-description" v-if="info.pain_type">
						<view class="inner-title">
							伤痛类型：
						</view>
						<text>{{ info.pain_type }}</text>
					</view>
					
					<view class="pain-q-a-body-description" v-if="info.description">
						<view class="inner-title">
							问题描述：
						</view>
						<text>{{ info.description }}</text>
					</view>
					
					<view class="pain-q-a-body-description" v-if="info.injury_history">
						<view class="inner-title">
							诊疗史：
						</view>
						<text>{{ info.injury_history }}</text>
					</view>
					
					<view class="pain-q-a-body-album" v-if="info.urls && info.urls.length">
						<u-album :urls="info.urls" multipleSize="226rpx" singleSize="678rpx" maxCount="6"></u-album>
					</view>
					
				</view>
				
				<view class="pain-q-a-body-bottom" v-if="info.description">
					<view class="pain-q-a-body-back"></view>
					<view class="pain-q-a-body-qa">
						<view class="inner-title">
							全部答伤 · {{ replies.length }}
						</view>
						<u-empty :show="!replies.length" marginTop="0" iconSize="24rpx" width="100rpx" height="100rpx" text="该问题暂无答复" textSize="12" mode="comment" :icon="commentEmptyImage"></u-empty>
						<view class="pain-q-a-body-qa-item" v-for="(u,index) in replies" :key="u.id" :class="{last: index === replies.length - 1}">
							<view class="pain-q-a-body-qa-item-left">
								<image @click.stop="showView(u.avatar)" class="info-avatar" :src="u.avatar ? baseUrl + u.avatar : avatarDefault"></image>
							</view>
							<view class="pain-q-a-body-qa-item-right">
								<view class="pain-q-a-body-qa-item-info">
									<view class="info-user">
										<view class="info-user-name" :class="{major: u.authenticate === 1}">
											<text class="info-user-name-text">{{ u.name || '森普健康用户' }}</text>
											<image v-if="u.identity === 1" src="@/static/images/index/physician.png" class="info-user-name-physician"></image>
											<image v-if="u.authenticate === 1" src="@/static/images/index/auth.png" class="info-user-name-auth"></image>
										</view>
										<view class="info-user-time">
											{{ u.show_reply_time }}
										</view>
									</view>
								</view>
								<view class="pain-q-a-body-qa-item-comment" v-html="u.reply_content"></view>
								<view class="pain-q-a-body-qa-item-album" v-if="u.urls && u.urls.length">
									<u-album :urls="u.urls" multipleSize="95rpx" singleSize="285rpx" maxCount="3"></u-album>
								</view>
								<view class="pain-q-a-body-qa-item-bottom">
									<view class="pain-bottom-reply">
										<image class="pain-bottom-icon" src="@/static/images/index/comment.png"></image>
										<text class="pain-bottom-text">{{ u.comment_num }}</text>
									</view>
									<view class="pain-bottom-like" v-if="!u.ready_like" @click="handleChangeLike(u.id, 1)">
										<image class="pain-bottom-icon" src="@/static/images/index/like.png"></image>
										<text class="pain-bottom-text">{{ u.like_num }}</text>
									</view>
									<view class="pain-bottom-like active" v-else @click="handleChangeLike(u.id, 0)">
										<image class="pain-bottom-icon" src="@/static/images/index/like-color.png"></image>
										<text class="pain-bottom-text">{{ u.like_num }}</text>
									</view>
									<view class="pain-bottom-send" @click="handleComment(u)">
										回复
									</view>
								</view>
								<view class="pain-q-a-body-qa-item-comments" v-if="u.comment_num">
									<view class="comment-item last-item" v-if="!u.expand">
										<view class="comment-item-left">
											<image @click.stop="showView(u.comments[0].avatar)" class="comment-item-left-avatar" :src="u.comments[0].avatar ? baseUrl + u.comments[0].avatar : avatarDefault"></image>
										</view>
										<view class="comment-item-right">
											<view class="comment-item-right-info">
												<view class="comment-item-right-info-name" :class="{major: u.comments[0].authenticate === 1}">{{ u.comments[0].name || '森普健康用户' }}</view>
												<image v-if="u.comments[0].identity === 1" src="@/static/images/index/physician.png" class="comment-item-right-info-physician"></image>
												<image v-if="u.comments[0].authenticate === 1" src="@/static/images/index/auth.png" class="comment-item-right-info-auth"></image>
											</view>
											<view class="comment-item-right-content">
												<text class="comment-item-right-content-reply" v-if="u.comments[0].comment_id">回复 <text class="comment-item-right-content-reply-name">@{{ u.comments[0].to_name }}</text> 说：</text>
												{{ u.comments[0].comment_content }}
											</view>
											<view class="comment-item-right-bottom">
												<view class="comment-item-right-bottom-time">{{ u.comments[0].show_comment_time }}</view>
												<view class="comment-item-right-bottom-like" v-if="!u.comments[0].ready_like" @click="handleChangeCommentLike(u.comments[0].id, 1)">
													<image class="pain-bottom-icon" src="@/static/images/index/like.png"></image>
													<text class="pain-bottom-text">{{ u.comments[0].like_num }}</text>
												</view>
												<view class="comment-item-right-bottom-like active" v-else @click="handleChangeCommentLike(u.comments[0].id, 0)">
													<image class="pain-bottom-icon" src="@/static/images/index/like-color.png"></image>
													<text class="pain-bottom-text">{{ u.comments[0].like_num }}</text>
												</view>
												<view class="comment-item-right-bottom-back" @click="handleComment(u,u.comments[0])">回复</view>
											</view>
										</view>
									</view>
									<view class="comment-item-wrapper" v-else>
										<view class="comment-item" v-for="(u1,index1) in u.comments" :key="index1" :class="{'last-item': index1 === u.comments.length - 1}">
											<view class="comment-item-left">
												<image @click.stop="showView(u1.avatar)" class="comment-item-left-avatar" :src="u1.avatar ? baseUrl + u1.avatar : avatarDefault"></image>
											</view>
											<view class="comment-item-right">
												<view class="comment-item-right-info">
													<view class="comment-item-right-info-name" :class="{major: u1.authenticate === 1}">{{ u1.name || '森普健康用户' }}</view>
													<image v-if="u1.identity === 1" src="@/static/images/index/physician.png" class="comment-item-right-info-physician"></image>
													<image v-if="u1.authenticate === 1" src="@/static/images/index/auth.png" class="comment-item-right-info-auth"></image>
												</view>
												<view class="comment-item-right-content">
													<text class="comment-item-right-content-reply" v-if="u1.comment_id">回复 <text class="comment-item-right-content-reply-name">@{{ u1.to_name }}</text> 说：</text>
													{{ u1.comment_content }}
												</view>
												<view class="comment-item-right-bottom">
													<view class="comment-item-right-bottom-time">{{ u1.show_comment_time }}</view>
													<view class="comment-item-right-bottom-like" v-if="!u1.ready_like" @click="handleChangeCommentLike(u1.id, 1)">
														<image class="pain-bottom-icon" src="@/static/images/index/like.png"></image>
														<text class="pain-bottom-text">{{ u1.like_num }}</text>
													</view>
													<view class="comment-item-right-bottom-like active" v-else @click="handleChangeCommentLike(u1.id, 0)">
														<image class="pain-bottom-icon" src="@/static/images/index/like-color.png"></image>
														<text class="pain-bottom-text">{{ u1.like_num }}</text>
													</view>
													<view class="comment-item-right-bottom-back" @click="handleComment(u,u1)">回复</view>
												</view>
											</view>
										</view>
									</view>
									<view class="comments-line" @click="handleExpand(index)" v-if="u.comment_num > 1 && !u.expand"><text class="comments-line-in">---</text> 展开{{ u.comment_num - 1 }}条评论<u-icon name="arrow-down" color="#666666" size="16"></u-icon></view>
									<view class="comments-line" @click="handleExpand(index)" v-if="u.comment_num > 1 && u.expand"><text class="comments-line-in">---</text> 收起评论<u-icon name="arrow-up" color="#666666" size="16"></u-icon></view>
								</view>
							</view>
							
							<view class="pain-q-a-body-qa-item-major" v-if="u.is_major === 1">
								<image class="pain-q-a-body-qa-item-major-img" src="@/static/images/index/major-round.png"></image>
								<text class="pain-q-a-body-qa-item-major-text">专业</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="pain-q-a-body-zhanwei">
					<view class="pain-q-a-body-zhanwei-in"></view>
					<u-safe-bottom></u-safe-bottom>
				</view>
			</view>
		</scroll-view>
		<view class="action-bottom">
			<view class="action-bottom-in">
				<view class="action-bottom-item item-left" @click="handleReply">
					<image src="@/static/images/index/comment.png" class="item-img"></image>
					<text class="item-text">答复</text>
				</view>
				<view class="action-bottom-item item-right" v-if="!readyCollect" @click="handleChangeCollect(1)">
					<image src="@/static/images/index/collect.png" class="item-img"></image>
					<text class="item-text">收藏</text>
				</view>
				<view class="action-bottom-item item-right item-active" v-else @click="handleChangeCollect(0)">
					<image src="@/static/images/index/collect-color.png" class="item-img"></image>
					<text class="item-text">已收藏</text>
				</view>
				
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
		<pain-q-a-reply @ok="okReply" :info="info" ref="painQAReply"></pain-q-a-reply>
		<pain-q-a-comment @ok="okReply" :info="info" ref="painQAComment"></pain-q-a-comment>
	</view>
</template>

<script>
	import Vue from 'vue';
	import {
		getRepliesAction,
		getQuestionByIdAction,
		updateQuestionAction,
		updateQuestionCollectAction,
		updateReplyLikeAction,
		updateCommentLikeAction
	} from '@/service/service'
	import painQAReply from '@/pages_index/painQAReply.vue'
	import painQAComment from '@/pages_index/painQAComment.vue'
	import moment from 'moment'
	export default Vue.extend({
		components: {
			painQAReply,
			painQAComment
		},
		data() {
			return {
				info: {
					
				},
				replies: [],
				baseUrl: process.env.VUE_APP_API_BASE_URL + '/',
				avatarDefault: require('@/static/images/avatar-default.png'),
				commentEmptyImage: require('@/static/images/index/comment-empty.png'),
				readyLike: false,
				readyCollect: false,
				expandList: []
			};
		},
		computed: {
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		onLoad() {
			const that = this
			// #ifdef APP-NVUE
			const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			const eventChannel = this.getOpenerEventChannel();
			// #endif
			eventChannel.on('show', function(data) {
			    console.log(data)
				if(data.record) that.info = data.record
				const ids = (that.info.collect_user_ids || '').split(',')
				that.readyCollect = ids.includes(that.userInfo.id)
				that.loadReplies()
				that.$nextTick(() => {
					
				})
			})
		},
		methods: {
			handleExpand(index){
				if(!this.replies[index].expand){
					this.expandList.push(this.replies[index].id)
				}else{
					let spliceIndex = this.expandList.findIndex(id=>id===this.replies[index].id)
					this.expandList.splice(spliceIndex, 1)
				}
				this.replies[index].expand = !this.replies[index].expand
				console.log('this.replies change', this.replies)
				console.log('this.expandList', this.expandList)
			},
			okReply(){
				this.getQuestion()
				this.loadReplies()
			},
			handleReply(){
				this.$refs.painQAReply.open()
			},
			handleComment(reply, comment){
				this.$refs.painQAComment.open(reply, comment)
			},
			handleChangeCollect(status){
				this.$loadingOn()
				updateQuestionCollectAction(this.info.id, status).then(res=>{
					this.$loadingOff()
					this.okReply()
					this.$toast(status ? '已收藏' : '已取消收藏');
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleChangeLike(id, status){
				this.$loadingOn()
				updateReplyLikeAction(id, status).then(res=>{
					this.$loadingOff()
					this.okReply()
					this.$toast(status ? '已点赞' : '已取消点赞');
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			handleChangeCommentLike(id, status){
				this.$loadingOn()
				updateCommentLikeAction(id, status).then(res=>{
					this.$loadingOff()
					this.okReply()
					this.$toast(status ? '已点赞' : '已取消点赞');
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			getQuestion(){
				this.$loadingOn()
				getQuestionByIdAction(this.info.id).then(res=>{
					this.info = Object.assign(this.info, res.data)
					this.info.urls = this.info.image_data ? this.info.image_data.split(',').map(url=>this.baseUrl+url) : []
					if(moment(new Date(this.info.question_time), 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')){
						this.info.show_question_time = '今天 ' + moment(new Date(this.info.question_time), 'HH:mm').format('HH:mm')
					}else if(new Date().getFullYear() === new Date(this.info.question_time).getFullYear()){
						this.info.show_question_time = moment(new Date(this.info.question_time), 'MM-DD HH:mm').format('MM-DD HH:mm')
					}else{
						this.info.show_question_time = moment(new Date(this.info.question_time), 'YY-MM-DD HH:mm').format('YY-MM-DD HH:mm')
					}
					const ids = (this.info.collect_user_ids || '').split(',')
					this.readyCollect = ids.includes(this.userInfo.id)
					this.$loadingOff()
				}).catch(err=>{
					this.$loadingOff()
				})
			},
			loadReplies(){
				getRepliesAction(this.info.id).then(res=>{
					this.replies = res.data || []
					this.replies.map(item=>{
						this.$set(item, 'expand', false)
						if(this.expandList.includes(item.id)){
							item.expand = true
						}
						item.urls = item.image_data.split(',').map(url=>this.baseUrl+url)
						const ids = (item.like_user_ids || '').split(',')
						item.ready_like = ids.includes(this.userInfo.id)
						if(moment(new Date(item.reply_time), 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')){
							item.show_reply_time = '今天 ' + moment(new Date(item.reply_time), 'HH:mm').format('HH:mm')
						}else if(new Date().getFullYear() === new Date(item.reply_time).getFullYear()){
							item.show_reply_time = moment(new Date(item.reply_time), 'MM-DD HH:mm').format('MM-DD HH:mm')
						}else{
							item.show_reply_time = moment(new Date(item.reply_time), 'YY-MM-DD HH:mm').format('YY-MM-DD HH:mm')
						}
						item.comments.map(itemIn=>{
							const idsIn = (itemIn.like_user_ids || '').split(',')
							itemIn.ready_like = idsIn.includes(this.userInfo.id)
							if(moment(new Date(itemIn.comment_time), 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')){
								itemIn.show_comment_time = '今天 ' + moment(new Date(itemIn.comment_time), 'HH:mm').format('HH:mm')
							}else if(new Date().getFullYear() === new Date(itemIn.comment_time).getFullYear()){
								itemIn.show_comment_time = moment(new Date(itemIn.comment_time), 'MM-DD HH:mm').format('MM-DD HH:mm')
							}else{
								itemIn.show_comment_time = moment(new Date(itemIn.comment_time), 'YY-MM-DD HH:mm').format('YY-MM-DD HH:mm')
							}
						})
					})
					console.log('this.replies ========', this.replies)
				})
			},
			close() {
				uni.navigateBack()
			},
			leftClick() {
				this.close()
			},
			showView(url) {
				if(!url) return
				// 预览图片
				uni.previewImage({
					urls: [this.baseUrl + url],
					indicator: 'none'
				});
			},
		}
	})
</script>

<style lang="scss">
	.action-bottom{
		position: fixed;
		left: 0;
		bottom: 0;
		background: #f6f6f6;
		box-sizing: border-box;
		border-top: 1px solid #eee;
		width: 100%;
		
		.action-bottom-in{
			width: 100%;
			box-sizing: border-box;
			padding: 24rpx;
			display: flex;
			align-items: center;
		}
		
		.action-bottom-item{
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			color: #333;
			box-sizing: border-box;
			font-weight: 800;
			
			.item-img{
				width: 36rpx;
				height: 36rpx;
				margin-right: 8rpx;
			}
			
			&.item-left{
				width: 50%;
			}
			&.item-center{
				width: 33.3333%;                                            
				border-right: 1px solid #aaa;
				border-left: 1px solid #aaa;
			}
			&.item-right{
				border-left: 1px solid #aaa;
				width: 50%;
			}
			
			&.item-active{
				
				.item-img{
					animation: pulse; /* referring directly to the animation's @keyframe declaration */
					animation-duration: 1s; /* don't forget to set a duration! */
					animation-delay: 0.5s;
				}
				
				.item-text{
					animation: pulse; /* referring directly to the animation's @keyframe declaration */
					animation-duration: 1s; /* don't forget to set a duration! */
					animation-delay: 0.5s;
					color: #4F68B0;
				}
			}
		}
	}
	
	.pain-q-a-wrapper{
		width: 100vw;
		height: 100vh;
		
		.pain-q-a-box{
			width: 100%;
			height: 100%;
			background: #F6F6F6;
		}
		
		.pain-q-a-body{
			width: 100%;
			
			.pain-q-a-body-top{
				width: 100%;
				background: #fff;
				box-sizing: border-box;
				padding: 24rpx;
				position: relative;
			}
			
			.pain-q-a-body-bottom{
				width: 100%;
				background: #fff;
				box-sizing: border-box;
				
				.pain-q-a-body-back{
					width: 100%;
					height: 24rpx;
					background: #F6F6F6;
				}
			}
			
			.pain-q-a-body-zhanwei{
				width: 100%;
				
				.pain-q-a-body-zhanwei-in{
					width: 100%;
					height: 80rpx;
				}
			}
			
			.pain-q-a-body-info {
				display: flex;
				align-items: center;
				height: 80rpx;
				width: 100%;
			
				.info-avatar {
					width: 70rpx;
					height: 70rpx;
					margin-right: 24rpx;
					border-radius: 10rpx;
				}
			
				.info-user {
					display: flex;
					justify-content: space-between;
					height: 100%;
					flex-direction: column;
					font-size: 13px;
					
					.info-user-name{
						font-weight: 700;
					}
					
					.info-user-time{
						color: #aaa;
					}
				}
			}
			
			.pain-q-a-body-fee{
				margin-top: 24rpx;
				box-sizing: border-box;
				padding: 2rpx 6rpx;
				display: flex;
				align-items: center;
				border-radius: 12rpx;
				border: 1px solid #4F68B0;
				display: inline-block;
				vertical-align: middle;
				position: absolute;
				top: 24rpx;
				right: 24rpx;
				
				.fee-icon{
					width: 28rpx;
					height: 28rpx;
					margin-right: 8rpx;
					transform: translateY(4rpx);
				}
				
				.fee-text{
					font-size: 12px;
					font-weight: 800;
					color: #4F68B0;
				}
			}
			
			.pain-q-a-body-description{
				width: 100%;
				margin-top: 24rpx;
				font-size: 14px;
				
				.inner-title{
					width: 100%;
					font-size: 14px;
					font-weight: 700;
					margin-bottom: 12px;
				}
			}
			
			.pain-q-a-body-album{
				width: 100%;
				margin-top: 24rpx;
				font-size: 14px;
			}
			
			.pain-q-a-body-qa{
				width: 100%;
				margin-top: 24rpx;
				font-size: 14px;
				box-sizing: border-box;
				padding-bottom: 24rpx;
				
				.inner-title{
					width: 100%;
					font-size: 14px;
					font-weight: 700;
					margin-bottom: 12px;
					box-sizing: border-box;
					padding-left: 24rpx;
				}
				
				.pain-q-a-body-qa-item{
					width: 100%;
					box-sizing: border-box;
					padding: 0 24rpx 24rpx 24rpx;
					margin-bottom: 24rpx;
					position: relative;
					z-index: 2;
					display: flex;
					
					.pain-q-a-body-qa-item-left{
						width: 84rpx;
						box-sizing: border-box;
						padding-right: 24rpx;
						flex-shrink: 0;
						
						.info-avatar {
							width: 60rpx;
							height: 60rpx;
							margin-right: 24rpx;
							border-radius: 10rpx;
						}
					}
					
					.pain-q-a-body-qa-item-right{
						flex-grow: 1;
						border-bottom: 1px solid #eee;
						box-sizing: border-box;
						padding-bottom: 24rpx;
					}
					
					&.last .pain-q-a-body-qa-item-right{
						border-bottom: none;
					}
					
					.pain-q-a-body-qa-item-info{
						display: flex;
						align-items: center;
						height: 70rpx;
						width: 100%;
									
						.info-user {
							display: flex;
							justify-content: space-between;
							height: 100%;
							flex-direction: column;
							font-size: 12px;
							
							.info-user-name{
								font-weight: 700;
								display: flex;
								align-items: center;
								height: 30rpx;
								
								&.major{
									color: #FCA231;
								}
								
								.info-user-name-auth, .info-user-name-physician{
									width: 30rpx;
									height: 30rpx;
									margin-left: 8rpx;
								}
							}
							
							.info-user-time{
								color: #aaa;
							}
						}
					}
					
					.pain-q-a-body-qa-item-comment{
						width: 100%;
						font-size: 13px;
						margin-top: 12rpx;
					}
					
					.pain-q-a-body-qa-item-album{
						width: 100%;
						margin-top: 12rpx;
					}
					
					.pain-q-a-body-qa-item-comments{
						width: 100%;
						box-sizing: border-box;
						padding-left: 36rpx;
						margin-top: 24rpx;
						
						.comment-item-wrapper{
							width: 100%;
						}
						
						.comment-item{
							width: 100%;
							padding: 12rpx 0;
							box-sizing: border-box;
							display: flex;
							
							&.last-item{
								border-bottom: none;
							}
							
							.comment-item-left{
								width: 60rpx;
								box-sizing: border-box;
								padding-right: 12rpx;
								flex-shrink: 0;
								
								.comment-item-left-avatar{
									width: 48rpx;
									height: 48rpx;
									border-radius: 50%;
								}
							}
							
							.comment-item-right{
								flex-grow: 1;
								
								.comment-item-right-info{
									width: 100%;
									margin-bottom: 12rpx;
									display: flex;
									align-items: center;
									
									.comment-item-right-info-name{
										color: #7C7C7C;
										font-size: 12px;
										font-weight: bold;
										
										&.major{
											color: #FCA231;
										}
									}
									
									.comment-item-right-info-auth, .comment-item-right-info-physician{
										width: 30rpx;
										height: 30rpx;
										margin-left: 8rpx;
									}
								}
								
								.comment-item-right-content{
									width: 100%;
									font-size: 12px;
									color: #333;
									margin-bottom: 12rpx;
									
									.comment-item-right-content-reply{
										padding-right: 4rpx;
										color: #666;
										
										.comment-item-right-content-reply-name{
											font-weight: 800;
										}
									}
								}
								
								.comment-item-right-bottom{
									width: 100%;
									font-size: 12px;
									display: flex;
									align-items: center;
									color: #7C7C7C;
									
									.comment-item-right-bottom-time{
										margin-right: 24rpx;
										color: #999;
										font-size: 11px;
									}
									
									.comment-item-right-bottom-back{
										font-weight: 800;
										color: #333;
									}
									
									.comment-item-right-bottom-like{
										display: flex;
										align-items: center;
										margin-right: 24rpx;
										
										.pain-bottom-icon{
											width: 24rpx;
											height: 24rpx;
											margin-right: 4rpx;
										}
										
										.pain-bottom-text{
											color: #333;
										}
										
										&.active{
											color: #4F68B0;
										}
									}
								}
							}
						}
						
						.comments-line{
							width: 100%;
							display: flex;
							align-items: center;
							font-size: 13px;
							font-weight: bold;
							color: #666666;
							
							.comments-line-in{
								padding-right: 6rpx;
								color: #E9E9E9;
							}
						}
					}
					
					.pain-q-a-body-qa-item-bottom {
						width: 100%;
						display: flex;
						align-items: center;
						margin-top: 24rpx;
						
						.pain-bottom-send{
							font-size: 14px;
							font-weight: 800;
							color: #aaa;
						}
					
						.pain-bottom-reply,
						.pain-bottom-like {
							display: flex;
							align-items: center;
							margin-right: 24px;
					
							.pain-bottom-icon {
								width: 32rpx;
								height: 32rpx;
								margin-right: 8rpx;
							}
					
							.pain-bottom-text {
								font-size: 14px;
							}
						}
						
						.pain-bottom-like.active .pain-bottom-text{
							color: #4F68B0;
						}
						
						.pain-bottom-button{
							display: flex;
							align-items: center;
							padding: 2rpx 6rpx;
							border-radius: 12rpx;
							background: #4F68B0;
							
							.pain-bottom-text {
								font-size: 12px;
								color: #fff;
								font-weight: 800;
								padding-left: 4rpx;
							}
						}
					}
					
					.pain-q-a-body-qa-item-major{
						position: absolute;
						top: 0;
						right: 10%;
						box-sizing: border-box;
						border: 2px solid #FCA231;
						color: #FCA231;
						font-size: 13px;
						border-radius: 50%;
						transform: rotate(30deg);
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						width: 100rpx;
						height: 100rpx;
						opacity: 0.9;
						z-index: 3;
						
						&::after{
							content: ' ';
							display: block;
							width: 80rpx;
							height: 80rpx;
							border-radius: 50%;
							border: 1px dashed #FCA231;
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%,-50%) rotate(30deg);
						}
						
						.pain-q-a-body-qa-item-major-text{
							white-space: nowrap;
							font-weight: 800;
						}
						
						.pain-q-a-body-qa-item-major-img{
							width: 32rpx;
							height: 32rpx;
							margin-bottom: 6rpx;
						}
					}
				}
				
				
			}
		}
	}
</style>