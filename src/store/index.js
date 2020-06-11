import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const defaultName = 'Jason';
const defaultUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const defaultPoweron = false
const defaultMode = true
const defaultSystemTime = '2020-5-24'
const defaultTemperature = 22
const defaultFrequence = 10000
const defaultToken = ''
const defaultRoomNo = '101'
const defaultASstate = '关机'
const defaultWind = 0
const defaultTotalMoney = 0
const defaultUseTime = 0
const defaultState = '制冷'
const defaultSlaveTemp = 27
// const defaultMode = 50

export default new Vuex.Store({
  state: {
    UserInfo: {
      name: defaultName,
      avaterUrl: defaultUrl,
	  token: defaultToken
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
    },
	SlaveState: {
		Basic: {
			RoomNo: defaultRoomNo,
			Temperature: defaultSlaveTemp,
			TotalMoney: defaultTotalMoney,
			UseTime: defaultUseTime,
			ASstate: defaultASstate, // 送风 等待送风 待机 关机
			State: defaultState // 制冷 制热
		},
		Settings: {
			SetTemperature: defaultTemperature,
			SetWind: defaultWind
		}
	}
  },
  mutations: {
    Login (state, UserInfo) {
      state.UserInfo.name = UserInfo.userName
      state.UserInfo.avaterUrl = UserInfo.avaterUrl
	  state.UserInfo.token = UserInfo.token
	  state.SlaveState.Basic.RoomNo = UserInfo.roomNo
    },
    Logout (state) {
      state.UserInfo.name = defaultName
      state.UserInfo.avaterUrl = defaultUrl
    },
    SetMasterState (state, MasterInfo) {
      state.MasterState.Basic.Poweron = MasterInfo.Poweron
      state.MasterState.Basic.Mode = MasterInfo.Mode
    //   state.MasterState.Basic.SystemTime = MasterInfo.SystemTime
      state.MasterState.Settings.SetTemperature = MasterInfo.SetTemperature
      state.MasterState.Settings.SetFrequence = MasterInfo.SetFrequence
    },
	UpdateSetFrequence(state, SetFrequence) {
	  state.MasterState.Settings.SetFrequence = SetFrequence
	},
	UpdateASstate(state, ASstate) {
	  state.SlaveState.Basic.ASstate = ASstate
	},
	UpdateSlaveSettings(state, SettingInfo) {
	  state.SlaveState.Settings.SetTemperature = SettingInfo.Temp
	  state.SlaveState.Settings.SetWind = SettingInfo.Wind
	},
	UpdateMasterState(state, SettingInfo) {
	  state.MasterState.SetTemperature = SettingInfo.Temp
	  state.MasterState.Basic.Mode = SettingInfo.Mode
	},
	UpdateSlaveTime(state, time) {
	  state.SlaveState.Basic.UseTime = time + state.SlaveState.Basic.UseTime
	},
	UpdateSlaveTemp(state, temp) {
	  state.SlaveState.Basic.Temperature = temp
	},
	UpdateSlaveTotalMoney(state, money) {
	  state.SlaveState.Basic.TotalMoney = money
	}
  }
})
