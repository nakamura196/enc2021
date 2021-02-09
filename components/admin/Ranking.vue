<template>
  <div>
    <h3 class="mt-10">{{ $t('ユーザ別') }}</h3>
    <Chart :chart-data="chartData" :chart-option="chartOption"></Chart>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import firebase from '@/plugins/firebase'
import Chart from '~/components/admin/Chart.vue'

@Component({
  components: {
    Chart,
  },
})
export default class Ranking extends Vue {
  users: any[] = []
  chartData: any = {}
  chartOption: any = {
    // アスペクト比を固定しないように変更
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            // stepSize: 1,
          },
        },
      ],
    },
  }

  created() {
    firebase
      .firestore()
      .collection('users')
      .onSnapshot(
        (res) => {
          const labels: string[] = []
          const dataset: number[] = []

          const map = {}

          res.forEach(function (doc) {
            const user = doc.data()
            map[user.name] = user.authorities ? user.authorities.length : 0
          })

          const arr = Object.keys(map).map((e) => ({ key: e, value: map[e] }))

          arr.sort(function (a, b) {
            if (a.value < b.value) return 1
            if (a.value > b.value) return -1
            return 0
          })

          for (let i = 0; i < arr.length; i++) {
            const obj = arr[i]
            labels.push(obj.key)
            dataset.push(obj.value)
          }

          this.chartData = {
            labels,
            datasets: [{ data: dataset, label: this.$t('authority') }],
          }
        },
        (error) => {
          console.error('GET_REALTIME_LIST', error)
        }
      )
  }
}
</script>
