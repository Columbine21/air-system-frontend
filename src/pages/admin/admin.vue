<template>
  <div>
    <admin-header></admin-header>
    <admin-content></admin-content>
  </div>
</template>

<script>
import AdminContent from './components/content'
import AdminHeader from './components/adminHeader'
export default {
  name: 'Admin',
  components: {
    AdminHeader: AdminHeader,
    AdminContent: AdminContent
  }
}
</script>

<style lang="stylus" scoped>
  .el-header
    padding: 0
</style>
