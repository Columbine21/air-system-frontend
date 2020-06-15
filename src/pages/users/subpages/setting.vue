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
					0: 'LOW',
					50: 'MID',
					100: 'HIGH'
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
				timer: '',
				timer2: ''
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
				this.getDefaultTemp()
				this.CentTemp = this.SlaveSettings.SetTemperature
				this.CentWind = this.SlaveSettings.SetWind
				if (this.SlaveBasic.State === '制热') {
					this.SetTemp.min = 25
					this.SetTemp.max = 30
				}
				this.timer2 = setInterval(this.getDefaultTemp, 4000);
			},
			changeInfo(currentValue, oldValue) {
				this.getDefaultTemp()
				if (this.SlaveBasic.State === '制冷') {
					if (this.CentTemp > parseFloat(this.SlaveBasic.Temperature) || this.CentTemp < this.MasterSettings.SetTemperature) {
						if (parseFloat(this.CentTemp) > parseFloat(this.SlaveBasic.Temperature)) {
							this.$message('温度设置失败：设定温度高于室温')
						} else {
							this.$message('温度设置失败：设定温度低于主机温度')
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
						if (parseFloat(this.CentTemp) < parseFloat(this.SlaveBasic.Temperature)) {
							this.$message('温度设置失败：设定温度低于室温')
						} else {
							this.$message('温度设置失败：设定温度高于主机温度')
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
				clearTimeout(this.timer)
				this.timer = setTimeout(this.sendSettings, 1000)
			},
			sendSettings() {
				this.$message('设置请求： 温度： ' + this.CentTemp + '°C   风速： ' + this.marksWind[this.CentWind])
				this.time0 = 0
				axios({
					method: 'post',
					url: '/slave/set', // 发送设置参数
					data: {
						t: this.SlaveSettings.SetTemperature,
						wind: this.marksWind[this.SlaveSettings.SetWind]
					},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					console.log('设置参数发送：')
					console.log(res)
					if (res.data.code === 200) {
						console.log('temp: ' + this.CentTemp + this.CentWind)
						this.$message('设置成功')
					}
				})
			},
			reload() {
				this.view = false
				this.$nextTick(function() {
					this.view = true
				})
			},
			getDefaultTemp() { // 获取主机温度
				axios.get('/slave/default', {
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(this.getDefaultTempRes)
			},
			getDefaultTempRes(res) {
				// console.log('获取主机温度请求：')
				if (res.data.code !== 200) {
					console.log('请求主机设定温度失败')
					this.$message('请求主机设定温度失败')
				} else {
					// console.log(res.data)
					var mode = ''
					if (res.data.data.mode === 'COOL') {
						mode = '制冷'
					} else {
						mode = '制热'
					}
					if (mode !== this.SlaveBasic.State) {
						this.CentTemp = res.data.data.t
						this.reload()
					}
					this.$store.commit('UpdateMasterState', {
						Temp: res.data.data.t,
						Mode: mode
					})
				}
			}
		},
		beforeDestroy() {
			clearInterval(this.timer2);
			this.timer2 = null;
			clearTimeout(this.timer)
		}
	}
</script>

<style lang="stylus" scoped>
</style>
