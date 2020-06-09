<template>
  <div>
    <el-divider direction="vertical"></el-divider>
    <el-col :span="12">
      <el-card style="margin-left: 3.5vw; margin-top: 6vh; width: 80%;">
        <div slot="header">
          <span>系统设置</span>
          <el-button style="float: right; padding: 3px 0" @click="clear" type="text">撤销</el-button>
          <el-button style="float: right; padding: 3px 10px" type="text">应用</el-button>
        </div>
        <div style="margin-top: 4px; font-size: 14px">系统时间</div>
        <el-date-picker
          ref="date"
          v-model="SettingForm.systemTime"
          align="right"
          type="date"
          value-format="yyyy-MM-dd"
          style="margin-top: 10px; margin-left: 20%; width: 60%"
          placeholder="Please set the Date."
          >
        </el-date-picker>
        <div>
          <div style="margin-top: 4px; font-size: 14px">系统开关</div>
          <el-switch style="margin: 5% 0 0 36%"
            v-model="SettingForm.powerOn"
            active-text="开启"
            inactive-text="关闭">
          </el-switch>
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
    <el-col :span="12">
      <el-card style="margin-left: 3.5vw; margin-top: 6vh; width: 80%;">
        <div slot="header">
          <span>中央空调状态</span>
        </div>
        <div>当前状态&ensp; :&ensp; {{ShowPower}}</div>
        <div style="margin-top: 3vh">当前月份&ensp; :&ensp; {{Month}}, 推荐模式&ensp; : &ensp;{{RecommendMode}}</div>
        <div style="margin-top: 3vh">当前模式&ensp; :&ensp; {{ShowMode}} &ensp;</div>
        <div style="margin-top: 3vh">设定温度&ensp; :&ensp; {{MasterState.Settings.SetTemperature}}</div>
        <div style="margin-top: 3vh">刷新频率&ensp; :&ensp; {{MasterState.Settings.SetFrequence}}</div>
      </el-card>
    </el-col>
  </div>
</template>

<script>

export default {
  name: 'adminSettings',
  data () {
    return {
      SettingForm: {
        systemTime: null,
        powerOn: null,
        systemMode: null,
        temperature: null,
        refreshFrequence: null
      }
    }
  },
  methods: {
    clear () {
      this.SettingForm.systemTime = this.MasterState.Basic.SystemTime
      this.SettingForm.powerOn = this.MasterState.Basic.Poweron
      this.SettingForm.systemMode = this.MasterState.Basic.Mode
      this.SettingForm.temperature = this.MasterState.Settings.SetTemperature
      this.SettingForm.refreshFrequence = this.MasterState.Settings.SetFrequence
    }
  },
  computed: {
    MasterState () {
      return this.$store.state.MasterState
    },
    Month () {
      return Number(this.MasterState.Basic.SystemTime.split('-')[1])
    },
    RecommendMode () {
      if (this.Month >= 5 && this.Month <= 10) {
        return "制冷模式"
      } else {
        return "制热模式"
      }
    },
    ShowPower () {
      return this.MasterState.Basic.Poweron === false ? '待机状态' : '开启状态'
    },
    ShowMode () {
      return this.MasterState.Basic.Mode === false ? '制热模式' : '制冷模式'
    },
    TemperatureControlerMin () {
      return this.SettingForm.systemMode === false ? 24 : 18
    },
    TemperatureControlerMax () {
      return this.SettingForm.systemMode === false ? 31 : 25
    }
  },
  mounted () {
    this.clear()
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