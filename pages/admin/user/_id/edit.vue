<template>
  <AdminLayout :breadcrumbs="breadcrumbs">
    <v-row class="mb-5">
      <v-col
        ><h2>{{ user.id }}・{{ $t('編集') }}</h2></v-col
      >
      <v-col class="text-right">
        <v-btn
          :to="
            localePath({
              name: 'admin-user-id',
              params: { id: user.id },
            })
          "
          >{{ $t('キャンセル') }}</v-btn
        >
        <v-btn :loading="loading" @click="save()">{{
          $t('保存')
        }}</v-btn></v-col
      >
    </v-row>
    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr>
            <th>{{ $t('表示名') }}</th>
            <td>
              <v-text-field
                v-model="user.name"
                class="mt-6 mb-0"
                outlined
                dense
              ></v-text-field>
            </td>
          </tr>
          <tr>
            <th>{{ $t('役割') }}</th>
            <td>
              <v-select
                v-model="user.role"
                :items="items"
                class="mt-6 mb-0"
                outlined
              ></v-select>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-snackbar v-model="dialog" top :timeout="2000">
      {{ $t('登録しました。') }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="dialog = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </AdminLayout>
</template>

<script>
import firebase from '@/plugins/firebase'
import AdminLayout from '~/components/admin/Layout.vue'

const FieldValue = firebase.firestore.FieldValue
const firestore = firebase.firestore()

export default {
  components: {
    AdminLayout,
  },
  data() {
    return {
      dialog: false,
      user: {},
      loading: false,
      items: [
        {
          text: this.$t('グローバル管理者'),
          value: 'global_admin',
        },
        {
          text: this.$t('編集者'),
          value: 'editor',
        },
        {
          text: this.$t('研究者'),
          value: 'researcher',
        },
      ],
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
  methods: {
    async save() {
      this.loading = true

      const batch = firestore.batch()

      const uid = this.$route.params.id

      // anotherRef
      const anotherUser = await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()

      const anotherUserRef = anotherUser.ref
      batch.update(anotherUserRef, {
        id: uid,
        name: this.user.name,
        role: this.user.role || 'researcher',
        updateTime: FieldValue.serverTimestamp(),
      })

      await batch.commit()

      this.dialog = true

      this.loading = false
    },
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
