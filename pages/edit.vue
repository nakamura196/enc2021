<template>
  <div>
    <v-container fluid class="my-5">
      <div class="mb-5 text-center">
        <v-btn
          v-if="source.prev"
          color="primary"
          class="ma-1"
          :href="
            baseUrl + localePath({ name: 'edit', query: { id: source.prev } })
          "
          ><v-icon>mdi-arrow-left-bold</v-icon>
          {{ $t('前の大項目に進む') }}</v-btn
        >
        <v-btn
          class="ma-1"
          color="cyan"
          dark
          :to="localePath({ name: 'table', query: { id } })"
          >{{ $t('一覧') }}</v-btn
        >

        <v-btn
          v-if="userRole == 'global_admin'"
          class="ma-1"
          :color="!finished ? 'success' : 'error'"
          dark
          @click="finish()"
          >{{ !finished ? $t('完了にする') : $t('未完了にする') }}</v-btn
        >
        <v-btn
          v-if="source.next"
          color="primary"
          class="ma-1"
          :href="
            baseUrl + localePath({ name: 'edit', query: { id: source.next } })
          "
          ><v-icon>mdi-arrow-right-bold</v-icon>
          {{ $t('次の大項目に進む') }}</v-btn
        >
      </div>
      <v-row>
        <v-col cols="12" sm="6">
          <v-sheet class="pa-3 text-center" dark color="primary">
            <small>
              {{ $t('項目名') }}[{{ source.title }}], {{ $t('著者') }}[{{
                source.authors.join(', ')
              }}],
              {{
                lang == 'ja' ? source.publish_year + '年' : source.publish_year
              }}, {{ getVolAndPage }}
            </small>
          </v-sheet>

          <v-card outlined flat class="pa-4 mt-5">
            <div
              id="html"
              style="height: 600px; overflow-y: auto"
              class="pa-3"
              v-html="getHtml"
            ></div>
          </v-card>
        </v-col>
        <v-col v-if="isSignedIn" cols="12" sm="6">
          <v-tabs v-model="tab" background-color="primary" dark>
            <v-tab v-for="(item, key) in formData.length" :key="key">{{
              key !== 0 ? $t('典拠') + key : $t('新規')
            }}</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(item, key) in formData" :key="key">
              <v-card outlined flat class="pa-4 mt-5">
                <div style="height: 600px; overflow-y: auto" class="pa-3">
                  <v-sheet
                    v-if="tab != 0 && currentAuthority"
                    class="pa-3 mb-5"
                    color="grey lighten-3"
                  >
                    <small>
                      <span class="mr-4">
                        <b>ID</b>:
                        {{ currentAuthority.geel_id }}
                      </span>
                      <span class="mr-4">
                        <b>{{ $t('作業者') }}</b
                        >:
                        {{ currentAuthority.editors.join(', ') }}
                      </span>
                      <span class="mr-4">
                        <b>{{ $t('作成日') }}</b
                        >:
                        {{
                          $utils.timestampToTime(currentAuthority.createTime)
                        }}
                      </span>
                      <span class="mr-4">
                        <b>{{ $t('更新日') }}</b
                        >:
                        {{
                          $utils.timestampToTime(currentAuthority.updateTime)
                        }}
                      </span>
                      <span class="mr-4">
                        <b>{{ $t('ダブルチェック') }}</b
                        >:
                        {{ currentAuthority.doubleChecked ? 'Y' : 'N' }}
                      </span>
                    </small>
                  </v-sheet>

                  <div v-for="(f, key3) in fields" :key="key3" class="mb-10">
                    <h3 class="mb-5">{{ f.label }}</h3>
                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr v-for="(obj, key2) in f.children" :key="key2">
                            <td width="25%">{{ obj.label }}</td>
                            <td>
                              <template v-if="obj.type == 'checkbox'">
                                <v-row>
                                  <v-col>
                                    <v-text-field
                                      v-model="item[obj.label].input"
                                      dense
                                      class="mt-5"
                                      :placeholder="
                                        obj.placeholder ||
                                        $t('値を入力してください。')
                                      "
                                      clearable
                                    ></v-text-field
                                  ></v-col>
                                  <v-col>
                                    <v-checkbox
                                      v-model="item[obj.label].etcValue"
                                      :label="obj.etcLabel"
                                    ></v-checkbox>
                                  </v-col>
                                </v-row>
                              </template>

                              <template v-else>
                                <v-text-field
                                  v-model="item[obj.label].input"
                                  dense
                                  class="mt-5"
                                  :placeholder="
                                    obj.placeholder ||
                                    $t('値を入力してください。')
                                  "
                                  clearable
                                ></v-text-field>
                              </template>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </div>
                <div class="mt-5 text-center">
                  <v-btn
                    class="ma-1"
                    color="primary"
                    :loading="loading"
                    :disabled="loading"
                    @click="submit()"
                    >{{ $t(tab == 0 ? '送信' : '更新') }}</v-btn
                  >

                  <template v-if="tab !== 0 && currentAuthority">
                    <v-btn
                      v-if="!currentAuthority.doubleChecked"
                      class="ma-1"
                      color="success"
                      :loading="loading"
                      :disabled="loading"
                      @click="submit(true)"
                      >{{ $t('ダブルチェック') }}</v-btn
                    >
                    <v-btn
                      class="ma-1"
                      color="error"
                      :loading="loading"
                      :disabled="loading"
                      @click="modal = true"
                      >{{ $t('削除') }}</v-btn
                    >
                  </template>
                </div>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="dialog" top :timeout="2000">
      {{ $t('登録しました。') }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="dialog = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-if="false" v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title>
          {{ $t('登録しました。') }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          {{ $t('本当に削除してよいですか?') }}
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modal = false">
            {{ $t('キャンセル') }}
          </v-btn>
          <v-btn color="error" @click="del">
            {{ $t('実行') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import VueScrollTo from 'vue-scrollto'
import firebase from '@/plugins/firebase'

const FieldValue = firebase.firestore.FieldValue
const firestore = firebase.firestore()

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
      fields: [
        {
          label: this.$t('抽出要素'),
          children: [
            {
              label: 'Nomenclature',
              value: '',
              type: 'checkbox',
              etcValue: '',
              etcLabel: this.$t('スモールキャピタル'),
              id: 'sc',
            },
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
              type: 'checkbox',
              etcValue: '',
              etcLabel: this.$t('イタリック'),
              id: 'i',
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
        },
        {
          label: this.$t('書誌情報（正規化用）'),
          children: [
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
        },
      ],
      userUids: [],
      authority: {},
      authorities: [],
      tab: 0,
      dialog: false,
      loading: false,
      modal: false,
      finished: false,
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale
    },
    userRole() {
      return this.$store.getters.getUserRole
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
    formData() {
      const formData = [this.authority]
      const authorities = this.authorities
      const fields = this.fields
      for (let i = 0; i < authorities.length; i++) {
        const authority = authorities[i]
        const data = {}

        for (let k = 0; k < fields.length; k++) {
          const children = fields[k].children

          for (let j = 0; j < children.length; j++) {
            const obj = children[j]

            if (obj.id) {
              const value = authority[obj.label] || ''
              const etcValue = value.includes('<' + obj.id + '>')
              data[obj.label] = {
                input: value
                  .replace('<' + obj.id + '>', '')
                  .replace('</' + obj.id + '>', ''),
                raw: value,
                etcValue,
                id: obj.id,
              }
            } else {
              const value = authority[obj.label] || ''
              data[obj.label] = {
                input: value,
                raw: value,
              }
            }
          }
        }

        formData.push(data)
      }
      return formData
    },
    getHtml() {
      let html = this.source.texthtml_re
      // html = html.split('\n').join(' ')
      const authorities = this.authorities

      for (let i = 0; i < authorities.length; i++) {
        const authority = authorities[i]
        let title = (authority['Titre mentionné'] || '').trim()

        if (title !== '') {
          const query =
            '(>| |’|\n)' + title.split(' ').join('(.+?)') + '(<| |,|\\.|\n)'

          const bar = html.match(query)

          if (bar) {
            const barLength = bar.length
            let text = bar[0]
            if (bar[1] !== '') {
              text = text.substring(1)
            }
            if (bar[barLength - 1] !== '') {
              text = text.substring(0, text.length - 1)
            }

            html = html
              .split(text)
              .join(
                `<span type="titre" id="e${this.id}-${i + 1}">${text}</span>`
              )
          }
        }

        // ---------------------

        title = (authority['Auteur mentionné'] || '').trim()

        if (title !== '') {
          const query =
            '(>| |’)' + title.split(' ').join('(.+?)') + '(<| |,|\\.)'

          const bar = html.match(query)

          if (bar) {
            const barLength = bar.length
            let text = bar[0]
            if (bar[1] !== '') {
              text = text.substring(1)
            }
            if (bar[barLength - 1] !== '') {
              text = text.substring(0, text.length - 1)
            }

            html = html.split(text).join(`<span type="author">${text}</span>`)
          }
        }
      }
      return html
    },
    currentAuthority() {
      const tab = this.tab
      if (tab !== 0) {
        return this.authorities[tab - 1]
      } else {
        return null
      }
    },
  },
  watch: {
    tab() {
      const id = this.id + '-' + this.tab
      const options = {
        container: '#html',
        y: true,
      }
      VueScrollTo.scrollTo('#e' + id, 500, options)
    },
  },
  created() {
    firebase.analytics().logEvent('read', {
      uid: this.userUid,
      eid: this.id,
    })

    this.initAuthority()
    firebase
      .firestore()
      .collection('items')
      .doc(this.id)
      .onSnapshot(
        (res) => {
          this.finished = res.data().finish === 1
        },
        (error) => {
          console.error('GET_REALTIME_LIST', error)
        }
      )

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
  methods: {
    initAuthority() {
      const fields = this.fields
      const data = {}

      for (let i = 0; i < fields.length; i++) {
        const children = fields[i].children

        for (let j = 0; j < children.length; j++) {
          const obj = children[j]
          data[obj.label] = {
            input: '',
            raw: '',
          }
        }
      }

      this.authority = data
    },
    async finish() {
      const fItem = await firebase
        .firestore()
        .collection('items')
        .doc(this.id)
        .get()
      const itemRef = fItem.ref
      if (!fItem.exists) {
        await itemRef.set({
          id: this.id,
          createTime: FieldValue.serverTimestamp(),
          updateTime: FieldValue.serverTimestamp(),
        })
      }

      const batch = firestore.batch()

      batch.update(firestore.doc(itemRef.path), {
        // id: anotherUserRef.id,
        updateTime: FieldValue.serverTimestamp(),
        finish: !this.finished ? 1 : 0,
      })

      await batch.commit()
    },
    async submit(doubleCheckFlag = false) {
      this.loading = true

      // ----------

      // itemRef
      const fItem = await firebase
        .firestore()
        .collection('items')
        .doc(this.id)
        .get()
      const itemRef = fItem.ref
      if (!fItem.exists) {
        await itemRef.set({
          id: this.id,
          createTime: FieldValue.serverTimestamp(),
          updateTime: FieldValue.serverTimestamp(),
        })
      }

      const batch = firestore.batch()

      // anotherRef
      const anotherUser = await firebase
        .firestore()
        .collection('users')
        .doc(this.userUid)
        .get()

      const anotherUserRef = anotherUser.ref
      if (!anotherUser.exists) {
        await anotherUserRef.set({
          id: this.userUid,
          createTime: FieldValue.serverTimestamp(),
          updateTime: FieldValue.serverTimestamp(),
        })
      }

      batch.update(firestore.doc(itemRef.path), {
        // id: anotherUserRef.id,
        updateTime: FieldValue.serverTimestamp(),
        likedUsers: firebase.firestore.FieldValue.arrayUnion(anotherUserRef.id),
      })

      const tab = this.tab

      const formData = this.formData[tab]

      const item = {}
      for (const key in formData) {
        const value = formData[key]
        if (!value.etcValue) {
          item[key] = value.input
        } else {
          const tag = value.id
          item[key] = '<' + tag + '>' + value.input + '</' + tag + '>'
        }
      }

      // let index = -1
      let id = ''
      if (tab === 0) {
        item.createTime = FieldValue.serverTimestamp()
        item.editors = firebase.firestore.FieldValue.arrayUnion(this.userName)
        // index = this.authorities.length + 1
        id = this.id + '-' + generateUuid() // index
      } else {
        const authority = this.currentAuthority
        item.createTime = authority.createTime
        const editors = authority.editors
        const newEditors = []
        for (const i in editors) {
          newEditors.push(editors[i])
        }
        if (!newEditors.includes(this.userName)) {
          newEditors.push(this.userName)
        }
        item.editors = newEditors
        // index = tab
        id = authority.geel_id
      }

      item.updateTime = FieldValue.serverTimestamp()

      item.doubleChecked = doubleCheckFlag ? 1 : 0

      batch.set(
        firestore.doc(itemRef.path).collection('authorities').doc(id),
        item
      )

      /*
      batch.set(
        firestore
          .doc(anotherUserRef.path)
          .collection('likedItems')
          .doc(itemRef.id),
        {
          id: itemRef.id,
          itemRef,
          createTime: FieldValue.serverTimestamp(),
        }
      )
      */

      // batch.update(itemRef, { likeCount: FieldValue.increment(1) })
      batch.update(anotherUserRef, { likeItemCount: FieldValue.increment(1) })

      await batch.commit()

      let event = 'create'
      if (tab !== 0) {
        event = 'update'
      }
      firebase.analytics().logEvent(event, {
        uid: this.userUid,
        eid: this.id,
      })

      this.dialog = true

      this.initAuthority()

      this.loading = false
    },
    async del() {
      this.modal = false
      this.loading = true

      // ----------

      // itemRef
      const item = await firebase
        .firestore()
        .collection('items')
        .doc(this.id)
        .get()
      const itemRef = item.ref

      const batch = firestore.batch()

      // anotherRef
      const anotherUser = await firebase
        .firestore()
        .collection('users')
        .doc(this.userUid)
        .get()

      const anotherUserRef = anotherUser.ref

      batch.update(firestore.doc(itemRef.path), {
        // id: anotherUserRef.id,
        updateTime: FieldValue.serverTimestamp(),
        likedUsers: firebase.firestore.FieldValue.arrayRemove(
          anotherUserRef.id
        ),
      })

      const id = this.authorities[this.tab - 1].geel_id
      batch.delete(
        firestore.doc(itemRef.path).collection('authorities').doc(id)
      )

      // batch.update(itemRef, { likeCount: FieldValue.increment(-1) })
      batch.update(anotherUserRef, {
        likeItemCount: FieldValue.increment(-1),
      })

      /*
      batch.delete(
        firestore
          .doc(anotherUserRef.path)
          .collection('likedItems')
          .doc(itemRef.id)
      )
      */

      await batch.commit()

      firebase.analytics().logEvent('delete', {
        uid: this.userUid,
        eid: this.id,
      })

      this.dialog = true

      this.initAuthority()

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

function generateUuid() {
  // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
  // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('')
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case 'x':
        chars[i] = Math.floor(Math.random() * 16).toString(16)
        break
      case 'y':
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
        break
    }
  }
  return chars.join('')
}
</script>
<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
td,
th {
  border: 0.1px solid lightgrey;
}
span[type='proposed'] {
  color: #f44336;
}
span[type='auteur_p'] {
  font-weight: bold;
  color: #00f;
}
span[type='titre'] {
  color: #9c27b0;
  font-weight: bold;
}

span[type='author'] {
  color: #03a9f4;
}
i > span[type='proposed'] {
  font-weight: bold;
  color: #f44336;
}
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
