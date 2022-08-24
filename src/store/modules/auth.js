const auth = {
	state: {
		authStatus: true
	},
	mutations: {
		SET_AUTH_STATUS: (state, status) => {
			state.authStatus = status
			if(!status){
				uni.removeStorageSync('SYS_AUTH_TOKEN_KEY')
			}
		}
	},
	actions: {
		setAuthStatus({commit}, status){
			commit('SET_AUTH_STATUS', status)
		}
	}
}

export default auth;