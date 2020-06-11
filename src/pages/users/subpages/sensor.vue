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
				frq: 0
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
				} else if (this.SlaveBasic.ASstate === '待机') {
					if (this.SlaveBasic.State === '制冷') {
						this.$store.commit('UpdateSlaveTemp', (parseFloat(this.SlaveBasic.Temperature) + this.frq).toFixed(2))
						if (this.SlaveBasic.Temperature - this.SlaveSettings.SetTemperature > 1) {
							this.$store.commit('UpdateASstate', '送风')
							this.sendWindReq()
						}
					} else {
						this.$store.commit('UpdateSlaveTemp', (parseFloat(this.SlaveBasic.Temperature) - this.frq).toFixed(2))
						if (this.SlaveSettings.SetTemperature - this.SlaveBasic.Temperature > 1) {
							this.$store.commit('UpdateASstate', '送风')
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
				axios({
					method: 'put',
					url: 'http://101.200.120.102:8080/slave/sensor',
					data: {
						'roomT': this.SlaveBasic.Temperature
					},
					headers: {
						'Authorization': this.Customer.token
					}
				}).then(this.getSendTempRes)
			},
			getSendTempRes(res) {
				if (res.data.code === 400) {
					this.alertTokenOverdue()
				} else if (res.data.data.interval_ms !== 0) {
					this.$store.commit('UpdateSetFrequence', res.data.data.interval_ms)
				}
			},
			alertTokenOverdue() {
				alert('Token已过期，请重新登陆')
				this.$router.push('login')
			},
			sendWindReq() {
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
					console.log(res)
				}).catch(function(err) {
					console.log(err);
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
					console.log(res)
				}).catch(function(err) {
					console.log(err);
				});
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
