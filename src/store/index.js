import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const defaultName = 'Jason';
const defaultUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const defaultWorkStatus = 'CLOSE'
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
const defaultError = 0
const MAXTemp = 31
const defaultTotalEnergy = 0
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
		WorkStatus: defaultWorkStatus,
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
			TotalEnergy: defaultTotalEnergy,
			UseTime: defaultUseTime,
			ASstate: defaultASstate, // 送风 等待送风 待机 关机
			State: defaultState // 制冷 制热
		},
		Settings: {
			SetTemperature: defaultTemperature,
			SetWind: defaultWind
		},
		Error: defaultError
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
	  state.MasterState.Basic.WorkStatus = MasterInfo.WorkStatus
      state.MasterState.Settings.SetTemperature = MasterInfo.SetTemperature
      state.MasterState.Settings.SetFrequence = MasterInfo.SetFrequence
    },
	SetSlaveState (state, SlaveInfo) {
		var wind = 0
		switch (SlaveInfo.slave.wind) {
			case 'LOW':
				wind = 0
				break;
			case 'MEDIUM':
				wind = 50
				break;
			case 'HIGH':
				wind = 100
				break;
			default:
				break;
		}
		state.SlaveState.Settings.SetWind = wind
		var state0 = '关机'
		switch (SlaveInfo.slave.state) {
			case 'CLOSE':
				state0 = '关机'
				break;
			case 'RUNNING':
				state0 = '送风'
				break;
			case 'WAITING':
				state0 = '待机'
				break;
			default:
				break;
		}
		state.SlaveState.Basic.ASstate = state0
		state.SlaveState.Settings.SetTemperature = SlaveInfo.slave.targetT
		state.SlaveState.Basic.Temperature = SlaveInfo.temperature
		state.SlaveState.Basic.TotalMoney = SlaveInfo.slave.prevPrice
		state.SlaveState.Basic.TotalEnergy = SlaveInfo.slave.prevP
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
	  state.MasterState.Settings.SetTemperature = SettingInfo.Temp
	  state.MasterState.Basic.Mode = SettingInfo.Mode
	  state.SlaveState.Basic.State = SettingInfo.Mode
	  console.log('1 ' + state.SlaveState.Basic.State)
	},
	UpdateSlaveTime(state, time) {
	  state.SlaveState.Basic.UseTime = time + state.SlaveState.Basic.UseTime
	},
	UpdateSlaveTemp(state, temp) {
	  if (temp <= MAXTemp) state.SlaveState.Basic.Temperature = temp
	  else state.SlaveState.Basic.Temperature = MAXTemp
	},
	UpdateSlaveTotalMoney(state, money) {
	  state.SlaveState.Basic.TotalMoney = money
	},
	UpdateSlaveError(state, error) {
	  state.SlaveState.Error = error
	}
  }
})
