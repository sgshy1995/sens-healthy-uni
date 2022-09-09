<template>
	<view class="s-album" v-show="urls.length">
		<view class="s-album__multi" v-if="urls.length > 1">
			<view class="s-album__row" :style="{height: multiHeight}" v-for="(u,index) in urlsShow" :key="index">
				<view class="s-album__item" v-for="(u1,index1) in u" :key="index1">
					<view class="s-album__item__in" :class="{last: index1 === 2}">
						<image mode="aspectFill" @tap="onPreviewTap(u1)" :src="u1" class="s-album__item__in__image"></image>
						<view class="s-album__item__in__more" @tap="onPreviewTap(urls[max - 1])" v-if="urls.length > max && index === urlsShow.length - 1 && index1 === u.length - 1">
							<text class="s-album__item__in__more__text">+{{ urls.length - max  }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="s-album__single" :style="{height: singleHeight}" v-else>
			<image mode="aspectFill" @tap="onPreviewTap(urls[0])" :src="urls[0]" class="s-album__single__image"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		props: {
			urls: {
				type: Array,
				default(){
					return []
				}
			},
			multiHeight: {
				type: Number | String,
				default: '150rpx'
			},
			singleHeight: {
				type: Number | String,
				default: '180rpx'
			},
			max: {
				type: Number,
				default: 9
			},
		},
		computed: {
			urlsShow(){
				const length = (this.max > 0 && this.max <= 3) ? 1 : (this.max > 3 && this.max <= 6) ? 2 : (this.max > 6 && this.max <= 9) ? 3 : 3
				return this.group(this.urls,3).slice(0, length)
			}
		},
		watch: {
			urlsShow: {
				handler(){
					console.log('urlsShow', this.urlsShow)
				},
				deep: true
			}
		},
		methods: {
			group(array, subGroupLength) {
			    var index = 0;
			    var newArray = [];
			    while(index < array.length) {
			        newArray.push(array.slice(index, index += subGroupLength));
			    }
			    return newArray;
			},
			// 预览图片
			onPreviewTap(url) {
			    uni.previewImage({
			        current: url,
			        urls: [...this.urls]
			    })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.s-album{
		width: 100%;
		
		&__multi{
			width: 100%;
		}
		
		&__single{
			width: 100%;
			
			&__image{
				width: 50%;
				height: 100%;
			}
		}
		
		&__row{
			width: 100%;
			display: flex;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 12rpx;
		}
		
		&__item{
			width: 33.3333%;
			height: 100%;
			box-sizing: border-box;
			padding-right: 12rpx;
			
			&.last{
				padding-right: 0;
			}
			
			&__in{
				width: 100%;
				height: 100%;
				position: relative;
				
				&__image{
					width: 100%;
					height: 100%;
				}
				
				&__more{
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background: rgba(0,0,0,0.6);
					z-index: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					
					&__text{
						color: #fff;
					}
				}
			}
		}
		
	}
</style>