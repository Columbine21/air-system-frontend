<template>
  <div class="home-header">
    <div class="home-header-left">
      <span class="iconfont">&#xe743;</span>
    </div>
    cool科技酒店
  </div>
</template>

<script>
export default {
  name: 'HeaderDemo'
}
</script>

<style lang="stylus" scoped>
  @import '~styles/variables.styl'
  .home-header
    position: relative
    overflow: hidden
    height: $headerHeight
    line-height: $headerHeight
    background: $bgColor
    text-align: center
    color: #fff
    font-size: .32rem
    .home-header-left
      position absolute
      width: .64rem
      text-align: center
      font-size: .4rem
      top: 0
      left: 0
      color: #fff
</style>
