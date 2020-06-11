<template>
  <el-container>
    <img src="../../assets/bkPhot2.jpg" 
    style=" z-index: -1; position: fixed; width: 100vw; height: 100vh;" />
    
    <el-card style="width: 40%; margin: 0 auto; margin-top: 15vh; margin-bottom: 10vh; opacity: .8">
        <div>
          <img style="margin: 0 20%;width: 60%" src='../../assets/logo.png' />
        </div>
        
      <el-form ref="loginForm" :model="form" :rules="rules">
        <img  style="width: 20%; margin:10px 40%" src="../../assets/avater.jpeg" />
       
          <el-form-item label="账号" prop="username">
            <el-input type="text" class='field' placeholder="请输入账号" v-model="form.username" />
          </el-form-item> 
        
          <el-form-item label="密码" prop="password">
            <el-input type="password" class='field' placeholder="请输入密码" v-model="form.password" />
          </el-form-item>
          
          <el-form-item label="用户类型" prop="userType" style="text-align: center">
            <el-radio-group v-model="form.userType">
              <el-radio label="Traveler" /> <el-radio label="Administrator" />
            </el-radio-group>
        </el-form-item>
          
          <el-button style="margin:0 20%; width: 60%;" type="primary" @click="onSubmit">登录</el-button>
          <!-- <el-button style="margin:5% 20%; width: 60%;" type="primary" @click="onSubmit('signUpForm')">注册</el-button> -->
      </el-form>
    </el-card>
    <div>{{counter}}</div>
  </el-container>
  <!-- </div> -->
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      validity: true,
      message: '',
      form: {
        username: '',
        password: '',
        userType: ''
      },
      isadmin: false,
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [
          { required: true, message: '账号不可为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不可为空', trigger: 'blur' },
          {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
        ], 
        userType: [
          {required: true, message: '用户类别不可为空'}
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.form.password && this.form.username) {
        // Todo : change url into ours. & do some simple test.
        if (this.form.userType === 'Administrator') {
          axios({
            method: 'post',
            url: '/login/admin',
            data: {
            'adminId': this.form.username,
            'password': this.form.password
            }
          }).then(this.getAdminSigninRes)
        } else if (this.form.userType === 'Traveler') {
          axios({
            method: 'post',
            url: '/login/customer',
            data: {
            'roomNo': this.form.username,
            'idNo': this.form.password
            }
          }).then(this.getCustomerSigninRes)
        }
      } else {
        this.validity = false
        this.message = 'User Name or Password can not be null'
      }
    },
    getAdminSigninRes (res) {
      if (res.data.code === 200) {
        console.log(res.data.data.token)
        this.$router.push('/admin')
        let url = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        this.$store.commit('Login', {userName: res.data.data.adminId, avaterUrl: url, token: res.data.data.token})
      } else {
        alert('Login Failed !')
      } 
    },
    getCustomerSigninRes (res) {
      console.log(res.data);
      
      if (res.data.code === 200) {
        this.$router.push('users')
        let url = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        this.$store.commit('Login', {userName: res.data.data.adminId, avaterUrl: url, token: res.data.data.token, roomNo: res.data.data.roomNo})
      } else {
        alert('Login Failed !')
      }
    }
  },
  computed: {
    counter () {
      return this.$store.state.count
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variables.styl'
</style>
