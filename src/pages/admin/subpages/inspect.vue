<template>
  <div>
    <el-card style="margin-left: 3.4%; margin-top: 6vh; width: 92.8%;">
      <div slot="header">
          <span>监控面板</span>
          <el-button style="float: right; padding: 3px 10px" type="text" @click="exportExcel('historyState')">导出历史记录表</el-button>
          <el-button style="float: right; padding: 3px 10px" type="text" @click="exportExcel('currentState')">导出当前状态表</el-button>
          <!-- <el-button style="float: right; padding: 3px 10px" type="text" @click="Refresh">Refresh</el-button> -->
        </div>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="从控机当前状态" name="1">
          <el-table :data="inspectInfo.form.record" height="400" style="margin-left:5%;width: 90%" id="currentStateTable" stripe border fit>
            <el-table-column prop="roomNo" label="房间号码" />
            <el-table-column prop="current_temperature" label="当前温度" />
            <el-table-column prop="target_temperature" label="设定温度"  />
            <el-table-column prop="state" label="从控状态"  />
            <el-table-column prop="communication_state" label="通信状态"
             />
            <el-table-column prop="wind_level" label="设定风速"  />
            <el-table-column prop="total_cost" label="总收费" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="使用历史记录" name="2">
          <el-table :data="HistoryDataParent" height="400" style="margin-left:5%;width: 90%; " id="HistoryTable" stripe border>
            <el-table-column prop="roomNo" label="房间号码" width="120" /> 
            <el-table-column prop="startTime" label="开始时间" width="160" /> 
            <el-table-column prop="endTime" label="结束时间" width="160" /> 
            <el-table-column prop="p" label="风量消耗" width="120" /> 
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
import axios from 'axios'
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  name: 'adminInspect',
  data () {
    return {
      activeName: '1',
      HistoryDataParent: null,
      inspectInfo: {
        form: {
          roomId: '',
          record: null
        }
      },
      Timer: {
        timer0: null
      }
    }
  },
  methods: {
    Refresh () {
      axios.get(
        '/master/slaves', 
        { 
          headers: {
             'Authorization': this.Manager.token
          }
        }).then(this.refreshStatusData)

      axios.get(
        '/master/log',
        { 
          headers: {
            'Authorization': this.Manager.token
          }
        }).then(this.refreshLogData)
    },
    refreshLogData (res) {
      // console.log(res.data)
      console.log("refresh log data")
      if (res.data.code === 200) {

        this.HistoryDataParent = res.data.data
        console.log(this.HistoryDataParent);
        
      } else {
        this.$alert(res.data.msg + ' 请重新登陆！', {
          confirmButtonText: '确定'
          })
        this.handleLogout()
				this.$router.push('login')
      }
    },
    refreshStatusData (res) {
      console.log("refresh status data")
      if (res.data.code === 200) {
        this.inspectInfo.form.record = res.data.data.contents
        console.log(this.inspectInfo.form.record)
      } else {
        this.$alert(res.data.msg + ' 请重新登陆！', {
          confirmButtonText: '确定'
          })
        this.handleLogout()
				this.$router.push('login')
      }
    },
    exportExcel (tableName) {
      console.log(tableName);
      if(tableName === 'currentState') {
        /* 从表生成工作簿对象 */
        var wb = XLSX.utils.table_to_book(document.querySelector("#currentStateTable"));
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
            "currentState.xlsx"
            );
        } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      } else {
        var wb = XLSX.utils.table_to_book(document.querySelector("#HistoryTable"));
        var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array"
        });
        try {
            FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "HistoryData.xlsx"
            );
        } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
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
  mounted () {
    this.Timer.timer0 = setInterval(this.Refresh, 2000)
    axios.get(
      '/master/slaves',
      { headers: {
         'Authorization': this.Manager.token
        }
      }
    ).then(this.refreshStatusData)

    axios.get(
      '/master/log',
       { headers: { 
         'Authorization': this.Manager.token
        }
      }).then(this.refreshLogData)
  },
  beforeDestroy () {
    this.HistoryDataParent = null
    this.inspectInfo.form.record = null
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