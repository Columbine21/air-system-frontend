<template>
	<div>
		<el-card style="margin:7vh 20%; width: 60%;">
			<div slot="header">
				<span>房间{{roomId}}空调状态</span>
			</div>
			<div>当前状态&ensp; :&ensp;{{onoff}}</div>
			<div style="margin-top: 5vh">
				<span>运行状态&ensp; :&ensp;{{state}}</span>
			</div>
			<div style="margin-top: 5vh">
				<span>运行时间&ensp; :&ensp;{{time}} 分钟</span>
			</div>
			<div style="margin-top: 5vh">
				<span>当前温度&ensp; :&ensp;{{temp}}°C</span>
			</div>
			<div style="margin-top: 5vh">
				<span>设定温度&ensp; :&ensp;{{setTemp}}</span>
			</div>
			<div style="margin-top: 5vh">
				<span>风速&ensp; :&ensp;{{wind}}</span>
			</div>
			<div style="margin-top: 5vh">
				<span>总花费&ensp; :&ensp;{{money}} 元</span>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'displayPanel',
		props: ['temp', 'setTemp', 'wind', 'money', 'time', 'state', 'on-off', 'roomId', 'onoff']
	}
</script>

<style>
</style>
