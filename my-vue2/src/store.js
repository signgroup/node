import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:localStorage.getItem('accessToken')?localStorage.getItem('accessToken'):'',
    userInfo:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):'',
  },
  mutations: {
      addLogin(state, val) {
          console.log('state',state)
          console.log('val',val)
          state.token = val.token
          state.userInfo = val.userInfo
          localStorage.setItem('accessToken',val.token)
          localStorage.setItem('userInfo',JSON.stringify(val.userInfo))
      },
      remoteLogin(state){
          state.token =''
          state.userInfo =''
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userInfo')
      }

  },
  actions: {

  }
})
