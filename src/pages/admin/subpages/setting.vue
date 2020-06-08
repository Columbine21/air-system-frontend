<template>
  <div>
    <el-card style="margin:5vh 20%; width: 60%;">
      <div slot="header">
        <span>系统设置</span>
        <el-button style="float: right; padding: 3px 0" type="text">应用</el-button>
      </div>
      <div style="margin-top: 4px; font-size: 13px">系统时间</div>
      <el-date-picker
        ref="date"
        v-model="MasterState.Basic.SystemTime"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        style="margin-top: 10px; margin-left: 30%"
        placeholder="Please set the Date."
        >
      </el-date-picker>
      <el-switch style="margin: 20px 0 0 40%"
        v-model="MasterState.Basic.Poweron"
        active-text="开启"
        inactive-text="关闭">
      </el-switch>
    </el-card>

    <el-card style="margin:5vh 20%; width: 60%;">
      <div slot="header">
        <span>中央空调状态</span>
        <el-button style="float: right; padding: 3px 0" type="text">应用</el-button>
      </div>
      <div>当前状态&ensp; :&ensp; {{MasterState.Basic.Poweron}}</div>
      <div style="margin-top: 3vh">默认模式&ensp; :&ensp; {{Mode}}</div>
      <div style="margin-top: 3vh">
        <span>温度控制</span>
        <el-slider style="margin: 0 1vw" v-model="MasterState.Settings.SetTemperature" :step='20' show-stops :marks="marksTemp">
        </el-slider>
      </div>
      <div style="margin-top: 3vh">
        <span>风速控制</span>
        <el-slider style="margin: 0 1vw" v-model="MasterState.Settings.SetMode" :step='50' show-stops :marks="marksWind">
        </el-slider>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'adminSettings',
  data () {
    return {
       marksWind: {
        0: 'low',
        50: 'medium',
        100: 'high'
      }
    }
  },
  computed: {
    MasterState () {
      return this.$store.state.MasterState
    },
    Mode () {
      const Season = Number(this.MasterState.Basic.SystemTime.split('-')[1])
      if (Season >= 5 && Season <= 10) {
        return "制冷模式"
      } else {
        return "制热模式"
      }
    },
    marksTemp () {
      const Season = Number(this.MasterState.Basic.SystemTime.split('-')[1])
      if (Season >= 5 && Season <= 10) {
        return { 
          0: '18°C',
					20: '19°C',
					40: '20°C',
					60: '21°C',
					80: '22°C',
					100: '23°C'
				}
      } else {
        return {
          0: '26°C',
					20: '27°C',
					40: '28°C',
					60: '29°C',
					80: '30°C',
					100: '31°C'
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>