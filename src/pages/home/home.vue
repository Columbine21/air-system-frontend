<template>
  <div>
    <img src="../../assets/bkPhoto.jpeg" class="bkPhoto" />
    <div class="login">
      <el-form ref="loginForm" :model="form" :rules="rules" class="login-box">
        <h3 class="login-title">logo</h3>
        <div class="field-box">
          <!-- <el-form-item label="账号" prop="username" class="account"> -->
          <div class="account">
            <span class="label">账号</span>
            <el-input type="text" class='field' placeholder="请输入账号" v-model="form.username" />
          </div>
          <div class="password">
            <span class="label">密码</span>
            <el-input type="password" class='field' placeholder="请输入密码" v-model="form.password" />
          </div>
          <div class="checkBox">
          <el-checkbox v-model="isadmin">Admin</el-checkbox>
          </div>
          <div class="button-box">
            <el-button class="loginButton" type="primary" v-on:click="onSubmit('loginForm')">登录</el-button>
            <el-button class="signupButton" type="primary" v-on:click="onSubmit('signUpForm')">注册</el-button>
          </div>
        </div>
      </el-form>

      <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>请输入账号和密码</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import HeaderDemo from './components/headerdemo'
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      isAdmin: false,
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [
          { required: true, message: '账号不可为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不可为空', trigger: 'blur' }]
      },

      // 对话框显示和隐藏
      dialogVisible: false
    }
  },
  components: {
    HeaderDemo: HeaderDemo
  }
}
</script>

<style lang="stylus" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-box {
  width: 55vw;
  height: 50vh;
  background-color: white;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}

.login-title {
  text-align: center;
  padding-top: 5vh;
}

.label {
  width:40px;
  display : flex;
  align-items : center;
}

.account {
  padding-top: 3vh;
  display: flex;
}

.password {
  padding-top: 2vh;
  display: flex;
}

.checkBox {
  width:79%;
  padding-top: 2vh;
}

.field-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.field {
  width : 35vw;
}

.button-box {
  width: 70%;
  display : flex;
  flex-direction : column;
  align-items : center;
  justify-content : center;
}
.loginButton {
  margin-top: 3vh;
  width: 100%;
}
.signupButton {
  width: 100%;
  margin-left:0;
  margin-top:1vh;
}
.bkPhoto {
  z-index: -100;
  position: fixed;
  width: 100vw;
  height: 100vh;
}
</style>
