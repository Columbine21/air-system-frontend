<template>
	<div>
		<el-card style="margin:7vh 20%; width: 60%;">
			<div slot="header">
				<span>空调控制</span>
			</div>
			<div>当前状态&ensp; :&ensp; {{Settings.state}}</div>
			<div style="margin-top: 5vh">
				<span>温度</span>
				<el-slider style="margin: 0 1vw" v-model="CentTemp" v-on:change="changeInfo" :step='20' show-stops :marks="marksTemp">
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
	export default {
		name: 'setting',
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
					0: '26°C',
					20: '27°C',
					40: '28°C',
					60: '29°C',
					80: '30°C',
					100: '31°C'
				},
				CentWind: 0,
				CentTemp: 0
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				this.Settings.temperature = this.marksTemp[this.CentTemp]
				this.Settings.wind = this.marksWind[this.CentWind]
				this.$emit('SettingReq', this.Settings.wind, this.Settings.temperature, this.Settings.state)
			},
			changeInfo() {
				this.Settings.temperature = this.marksTemp[this.CentTemp]
				this.Settings.wind = this.marksWind[this.CentWind]
				this.$emit('SettingReq', this.Settings.wind, this.Settings.temperature, this.Settings.state)
			}
		}
	}
</script>

<style lang="stylus" scoped>
</style>
