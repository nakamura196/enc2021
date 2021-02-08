<template>
  <AdminLayout>
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
  </AdminLayout>
</template>

<script>
import firebase from '@/plugins/firebase'
import AdminLayout from '~/components/admin/Layout.vue'

export default {
  components: {
    AdminLayout,
  },
  data() {
    return {
      users: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: '表示名', value: 'name' },
        { text: '役割', value: 'role' },
        { text: '作成日', value: 'createTime' },
      ],
      title: process.env.siteName,
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
          disabled: false,
          to: this.localePath({ name: 'admin' }),
          exact: true,
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
