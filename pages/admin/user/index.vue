<template>
  <AdminLayout :breadcrumbs="breadcrumbs">
    <v-data-table :headers="headers" :items="users" :items-per-page="-1">
      <template v-slot:item.id="{ item }">
        <nuxt-link
          :to="localePath({ name: 'admin-user-id', params: { id: item.id } })"
        >
          {{ item.id }}
        </nuxt-link>

        <!--
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
        -->
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
      <li>{{ $t('admin') }}: 「完了にする」以外のすべての権限あり</li>
      <li>
        {{ $t('editor') }}:
        「初期入力」および「自身が入力した項目の更新」のみ可能
      </li>
      <li>{{ $t('researcher') }}: 「閲覧」のみ可能</li>
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
    userRole() {
      return this.$store.getters.getUserRole
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

          const self = this
          res.forEach(function (doc) {
            const user = doc.data()

            if (
              self.userRole === 'global_admin' ||
              self.userRole === 'admin' ||
              self.userUid === user.id
            )
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
