<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="18vw" style="background-color: rgb(84, 92, 100)">
      <el-avatar class="avater" style="position: absolute; top: 10px; left: 20px" :src="Manager.avaterUrl"></el-avatar>
      <div style="position: absolute; top: 27.5px; left: 80px; font-size: 15px">{{Manager.name}}</div>
      
      <el-menu
        default-active="settings"
        class="el-menu-vertical-demo"
        background-color="#545c64" 
        text-color="#fff" 
        active-text-color="#ffd04b"
        @select="showChange"
        style="margin-top: 60px"
        >
        <el-menu-item index="settings">
          <i class="el-icon-setting"></i>
          <span slot="title">Setting</span>
        </el-menu-item>
        <el-menu-item index="inspect">
          <i class="el-icon-bell"></i>
          <span slot="title">Inspect</span>
        </el-menu-item>
        <el-menu-item index="statistics">
          <i class="el-icon-document"></i>
          <span slot="title">Statistic</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="font-size: 12px; height: 10vh">
				<div class="header" style="height: 100%; text-align: right;">
          
          <el-dropdown>
            <span class="el-dropdown-link" style="position: relative; top: 0px">
              Options
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleLogout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
			</el-header>

      <el-main>
        <div v-show="showControl.selectSettings">
          <admin-settings></admin-settings>
        </div>
        <div v-show="showControl.selectInspect">
          <admin-inspect 
          :slaveData="tableData"></admin-inspect>
        </div>
        <div v-show="showControl.selectStatistics">
          <el-divider direction="vertical"></el-divider>
          <el-col :span="12">
            <statistic-form @StatisticReq="showStatisticDetails"></statistic-form>
          </el-col>
          <el-col :span="12" v-show="statisticInfo.showCharts">
            <el-card style="margin:5vh 10%; width: 80%;">
              <div slot="header">
                <span>Summary</span>
              </div>
              <div>总计盈利&ensp; :</div>
              <div style="margin-top: 3vh">计费标准&ensp; :</div>
              <div id="statisticCharts" style="height: 300px; width: 280px; margin-left: 5%; margin-top: 3vh"></div>
            </el-card>
          </el-col>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import adminSettings from '@/pages/admin/subpages/setting'
import adminInspect from '@/pages/admin/subpages/inspect'
import statisticForm from '@/pages/admin/subpages/statisticForm'
export default {
  name: 'Admin',
  components: {
    statisticForm: statisticForm,
    adminSettings: adminSettings,
    adminInspect: adminInspect
  },
  data () {
    return {
      showControl: {
        selectSettings: true,
        selectInspect: false,
        selectStatistics: false
      },
      tableData: [{
            roomId: '2-231',
            temperature: '18',
            mode: 'high'
          }, {
            roomId: '3-304',
            temperature: '20',
            mode: 'high'
          }, {
            roomId: '1-119',
            temperature: '19',
            mode: 'medium'
          }
      ],
      statisticInfo: {
        showCharts: false,
        chartOption: {
          title: {
            text: '一周气温变化'
          },
          xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line'
          }]
        }
      }
    }
  },
  methods: {
    showChange(key, keyPath) {
      // deal with aside bar event. (change which to show)
      console.log(key + '...' + keyPath);
      if (key == 'settings') {
        this.showControl.selectSettings = true,
        this.showControl.selectInspect = false,
        this.showControl.selectStatistics = false
      } else if (key == 'inspect') {
        this.showControl.selectSettings = false,
        this.showControl.selectInspect = true,
        this.showControl.selectStatistics = false
      } else {
        this.showControl.selectSettings = false,
        this.showControl.selectInspect = false,
        this.showControl.selectStatistics = true
      }
    },
    handleLogout () {
      // click logout button to return the login window.
      this.$store.commit('Logout')
      this.$router.push('/')
      
    },
    // showRoomDetails (row) {
    //   console.log(row.roomId)
    //   // Todo : here to use the repondence info.
    //   this.inspectInfo.InspectDetails = true
    //   this.inspectInfo.form.roomId = row.roomId
    //   // this.inspectInfo.form.record = 
    // },
    // HiddenDetails () {
    //   this.inspectInfo.InspectDetails = false
    // },
    showStatisticDetails (roomId, startDate, peroid) {
      // Todo : here to use the respondence data
      this.statisticInfo.showCharts = true
      alert(roomId)
      var chartDom = document.getElementById("statisticCharts")
      
      var myChart = echarts.init(chartDom)
      // Use the axios response to change chartOption 
      myChart.setOption(this.statisticInfo.chartOption, true)
    }
  },
  computed: {
    Manager () {
      return this.$store.state.UserInfo
    },
    MasterState () {
      return this.$store.state.MasterState
    }
  },
  mounted () {
    // 1. use store thing to change the this.Manager.
    // 2. axios request : time / open / state.
    // 3. store thing into store.
    // 4. axios request : slave usage list.  result should contain tableData & inspectInfo.
  }
}
</script>

<style lang="stylus" scoped>
  .el-header {
    padding: 7.5px 20px;
		background-color: #B3C0D1;
		color: #333;
		line-height: 8vh;
	}
  .el-avatar {
    height: 45px;
    width: 45px;
  }
  .el-main {
    padding: 0
  }
  .el-divider--vertical {
    position: absolute;
    height: 100%;
    left: 58%;
    margin: 0;
  }

  .el-picker-panel {
    margin: 5px 50px
  }

</style>