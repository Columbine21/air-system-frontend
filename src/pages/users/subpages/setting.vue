<template>
	<div>
		<el-card style="margin:7vh 20%; width: 60%;">
			<div slot="header">
				<span>空调控制</span>
			</div>
			<div>当前状态&ensp; :&ensp; {{Settings.state}}</div>
			<div style="margin-top: 5vh">
				<span>温度</span>
				<el-slider style="margin: 0 1vw" v-model="CentTemp" v-on:change="changeInfo" :step='14.29' show-stops :marks="marksTemp">
				</el-slider>
			</div>
			<div style="margin-top: 7vh">
				<span>风速</span>
				<el-slider style="margin: 0 1vw" v-model="CentWind" v-on:change="changeInfo" :step='50' show-stops :marks="marksWind">
				</el-slider>
			</div>
		</el-card>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'setting',
		props: ['nowTemp', 'state', 'token'],
		data() {
			return {
				Settings: {
					wind: 'low',
					temperature: '26°C',
					state: '制冷'
				},
				marksWind: {
					0: 'low',
					50: 'medium',
					100: 'high'
				},
				marksTemp: {
					0: '18°C',
					14.29: '19°C',
					28.58: '20°C',
					42.87: '21°C',
					57.16: '22°C',
					71.46: '23°C',
					85.74: '24°C',
					100: '25°C'
				},
				CentWind: 0,
				CentTemp: 0,
				CentTemp0: 0,
				time0: 0,
				time1: 0
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				this.Settings.temperature = this.marksTemp[this.CentTemp]
				this.Settings.wind = this.marksWind[this.CentWind]
				console.log(this.state)
				this.Settings.state = this.state
				this.$emit('SettingReq', this.Settings.wind, this.Settings.temperature, this.Settings.state)
			},
			changeInfo() {
				if (this.state === '制冷') {
					if (parseFloat(this.marksTemp[this.CentTemp]) > parseFloat(this.nowTemp)) {
						console.log(parseInt(this.marksTemp[this.CentTemp]))
						console.log(parseFloat(this.nowTemp))
						this.CentTemp = this.CentTemp0
						alert('温度设置失败')
						return
					}
				} else {
					if (this.marksTemp[this.CentTemp] < this.nowTemp) {
						this.CentTemp = this.CentTemp0
						alert('温度设置失败2')
						return
					}
				}
				this.Settings.temperature = this.marksTemp[this.CentTemp]
				this.Settings.wind = this.marksWind[this.CentWind]
				this.$emit('SettingReq', this.Settings.wind, this.Settings.temperature, this.Settings.state)
				this.CentTemp0 = this.CentTemp
				if (this.time0 === 0) {
					this.time0 = new Date().getMilliseconds()
				} else {
					this.time1 = new Date().getMilliseconds()
					if (this.time1 - this.time0 < 1000) {
						// this.sendSettings()
					}
					this.time0 = 0
					this.time1 = 0
				}
			},
			sendSettings() {
				axios({
					method: 'put',
					url: 'localhost:8080/slave/settings', // 发送设置参数
					data: {
						setTemp: this.Settings.temperature,
						setWind: this.Settings.wind
					},
					headers: {
						'Authorization': 'Bearer ' + this.token
					}
				}).then(this.getSendSettingsRes)
			},
			getSendSettingsRes(res) {
				// todo
				console.log(res)
			}
		}
	}
</script>

<style lang="stylus" scoped>
</style>
