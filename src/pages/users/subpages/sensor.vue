<template>
	<div>{{setTemp}}</div>
</template>

<script>
	export default {
		name: 'sensor',
		props: ['state', 'setTemp', 'setWind', 'nowTemp'],
		data() {
			return {
				timer1: '',
				timer2: '',
				temperature: 0,
				setTemp2: 0,
				frq: 0 // update temperature every 3s
			}
		},
		mounted() {
			this.init();
			this.refresh();
			this.timer1 = setInterval(this.get, 3000);
			this.timer2 = setInterval(this.refresh, 1000);
		},
		methods: {
			init() {
				this.temperature = this.nowTemp
				this.setTemp2 = parseInt(this.setTemp)
			},
			get() {
				this.temperature = this.nowTemp
				this.setTemp2 = parseInt(this.setTemp)
				if (this.state === '制冷') {
					if (this.nowTemp > this.setTemp2) {
						this.temperature = this.temperature - this.frq
					} else {
						this.temperature = this.setTemp2
					}
				} else {
					if (this.nowTemp < this.setTemp2) {
						this.temperature = this.temperature + this.frq
					} else {
						this.temperature = this.setTemp2
					}
				}
				// console.log('temp:' + this.temperature + this.state)
			},
			refresh() {
				this.$emit('SensorReq', parseFloat(this.temperature).toFixed(2))
				switch (this.setWind) {
					case 'low':
						this.frq = 0.12
						break
					case 'medium':
						this.frq = 0.15
						break
					case 'high':
						this.frq = 0.2
						break
					default:
						break
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
</style>
