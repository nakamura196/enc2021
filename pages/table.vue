<template>
  <div>
    <v-sheet color="grey lighten-2">
      <v-container fluid class="py-4">
        <v-breadcrumbs class="py-0" :items="breadcrumbs">
          <template #divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-container>
    </v-sheet>
    <v-container fluid class="my-5">
      <div class="mb-5 text-center">
        <v-btn
          color="primary"
          class="ma-1"
          :href="
            baseUrl + localePath({ name: 'table', query: { id: source.prev } })
          "
          ><v-icon>mdi-arrow-left-bold</v-icon>
          {{ $t('前の大項目に進む') }}</v-btn
        >
        <v-btn
          v-if="false"
          class="ma-1"
          :to="localePath({ name: 'edit', query: { id } })"
          >{{ $t('編集') }}</v-btn
        >
        <v-btn
          color="primary"
          class="ma-1"
          :href="
            baseUrl + localePath({ name: 'table', query: { id: source.next } })
          "
          ><v-icon>mdi-arrow-right-bold</v-icon>
          {{ $t('次の大項目に進む') }}</v-btn
        >
      </div>
      <v-sheet class="pa-3 text-center" dark color="primary">
        <small>
          {{ $t('項目名') }}[{{ source.title }}], {{ $t('著者') }}[{{
            source.authors.join(', ')
          }}],
          {{ lang == 'ja' ? source.publish_year + '年' : source.publish_year }},
          {{ getVolAndPage }}
        </small>
      </v-sheet>

      <v-card class="pa-4 mt-5" flat>
        <Table :id="id" :data="authorities"></Table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import firebase from '@/plugins/firebase'

export default {
  async asyncData({ payload, app }) {
    if (payload) {
      return payload
    } else {
      const id = app.context.route.query.id || '2-1'

      const response = await axios.get(
        process.env.BASE_URL + '/data/json/' + id + '.json'
      )

      const source = response.data

      return { source, id }
    }
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      title: process.env.siteName,
      authorities: [],
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale
    },
    userName() {
      return this.$store.getters.getUserName
    },
    isSignedIn() {
      return this.$store.getters.getIsSignedIn
    },
    userUid() {
      return this.$store.getters.getUserUid
    },
    getVolAndPage() {
      const source = this.source
      return this.lang === 'ja'
        ? source.tome + '巻, p.' + source.pages
        : 'Vol.' + source.tome + ', p.' + source.pages
    },
    breadcrumbs() {
      const source = this.source
      return [
        {
          text: this.$t('HOME'),
          disabled: false,
          to: this.localePath({ name: 'index' }),
          exact: true,
        },
        {
          text:
            (this.lang === 'en' ? `Vol. ${2}` : `第${2}巻`) +
            ' ' +
            this.$t('目次'),
          disabled: false,
          to: this.localePath({ name: 'toc' }),
          exact: true,
        },
        {
          disabled: false,
          to: this.localePath({ name: 'edit', query: { id: this.id } }),
          exact: true,
          text:
            `${this.$t('項目名')}[${source.title}], ${this.$t(
              '著者'
            )}[${source.authors.join(', ')}],` +
            (this.lang === 'ja'
              ? `${source.publish_year}年`
              : source.publish_year) +
            ', ' +
            this.getVolAndPage,
        },
        {
          text: this.$t('一覧'),
        },
      ]
    },
  },
  created() {
    firebase
      .firestore()
      .collection('items')
      .doc(this.id)
      .collection('authorities')
      .orderBy('createTime')
      .onSnapshot(
        (res) => {
          const authorities = []
          res.forEach(function (doc) {
            const authority = doc.data()
            authority.geel_id = doc.id
            authorities.push(authority)
          })
          this.authorities = authorities
        },
        (error) => {
          console.error('GET_REALTIME_LIST', error)
        }
      )
  },
  methods: {},
  head() {
    const title = this.title
    return {
      titleTemplate: null,
      title,
    }
  },
}
</script>
<style>
i {
  font-weight: bold;
}
.prp-pages-output a {
  color: #ff9800 !important;
}
.sc {
  font-variant: small-caps;
}
</style>
