<template>
  <div>
    <el-divider direction="vertical"></el-divider>
    <el-col :span="12">
      <el-card style="margin-left: 3.5vw; margin-top: 6vh; width: 80%;">
        <div slot="header">
          <span>系统设置</span>
        </div>
        <!-- <div style="margin-top: 4px; font-size: 14px">系统时间</div>
        <el-date-picker
          ref="date"
          v-model="SettingForm.systemTime"
          align="right"
          type="date"
          value-format="yyyy-MM-dd"
          style="margin-top: 10px; margin-left: 20%; width: 60%"
          placeholder="Please set the Date."
          >
        </el-date-picker> -->
        <div>
          <div style="margin-top: 4px; font-size: 14px">系统开关</div>
          <el-switch style="margin: 5% 0 0 36%"
            v-model="MasterState.Basic.Poweron"
            @change="SwitchReq"
            active-text="开启"
            inactive-text="关闭">
          </el-switch>
        </div>
        <el-collapse accordion style="margin-top:3vh">
          <el-collapse-item title="当前主控状态">
            <div>
              <div style="font-size: 14px">工作模式</div>
              <el-radio-group v-model="SystemWorkMode" style="margin-top: 3vh; margin-top: 3vh;margin-left: 15%" disabled>
                <el-radio :label="0">关闭状态</el-radio>
                <el-radio :label="1">待机状态</el-radio>
                <el-radio :label="2">工作状态</el-radio>
              </el-radio-group>
            </div>
            <div>
              <div style="margin-top: 4px; font-size: 14px">系统模式</div>
              <el-switch style="margin: 5% 0 0 36%"
                v-model="MasterState.Basic.Mode"
                disabled
                active-text="制冷"
                inactive-text="制热">
              </el-switch>
            </div>
            <div>温度控制</div> 
            <div style="margin-top: 3vh; text-align: center">
              
              <el-input-number disabled v-model="MasterState.Settings.SetTemperature" :min="TemperatureControlerMin" :max="TemperatureControlerMax"/>
            </div>
            <div style="margin-top: 3vh">
              <div>刷新频率</div>
              <el-input  disabled style="margin: 1vh 20%; width: 60%" placeholder="刷新频率(单位s)" v-model="transformedFrequence" />
            </div>
            <el-button type="primary" style="width: 40%;margin-top:2vh; margin-left:30%" @click="ShowModify">修改主控详细设置</el-button>
          </el-collapse-item>
        </el-collapse>
        
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="margin-left: 3.5vw; margin-top: 6vh; width: 80%;" v-show="showModifySection">
        <div slot="header">
          <span>更细系统设置</span>
          <el-button style="float: right; padding: 3px 0" @click="clear" type="text">撤销</el-button>
          <el-button style="float: right; padding: 3px 10px" @click="submit" type="text">应用</el-button>
        </div>

        <div>
          <div style="margin-top: 4px; font-size: 14px">系统模式</div>
          <el-switch style="margin: 5% 0 0 36%"
            v-model="SettingForm.systemMode"
            active-text="制冷"
            inactive-text="制热">
          </el-switch>
        </div>
        <div>温度控制</div> 
        <div style="margin-top: 3vh; text-align: center">
          
          <el-input-number v-model="SettingForm.temperature" :min="TemperatureControlerMin" :max="TemperatureControlerMax"/>
        </div>
        <div style="margin-top: 3vh">
          <div>刷新频率</div>
          <el-input  style="margin: 1vh 20%; width: 60%" placeholder="刷新频率(单位s)" v-model="SettingForm.refreshFrequence" clearable />
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'adminSettings',
  data () {
    return {
      showModifySection: false,
      SettingForm: {
        // systemTime: null,
        powerOn: null,
        systemMode: null,
        temperature: null,
        refreshFrequence: null
      },
      Timer: {
        timer0: null
      }
    }
  },
  methods: {
    ShowModify () {
      this.showModifySection = true
      this.SettingForm.powerOn = this.MasterState.Basic.Poweron
      this.SettingForm.systemMode = this.MasterState.Basic.Mode
      this.SettingForm.temperature = this.MasterState.Settings.SetTemperature
      this.SettingForm.refreshFrequence = this.transformedFrequence
    },
    clear () {
      this.showModifySection = false

      this.SettingForm.systemMode = this.MasterState.Basic.Mode
      this.SettingForm.temperature = this.MasterState.Settings.SetTemperature
      this.SettingForm.refreshFrequence = this.transformedFrequence
    },
    submit () {
      let tmpMode = this.SettingForm.systemMode === true ? 'COOL' : 'HEAT'
      console.log(tmpMode, this.SettingForm.refreshFrequence, this.SettingForm.temperature)
      axios({
            method: 'post',
            url: '/master/set',
            headers: { 
              'Authorization': this.Manager.token
            },
            data: {
              'mode': tmpMode,
              'freq': this.SettingForm.refreshFrequence * 1000,
              't': this.SettingForm.temperature
            }
          }).then(this.getSetModeRes)
      this.showModifySection = false
    },
    getSetModeRes (res) {
      console.log(res.data);
      let refreshFrequence = this.SettingForm.refreshFrequence * 1000
      if (res.data.code === 200) {
        this.$store.commit('SetMasterState',{
          'Poweron': this.MasterState.Basic.Poweron,
          'Mode': this.SettingForm.systemMode, 
          'WorkStatus': this.MasterState.Basic.WorkStatus,
          'SetTemperature': this.SettingForm.temperature,
          'SetFrequence': refreshFrequence
        })
        // this.$store.commit('Login', {userName: res.data.data.adminId, avaterUrl: url})
      } else {
        alert('Set Failed !')
      } 
    },
    initStatus (res) {
      // console.log("auto set status")
      // console.log(res.data.data)
      let statuson = res.data.data.state === "CLOSE" ? false : true
      // if (res.data.data.state === "RUNNING") {
      //   var statuson = true
      // } else if (res.data.data.state === "WAITING") {
      //   var statuson = true
      // } else if (res.data.data.state === "CLOSE") {
      //   var statuson = false
      // }

      let statusmode = res.data.data.mode === "COOL" ? true : false
      let temperature = res.data.data.ct
      let frequence = res.data.data.interval_ms
      this.$store.commit('SetMasterState', {
        'Poweron': statuson,
        'Mode': statusmode,
        'WorkStatus': res.data.data.state,
        'SetTemperature': temperature,
        'SetFrequence': frequence
        })
    },
    SwitchReq () {
      if (this.MasterState.Basic.Poweron === true) {
        axios({
          method: 'get',
          url: '/master/start',
          headers: {'Authorization': this.Manager.token}
        }).then(this.getSwitchRes)
      } else {
        axios({
          method: 'get',
          url: '/master/close',
          headers: {'Authorization': this.Manager.token}
        }).then(this.getSwitchRes)
      }
    },
    getSwitchRes (res) {
      console.log(res.data.data)
      if(res.data.code === 200) {
        if (this.MasterState.Basic.Poweron === true) {
          
          this.$alert('开启中央空调成功', {
          confirmButtonText: '确定'
          })
        } else {
          this.$alert('关闭中央空调成功', {
          confirmButtonText: '确定'
          })
        }
      }
    },
    getMasterStatus () {
      axios.get('/master/status', { headers: { 'Authorization': this.Manager.token}}).then(this.initStatus)
    }
  },
  computed: {
    Manager () {
      return this.$store.state.UserInfo
    },
    MasterState () {
      return this.$store.state.MasterState
    },
    TemperatureControlerMin () {
      return this.SettingForm.systemMode === false ? 24 : 18
    },
    TemperatureControlerMax () {
      return this.SettingForm.systemMode === false ? 31 : 25
    }, 
    transformedFrequence () {
      return this.MasterState.Settings.SetFrequence / 1000
    },
    SystemWorkMode () {
      if (this.MasterState.Basic.WorkStatus === "CLOSE") {
        return 0
      } else if (this.MasterState.Basic.WorkStatus === "WAITING") {
        return 1
      } else {
        return 2
      }  
    }
  },
  mounted () {
    this.getMasterStatus()
    this.Timer.timer0 = setInterval(this.getMasterStatus, 500)
  },
  beforeDestroy () {
    clearInterval(this.Timer.timer0)
    this.Timer.timer0 = null
  }
}
</script>

<style lang="stylus" scoped>
.el-divider--vertical {
    position: absolute;
    height: 100%;
    left: 58%;
    margin: 0;
  }
</style>