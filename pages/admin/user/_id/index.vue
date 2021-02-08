<template>
  <AdminLayout :breadcrumbs="breadcrumbs">
    <v-row class="mb-5">
      <v-col
        ><h2>{{ user.id }}</h2></v-col
      >
      <v-col class="text-right"
        ><v-btn
          :to="
            localePath({
              name: 'admin-user-id-edit',
              params: { id: user.id },
            })
          "
          >{{ $t('ユーザの編集') }}</v-btn
        ></v-col
      >
    </v-row>
    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr>
            <th>{{ $t('表示名') }}</th>
            <td>
              {{ user.name }}
            </td>
          </tr>
          <tr>
            <th>{{ $t('役割') }}</th>
            <td>
              {{ $t(user.role) }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
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
      title: process.env.siteName,
      user: {},
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
        {
          text: this.$t('ユーザ一覧'),
          disabled: false,
          to: this.localePath({ name: 'admin-user' }),
          exact: true,
        },
      ]
    },
  },
  created() {
    firebase
      .firestore()
      .collection('users')
      .doc(this.$route.params.id)
      .onSnapshot(
        (res) => {
          const user = res.data()
          this.user = user
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
<style>
td,
th {
  border: 0.1px solid lightgrey;
}
</style>
