const history = {
	state: {
		info: {
			id: '',
			recent_num: 0,
			recent_progress: ''
		}
	},
	mutations: {
		setHistoryInfo(state, info){
			state.info = info
		}
	},
	actions: {
		changeHistoryInfo({commit}, info){
			commit('setHistoryInfo', info)
		}
	}
}

export default history;