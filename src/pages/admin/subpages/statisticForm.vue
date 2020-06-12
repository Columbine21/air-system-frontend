<template>
  <div>
    <!-- <el-card style="margin:5% 30%; width: 40%;">
      <div slot="header">
        <span>统计查询表单</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="房间号码" prop="roomId">
          <el-input v-model="form.roomId" />
        </el-form-item>
        

        <el-form-item label="统计范围" prop="peroid">
          <el-radio-group v-model="form.peroid">
            <el-radio label="day" /> <el-radio label="week" /> <el-radio label="month" />
          </el-radio-group>
        </el-form-item>

        <el-form-item style="margin-left:5%">
          <el-button type="primary" @click="onSubmit">立即查询</el-button>
          <el-button type="primary" @click="onClear">清空表项</el-button>
        </el-form-item>
      </el-form>
    </el-card> -->
  </div>
</template>

<script>
export default {
  name: 'statisticFrom',
  data () {
    // return {
    //   form: {
    //     roomId: '',
    //     // optional function
    //     quireType: null,
    //     // optional function
    //     date: '',
    //     peroid: ''
    //   }, 
    //   rules: {
    //     roomId: [
    //        { required: true, message: '请输入房间号码', trigger: 'blur' },
    //     ],
    //     peroid: [
    //       { required: true, message: '请输入起始日期', trigger: 'change' }
    //     ]
    //   }
    // }
  },
  methods: {
    // onSubmit () {
    //   this.$emit('StatisticReq', this.form.roomId, this.form.date, this.form.peroid)
    // }, 
    // onClear () {
    //   this.form.roomId = ''
    //   this.form.date = ''
    //   this.form.peroid = ''
    // }
  }
}
</script>

<style lang="stylus" scoped>

</style>
