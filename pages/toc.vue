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
      <template v-if="!loaded">
        <div class="text-center pa-10">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </template>
      <template v-else>
        <v-row>
          <v-col cols="12" md="9">
            <v-row>
              <v-col cols="12" md="8">
                <h4>{{ $t('手付かずの項') }}</h4>
                <v-card outlined flat class="pa-4 mt-2">
                  <div style="height: 600px; overflow-y: auto" class="pa-3">
                    <v-row>
                      <v-col
                        v-for="(value, index) in status.undone"
                        :key="index"
                        cols="12"
                        md="6"
                      >
                        <ul>
                          <li>
                            <nuxt-link
                              :to="
                                localePath({
                                  name: 'edit',
                                  query: { id: value.id },
                                })
                              "
                              >{{ `(${value.id}) ${value.label}` }}</nuxt-link
                            >
                          </li>
                        </ul>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <h4>{{ $t('作業中・作業済の項') }}</h4>
                <v-card outlined flat class="pa-4 mt-2">
                  <div style="height: 600px; overflow-y: auto" class="pa-3">
                    <ul>
                      <li v-for="(value, index) in status.done" :key="index">
                        <nuxt-link
                          :to="
                            localePath({
                              name: 'edit',
                              query: { id: value.id },
                            })
                          "
                          :style="
                            value.status === 'finished' ? 'color: #F44336' : ''
                          "
                        >
                          {{ `(${value.id}) ${value.label}` }}
                        </nuxt-link>
                      </li>
                    </ul>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="3">
            <v-card outlined flat class="pa-4">
              <h4>【{{ $t('進捗管理欄') }}】</h4>
              <p class="mt-5">
                現在、<br />
                {{ status.done.length }}
                /
                {{ total }}
                項目の作業が進行しています（
                {{ frm((status.done.length / total) * 100) }} %）<br />
                {{ sizeDouble }} / {{ total }} 項目の作業が完了しています（
                {{ frm((sizeDouble / total) * 100) }} %）
              </p>
            </v-card>

            <template v-if="isSignedIn">
              <v-card outlined flat class="pa-4 mt-5">
                <h4>【{{ $t('作業に関わる連絡事項') }}】</h4>
                <div style="height: 300px; overflow-y: auto" class="pa-3 mt-2">
                  <v-card
                    v-for="(message, key) in messages"
                    :key="key"
                    outlined
                    flat
                    class="mb-2"
                  >
                    <v-card-actions class="mb-0">
                      <v-list-item>
                        <v-list-item-avatar color="grey darken-3">
                          <v-img
                            class="elevation-6"
                            alt=""
                            :src="message.pic"
                          ></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <b class="mr-2">{{ message.name }}</b>
                          <small>{{
                            $utils.timestampToTime(message.createTime) | moment
                          }}</small>
                        </v-list-item-content>

                        <v-row align="center" justify="end">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon v-on="on" @click="del(message.id)"
                                ><v-icon> mdi-delete </v-icon>
                              </v-btn>
                            </template>
                            <span>{{ $t('delete') }}</span>
                          </v-tooltip>
                        </v-row>
                      </v-list-item>
                    </v-card-actions>

                    <v-card-text class="pt-0">
                      {{ message.text }}
                    </v-card-text>
                  </v-card>
                </div>
              </v-card>

              <v-textarea
                v-model="text"
                auto-grow
                rows="1"
                class="mt-5"
                :placeholder="$t('値を入力してください。')"
                clearable
              ></v-textarea>

              <div>
                <v-btn :loading="loading" color="primary" @click="save()">{{
                  $t('送信')
                }}</v-btn>
              </div>
            </template>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'
import moment from 'moment'

const FieldValue = firebase.firestore.FieldValue
const firestore = firebase.firestore()

export default {
  filters: {
    moment(date) {
      return moment(date).fromNow()
    },
  },
  asyncData({ payload, app }) {
    if (payload) {
      return payload
    } else {
      const vol = Number(app.context.route.query.vol) || 2
      const data = process.env.toc[String(vol)]

      return { vol, data }
    }
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      title: process.env.siteName,
      items: [],
      loaded: false,
      messages: [],
      loading: false,
    }
  },
  computed: {
    text: {
      get() {
        return this.comment
      },
      set(value) {
        this.comment = value
      },
    },
    lang() {
      return this.$i18n.locale
    },
    userName() {
      return this.$store.getters.getUserName
    },
    userPic() {
      return this.$store.getters.getUserPic
    },
    isSignedIn() {
      return this.$store.getters.getIsSignedIn
    },
    userUid() {
      return this.$store.getters.getUserUid
    },
    total() {
      const status = this.status
      let total = 0
      for (const key in status) {
        total += status[key].length
      }
      return total
    },

    sizeDouble() {
      const status = this.status.done
      let total = 0
      for (let i = 0; i < status.length; i++) {
        if (status[i].status === 'finished') {
          total += 1
        }
      }
      return total
    },

    status() {
      const data = this.data

      const items = this.items
      const map = {}
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        map[item.id] = item
      }

      const undone = []
      const done = []
      for (let i = 0; i < data.length; i++) {
        const obj = data[i]
        const id = this.vol + '-' + (i + 1)
        if (map[id]) {
          const item = map[id]

          if ((item.authorities && item.authorities > 0) || item.noA === 1) {
            done.push({
              label: obj.label,
              id,
              status: item.finish === 1 ? 'finished' : 'unfinished',
            })
          } else {
            undone.push({
              label: obj.label,
              id,
            })
          }
        } else {
          undone.push({
            label: obj.label,
            id,
          })
        }
      }

      return {
        undone,
        done,
      }
    },
    breadcrumbs() {
      /*
      {{ lang == 'en' ? 'Vol. ' + vol : '第' + vol + '巻' }}
              {{ $t('目次') }}
              */
      const vol = this.vol
      return [
        {
          text: this.$t('HOME'),
          disabled: false,
          to: this.localePath({ name: 'index' }),
          exact: true,
        },
        {
          text:
            (this.lang === 'en' ? `Vol. ${vol}` : `第${vol}巻`) +
            ' ' +
            this.$t('目次'),
        },
      ]
    },
  },
  created() {
    firebase
      .firestore()
      .collection('items')
      .onSnapshot(
        (res) => {
          const items = []
          res.forEach(function (doc) {
            const item = doc.data()
            items.push(item)
          })
          this.items = items
          this.loaded = true
        },
        (error) => {
          console.error('GET_REALTIME_LIST', error)
        }
      )

    firebase
      .firestore()
      .collection('messages')
      .orderBy('createTime', 'desc')
      .onSnapshot(
        (res) => {
          const items = []
          res.forEach(function (doc) {
            const item = doc.data()
            item.id = doc.id
            items.push(item)
          })
          this.messages = items
        },
        (error) => {
          console.error('GET_REALTIME_LIST', error)
        }
      )
  },
  methods: {
    frm(value, n = 2) {
      return Math.floor(value * Math.pow(10, n)) / Math.pow(10, n)
    },
    async save() {
      this.loading = true

      const batch = firestore.batch()

      const userName = this.userName

      batch.set(firebase.firestore().collection('messages').doc(), {
        text: this.comment,
        name: userName,
        createTime: FieldValue.serverTimestamp(),
        pic: this.userPic,
      })

      await batch.commit()

      this.loading = false
    },
    async del(id) {
      const batch = firestore.batch()
      batch.delete(firebase.firestore().collection('messages').doc(id))
      await batch.commit()
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
