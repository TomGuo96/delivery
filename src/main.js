import Vue from 'vue'
import App from './App'
import router from './router'
import Resource from 'vue-resource'
import 'common/stylus/index.styl' // 引入图标字体

Vue.config.productionTip = false
Vue.use(Resource) // 使用$http.get()方法

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
