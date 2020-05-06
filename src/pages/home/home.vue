<template>
  <div>
    <img src="../../assets/bkPhoto.jpeg" class="bkPhoto" />
    <div class="login">
      <div class="header-wrapper">
        <img class="header-img" src='../../assets/logo.png' />
      </div>
      <el-form ref="loginForm" :model="form" :rules="rules" class="login-box">
        <div class="image-wrapper">
          <img class="login-avater" src="../../assets/avater.jpeg" />
        </div>
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
          <div class="validity-check-info" v-show="!validity">
              {{this.message}}
          </div>
          <div class="button-box">
            <el-button class="loginButton" type="primary" v-on:click="onSubmit('loginForm')">登录</el-button>
            <el-button class="signupButton" type="primary" v-on:click="onSubmit('signUpForm')">注册</el-button>
          </div>
        </div>
      </el-form>

      <!-- <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>请输入账号和密码</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      validity: true,
      message: '',
      form: {
        username: '',
        password: ''
      },
      isadmin: false,
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
  methods: {
    onSubmit (type) {
      if (type === 'loginForm') {
        if (this.form.password && this.form.username) {
          // Todo : change it into axios post request
          console.log('login \n' + this.form.username + '\n' + this.form.password)
        } else {
          this.validity = false
          this.message = 'User Name or Password can not be null'
        }
      } else {
        if (this.onValidityCheck()) {
          // Todo : change it into axios post request
          console.log('login \n' + this.form.username + '\n' + this.form.password)
        }
      }
    },
    onValidityCheck () {
      // Todo : add more complex validity check.
      if (this.form.password.length < 6) {
        this.validity = false
        this.message = 'Password length is at least 6'
        return false
      }
      return true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variables.styl'
.login {
  display: flex;
  flex-direction: column;
  align-items: center;  /* block 垂直居中 */
  justify-content: space-around;  /* block 水平居中 */
  height: 100vh; /* 垂直居中的时候需要设定 height */
}

.header-wrapper {
  height: 10vh;
  align-content: center;
}

.header-img {
  height: 100%;
}

.login-box {
  width: 60vw;
  height: 50vh;
  margin-bottom: 10vh
  background-color: white;
  opacity: 0.85
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}

.image-wrapper {
  text-align: center;
  padding-top: 2.5vh;
}

.login-avater {
  height: 5vh;
  width: 10vh;
}

.label {
  width: 10vw;
  display: flex;
  align-items: center;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkBox >>> .el-checkbox {
  align-items: center;
  justify-content: center;
}

.checkBox >>> .el-checkbox__label {
  line-height: 3vh;
  font-size: 2.5vh;
  margin-top: 2vh
}

.checkBox >>> .el-checkbox__inner {
  width: 3vh;
  height: 3vh;
  border-radius: 1vh;
  border: .4vh solid #DCDFE6;
}

.field-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.field >>> .el-input__inner {
  line-height: 5vh;
  height: 5vh;
  font-size: 1vh;
  border-radius: 1vh;
  border: .4vh solid #DCDFE6;
  padding: 0 2vw;
}

.field {
  width: 35vw;
  line-height: 5vh
  height: 5vh
}

.el-input__inner {
  line-height: 5vh !important
  border-radius: 3px
  height: 5vh !important
}

.validity-check-info {
  margin-top: .1rem
  text-align: center
  color: red;
}

.button-box {
  width: 70%;
  display : flex;
  flex-direction : column;
  align-items : center;
  justify-content : center;
}

.button-box >>> .el-button {
  padding: 0 20px
  font-size: 2vw
}

.loginButton {
  margin-top: 1vh;
  height: 5vh;
  width: 40vw;
}

.signupButton {
  width: 40vw;
  height: 5vh;
  margin-left:0;
  margin-top:1vh;
}

.bkPhoto {
  z-index: $backgroundIndex;
  position: fixed;
  width: 100vw;
  height: 100vh;
}
</style>
