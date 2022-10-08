<script>
    import Vue from 'vue';
	import {
		getUserInfoByUsernameAction
	} from '@/service/service'
    export default {
        mpType: 'app',
		data(){
			return {
				info: {
					id: 0,
					money_avatar: '',
					money_background: '',
					user_id: 0
				}
			}
		},
		onLaunch() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
			const that = this
			uni.getSystemInfo({
			    success(e) {
					console.log('success ------')
			        let barHeight = 0;
			        // #ifdef APP-PLUS  
					console.log('APP-PLUS')
			        if (e.platform == 'android') {
			            barHeight = e.statusBarHeight + 50
			        } else {
			            barHeight = e.statusBarHeight + 45
			        }
			        // #endif
					
			        // #ifdef MP-WEIXIN  
			        let custom = wx.getMenuButtonBoundingClientRect()
			        barHeight = custom.bottom + custom.top - e.statusBarHeight
			        // #endif  
					
			        // #ifdef MP-ALIPAY  
			        barHeight = e.statusBarHeight + e.titleBarHeight
			        // #endif
					
			        // 本地缓存
			        console.log('barHeight',barHeight)
					if(!uni.getStorageSync('SYS_AUTH_TOKEN_KEY')){
						console.log('if=====================')
						that.$store.dispatch('setAuthStatus', false)
					}
					setTimeout(() => {
						plus.navigator.closeSplashscreen();
					}, 2000)
			    },
				fail(e){
					console.log('faile ------')
				}
			})
		},
		onShow(){
			if (uni.getStorageSync('SYS_USER_INFO') && uni.getStorageSync('SYS_USER_INFO').id) {
				this.$store.dispatch('setUserInfo', uni.getStorageSync('SYS_USER_INFO'))
			}
			if (uni.getStorageSync('SYS_AUTH_TOKEN_KEY')) {
				this.$store.dispatch('getUserInfo')
				this.$store.dispatch('getInfo')
			}
		},
		computed: {
			authStatus(){
				return this.$store.state.auth.authStatus
			},
			userInfo(){
				return this.$store.state.user.userInfo
			}
		},
		watch: {
			/* authStatus(){
				if(!this.authStatus){
					console.log('==================== relaunch ==================')
					setTimeout(()=>{
						uni.reLaunch({
							url: "/pages/guard/index?notAuth=1"
						})
					},1000)
				}
			}, */
			authStatus:{
				handler(){
					if(!this.authStatus){
						uni.hideTabBar()
					}else{
						uni.showTabBar()
					}
				},
				immediate: true
			}
		}
    };
</script>

<style>

</style>
