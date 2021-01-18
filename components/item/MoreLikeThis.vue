<template>
  <div v-if="moreLikeThisData.length > 0">
    <!-- <v-divider class="my-10" /> -->
    <h3 class="mb-4">
      {{ $t('more_like_this') }}
    </h3>
    <HorizontalItems :key="itemId" :data="moreLikeThisData" />
  </div>
</template>

<script lang="ts">
import { Prop, Component, Watch, Vue } from 'nuxt-property-decorator'
import axios from 'axios'
import HorizontalItems from '../display/HorizontalItems.vue'

@Component({
  components: {
    HorizontalItems,
  },
})
export default class morelikethis extends Vue {
  moreLikeThisData: any[] = []

  @Prop({
    required: true,
  })
  itemId!: string

  @Prop({
    required: true,
  })
  query!: string

  mounted() {
    this.moreLikeThis()
  }

  @Watch('itemId')
  watchId(): void {
    this.moreLikeThis()
  }

  async moreLikeThis() {
    const itemId = this.itemId

    const esQuery = {
      query: {
        more_like_this: {
          fields: ['tags'],
          like: this.query,
          min_term_freq: 0,
          min_doc_freq: 0,
          max_query_terms: 12,
        },
      },

      size: 21,
    }

    const url = 'https://gimli-eu-west-1.searchly.com/main/_search'

    const response = await axios.post(url, esQuery, {
      auth: {
        username: 'search',
        password: 'lqtia2ngm63yi5tam7ewxjvqhogjem82',
      },
    })

    const result = response.data.hits.hits

    const result2 = []
    if (result.length > 1) {
      for (let i = 0; i < result.length; i++) {
        const obj = result[i]
        if (obj._id !== itemId) {
          obj.access = this.$utils.formatArrayValue(obj._source.tags)
          result2.push(obj)
        }
      }
    }

    this.moreLikeThisData = result2
  }
}
</script>
