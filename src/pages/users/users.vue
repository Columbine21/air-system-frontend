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
				<sensor @SensorReq='returnSensor' :state='Settings.state' :setTemp='Settings.temperature' :setWind='Settings.wind'
				 :nowTemp='RoomInfo.roomtemp'></sensor>
				<div v-show="show_info">
					<display-panal :roomId='RoomInfo.roomId' :temp='RoomInfo.roomtemp' :wind='Settings.wind' :money='RoomInfo.money'
					 :state='Settings.state' :onoff='RoomInfo.onoff' :setTemp='Settings.temperature' :time='RoomInfo.time'></display-panal>
				</div>

				<div v-show="show_setting">
					<setting @SettingReq="returnSettingInfo" :nowTemp='this.RoomInfo.roomtemp' :state='this.Settings.state' :token='this.RoomInfo.token'></setting>
				</div>

				<div v-show="show_money">
					<charts :roomId='RoomInfo.roomId' id='moneyCharts' :timelist='this.RoomInfo.timelist' :datalist='this.RoomInfo.templist'></charts>
				</div>

				<div v-show="show_temp">
					<charts :roomId='RoomInfo.roomId' id='tempCharts' :timelist='this.RoomInfo.timelist' :datalist='this.RoomInfo.templist'></charts>
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
				machine: true,
				Settings: {
					wind: 0,
					temperature: 0,
					state: '制冷'
				},
				RoomInfo: {
					money: 0,
					roomtemp: 30,
					roomId: '101',
					idNo: '101id',
					onoff: '开',
					time: 0,
					token: '',
					timelist: [],
					templist: [],
					moneylist: []
				},
				Timer: {
					timer0: '',
					timer1: ''
				},
				sendFrq: 1000
			}
		},
		mounted() {
			this.Timer.timer0 = setInterval(this.getlist, 10000);
			this.Timer.timer0 = setInterval(this.sendTemp, this.sendFrq);
			this.init()
		},
		methods: {
			init() {
				this.RoomInfo.timelist.push(0)
				this.RoomInfo.templist.push(this.RoomInfo.roomtemp)
				this.RoomInfo.moneylist.push(0)
				console.log('list0:' + this.RoomInfo.timelist + this.RoomInfo.templist)
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
			returnSettingInfo(wind, temperature, state) {
				this.Settings.wind = wind
				this.Settings.temperature = temperature
				this.Settings.state = state
			},
			returnMoney(money) {
				this.RoomInfo.money = money
			},
			returnSensor(temp) {
				this.RoomInfo.roomtemp = temp
			},
			getlist() {
				this.RoomInfo.time = this.RoomInfo.time + 10;
				this.RoomInfo.timelist.push(this.RoomInfo.time)
				this.RoomInfo.templist.push(this.RoomInfo.roomtemp)
				console.log('timelist:' + this.RoomInfo.timelist)
				console.log('templist:' + this.RoomInfo.templist)
			},
			sendTemp() {
				axios({
					method: 'put',
					url: 'http://101.200.120.102:8080/slave/status',
					data: {
						roomT: this.RoomInfo.roomtemp
					},
					headers: {
						'Authorization': this.RoomInfo.token
					}
				}).then(this.getSendTempRes)
			},
			getSendTempRes(res) {
				// Todo if success
				console.log(res)
			},
			sendOnOff() {
				if (this.machine === false) {
					this.RoomInfo.onoff = '关'
					axios({
						method: 'post',
						url: 'localhost:8080/slave/off', // 关闭请求
						data: {},
						headers: {
							'Authorization': 'Bearer ' + this.RoomInfo.token
						}
					}).then(this.getSendOffRes)
				} else {
					this.RoomInfo.onoff = '开'
					axios({
						method: 'post',
						url: 'http://101.200.120.102:8080/login/customer', // 关闭请求
						data: {
							'roomNo': this.RoomInfo.roomId,
							'idNo': this.RoomInfo.idNo
						}
					}).then(this.getSendOnRes)
				}
			},
			getSendOffRes(res) {
				// Todo
				console.log(res)
			},
			getSendOnRes(res) {
				console.log(res.data.data.token)
				this.RoomInfo.token = res.data.data.token
			}
		},
		computed: {
			Customer() {
				return this.$store.state.UserInfo
			}
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
