<template>
	<view class="s-show-more">
		<view class="s-show-more-in" v-if="content.length > length">
			<text class="s-show-more-ellipse" v-if="ellipse">{{ content_ellipse + '...' }}</text>
			<text class="s-show-more-text" v-else>{{ content }}</text>
			<text class="s-show-more-button" @click="handleEllipse(0)" v-if="ellipse">展开</text>
			<text class="s-show-more-button" @click="handleEllipse(1)" v-else>收起</text>
		</view>
		<view class="s-show-more-in" v-else>
			<text class="s-show-more-text">{{ content }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				ellipse: true
			}
		},
		props: {
			content: {
				type: String,
				reqiured: true
			},
			length: {
				type: Number,
				default: 50
			},
		},
		computed: {
			content_ellipse(){
				return this.content.slice(0,this.length)
			}
		},
		methods: {
			handleEllipse(status){
				this.ellipse = !!status
			}
		}
	}
</script>

<style lang="scss">
	.s-show-more{
		width: 100%;
		
		.s-show-more-in{
			width: 100%;
			color: #656565;
			font-size: 13px;
		}
		
		.s-show-more-button{
			color: #e4b59f;
			padding-left: 4rpx;
			white-space: nowrap;
			box-sizing: border-box;
		}
	}
</style>