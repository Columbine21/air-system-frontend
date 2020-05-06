<template>
  <div>
    <echart-demo></echart-demo>
  </div>
</template>

<script>
import AdminContent from './components/content'
import AdminHeader from './components/adminHeader'
import EchartDemo from './components/echartdemo'
export default {
  name: 'Admin',
  components: {
    AdminHeader: AdminHeader,
    AdminContent: AdminContent,
    EchartDemo: EchartDemo
  }
}
</script>

<style lang="stylus" scoped>
  .el-header
    padding: 0
</style>
