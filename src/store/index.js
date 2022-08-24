import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import global from '@/store/modules/global.js'
import auth from '@/store/modules/auth.js'
import user from '@/store/modules/user.js'

const store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
	modules: {
		global,
		auth,
		user
	}
})
export default store