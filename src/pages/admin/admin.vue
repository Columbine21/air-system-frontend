<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="18vw" style="background-color: rgb(84, 92, 100)">
      <el-avatar class="avater" style="position: absolute; top: 10px; left: 20px" :src="Manager.avaterUrl"></el-avatar>
      <div style="position: absolute; top: 27.5px; left: 80px; font-size: 15px">{{Manager.name}}</div>
      
      <el-menu
        default-active="settings"
        class="el-menu-vertical-demo"
        background-color="#545c64" 
        text-color="#fff" 
        active-text-color="#ffd04b"
        @select="showChange"
        style="margin-top: 60px"
        >
        <el-menu-item index="settings">
          <i class="el-icon-setting"></i>
          <span slot="title">Setting</span>
        </el-menu-item>
        <el-menu-item index="inspect">
          <i class="el-icon-bell"></i>
          <span slot="title">Inspect</span>
        </el-menu-item>
        <el-menu-item index="statistics">
          <i class="el-icon-document"></i>
          <span slot="title">Statistic</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="font-size: 12px; height: 10vh">
				<div class="header" style="height: 100%; text-align: right;">
          
          <el-dropdown>
            <span class="el-dropdown-link" style="position: relative; top: 0px">
              Options
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleLogout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
			</el-header>
      <el-main>
        <el-divider direction="vertical"></el-divider>
          <el-col :span="12">
            sdjfaiojrga
          </el-col>
          
          <el-col :span="12">
            fahgaira
          </el-col>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Admin',
  data () {
    return {
      Manager: {
        avaterUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        name: "Jason"
      }
    }
  },
  methods: {
    showChange(key, keyPath) {
      console.log(key + '...' + keyPath);
      // this.$router.push('admin/' + key)
    },
    handleLogout () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-header {
    padding: 7.5px 20px;
		background-color: #B3C0D1;
		color: #333;
		line-height: 8vh;
	}
  .el-avatar {
    height: 45px;
    width: 45px;
  }
  .el-main {
    padding: 0
  }
  .el-divider--vertical {
    position: absolute;
    height: 100%;
    left: 58%;
    margin: 0;
  }
</style>