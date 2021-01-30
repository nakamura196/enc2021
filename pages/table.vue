<template>
  <div>
    <v-container fluid class="my-5">
      <v-sheet class="pa-3 text-center" dark color="primary">
        {{ $t('項目名') }}[{{ source.title }}], {{ $t('著者') }}[{{
          source.authors.join(', ')
        }}],
        {{ lang == 'ja' ? source.publish_year + '年' : source.publish_year }},
        {{ getVolAndPage }}
      </v-sheet>

      <div class="mt-5 text-right">
        <v-btn :to="localePath({ name: 'edit', query: { id } })">編集</v-btn>
      </div>

      <v-card class="pa-4 mt-5" flat>
        <Table :data="authorities"></Table>
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
        process.env.BASE_URL + '/data/sample.json'
      )

      const data = response.data

      const keys = Object.keys(data)
      const index = keys.indexOf(id)

      const source = data[id]
      if (index !== keys.length - 1) {
        source.next = keys[index + 1]
      } else {
        source.next = keys[0]
      }

      return { source, id }
    }
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      title: process.env.siteName,
      fields: [
        {
          label: 'Page',
          value: '',
        },
        {
          label: 'Schwab',
          value: '',
        },
        {
          label: 'Désignant',
          value: '',
        },
        {
          label: 'Signature',
          value: '',
        },
        {
          label: 'Collaborateur',
          value: '',
        },
        {
          label: 'Auteur mentionné',
          value: '',
        },
        {
          label: 'Titre mentionné',
          value: '',
        },
      ],
      metadata: [
        {
          label: 'nb de réf',
          value: '',
        },
        {
          label: 'Auteur',
          value: '',
        },
        {
          label: 'titre',
          value: '',
        },
        {
          label: 'année de la pub.',
          value: '',
        },
        {
          label: '研究会設定の分類名（仮）',
          value: '',
        },
        {
          label: 'Notes',
          value: '',
        },
      ],
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
  },
  created() {
    firebase
      .firestore()
      .collection('items')
      .doc(this.id)
      .collection('authorities')
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
