<template>
	<div></div>
</template>

<script>
	import axios from 'axios'
	axios.defaults.retry = 4;
	axios.defaults.retryDelay = 1000;
	axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
		var config = err.config;
		if (!config || !config.retry) return Promise.reject(err);
		console.log('第' + config.__retryCount + '次重连')
		alert('第' + config.__retryCount + '次重连')
		config.__retryCount = config.__retryCount || 0;
		if (config.__retryCount >= config.retry) {
			return Promise.reject(err);
		}
		config.__retryCount += 1;
		var backoff = new Promise(function(resolve) {
			setTimeout(function() {
				resolve();
			}, config.retryDelay || 1);
		});
		return backoff.then(function() {
			return axios(config);
		});
	});
	export default {
		name: 'sensor',
		data() {
			return {
				timer1: '',
				timer2: '',
				timer3: '',
				timer4: '',
				frq: 0,
				retry: 0
			}
		},
		mounted() {
			this.init();
			this.refresh();
			this.timer1 = setInterval(this.get, 3000);
			this.timer2 = setInterval(this.refresh, 10);
		},
		methods: {
			init() {
				this.timer3 = setInterval(this.sendTemp, 2000);
			},
			get() {
				this.refresh()
				if (this.SlaveBasic.ASstate === '送风') {
					if (this.SlaveBasic.State === '制冷') {
						if ((parseFloat(this.SlaveBasic.Temperature) - this.frq) <= parseFloat(this.SlaveSettings.SetTemperature)) {
							this.$store.commit('UpdateSlaveTemp', parseFloat(this.SlaveSettings.SetTemperature).toFixed(2))
							this.sendWindStopReq()
							console.log('sdf1fdas')
							this.$store.commit('UpdateASstate', '待机')
						} else {
							this.$store.commit('UpdateSlaveTemp', (parseFloat(this.SlaveBasic.Temperature) - this.frq).toFixed(2))
						}
					} else {
						if ((parseFloat(this.SlaveBasic.Temperature) + this.frq) >= parseFloat(this.SlaveSettings.SetTemperature)) {
							this.$store.commit('UpdateSlaveTemp', parseFloat(this.SlaveSettings.SetTemperature).toFixed(2))
							this.sendWindStopReq()
							this.$store.commit('UpdateASstate', '待机')
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
				} else if (this.SlaveBasic.ASstate === '待机') {
					this.frq = 0.3
				} else {
					this.frq = 0
				}
			},
			sendTemp() {
				if (this.SlaveBasic.ASstate === '关机') {
					return
				}
				axios({
					method: 'put',
					url: 'http://101.200.120.102:8080/slave/sensor',
					data: {
						'roomT': this.SlaveBasic.Temperature
					},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					if (res.data.code === 400) {
						this.alertTokenOverdue()
					} else if (res.data.data.interval_ms !== 0) {
						this.$store.commit('UpdateSetFrequence', res.data.data.interval_ms)
					}
				}).catch(function(err) {
					console.log(err);
					this.retryConnect(2)
				})
			},
			alertTokenOverdue() {
				alert('Token已过期，请重新登陆')
				this.$router.push('login')
			},
			sendWindReq() {
				if (this.SlaveBasic.ASstate === '关机') {
					return
				}
				console.log(this.Customer.token)
				axios({
					method: 'post',
					url: 'http://101.200.120.102:8080/slave/on',
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
						if (res.data.data === '正在排队') {
							this.$store.commit('UpdateASstate', '等待送风')
						} else {
							this.$store.commit('UpdateASstate', '送风')
						}
					} else {
						alert(res.data.msg)
					}
				}).catch(function(err) {
					console.log(err);
					this.retryConnect(0)
				})
			},
			sendWindStopReq() {
				axios({
					method: 'post',
					url: 'http://101.200.120.102:8080/slave/off',
					data: {
						'ct': this.SlaveBasic.Temperature
					},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(res => {
					console.log('停风请求：')
					console.log(res.data)
				}).catch(function(err) {
					console.log(err);
					this.retryConnect(1)
				});
			},
			retryConnect(code) {
				alert('与主机连接断开')
				this.retry++
				if (this.retry < 4) {
					alert('尝试与主机重连：第' + this.retry + '次')
					if (code === 0) {
						this.timer4 = setTimeout(this.sendWindReq(), 3000)
					} else if (code === 1) {
						this.timer4 = setTimeout(this.sendWindReq(), 3000)
					} else {
						this.timer4 = setTimeout(this.sendTemp(), 3000)
					}
				} else {
					alert('已与主机连接断开')
				}
				this.retry = 0
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
			},
			MAX() {
				return 1000000
			}
		},
		beforeDestroy() {
			clearInterval(this.timer1);
			this.timer1 = null;
			clearInterval(this.timer2);
			this.timer2 = null;
			clearInterval(this.timer3);
			this.timer3 = null;
		}
	}
</script>

<style lang="stylus" scoped>
</style>
