import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)
Vue.config.productionTip = false

new Vue({
  el: "#app",
  render: h => h(require("./App").default)
})
