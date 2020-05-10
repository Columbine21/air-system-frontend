<template>

	<el-container style="height: 750px; border: 1px solid #eee">
		<el-aside width="200px" style="background-color: rgb(84, 92, 100)">
			<el-menu :default-active="set" @select="showChange" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
				<el-menu-item index="info">
					<template slot="title"><i class="el-icon-s-platform"></i>显示面板</template>
				</el-menu-item>
				<el-menu-item index="set">
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
				<dev v-show="show_info">
					<span>info</span>
				</dev>

				<dev v-show="show_set">
					<span>设定温度： {{marksTemp[tempture]}} </span> 
					<div class="block">
						<span class="demonstration">温度</span>
						<el-slider v-model="tempture" step="20" show-stops label='12313' :marks="marksTemp">
						</el-slider>
					</div>
					<div class="block">
						<span>设定风速：{{marksWind[wind]}}</span>
						<span class="demonstration">风速</span>
						<el-slider v-model="wind" step="50" input-size="small" show-stops :marks="marksWind">
						</el-slider>
					</div>
				</dev>

				<dev v-show="show_money">
					<span>当前费用：{{money}}</span>

				</dev>

				<dev v-show="show_temp">
					<span>当前温度{{roomtemp}}</span>
				</dev>
			</el-main>
		</el-container>

	</el-container>

</template>

<script>
	export default {
		name: 'Users',
		data() {
			const item = {
				date: '2016-05-02',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1518 弄'
			};
			return {
				name: 'zfh',
				tableData: Array(20).fill(item),
				show_info: true,
				show_set: false,
				show_money: false,
				show_temp: false,
				machine: true,
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
				wind: 0,
				tempture: 0,
				money: 0,
				roomtemp: 27
			}
		},
		methods: {
			showChange(type, p) {
				console.log(type + '...' + p)
				if (type === 'info') {
					this.show_info = true
					this.show_money = false
					this.show_set = false
					this.show_temp = false
				} else if (type === 'money') {
					this.show_info = false
					this.show_money = true
					this.show_set = false
					this.show_temp = false
				} else if (type === 'set') {
					this.show_info = false
					this.show_money = false
					this.show_set = true
					this.show_temp = false
				} else if (type === 'temp') {
					this.show_info = false
					this.show_money = false
					this.show_set = false
					this.show_temp = true
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.el-header {
		background-color: #B3C0D1;
		color: #333;
		line-height: 60px;
	}

	.el-aside {
		color: #333;
	}
</style>
