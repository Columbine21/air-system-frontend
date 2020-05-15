<template>
  <el-container class="wrap">
    <el-header height="12.5vh">
      <the-header />
    </el-header>
  </el-container>
</template>

<script>
import TheHeader from './components/TheHeader'
export default {
  name: 'Admin',
  components: {
    TheHeader: TheHeader
  }
}
</script>

<style lang="stylus" scoped>
.wrap {
  min-height: 96vh;
  .el-header {
    position: relative;
    background-color: #409EFF;
    line-height: 80px;
    padding: 0 0
  }
}
</style>
