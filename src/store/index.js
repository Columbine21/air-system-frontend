import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const defaultName = 'Jason';
const defaultUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const defaultPoweron = false
const defaultMode = true
const defaultSystemTime = '2020-5-24'
const defaultTemperature = 20
const defaultFrequence = 10
// const defaultMode = 50

export default new Vuex.Store({
  state: {
    UserInfo: {
      name: defaultName,
      avaterUrl: defaultUrl
    },
    MasterState: {
      Basic: {
        Poweron: defaultPoweron,
        Mode: defaultMode,
        SystemTime: defaultSystemTime
      },
      Settings: {
        SetTemperature: defaultTemperature,
        SetFrequence: defaultFrequence
      }
    }
  },
  mutations: {
    Login (state, UserInfo) {
      state.UserInfo.name = UserInfo.userName
      state.UserInfo.avaterUrl = UserInfo.avaterUrl
    },
    Logout (state) {
      state.UserInfo.name = defaultName
      state.UserInfo.avaterUrl = defaultUrl
    },
    SetMasterState (state, MasterInfo) {
      state.MasterState.Basic.Poweron = MasterInfo.Poweron
      state.MasterState.Basic.Mode = MasterInfo.Mode
      state.MasterState.Basic.SystemTime = MasterInfo.SystemTime
      state.MasterState.Settings.SetTemperature = MasterInfo.SetTemperature
      state.MasterState.Settings.SetFrequence = MasterInfo.SetFrequence
    }
  }
})
