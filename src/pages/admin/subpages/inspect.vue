<template>
  <div>
    <el-card style="margin-left: 3.4%; margin-top: 6vh; width: 92.8%;">
      <div slot="header">
          <span>监控面板</span>
          <el-button style="float: right; padding: 3px 0" type="text">Refresh</el-button>
        </div>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="从控机当前状态" name="1">
          <el-table :data="inspectInfo.form.record" height="400" style="margin-left:5%;width: 90%" stripe border>
            <el-table-column prop="roomId" label="房间号码" width="120" />
            <el-table-column prop="" label="当前温度" width="120" />
            <el-table-column prop="temperature" label="设定温度" width="120" />
            <el-table-column prop="" label="送风状态" width="120" />
            <el-table-column prop="" label="通信状态"
            width="120" />
            <el-table-column prop="mode" label="设定风速" width="120" />
            <el-table-column prop="" label="总收费" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="使用历史记录" name="2">
          <el-table :data="HistoryData" height="400" style="margin-left:5%;width: 90%; " stripe border>
            <el-table-column prop="roomNo" label="房间号码" width="120" /> 
            <el-table-column prop="startTime" label="开始时间" width="160" /> 
            <el-table-column prop="endTime" label="结束时间" width="160" /> 
            <el-table-column prop="" label="送风状态" width="120" /> 
            <el-table-column prop="targetT" label="设定温度" width="120" />
            <el-table-column prop="wind" label="设定风速"  width="120"/>
            <el-table-column prop="price" label="本次花费" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'adminInspect',
  props: ['HistoryData'],
  data () {
    return {
      activeName: '1',
      inspectInfo: {
        form: {
          roomId: '',
          record: [{
            startTime: '',
            endTime: '',
            setTemperature: null,
            setMode: '',
            spent: null
          }]
        }
      },
    }
  },
  methods: {
    
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