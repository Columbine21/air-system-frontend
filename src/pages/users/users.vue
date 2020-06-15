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
			<el-header>
				<img style="left:10px;width: 9%" src='../../assets/avater.jpeg' />
				<img style="margin:0 25%;width: 15%" src='../../assets/logo.png' />
				<el-popover style="margin:0 1%" trigger="click">
					<div>
						<img style="margin:0 50%;width: 30%" src='../../assets/bill.png' />
					</div>
					<el-button slot="reference" type="primary" round>立即付款</el-button>
				</el-popover>
				<el-button style="margin:0 1%" type="primary" round @click="sendOffReq">关机</el-button>
				<!--el-switch style="left:50px;text-align: right; font-size: 12px" @change="sendOnOff" v-model="machine" active-text="开"
				 inactive-text="关" name="空调开关">
				</el-switch -->
				<span>{{Customer.name}}</span>
			</el-header>

			<el-main>
				<sensor ref="sensor"></sensor>
				<div v-show="show_info">
					<display-panal ref="panal"></display-panal>
				</div>

				<div v-show="show_setting">
					<setting ref="set"></setting>
				</div>

				<div v-show="show_money">
					<charts id='moneyCharts' :timelist='this.RoomInfo.timelist' :datalist='this.RoomInfo.moneylist'></charts>
				</div>

				<div v-show="show_temp">
					<charts id='tempCharts' :timelist='this.RoomInfo.timelist' :datalist='this.RoomInfo.templist'></charts>
				</div>
			</el-main>
		</el-container>
	</el-container>

</template>

<script>
	import setting from '@/pages/users/subpages/setting'
	import charts from '@/pages/users/subpages/charts'
	import displayPanel from '@/pages/users/subpages/displayPanel'
	import sensor from '@/pages/users/subpages/sensor'
	import axios from 'axios'

	export default {
		name: 'Users',
		components: {
			setting: setting,
			charts: charts,
			displayPanal: displayPanel,
			sensor: sensor
		},
		data() {
			return {
				default_selected: 'setting',
				show_info: false,
				show_setting: true,
				show_money: false,
				show_temp: false,
				// 机器状态
				machine: false,
				RoomInfo: {
					timelist: [],
					templist: [],
					moneylist: []
				},
				Timer: {
					timer0: '',
					timer1: '',
					timer2: ''
				},
				retry: 0
			}
		},
		mounted() {
			// timer0 更新timelist templist moneylist
			this.Timer.timer0 = setInterval(this.getlist, 5000);
			// timer1 刷新Error代码
			this.Timer.timer1 = setInterval(this.handleError, 1000);
			this.Timer.timer2 = setInterval(this.getMoney2, 2000);
			this.init()
		},
		methods: {
			/*
			 *  init() initInfo()  初始化
			 */
			init() {
				this.sendOnReq()
				this.RoomInfo.timelist.push(0)
				this.RoomInfo.templist.push(this.SlaveBasic.Temperature)
				this.RoomInfo.moneylist.push(0)
				this.initInfo()
			},
			initInfo() {
				axios.get('/slave/status', {
						headers: {
							'Authorization': this.Customer.token
						}
					})
					.then(res => {
						console.log('init请求：')
						console.log(res.data)
						this.$store.commit('SetSlaveState', res.data.data)
						this.$refs.set.init()
					})
					.catch(function(err) {
						console.log('failed', err);
					});
			},
			/*
			 *  showChange() 切换页面
			 */
			showChange(type, p) {
				// console.log(type + '...' + p)
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
			/*
			 *  getlist() + getMoney() 每10s更新一下templist和moneylist
			 */
			getlist() {
				this.$store.commit('UpdateSlaveTime', 5)
				this.RoomInfo.timelist.push(this.SlaveBasic.UseTime)
				this.RoomInfo.templist.push(this.SlaveBasic.Temperature)
				this.getMoney()
			},
			getMoney() {
				if (this.SlaveBasic.ASstate === '关机') {
					return
				}
				axios.get('/slave/bill', {
						headers: {
							'Authorization': this.Customer.token
						}
					})
					.then(res => {
						console.log('计费请求：')
						console.log(res.data)
						if (parseFloat(res.data.data.cost) >= parseFloat(this.SlaveBasic.TotalMoney)) {
							this.RoomInfo.moneylist.push(this.SlaveBasic.TotalMoney)
						} else {
							this.RoomInfo.moneylist.push(this.SlaveBasic.TotalMoney)
						}
					})
					.catch(function(err) {
						console.log('failed', err);
					});
			},
			getMoney2() {
				if (this.SlaveBasic.ASstate === '关机') {
					return
				}
				axios.get('/slave/bill', {
						headers: {
							'Authorization': this.Customer.token
						}
					})
					.then(res => {
						console.log('计费请求：')
						console.log(res.data)
						if (parseFloat(res.data.data.cost) >= parseFloat(this.SlaveBasic.TotalMoney)) {
							this.$store.commit('UpdateSlaveTotal', {
								cost: parseFloat(res.data.data.cost).toFixed(2),
								P: parseFloat(res.data.data.p).toFixed(2)
							})
							this.$refs.panal.change()
						} 
					})
			},
			/*
			 *  sendOnOff 开关状态变化时被调用
			 *  sendOffReq（） 发送关机请求
			 *  sendOnReq（） 发送开机请求
			 */
			/* sendOnOff() {
				if (this.machine === false) {
					this.sendOffReq()
				} else {
					this.sendOnReq()
				}
			}, */
			sendOffReq() {
				// this.$refs.sensor.sendWindStopReq()
				axios({
					method: 'get',
					url: '/slave/close', // 关闭请求
					data: {},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					// console.log('关闭请求：')
					// console.log(res.data)
					if (res.data.code === 200) {
						this.$refs.sensor.code = 0
						this.$store.commit('UpdateASstate', '关机')
						this.$router.push('login')
					}
				})
			},
			sendOnReq() {
				axios({
					method: 'get',
					url: '/slave/start', // 开启请求
					data: {},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					// console.log('开机请求：')
					// console.log(res.data)
					if (res.data.code === 200) {
						this.$store.commit('UpdateASstate', '待机')
					} else {
						this.machine = false
						alert(res.data.msg)
						alert('请联系前台后重新登录')
						this.$router.push('login')
					}
				})
			},
			/*
			 *  循环处理错误代码
			 */
			handleError() {
				var e = this.$store.state.SlaveState.Error
				// console.log('err:' + e)
				if (e !== 0) {
					if (e === 1) {
						this.sendOffReq()
						this.sendOnReq()
						this.$store.commit('UpdateSlaveError', 0)
					}
				}
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
			clearInterval(this.Timer.timer0);
			this.Timer.timer0 = null;
			clearInterval(this.Timer.timer1);
			this.Timer.timer1 = null;
			clearInterval(this.Timer.timer2);
			this.Timer.timer2 = null;
			this.sendOffReq()
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
