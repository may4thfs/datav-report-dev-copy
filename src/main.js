import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/vcharts'
import ECharts from 'echarts'
import VueECharts from 'vue-echarts'
import './style/index.css'

Vue.config.productionTip = false
// 将 ECharts 放到原型链上，方便使用（之后每个组件就不要再导入了）
Vue.prototype.$echarts = ECharts
// 全局注册组件
Vue.component('v-chart', VueECharts)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
