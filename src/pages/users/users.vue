<template>

	<el-container style="height: 100vh; border: 1px solid #eee">
		<el-aside width="20vw" style="background-color: rgb(84, 92, 100)">
			<el-menu :default-active="default_selected" @select="showChange" background-color="#545c64" text-color="#fff"
			 active-text-color="#ffd04b">
				<el-menu-item index="info">
					<template slot="title"><i class="el-icon-s-platform"></i>显示面板</template>
				</el-menu-item>
				<el-menu-item index="setting">
					<template slot="title"><i class="el-icon-set-up"></i>调节</template>
				</el-menu-item>
				<el-menu-item index="money">
					<template slot="title"><i class="el-icon-coin"></i>计费</template>
				</el-menu-item>
				<el-menu-item index="temp">
					<template slot="title"><i class="el-icon-odometer"></i>房间温度</template>
				</el-menu-item>
			</el-menu>
		</el-aside>

		<el-container>
			<el-header style="text-align: right; font-size: 12px">
				<el-switch @change="sendOnOff" v-model="machine" active-text="开" inactive-text="关" name="空调开关">
				</el-switch>
				<span>{{Customer.name}}</span>
			</el-header>

			<el-main>
				<sensor></sensor>
				<div v-show="show_info">
					<display-panal></display-panal>
				</div>

				<div v-show="show_setting">
					<setting></setting>
				</div>

				<div v-show="show_money">
					<charts id='moneyCharts' :timelist='this.RoomInfo.timelist' :datalist='this.RoomInfo.moneylist'></charts>
				</div>

				<div v-show="show_temp">
					<charts id='tempCharts' :timelist='this.RoomInfo.timelist' :datalist='this.RoomInfo.templist'></charts>
				</div>
			</el-main>
		</el-container>
	</el-container>

</template>

<script>
	import setting from '@/pages/users/subpages/setting'
	import charts from '@/pages/users/subpages/charts'
	import displayPanel from '@/pages/users/subpages/displayPanel'
	import sensor from '@/pages/users/subpages/sensor'
	import axios from 'axios'

	export default {
		name: 'Users',
		components: {
			setting: setting,
			charts: charts,
			displayPanal: displayPanel,
			sensor: sensor
		},
		data() {
			return {
				default_selected: 'setting',
				show_info: false,
				show_setting: true,
				show_money: false,
				show_temp: false,
				// 机器状态
				machine: false,
				RoomInfo: {
					timelist: [],
					templist: [],
					moneylist: []
				},
				Timer: {
					timer0: '',
					timer1: ''
				},
				retry: 0
			}
		},
		mounted() {
			// timer0 更新timelist templist moneylist
			this.Timer.timer0 = setInterval(this.getlist, 10000);
			// timer1 刷新Error代码
			this.Timer.timer1 = setInterval(this.handleError, 1000);
			this.init()
		},
		methods: {
			init() {
				this.RoomInfo.timelist.push(0)
				this.RoomInfo.templist.push(this.SlaveBasic.Temperature)
				this.RoomInfo.moneylist.push(0)
				this.initTemp()
			},
			initTemp() {
				axios.get('/room/temperature', {
						retry: 3,
						retryDelay: 3000,
						headers: {
							'Authorization': this.Customer.token
						}
					})
					.then(res => {
						console.log('room温度请求：')
						console.log(res.data)
						this.$store.commit('UpdateSlaveTemp', res.data.data.current_room_temperature)
					})
					.catch(function(err) {
						console.log('failed', err);
					});
			},
			showChange(type, p) {
				console.log(type + '...' + p)
				if (type === 'info') {
					this.show_info = true
					this.show_money = false
					this.show_setting = false
					this.show_temp = false
				} else if (type === 'money') {
					this.show_info = false
					this.show_money = true
					this.show_setting = false
					this.show_temp = false
				} else if (type === 'setting') {
					this.show_info = false
					this.show_money = false
					this.show_setting = true
					this.show_temp = false
				} else if (type === 'temp') {
					this.show_info = false
					this.show_money = false
					this.show_setting = false
					this.show_temp = true
				}
			},
			getlist() {
				this.$store.commit('UpdateSlaveTime', 10)
				this.RoomInfo.timelist.push(this.SlaveBasic.UseTime)
				this.RoomInfo.templist.push(this.SlaveBasic.Temperature)
				this.getMoney()
				this.RoomInfo.moneylist.push(this.SlaveBasic.TotalMoney)
			},
			getMoney() {
				if (this.SlaveBasic.ASstate === '关机') {
					return
				}
				axios.get('/slave/bill', {
						retry: 3,
						retryDelay: 3000,
						headers: {
							'Authorization': this.Customer.token
						}
					})
					.then(res => {
						console.log('计费请求：')
						console.log(res.data)
						this.$store.commit('UpdateSlaveTotalMoney', res.data.data.cost.toFixed(2))
					})
					.catch(function(err) {
						console.log('failed', err);
					});
			},
			sendOnOff() {
				if (this.machine === false) {
					this.sendOnReq()
				} else {
					this.sendOffReq()
				}
			},
			sendOnReq() {
				axios({
					method: 'get',
					url: 'http://101.200.120.102:8080/slave/close', // 关闭请求
					data: {},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					console.log('关闭请求：')
					console.log(res.data)
					if (res.data.code === 200) {
						this.$store.commit('UpdateASstate', '关机')
					}
				})
			},
			sendOffReq() {
				axios({
					method: 'get',
					url: 'http://101.200.120.102:8080/slave/start', // 开启请求
					data: {},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					console.log('开机请求：')
					console.log(res.data)
					if (res.data.code === 200) {
						this.$store.commit('UpdateASstate', '待机')
					} else {
						this.machine = false
						alert(res.data.msg)
					}
				})
			},
			handleError() {
				var e = this.$store.state.SlaveState.Error
				console.log('err:' + e)
				if (e !== 0) {
					if (e === 1) {
						this.sendOffReq()
						this.sendOnReq()
						this.$store.commit('UpdateSlaveError', 0)
					}
				}
			}
		},
		computed: {
			Customer() {
				return this.$store.state.UserInfo
			},
			SlaveBasic() {
				return this.$store.state.SlaveState.Basic
			},
			SlaveSettings() {
				return this.$store.state.SlaveState.Settings
			}
		},
		beforeDestroy() {
			clearInterval(this.Timer.timer0);
			this.Timer.timer0 = null;
			clearInterval(this.Timer.timer1);
			this.Timer.timer1 = null;
		}
	}
</script>

<style lang="stylus" scoped>
	.el-header {
		background-color: #B3C0D1;
		color: #333;
		line-height: 8vh;
	}

	.el-aside {
		color: #333;
	}
</style>
