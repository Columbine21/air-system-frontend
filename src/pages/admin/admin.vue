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

          <el-card style="margin:5vh 20%; width: 60%;">
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
              style="margin-top: 10px; margin-left: 30%"
              placeholder="Please set the Date."
              >
            </el-date-picker>
            <el-switch style="margin: 20px 0 0 40%"
              v-model="Settings.State"
              active-text="开启"
              inactive-text="关闭">
            </el-switch>
          </el-card>

          <el-card style="margin:5vh 20%; width: 60%;">
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
        </div>
        <div v-show="showControl.selectInspect">
          <el-divider direction="vertical"></el-divider>
          <el-col :span="12">
            <el-card style="margin-left: 3.5vw; margin-top: 6vh; width: 80%;">
              <div slot="header">
                <span>从控机请求列表</span>
                <el-button style="float: right; padding: 3px 0" type="text">Refresh</el-button>
              </div>
              <el-table :data="tableData" height="420" style="width: 100%" stripe border @row-dblclick="showRoomDetails">
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
              </div>
              <div>房间号码&ensp; :&ensp; {{inspectInfo.form.roomId}}</div>
              <div style="margin-top: 4vh">使用记录</div>
              <el-table :data="inspectInfo.form.record" height="220" style="width: 100%; margin-top: 3vh" stripe border>
                <el-table-column prop="startTime" label="开始时间" width="68" /> 
                <el-table-column prop="endTime" label="结束时间" width="68" /> 
                <el-table-column prop="setTemperature" label="设定温度" width="68" />
                <el-table-column prop="mode" label="设定风速"  width="68"/>
                <el-table-column prop="spent" label="总共花费"  width="68"/>
              </el-table>
              <div style="margin-top: 3vh"> 用户安全评定&ensp; :&ensp;</div>
            </el-card>
          </el-col>
        </div>
        <div v-show="showControl.selectStatistics">
          <el-divider direction="vertical"></el-divider>
          <el-col :span="12">
            <statistic-form @StatisticReq="showStatisticDetails"></statistic-form>
          </el-col>
          <el-col :span="12">
            <el-card style="margin:5vh 3%; width: 90%;">
              <div slot="header">
                <span>Summary</span>
              </div>
              <div>总计盈利&ensp; :</div>
              <div style="margin-top: 3vh">计费标准&ensp; :</div>
              <div id="statisticCharts" style="width: 80%; height: 300px; margin-left: 5%; margin-top: 3vh"></div>
            </el-card>
          </el-col>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import statisticForm from "@/pages/admin/subpages/statisticForm"
export default {
  name: 'Admin',
  components: {
    statisticForm: statisticForm
  },
  data () {
    return {
      showControl: {
        selectSettings: true,
        selectInspect: false,
        selectStatistics: false
      },
      Manager: {
        avaterUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        name: "Jason"
      },
      Settings: {
        Date: '2020-5-20',
        State: 'off',
        temperature: null,
        wind: null
      },
      marksWind: {
        0: 'low',
        50: 'medium',
        100: 'high'
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
          }, {
            roomId: '1-119',
            temperature: '19',
            mode: 'medium'
          }, {
            roomId: '1-119',
            temperature: '19',
            mode: 'medium'
          }, {
            roomId: '1-119',
            temperature: '19',
            mode: 'medium'
          }, {
            roomId: '1-119',
            temperature: '19',
            mode: 'medium'
          }, {
            roomId: '1-119',
            temperature: '19',
            mode: 'medium'
          }, {
            roomId: '1-119',
            temperature: '19',
            mode: 'medium'
          }
      ],
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
          },
          {
            startTime: '',
            endTime: '',
            setTemperature: null,
            setMode: '',
            spent: null
          },{
            startTime: '',
            endTime: '',
            setTemperature: null,
            setMode: '',
            spent: null
          },{
            startTime: '',
            endTime: '',
            setTemperature: null,
            setMode: '',
            spent: null
          },{
            startTime: '',
            endTime: '',
            setTemperature: null,
            setMode: '',
            spent: null
          },{
            startTime: '',
            endTime: '',
            setTemperature: null,
            setMode: '',
            spent: null
          }]
        }
      },
      statisticInfo: {

        chartOption: {
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
      this.$router.push('/')
    },
    showRoomDetails (row) {
      console.log(row.roomId)
      this.inspectInfo.InspectDetails = true
      this.inspectInfo.form.roomId = row.roomId
    },
    showStatisticDetails (roomId, startDate, peroid) {
      alert(roomId)
      var chartDom = document.getElementById("statisticCharts")
      
      var myChart = echarts.init(chartDom)
      var chartOption = {
        title: {
           text: '未来一周气温变化'
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
      
      myChart.setOption(chartOption, true)
    }
  },
  computed: {
    Season () {
      return Number(this.Settings.Date.split('-')[1])
    },
    Mode () {
      if (this.Season >= 5 && this.Season <= 10) {
        return "制冷模式"
      } else {
        return "制热模式"
      }
    },
    marksTemp () {
      if (this.Season >= 5 && this.Season <= 10) {
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