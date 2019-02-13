import vuex from 'vuex'
import Vue from 'vue'
import wsData from './modules/wsData'
import resource from './modules/resource'
Vue.use(vuex)

export default new vuex.Store({
  modules:{
    wsData,
    resource
  }
});
