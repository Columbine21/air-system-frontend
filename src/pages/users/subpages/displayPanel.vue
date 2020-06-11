<template>
	<div>
		<el-card style="margin:7vh 20%; width: 60%;">
			<div slot="header">
				<span>房间{{SlaveBasic.RoomNo}}空调状态</span>
			</div>
			<div>当前状态&ensp; :&ensp;{{SlaveBasic.ASstate}}</div>
			<div style="margin-top: 5vh">
				<span>运行状态&ensp; :&ensp;{{SlaveBasic.State}}</span>
			</div>
			<div style="margin-top: 5vh">
				<span>运行时间&ensp; :&ensp;{{SlaveBasic.UseTime}} 分钟</span>
			</div>
			<div style="margin-top: 5vh">
				<span>当前温度&ensp; :&ensp;{{SlaveBasic.Temperature}}°C</span>
			</div>
			<div style="margin-top: 5vh">
				<span>设定温度&ensp; :&ensp;{{SlaveSettings.SetTemperature}}</span>
			</div>
			<div style="margin-top: 5vh">
				<span>风速&ensp; :&ensp;{{marksWind[SlaveSettings.SetWind]}}</span>
			</div>
			<div style="margin-top: 5vh">
				<span>总花费&ensp; :&ensp;{{SlaveBasic.TotalMoney}} 元</span>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'displayPanel',
		data() {
			return {
				marksWind: {
					0: 'low',
					50: 'medium',
					100: 'high'
				}
			}
		},
		computed: {
			SlaveBasic() {
				return this.$store.state.SlaveState.Basic
			},
			SlaveSettings() {
				return this.$store.state.SlaveState.Settings
			}
		}
	}
</script>

<style>
</style>
