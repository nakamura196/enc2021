<template>
  <AdminLayout :breadcrumbs="breadcrumbs">
    <h2>{{ $t('管理ダッシュボード') }}</h2>

    <p class="my-5">
      {{ $t(title) }} {{ $t('管理ダッシュボードへようこそ！') }}
    </p>

    <ul>
      <li>
        <nuxt-link :to="localePath({ name: 'admin-user' })">{{
          $t('ユーザ一覧')
        }}</nuxt-link>
      </li>
    </ul>

    <h3 class="mt-10">{{ $t('History Log') }}</h3>

    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      class="mt-5"
    >
      <template v-slot:item.id="{ item }">
        <nuxt-link :to="localePath({ name: 'edit', query: { id: item.id } })">
          {{ item.id }}
        </nuxt-link>
      </template>
      <template v-slot:item.authorities="{ item }">
        {{ item.authorities || 0 }}
      </template>
      <template v-slot:item.event="{ item }">
        {{ $t(item.event) }}
      </template>
      <template v-slot:item.finish="{ item }">
        {{ item.finish === 1 ? '○' : '' }}
      </template>
      <template v-slot:item.noA="{ item }">
        {{ item.noA === 1 ? '○' : '' }}
      </template>
      <template v-slot:item.updateTime="{ item }">
        {{ $utils.timestampToTime(item.updateTime) }}
      </template>
    </v-data-table>

    <Ranking></Ranking>
  </AdminLayout>
</template>

<script>
import firebase from '@/plugins/firebase'
import AdminLayout from '~/components/admin/Layout.vue'
import Ranking from '~/components/admin/Ranking.vue'

export default {
  components: {
    AdminLayout,
    Ranking,
  },
  data() {
    return {
      users: [],
      headers: [
        { text: this.$t('更新日'), value: 'updateTime' },
        { text: 'ID', value: 'id' },
        { text: this.$t('User'), value: 'editor' },
        { text: this.$t('Action'), value: 'event' },
        { text: this.$t('典拠数'), value: 'authorities' },
        { text: this.$t('完了'), value: 'finish' },
        { text: this.$t('典拠なし'), value: 'noA' },
      ],
      title: process.env.siteName,
      items: [],
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale
    },
    breadcrumbs() {
      return [
        {
          text: this.$t('管理ダッシュボード'),
        },
      ]
    },
  },
  created() {
    firebase
      .firestore()
      .collection('users')
      .onSnapshot(
        (res) => {
          const users = []

          res.forEach(function (doc) {
            const user = doc.data()
            users.push(user)
          })
          this.users = users
        },
        (error) => {
          console.error('GET_REALTIME_LIST', error)
        }
      )

    firebase
      .firestore()
      .collection('items')
      .orderBy('updateTime', 'desc')
      .onSnapshot(
        (res) => {
          const items = []
          res.forEach(function (doc) {
            const item = doc.data()
            items.push(item)
          })
          this.items = items
        },
        (error) => {
          console.error('GET_REALTIME_LIST', error)
        }
      )
  },
  head() {
    const title = this.title
    return {
      titleTemplate: null,
      title,
    }
  },
}
</script>
