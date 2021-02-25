<template>
  <AdminLayout :breadcrumbs="breadcrumbs">
    <v-data-table :headers="headers" :items="users" :items-per-page="-1">
      <template v-slot:item.id="{ item }">
        <template v-if="userRole == 'global_admin' || item.id === userUid">
          <nuxt-link
            :to="localePath({ name: 'admin-user-id', params: { id: item.id } })"
          >
            {{ item.id }}
          </nuxt-link>
        </template>
        <template v-else>
          {{ item.id }}
        </template>
      </template>
      <template v-slot:item.role="{ item }">
        {{ $t(item.role) }}
      </template>
      <template v-slot:item.createTime="{ item }">
        {{ $utils.timestampToTime(item.createTime) }}
      </template>
    </v-data-table>

    <ul v-if="lang === 'ja'" class="mt-5">
      <li>{{ $t('global_admin') }}: すべての権限あり</li>
      <li>{{ $t('editor') }}: 編集権限あり、ただし「完了にする」権限はなし</li>
      <li>{{ $t('researcher') }}: 閲覧のみ</li>
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
        { text: this.$t('表示名'), value: 'name' },
        { text: this.$t('役割'), value: 'role' },
        { text: this.$t('作成日'), value: 'createTime' },
      ],
    }
  },
  computed: {
    userUid() {
      return this.$store.getters.getUserUid
    },
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
        {
          text: this.$t('ユーザ一覧'),
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
