const auth = {
	state: {
		authStatus: true,
		authPageOptions: {
			show: false
		}
	},
	mutations: {
		SET_AUTH_STATUS: (state, status) => {
			state.authStatus = status
			if(!status){
				uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
			}
		},
		SET_AUTH_PAGE_OPTIONS: (state, options) => {
			state.authPageOptions.show = options.show
			if(!options.show){
				uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
			}
		}
	},
	actions: {
		setAuthStatus({commit}, status){
			commit('SET_AUTH_STATUS', status)
		},
		setAuthPageOptions({commit}, options){
			commit('SET_AUTH_PAGE_OPTIONS', options)
		}
	}
}

export default auth;