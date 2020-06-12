<template>
	<div></div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'sensor',
		data() {
			return {
				timer1: '',
				timer2: '',
				timer3: '',
				timer4: '',
				timer5: '',
				frq: 0,
				retry: 0,
				code: 0,
				msg: ''
			}
		},
		mounted() {
			this.init();
			this.refresh();
			this.timer1 = setInterval(this.get, 3000);
			this.timer2 = setInterval(this.refresh, 10);
			this.timer4 = setInterval(this.getWind, 1000);
		},
		methods: {
			init() {
				this.timer3 = setInterval(this.sendTemp, 5000);
			},
			/*
			* get() 按照3s的频率进行刷新 室温
			*/
			get() {
				this.refresh()
				if (this.SlaveBasic.ASstate === '送风') {
					if (this.SlaveBasic.State === '制冷') {
						if ((parseFloat(this.SlaveBasic.Temperature) - this.frq) <= parseFloat(this.SlaveSettings.SetTemperature)) {
							this.$store.commit('UpdateSlaveTemp', parseFloat(this.SlaveSettings.SetTemperature).toFixed(2))
							this.sendWindStopReq()
						} else {
							this.$store.commit('UpdateSlaveTemp', (parseFloat(this.SlaveBasic.Temperature) - this.frq).toFixed(2))
						}
					} else {
						if ((parseFloat(this.SlaveBasic.Temperature) + this.frq) >= parseFloat(this.SlaveSettings.SetTemperature)) {
							this.$store.commit('UpdateSlaveTemp', parseFloat(this.SlaveSettings.SetTemperature).toFixed(2))
							this.sendWindStopReq()
						} else {
							this.$store.commit('UpdateSlaveTemp', (parseFloat(this.SlaveBasic.Temperature) + this.frq).toFixed(2))
						}
					}
				} else {
					if (this.SlaveBasic.State === '制冷') {
						this.$store.commit('UpdateSlaveTemp', (parseFloat(this.SlaveBasic.Temperature) + this.frq).toFixed(2))
						if (this.SlaveBasic.Temperature - this.SlaveSettings.SetTemperature > 1) {
							this.sendWindReq()
						}
					} else {
						this.$store.commit('UpdateSlaveTemp', (parseFloat(this.SlaveBasic.Temperature) - this.frq).toFixed(2))
						if (this.SlaveSettings.SetTemperature - this.SlaveBasic.Temperature > 1) {
							this.sendWindReq()
						}
					}
				}
			},
			/*
			* get() 按照1s的频率进行刷新 送风情况
			*/
			getWind() {
				if (this.SlaveBasic.ASstate === '关机' || this.code === 0) {
					return
				}
				axios.get('/slave/wind', {
						headers: {
							'Authorization': this.Customer.token
						}
					})
					.then(res => {
						console.log('get Wind请求：')
						console.log(res.data)
						if (res.data.code === 200) {
							this.$store.commit('UpdateASstate', '送风')
						} else {
							if (Math.abs(parseFloat(this.SlaveBasic.Temperature) - parseFloat(this.SlaveSettings.SetTemperature)) > 1) {
								this.$store.commit('UpdateASstate', '等待送风')
							} else {
								this.$store.commit('UpdateASstate', '待机')
							}
							if (res.data.msg !== '未送风') {
								if (this.msg !== res.data.msg) {
									alert(res.data.msg)
									this.msg = res.data.msg
								}
							}
						}
					})
					.catch(function(err) {
						console.log('failed', err);
					});
			},
			/*
			* refresh（） 按照10ms的频率进行刷新 frq（更新室温）
			*/
			refresh() {
				if (this.SlaveBasic.ASstate === '送风') {
					switch (this.SlaveSettings.SetWind) {
						case 0:
							this.frq = 0.12
							break
						case 50:
							this.frq = 0.15
							break
						case 100:
							this.frq = 0.2
							break
						default:
							break
					}
				} else {
					this.frq = 0.3
				}
			},
			/*
			* sendTemp（）定时发送温度
			*/
			sendTemp() {
				const that = this
				axios({
					method: 'put',
					url: '/slave/sensor',
					retry: 3,
					retryDelay: 3000,
					data: {
						'roomT': this.SlaveBasic.Temperature
					},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					console.log('发送temp：')
					console.log(res.data)
					this.retry = 0
					if (res.data.code === 400) {
						this.alertTokenOverdue()
					} else if (res.data.data.interval_ms !== 0) {
						this.$store.commit('UpdateSetFrequence', res.data.data.interval_ms)
					}
				}).catch(function(err) {
					console.log(err);
					that.retryConnect()
				})
			},
			alertTokenOverdue() {
				alert('Token已过期，请重新登陆')
				this.$router.push('login')
			},
			/*
			* sendWindReq 送风请求
			* sendWindStopReq 停风请求
			*/
			sendWindReq() {
				if (this.SlaveBasic.ASstate === '关机' || this.code === 1) {
					return
				}
				console.log(this.Customer.token)
				axios({
					method: 'post',
					url: '/slave/on',
					data: {
						'ct': this.SlaveBasic.Temperature
					},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					console.log('送风请求')
					console.log(res.data)
					if (res.data.code === 200) {
						this.code = 1
						if (res.data.data === '正在排队') {
							this.$store.commit('UpdateASstate', '等待送风')
						} else {
							this.$store.commit('UpdateASstate', '送风')
						}
					} else {
						alert(res.data.msg)
						if (res.data.code === 400) {
							this.$store.commit('UpdateSlaveError', 1)
						}
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			sendWindStopReq() {
				this.code = 0
				axios({
					method: 'post',
					url: '/slave/off',
					data: {
						'ct': this.SlaveBasic.Temperature
					},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					console.log('停风请求：')
					console.log(res.data)
					if (res.data.code === 200) {
						this.code = 0
						this.$store.commit('UpdateASstate', '待机')
					} else {
						this.$store.commit('UpdateASstate', '待机')
					}
				}).catch(function(err) {
					console.log(err);
				});
			},
			/*
			* 异常检测
			*/
			retryConnect(code) {
				this.timer5 = setTimeout(this.retryC(), 2000)
			},
			retryC() {
				if (this.retry === 0) {
					this.showMsg('与主机断开连接')
					this.retry++
					return
				}
				if (this.retry < 4) {
					this.showMsg('第' + this.retry + '次重连')
					this.retry++
					this.sendretryTemp()
				} else {
					alert('已与主机连接断开,请重新登陆')
					this.$router.push('login')
				}
			},
			showMsg(str) {
				this.$message(str);
			}
		},
		computed: {
			SettingsFrq() {
				return this.$store.state.MasterState.Settings.SetFrequence
			},
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
			clearInterval(this.timer1);
			this.timer1 = null;
			clearInterval(this.timer2);
			this.timer2 = null;
			clearInterval(this.timer3);
			this.timer3 = null;
			clearInterval(this.timer4);
			this.timer4 = null;
		}
	}
</script>

<style lang="stylus" scoped>
</style>
