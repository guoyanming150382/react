import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import Viser from 'viser-vue'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import global_ from './global'

if(process.env.NODE_ENV == "development"){  //文件上传
  Vue.prototype.UPLOAD_URL = "/dev"
}else if(process.env.NODE_ENV == "production"){
  Vue.prototype.UPLOAD_URL = "/prod"
}

Vue.prototype.GLOBAL = global_
/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

 // 富文本
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(MintUI)
Vue.use(Viser) 
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
