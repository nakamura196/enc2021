<!-- Template Tag can not be merged... -->

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
// import Chart from 'chart.js'
import VueChart from 'vue-chartjs'
// 棒グラフの場合は、Barを使う
// eslint-disable-next-line
const Bar = VueChart.Bar

@Component
// mixinsもBarに変更
export default class ChartLine extends mixins(Bar) {
  @Prop({ default: {} }) chartData!: any
  @Prop({ default: {} }) chartOption!: any

  @Watch('chartData', { deep: true })
  watchTmp() {
    this.main()
  }

  mounted() {
    this.main()
  }

  main() {
    this.renderChart(this.chartData, this.chartOption)
  }
}
</script>
