import {
		getUserInfoByJWTAction,
		getInfoByUserIdAction,
		getInfoByJwtAction
	} from '@/service/service'
const user = {
	state: {
		userInfo: {
			id: null,
			username: null,
			name: null,
			avatar: null,
			background: null,
			gender: null,
			phone: null,
			identity: null,
			authenticate: null,
			wx_unionid: null,
			wx_nickname: null,
			recent_login_time: null,
			status: null,
			created_at: null,
			updated_at: null
		},
		info: {
			id: null,
			user_id: null,
			integral: null,
			balance: null,
			age: null,
			injury_history: null,
			injury_recent: null,
			discharge_abstract: null,
			image_data: null,
			default_address_id: null,
			default_address_info: {
				id: null,
				user_id: null,
				province_code: null,
				city_code: null,
				area_code: null,
				detail_text: null,
				all_text: null,
				phone: null,
				name: null,
				tag: null,
				status: null,
				created_at: null,
				updated_at: null
			},
			status: null,
			created_at: null,
			updated_at: null
		}
	},
	mutations: {
		SET_USER_INFO: (state, info) => {
			state.userInfo = info
		},
		SET_INFO: (state, info) => {
			state.info = info
		}
	},
	actions: {
		setUserInfo({commit}, info){
			commit('SET_USER_INFO', info)
		},
		setInfo({commit}, info){
			commit('SET_INFO', info)
		},
		resetUserInfo({commit}){
			commit('SET_USER_INFO', {
				id: null,
				username: null,
				name: null,
				avatar: null,
				background: null,
				gender: null,
				phone: null,
				identity: null,
				authenticate: null,
				wx_unionid: null,
				wx_nickname: null,
				recent_login_time: null,
				status: null,
				created_at: null,
				updated_at: null
			})
		},
		getUserInfo({commit}){
			return new Promise((reslove, reject) => {
				getUserInfoByJWTAction().then(res => {
					//this.close()
					console.log('获取成功', res.data)
					uni.setStorageSync('SYS_USER_INFO', res.data)
					commit('SET_USER_INFO', res.data)
					reslove(res.data)
				}).catch((err) => {
					commit('SET_USER_INFO', {
						id: null,
						username: null,
						name: null,
						avatar: null,
						background: null,
						gender: null,
						phone: null,
						identity: null,
						authenticate: null,
						wx_unionid: null,
						wx_nickname: null,
						recent_login_time: null,
						status: null,
						created_at: null,
						updated_at: null
					})
					uni.removeStorageSync('SYS_USER_INFO')
					uni.removeStorageSync('SYS_INFO')
					reject(err)
				})
			})
		},
		getInfo({commit}){
			return new Promise((reslove, reject) => {
				getInfoByJwtAction().then(res => {
					//this.close()
					console.log('获取成功', res.data)
					uni.setStorageSync('SYS_INFO', res.data)
					commit('SET_INFO', res.data)
					reslove(res.data)
				}).catch((err) => {
					commit('SET_INFO', {
						id: null,
						user_id: null,
						integral: null,
						balance: null,
						age: null,
						injury_history: null,
						injury_recent: null,
						discharge_abstract: null,
						image_data: null,
						default_address_id: null,
						default_address_info: {
							id: null,
							user_id: null,
							province_code: null,
							city_code: null,
							area_code: null,
							detail_text: null,
							all_text: null,
							phone: null,
							name: null,
							tag: null,
							status: null,
							created_at: null,
							updated_at: null
						},
						status: null,
						created_at: null,
						updated_at: null
					})
					uni.removeStorageSync('SYS_INFO')
					reject(err)
				})
			})
		}
	}
}

export default user;