import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const defaultName = 'Jason';
const defaultUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const defaultPoweron = false
const defaultSystemTime = '2020-5-24'
const defaultTemperature = 20
const defaultMode = 50

export default new Vuex.Store({
  state: {
    count: 0,
    UserInfo: {
      name: defaultName,
      avaterUrl: defaultUrl
    },
    MasterState: {
      Basic: {
        Poweron: defaultPoweron,
        SystemTime: defaultSystemTime
      },
      Settings: {
        SetTemperature: defaultTemperature,
        SetMode: defaultMode
      }
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    Login (state, userName, avaterUrl) {
      state.UserInfo.name = userName
      state.UserInfo.avaterUrl = avaterUrl
    },
    Logout (state) {
      state.UserInfo.name = defaultName
      state.UserInfo.avaterUrl = defaultUrl
    },
    SetMasterBasic (state, Poweron, SystemTime) {
      state.MasterState.Basic.Poweron = Poweron
      state.MasterState.Basic.SystemTime = SystemTime
    },
    SetMasterSetttings (state, SetTemperature, SetMode) {
      state.MasterState.Settings.SetTemperature = SetTemperature
      state.MasterState.Settings.SetMode = SetMode
    }
  }
})
