<template>
  <div>
    <el-divider direction="vertical"></el-divider>
    <el-col :span="12">
      <el-card style="margin-left: 3.4%; margin-top: 6vh; width: 92.8%;">
        <div slot="header">
          <span>从控机当前状态</span>
          <el-button style="float: right; padding: 3px 0" type="text">Refresh</el-button>
        </div>
        <el-table :data="slaveData" height="420" style="width: 100%" stripe border>
          <el-table-column prop="roomId" label="房间号" width="68" />
          <el-table-column prop="" label="当前温度" width="80" />
          <el-table-column prop="temperature" label="设定温度" width="80" />
          <el-table-column prop="" label="送风状态" width="80" />
          <el-table-column prop="" label="通信状态"
           width="80" />
          <el-table-column prop="mode" label="风速" width="51" />
          <el-table-column prop="" label="总收费"
           width="68" />
        </el-table>
        
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card  style="margin-left: 3.4%; margin-top: 6vh; width: 92.8%;">
        <div slot="header">
          <span>使用历史记录</span>
        </div>
        <!-- <div style="margin-top: 4vh">使用记录</div> -->
        <el-table :data="inspectInfo.form.record" height="220" style="width: 100%; " stripe border>
          <el-table-column prop="" label="房间号" width="68" /> 
          <el-table-column prop="startTime" label="开始时间" width="80" /> 
          <el-table-column prop="endTime" label="结束时间" width="80" /> 
          <el-table-column prop="" label="送风状态" width="80" /> 
          <el-table-column prop="setTemperature" label="设定温度" width="80" />
          <el-table-column prop="mode" label="风速"  width="51"/>
          <el-table-column prop="spent" label="本次花费"  width="80"/>
        </el-table>
        
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