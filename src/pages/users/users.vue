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
				<el-switch v-model="machine" active-text="开" inactive-text="关" name="空调开关">
				</el-switch>
				<span>{{name}}</span>
			</el-header>

			<el-main>
				<div v-show="show_info">
					<span>info {{Settings.state}} {{Settings.temperature}} {{Settings.wind}}</span>
					<display-panal :roomId='RoomInfo.roomId' :temp='RoomInfo.roomtemp' :wind='Settings.wind' :money='RoomInfo.money'
					 :state='Settings.state' :onoff='RoomInfo.onoff' :setTemp='Settings.temperature' :time='RoomInfo.time'></display-panal>
				</div>

				<div v-show="show_setting">
					<span>info {{Settings.state}} {{Settings.temperature}} {{Settings.wind}}</span>
					<setting @SettingReq="returnSettingInfo"></setting>
				</div>

				<div v-show="show_money">
					<charts @ChartingReq='returnMoney' :roomId='RoomInfo.roomId' id='moneyCharts'></charts>
				</div>

				<div v-show="show_temp">
					<charts @ChartingReq='returnTemp' :roomId='RoomInfo.roomId' id='tempCharts'></charts>
				</div>
			</el-main>
		</el-container>

	</el-container>

</template>

<script>
	import setting from '@/pages/users/subpages/setting'
	import charts from '@/pages/users/subpages/charts'
	import displayPanel from '@/pages/users/subpages/displayPanel'
	export default {
		name: 'Users',
		components: {
			setting: setting,
			charts: charts,
			displayPanal: displayPanel
		},
		data() {
			const item = {
				date: '2016-05-02',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1518 弄'
			};
			return {
				name: 'zfh',
				tableData: Array(20).fill(item),
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
					roomtemp: 27,
					roomId: '2-123',
					onoff: '开',
					time: 30
				}
			}
		},
		methods: {
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
			returnTemp(temp) {
				this.RoomInfo.roomtemp = temp
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
