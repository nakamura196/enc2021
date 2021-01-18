<template>
  <span>
    {{ $t('search_result') }}: {{ result.hits ? total.toLocaleString() : 0
    }}{{ $t('hits') }}
    <v-tooltip v-if="result.hits.total.value == 10000" bottom>
      <template v-slot:activator="{ on }">
        <i class="mdi mdi-information" v-on="on"></i>
      </template>
      <span>{{ $t('pageAlert2') }}</span>
    </v-tooltip>
  </span>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class searchfilter extends Vue {
  get result() {
    return this.$store.state.result
  }

  get total(): number {
    const agg: string = 'label'
    let total: number = 0
    const buckets = this.result.aggregations[agg].buckets
    for (let i = 0; i < buckets.length; i++) {
      total += buckets[i].doc_count
    }
    return total
  }
}
</script>
