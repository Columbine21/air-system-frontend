<template>
  <div>
    <el-card style="margin:5vh 3%; width: 90%;">
      <div slot="header">
        <span>统计查询表单</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="房间号码" prop="roomId">
          <el-input v-model="form.roomId" />
        </el-form-item>

        <el-form-item label="起始时间" prop="date">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>

        <el-form-item label="统计范围" prop="peroid">
          <el-radio-group v-model="form.peroid">
            <el-radio label="Day" /> <el-radio label="Week" /> <el-radio label="Month" />
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即查询</el-button>
          <el-button type="primary" @click="onClear">清空表项</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'statisticFrom',
  data () {
    return {
      form: {
        roomId: '',
        date: '',
        peroid: ''
      }, 
      rules: {
        roomId: [
           { required: true, message: '请输入房间号码', trigger: 'blur' },
        ],
        date: [
          { required: true, message: '请输入起始日期', trigger: 'change' }
        ],
        peroid: [
          { required: true, message: '请输入起始日期', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {

    }, 
    onClear () {

    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
