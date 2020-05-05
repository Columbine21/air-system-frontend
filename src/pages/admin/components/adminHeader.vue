<template>
  <div class="header">
    <div class="header-left">
       <el-avatar class="avater" :size="45" :src="avaterUrl"></el-avatar>
    </div>
    <div class="header-medium">
      <span class="iconfont">&#xe7b3;</span>
      Cool Hotel.tec
    </div>
    <div class="header-right">
      <el-dropdown>
        <span class="el-dropdown-link">
          Options<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleLogout">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminHeader',
  data () {
    return {
      avaterUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  methods: {
    handleLogout () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import '~styles/variables.styl'
  .header
    display: flex
    line-height: $headerHeight
    background: $bgColor
    color: #fff
    .header-left
      width: 1.2rem
      height: $headerHeight
      float: left
      text-align: center
      .avater
        margin-top: .15rem
    .header-medium
      margin-top: .2rem
      margin-bottom: .2rem
      margin-left: .1rem
      margin-right: .1rem
      line-height: .8rem
      height: .8rem
      background-color: #fff
      color: #ccc
      border-radius: .1rem
      flex: 1
    .header-right
      min-width: 1.04rem
      padding: 0 .1rem
      float: right
      text-align: center
      color: #fff
</style>
