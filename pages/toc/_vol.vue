<template>
  <div>
    <v-container fluid class="my-5">
      <v-row>
        <v-col cols="12" sm="6">
          <v-sheet class="pa-3 text-center" dark color="primary"
            >第{{ vol }}巻 目次</v-sheet
          >

          <v-row class="mt-5">
            <v-col cols="12" sm="6">
              <h4>手付かずの項</h4>
              <v-card outlined flat class="pa-4 mt-2">
                <div style="height: 600px; overflow-y: auto" class="pa-3">
                  <v-row>
                    <v-col
                      v-for="(value, index) in status[vol].undone"
                      :key="index"
                      cols="12"
                      sm="6"
                    >
                      <ul>
                        <li>{{ value }}</li>
                      </ul>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <h4>作業中・作業済の項</h4>
              <v-card outlined flat class="pa-4 mt-2">
                <div style="height: 600px; overflow-y: auto" class="pa-3">
                  <ul>
                    <li v-for="(value, index) in status[vol].done" :key="index">
                      <span
                        :style="
                          value.status === 'double' ? 'color: #F44336' : ''
                        "
                      >
                        {{ value.label }}
                      </span>
                    </li>
                  </ul>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="isSignedIn" cols="12" sm="6">
          <v-card outlined flat class="pa-4">
            <h4>【進捗管理欄】</h4>
            <p class="mt-5">
              現在、<br />
              {{ status[vol].done.length }}
              /
              {{ total }}
              項目の作業が完了しています（
              {{ (status[vol].done.length / total) * 100 }} %）<br />
              {{ sizeDouble }} /
              {{ total }} 項目のダブルチェックが完了しています（
              {{ (sizeDouble / total) * 100 }} %）
            </p>
          </v-card>

          <v-card outlined flat class="pa-4 mt-5">
            <h4>【作業に関わる連絡事項】</h4>
            <div style="height: 300px; overflow-y: auto" class="pa-3 mt-5">
              <div v-for="n in 5" :key="n">
                コメント {{ n }}
                <hr class="my-2" />
              </div>
            </div>
          </v-card>

          <v-textarea
            filled
            auto-grow
            rows="1"
            class="mt-5"
            value=""
            placeholder="値を入力してください。"
          ></v-textarea>

          <div class="text-right">
            <v-btn>{{
              $t('送信')
            }}</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

const FieldValue = firebase.firestore.FieldValue
const firestore = firebase.firestore()

export default {
  asyncData({ payload, app }) {
    if (payload) {
      return payload
    } else {
      const vol = Number(app.context.route.params.vol) || 2

      return { vol }
    }
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      title: process.env.siteName,
      status: {
        2: {
          undone: ['BLAFERT PLAPPERT', 'BLANINVILLE'],
          done: [
            { label: 'BORT', status: 'double' },
            { label: 'BORTWICK', status: 'single' },
          ],
        },
      },
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
    total() {
      const status = this.status[this.vol]
      let total = 0
      for (const key in status) {
        total += status[key].length
      }
      return total
    },

    sizeDouble() {
      const status = this.status[this.vol].done
      let total = 0
      for (let i = 0; i < status.length; i++) {
        if (status[i].status === 'double') {
          total += 1
        }
      }
      return total
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
