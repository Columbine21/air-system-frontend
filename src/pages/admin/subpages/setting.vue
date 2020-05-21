<template>
  <div>
    <el-divider direction="vertical"></el-divider>
      <el-col :span="12">
        <el-card style="margin:8% 4vw; width: 80%;">
          <div slot="header">
            <span>系统设置</span>
            <el-button style="float: right; padding: 3px 0" type="text">应用</el-button>
          </div>
          <div style="margin-top: 4px; font-size: 13px">系统时间</div>
          <el-date-picker
            ref="date"
            v-model="Settings.Date"
            align="right"
            type="date"
            value-format="yyyy-MM-dd"
            style="margin-top: 10px; margin-left: 18%"
            placeholder="Please set the Date."
            >
          </el-date-picker>
          <el-switch style="margin: 20px 0 0 30%"
            v-model="Settings.State"
            active-text="开启"
            inactive-text="关闭">
          </el-switch>
        </el-card>
        <el-card style="margin:4vw; width: 80%;">
          <div slot="header">
            <span>中央空调状态</span>
          </div>
          <div>当前状态&ensp; :&ensp; {{Settings.State}}</div>
          <div style="margin-top: 3vh">默认模式&ensp; :&ensp; {{Mode}}</div>
          <div style="margin-top: 3vh">
            <span>温度控制</span>
            <el-slider style="margin: 0 1vw" v-model="Settings.temperature" :step='20' show-stops :marks="marksTemp">
            </el-slider>
          </div>
          <div style="margin-top: 3vh">
            <span>风速控制</span>
            <el-slider style="margin: 0 1vw" v-model="Settings.wind" :step='50' show-stops :marks="marksWind">
            </el-slider>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card style="margin-left: 4vw; margin-top: 2vw; width: 80%;">
          <div slot="header">
            <span>响应的从控机</span>
          </div>
          <el-table
            :data="tableData"
            max-height="200"
            style="width: 100%">
            <el-table-column
              prop="roomId"
              label="房间号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="temperature"
              label="设定温度"
              width="120">
            </el-table-column>
            <el-table-column
              prop="mode"
              label="设定风速">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
  </div>
</template>

<script>
export default {
  name: 'adminSettings'
}
</script>

<style lang="stylus" scoped>

</style>