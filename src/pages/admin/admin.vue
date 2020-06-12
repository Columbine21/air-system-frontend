<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="15vw" style="background-color: rgb(84, 92, 100)">
      <el-avatar class="avater" style="position: absolute; top: 10px; left: 20px" :src="Manager.avaterUrl"></el-avatar>
      <div style="position: absolute; top: 27.5px; left: 80px; font-size: 15px">{{Manager.name}}</div>
      
      <el-menu default-active="settings" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="showChange" style="margin-top: 60px">
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
          <admin-inspect></admin-inspect>
        </div>
        <div v-show="showControl.selectStatistics">
          <!-- <el-divider direction="vertical"></el-divider> -->
          <!-- <el-col :span="12"> -->
            <!-- <statistic-form @StatisticReq="sendStatisticReq"></statistic-form> -->
          <!-- </el-col> -->
          <!-- <el-col :span="12" v-show="statisticInfo.showCharts"> -->

            <el-card style="margin:5% 10%; width: 80%; height: 90%">
              <div slot="header">
                <span>房间报表记录</span>
                
                <el-button style="float: right; padding: 3px 10px" @click="statisticReq" type="text">查询</el-button>
                <el-button style="float: right; padding: 3px 10px" @click="statisticClear" type="text">清除</el-button>
                <el-button style="float: right; padding: 3px 8px" 
                @click="exportExcel(statisticInfo.form.roomId, statisticInfo.data.start_times, statisticInfo.data.end_times)" 
                type="text">下载</el-button>
              </div>
              <el-form ref="statisticInfo.form" :model="statisticInfo.form" label-width="80px" :rules="statisticInfo.rules">
                <el-form-item label="房间号码" prop="roomId">
                  <el-input v-model="statisticInfo.form.roomId" />
                </el-form-item>
                
                <el-form-item label="统计范围" prop="peroid">
                  <el-radio-group v-model="statisticInfo.form.peroid">
                    <el-radio label="day" /> <el-radio label="week" /> <el-radio label="month" />
                  </el-radio-group>
                </el-form-item>
              </el-form> 
              <!-- <div v-show="statisticInfo.showDefault" style=""></div> -->
              <div v-show="statisticInfo.showResult">
                <el-divider></el-divider>
                <div style="margin-top: 3vh">开机次数&ensp; :&ensp; {{statisticInfo.data.start_times}}</div>
                <div style="margin-top: 3vh">关机次数&ensp; :&ensp; {{statisticInfo.data.end_times}}</div>
                <el-table :data="statisticInfo.data.contents" height="300" style="width: 100%; margin-top: 3vh" id="statisticInfoTable" stripe border>
                  <el-table-column prop="start_time" label="开始时间" width="160" /> 
                  <el-table-column prop="end_time" label="结束时间" width="160" /> 
                  <el-table-column prop="start_room_temperature" label="起始温度" width="120" />
                  <el-table-column prop="end_room_temperature" label="终止温度" width="120" /> 
                  <el-table-column prop="wind_consumption" label="消耗风量"  width="120"/>
                  <el-table-column prop="price" label="本次花费" />
                </el-table>
                <!-- <div style="text-align:center"> -->
                <div style="margin-top: 3vh">总费用&ensp; :&ensp; {{statisticInfo.data.total_price}}</div>
              <!-- </div>  -->
            </div>
            </el-card>
          <!-- </el-col> -->
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import FileSaver from "file-saver"
import XLSX from "xlsx"
// import echarts from 'echarts'
import adminSettings from '@/pages/admin/subpages/setting'
import adminInspect from '@/pages/admin/subpages/inspect'
import statisticForm from '@/pages/admin/subpages/statisticForm'
import axios from 'axios'
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
      // HistoryData: null,
      statisticInfo: {
        showResult: false,
        rules: {
          roomId: [
            { required: true, message: '请输入房间号码', trigger: 'blur' },
          ],
          peroid: [
            { required: true, message: '请输入起始日期', trigger: 'change' }
          ]
        },
        form: {
          roomId: '',
          peroid: ''
        },
        data: {
          
        }
      }
    }
  },
  methods: {
    showChange(key, keyPath) {
      // deal with aside bar event. (change which to show)
      // console.log(key + '...' + keyPath);
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
    statisticReq () {
      // axios.get('/report', { params: { 'roomNo': roomId, 'report_category': peroid}}).then(this.showStatisticDetails)
      // console.log(roomId, peroid)
      axios({
            method: 'post',
            url: '/report',
            headers: { 
              'Authorization': this.Manager.token
            },
            data: {
            'roomNo': this.statisticInfo.form.roomId,
            'report_category': this.statisticInfo.form.peroid
            }
          }).then(this.showStatisticDetails)
    },
    showStatisticDetails (res) {
      // console.log("iefaiuerhgirghiughsight")
      console.log(res.data)
      if (res.data.code === 200) {
        this.statisticInfo.showResult = true
        this.statisticInfo.data = res.data.data
      } else {
        alert("Request failed.")
      }
    },
    statisticClear () {
      this.statisticInfo.showResult = false
      this.statisticInfo.form.roomId = ''
      this.statisticInfo.form.peroid = ''
    },
    // initLogData (res) {
    //   if (res.data.code === 200) {
    //     this.HistoryData = res.data.data
    //     console.log(this.HistoryData);
    //   } else {
    //     alert(res.data.msg + ' 请重新登陆！')
    //     this.handleLogout()
    //   }
    // },
    exportExcel (roomId, startT, closeT) {
      if (this.statisticInfo.showResult === true) {
        var wb = XLSX.utils.table_to_book(document.querySelector("#statisticInfoTable"));
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array"
        });
        try {
            FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。
            //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            "Room" + roomId + "_" + startT + "_" + closeT + ".xlsx"
            );
        } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      } else {
        this.$alert('请在查询后下载', {
          confirmButtonText: '确定'
          })
      }
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
  beforeDestroy () {
    this.statisticInfo.form = null
    this.statisticInfo.data = null
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