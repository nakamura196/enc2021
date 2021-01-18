<template>
  <div v-if="moreLikeThisData.length > 0">
    <!-- <v-divider class="my-10" /> -->
    <h3 class="mb-4">
      {{ $t('similar_images') }}
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
    const images = this.query

    const esQuery = {
      query: {
        terms: {
          _id: images,
        },
      },
    }

    const url = 'https://gimli-eu-west-1.searchly.com/main/_search'

    const response = await axios.post(url, esQuery, {
      auth: {
        username: 'search',
        password: 'lqtia2ngm63yi5tam7ewxjvqhogjem82',
      },
    })

    const result = response.data.hits.hits

    // 一度マップに変換
    const map: any = {}

    for (let i = 0; i < result.length; i++) {
      const obj = result[i]
      obj.access = this.$utils.formatArrayValue(obj._source.tags)
      map[obj._id] = obj
    }

    // 元の順番で並び替え
    const result2 = []
    for (let i = 0; i < images.length; i++) {
      const id = images[i]
      if (map[id]) {
        result2.push(map[id])
      }
    }

    this.moreLikeThisData = result2
  }
}
</script>
