<template>
	<div>
		<el-divider direction="vertical"></el-divider>
		<el-card style="margin:7vh 10%; width: 50%; height: 80%;">
			<div slot="header">
				<span>房间 {{SlaveBasic.RoomNo}} 显示面板</span>
			</div>
			<el-row :gutter="7">
				<el-col :span="11">
					<el-card style="margin:2vh 10%; width: 80%; height: 80%;" shadow="hover">
						<div style="margin-top: 3vh">
							<span>当前状态&ensp; :&ensp;{{SlaveBasic.ASstate}}</span>
						</div>
						<div style="margin-top: 5vh">
							<span>运行状态&ensp; :&ensp;{{SlaveBasic.State}}</span>
						</div>
						<div style="margin-top: 5vh">
							<span>运行时间&ensp; :&ensp;{{SlaveBasic.UseTime}} 秒</span>
						</div>
						<div style="margin-top: 5vh">
							<span>总花费&ensp; :&ensp;{{SlaveBasic.TotalMoney}} 元</span>
						</div>
						<div style="margin-top: 5vh">
							<span>刷新频率&ensp; :&ensp;{{MasterSettings.SetFrequence}} </span>
						</div>
					</el-card>
				</el-col>
				<el-col :span="11">
					<el-card style="margin:4vh 22%; width: 80%; height: 80%;" shadow="hover">
						<div style="margin-top: 3vh">
							<span>当前温度&ensp; :&ensp;{{SlaveBasic.Temperature}}°C</span>
						</div>
						<div style="margin-top: 5vh">
							<span>设定温度&ensp; :&ensp;{{SlaveSettings.SetTemperature}}</span>
						</div>
						<div style="margin-top: 5vh">
							<span>风速&ensp; :&ensp;{{marksWind[SlaveSettings.SetWind]}}</span>
						</div>
						<div style="margin-top: 5vh">
							<span>消耗能量&ensp; :&ensp;{{SlaveBasic.TotalEnergy}} </span>
						</div>
						<div style="margin-top: 1vh">
							<span>&ensp; &ensp;</span>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'displayPanel',
		data() {
			return {
				marksWind: {
					0: 'LOW',
					50: 'MEDIUM',
					100: 'HIGH'
				}
			}
		},
		computed: {
			SlaveBasic() {
				return this.$store.state.SlaveState.Basic
			},
			SlaveSettings() {
				return this.$store.state.SlaveState.Settings
			},
			MasterSettings() {
				return this.$store.state.MasterState.Settings
			}
		}
	}
</script>

<style>
	.el-divider--vertical {
		position: absolute;
		top: 25%;
		height: 50%;
		left: 48%;
		margin: 0;
	}
</style>
