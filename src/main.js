import Vue from 'vue'
import App from './App.vue'

import uView from "uview-ui";
Vue.use(uView);

import store from "@/store/index"

Vue.prototype.$store = store

Vue.prototype.$toast  = function(message,icon){
	uni.showToast({
		title: message,
		icon: icon ? icon : 'none'
	})
}

Vue.prototype.$loadingOn  = function(){
	uni.showLoading({
		title: '',
		mask: true
	})
}

Vue.prototype.$loadingOff  = function(){
	uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
//挂载
    store
})
app.$mount();
