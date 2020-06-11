<template>
	<div>
		<el-card style="margin:7vh 20%; width: 60%;">
			<div slot="header">
				<span>空调控制</span>
			</div>
			<div>当前状态&ensp; :&ensp; {{SlaveBasic.State}}</div>
			<div style="margin-top: 5vh">
				<span>温度</span>
				<div style="margin-top: 3vh; text-align: center">
					<el-input-number v-if='view' v-model="CentTemp" :min="SetTemp.min" :max="SetTemp.max" @change="changeInfo" />
				</div>
			</div>
			<div style="margin-top: 7vh">
				<span>风速</span>
				<div style="margin-top: 3vh;  width: 60%; text-align: center; margin-left: 15vh;">
					<el-slider v-model="CentWind" v-on:change="changeInfo" :step='50' show-stops :marks="marksWind">
					</el-slider>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'setting',
		data() {
			return {
				marksWind: {
					0: 'low',
					50: 'medium',
					100: 'high'
				},
				SetTemp: {
					min: 18,
					max: 25
				},
				CentWind: 0,
				CentTemp: 0,
				time0: 0,
				time1: 0,
				view: true,
				timer: ''
			}
		},
		mounted() {
			this.init()
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
			},
			MasterSettings() {
				return this.$store.state.MasterState.Settings
			}
		},
		methods: {
			init() {
				// this.getDefaultTemp()
				this.CentTemp = this.MasterSettings.SetTemperature
				this.CentWind = this.SlaveSettings.SetWind
				if (this.SlaveBasic.State === '制热') {
					this.SetTemp.min = 25
					this.SetTemp.max = 30
				}
			},
			changeInfo(currentValue, oldValue) {
				// this.getDefaultTemp()
				if (this.SlaveBasic.State === '制冷') {
					if (this.CentTemp > parseFloat(this.SlaveBasic.Temperature) || this.CentTemp < this.MasterSettings.SetTemperature) {
						if (parseFloat(this.CentTemp) > parseFloat(this.SlaveBasic.Temperature)) {
							alert('温度设置失败：设定温度高于室温')
						} else {
							alert('温度设置失败：设定温度低于主机温度')
						}
						this.CentTemp = oldValue
						console.log('nowTemp:' + this.SlaveBasic.Temperature)
						console.log('setTemp:' + currentValue)
						console.log('masterTemp:' + this.MasterSettings.SetTemperature)
						this.reload()
						return
					}
				} else {
					if (this.CentTemp < parseFloat(this.SlaveBasic.Temperature) || this.CentTemp > this.MasterSettings.SetTemperature) {
						this.CentTemp = oldValue
						if (this.CentTemp < parseFloat(this.SlaveBasic.Temperature)) {
							alert('温度设置失败：设定温度低于室温')
						} else {
							alert('温度设置失败：设定温度高于主机温度')
						}
						console.log('nowTemp:' + this.SlaveBasic.Temperature)
						console.log('setTemp:' + currentValue)
						console.log('masterTemp:' + this.MasterSettings.SetTemperature)
						this.reload()
						return
					}
				}
				this.$store.commit('UpdateSlaveSettings', {
					Temp: this.CentTemp,
					Wind: this.CentWind
				})
				if (this.time0 === 0) {
					this.time0 = new Date().getMilliseconds()
					this.timer = setTimeout(this.sendSettings, 1000)
				} else {
					this.time1 = new Date().getMilliseconds()
					if (this.time1 - this.time0 < 1000) {
						this.sendSettings()
						clearTimeout(this.timer)
					}
					this.time0 = 0
					this.time1 = 0
				}
			},
			sendSettings() {
				this.time0 = 0
				this.time1 = 0
				/* axios({
					method: 'put',
					url: 'localhost:8080/slave/settings', // 发送设置参数
					data: {
						setTemp: this.Settings.temperature,
						setWind: this.Settings.wind
					},
					headers: {
						'Authorization': 'Bearer ' + this.Customer.token
					}
				}).then(this.getSendSettingsRes) */
			},
			getSendSettingsRes(res) {
				// todo
				console.log(res)
			},
			reload() {
				this.view = false
				this.$nextTick(function() {
					this.view = true
				})
			},
			getDefaultTemp() { // 获取主机温度
				axios({
					method: 'get',
					url: 'http://101.200.120.102:8080/slave/default',
					data: {},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(this.getDefaultTempRes)
			},
			getDefaultTempRes(res) {
				if (res.data.code !== 200) {
					console.log('请求主机设定温度失败')
					alert('请求主机设定温度失败')
				} else {
					var mode = ''
					if (res.data.data.mode === 'COOL') {
						mode = '制冷'
					} else {
						mode = '制热'
					}
					this.$store.commit('UpdateMasterState', {
						Temp: res.data.data.t,
						Mode: mode
					})
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
</style>
