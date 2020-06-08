<template>
  <div>
    <el-divider direction="vertical"></el-divider>
    <el-col :span="12">
      <el-card style="margin-left: 3.5vw; margin-top: 6vh; width: 80%;">
        <div slot="header">
          <span>从控机请求列表</span>
          <el-button style="float: right; padding: 3px 0" type="text">Refresh</el-button>
        </div>
        <el-table :data="slaveData" height="420" style="width: 100%" stripe border @row-dblclick="showRoomDetails">
          <el-table-column prop="roomId" label="房间号" width="110" /> 
          <el-table-column prop="temperature" label="设定温度" width="110" /> 
          <el-table-column prop="mode" label="设定风速" />
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card v-show="inspectInfo.InspectDetails" style="margin-left: 3.5vw; margin-top: 6vh; width: 80%;">
        <div slot="header">
          <span>房间详细信息</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="HiddenDetails">Hidden</el-button>
        </div>
        <div>房间号码&ensp; :&ensp; {{inspectInfo.form.roomId}}</div>
        <div style="margin-top: 4vh">使用记录</div>
        <el-table :data="inspectInfo.form.record" height="220" style="width: 100%; margin-top: 3vh" stripe border>
          <el-table-column prop="startTime" label="开始时间" width="86" /> 
          <el-table-column prop="endTime" label="结束时间" width="86" /> 
          <el-table-column prop="setTemperature" label="设定温度" width="86" />
          <el-table-column prop="mode" label="设定风速"  width="86"/>
          <el-table-column prop="spent" label="总共花费"  width="86"/>
        </el-table>
        <div style="margin-top: 3vh"> 用户安全评定&ensp; :&ensp;</div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'adminInspect',
  props: ['slaveData'],
  data () {
    return {
      inspectInfo: {
        InspectDetails: false,
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
    HiddenDetails () {
      this.inspectInfo.InspectDetails = false
    },
    showRoomDetails (row) {
      console.log(row.roomId)
      // Todo : here to use the repondence info.
      this.inspectInfo.InspectDetails = true
      this.inspectInfo.form.roomId = row.roomId
      // this.inspectInfo.form.record = 
    },
  }
}
</script>

<style lang="stylus" scoped>

</style>