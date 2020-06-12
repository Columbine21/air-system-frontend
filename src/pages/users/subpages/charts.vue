<template>
	<div>
		<el-card style="margin:5vh 10%; width: 80%;">
			<div slot="header">
				<span>房间：{{SlaveBasic.RoomNo}}</span>
			</div>
			<div>{{text}}&ensp; :&ensp; &ensp; {{chartInfo[chartIndex].nowValue}}&ensp; {{chartInfo[chartIndex].unit}}</div>
			<div style="height: 300px; width: 700px; margin-left: 15%; margin-top: 3vh" :id='id'></div>
		</el-card>
	</div>
</template>

<script>
	import echarts from 'echarts'
	export default {
		name: 'charts',
		props: ['id', 'timelist', 'datalist'],
		data() {
			return {
				statisticInfo: {
					showCharts: true,
					chartOption: {
						title: {
							text: ''
						},
						xAxis: {
							type: 'category',
							data: [],
							name: ''
						},
						yAxis: {
							type: 'value',
							name: '',
							min: ''
						},
						series: {
							data: [],
							type: 'line'
						}
					}
				},
				chartInfo: [{
					timelist: [],
					datalist: [],
					xname: '时间',
					yname: '费用',
					text: '费用变化',
					nowValue: 0,
					unit: '元',
					min: 0
				}, {
					timelist: [],
					datalist: [],
					xname: '时间',
					yname: '温度',
					text: '温度变化',
					nowValue: 27,
					unit: '°C',
					min: 17
				}],
				chartIndex: 0,
				text: '',
				timer: ''
			}
		},
		mounted() {
			this.init()
			this.timer = setInterval(this.showChart, 3000);
		},
		methods: {
			init() {
				if (this.id === 'moneyCharts') {
					this.chartIndex = 0
					this.text = '总计费'
				} else {
					this.chartIndex = 1
					this.text = '当前温度'
				}
				this.statisticInfo.chartOption.xAxis.name = this.chartInfo[this.chartIndex].xname
				this.statisticInfo.chartOption.yAxis.name = this.chartInfo[this.chartIndex].yname
				this.statisticInfo.chartOption.title.text = this.chartInfo[this.chartIndex].text
				this.statisticInfo.chartOption.yAxis.min = this.chartInfo[this.chartIndex].min
			},
			showChart() {
				this.statisticInfo.chartOption.xAxis.data = this.timelist
				this.statisticInfo.chartOption.series.data = this.datalist
				this.chartInfo[this.chartIndex].nowValue = this.datalist[this.datalist.length - 1]
				var chartDom = document.getElementById(this.id)
				var myChart = echarts.init(chartDom)
				myChart.setOption(this.statisticInfo.chartOption, true)
			},
			getId() {
				return this.id
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
			clearInterval(this.timer);
			this.timer = null;
		}
	}
</script>

<style lang="stylus" scoped>
</style>
