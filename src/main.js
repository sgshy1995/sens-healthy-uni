import Vue from 'vue'
import App from './App.vue'

import SAlbum from '@/components/album/s-album.vue'
Vue.component('s-album',SAlbum)

import uView from "uview-ui";
Vue.use(uView);

import store from "@/store/index"

Vue.prototype.$store = store

Vue.prototype.$toast  = function(message,icon,duration){
	uni.showToast({
		title: message,
		icon: icon ? icon : 'none',
		duration: duration ? duration : 2000
	})
}

Vue.prototype.$loadingOn  = function(title){
	uni.showLoading({
		title: title ? title : '',
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
