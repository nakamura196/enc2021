<template>
  <div>
    <v-container class="my-5">
      <v-row>
        <v-col cols="12" sm="6">
          <v-sheet class="pa-3" dark color="primary">
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
              style="height: 600px; overflow-y: auto"
              class="pa-3"
              v-html="getHtml"
            ></div>
            <div class="mt-5 text-right">
              <v-btn
                color="primary"
                :href="
                  baseUrl +
                  localePath({ name: 'edit', query: { id: source.next } })
                "
                ><v-icon>mdi-arrow-right-bold</v-icon>
                {{ $t('次の大項目に進む') }}</v-btn
              >
            </div>
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
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">{{ $t('抽出要素') }}</th>
                          <th class="text-left">{{ $t('入力欄') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ $t('Nomenclature') }}</td>
                          <td>
                            <v-row>
                              <v-col cols="12" sm="8"
                                ><v-text-field
                                  dense
                                  class="mt-5"
                                  placeholder="Ex. あいう"
                                  clearable
                                ></v-text-field
                              ></v-col>
                              <v-col cols="12" sm="4"
                                ><v-checkbox
                                  dense
                                  class="mt-5"
                                  :label="$t('スモールキャピタル')"
                                ></v-checkbox
                              ></v-col>
                            </v-row>
                          </td>
                        </tr>
                        <tr v-for="(obj, key2) in fields" :key="key2">
                          <td>{{ $t(obj.label) }}</td>
                          <td>
                            <v-text-field
                              v-model="item[obj.label]"
                              dense
                              class="mt-5"
                              :placeholder="obj.placeholder"
                              clearable
                            ></v-text-field>
                          </td>
                        </tr>
                      </tbody>
                      <thead>
                        <tr>
                          <th class="text-left pt-10 pb-3">
                            {{ $t('書誌情報') }}
                          </th>
                          <th class="text-left pt-10 pb-3">
                            {{ $t('入力欄') }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(obj, key2) in metadata" :key="key2">
                          <td>{{ $t(obj.label) }}</td>
                          <td>
                            <v-text-field
                              v-model="item[obj.label]"
                              dense
                              class="mt-5"
                              :placeholder="obj.placeholder"
                              clearable
                            ></v-text-field>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <div class="mt-5 text-center">
                  {{ $t('作業者名') }}: {{ userName }}
                  <v-btn
                    class="ml-5"
                    color="primary"
                    :loading="loading"
                    :disabled="loading"
                    @click="submit"
                    >{{ $t('送信') }}</v-btn
                  >
                </div>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" persistent max-width="290">
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
  </div>
</template>

<script>
import axios from 'axios'
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
          label: 'Designant',
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
          label: 'Auteur mentionne',
          value: '',
        },
        {
          label: 'Titre mentionne',
          value: '',
        },
      ],
      metadata: [
        {
          label: 'nb de ref',
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
          label: 'annee de la pub.',
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
      userUids: [],
      authority: {},
      authorities: [],
      tab: 0,
      dialog: true,
      loading: false,
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
      const pages = this.source.pages
      const es = pages.split('-')
      return this.lang === 'ja'
        ? es[0] + '巻, p.' + es[1]
        : 'Vol.' + es[0] + ', p.' + es[1]
    },
    formData() {
      const formData = [this.authority]
      const authorities = this.authorities
      const fields = this.fields
      for (let i = 0; i < authorities.length; i++) {
        const authority = authorities[i]
        const data = {}
        for (let j = 0; j < fields.length; j++) {
          const obj = fields[j]
          data[obj.label] = authority[obj.label] || ''
        }
        formData.push(data)
      }
      return formData
    },
    getHtml() {
      let html = this.source.texthtml_re
      const authorities = this.authorities
      for (let i = 0; i < authorities.length; i++) {
        const authority = authorities[i]
        const title = authority['Titre mentionne'] || ''
        if (title !== '') {
          html = html.replace(title, `<span type="titre">${title}</span>`)
        }
      }
      return html
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
            authorities.push(doc.data())
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
      for (let j = 0; j < fields.length; j++) {
        const obj = fields[j]
        data[obj.label] = ''
      }
      this.authority = data
    },
    async submit() {
      this.loading = true
      const addFlag = true

      // ----------

      // itemRef
      const item = await firebase
        .firestore()
        .collection('items')
        .doc(this.id)
        .get()
      const itemRef = item.ref
      if (!item.exists) {
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

      if (addFlag) {
        batch.update(firestore.doc(itemRef.path), {
          // id: anotherUserRef.id,
          updateTime: FieldValue.serverTimestamp(),
          likedUsers: firebase.firestore.FieldValue.arrayUnion(
            anotherUserRef.id
          ),
        })

        const item = this.formData[this.tab]
        item.createTime = FieldValue.serverTimestamp()
        item.updateTime = FieldValue.serverTimestamp()
        item.editors = firebase.firestore.FieldValue.arrayUnion(this.userName)

        batch.set(
          firestore.doc(itemRef.path).collection('authorities').doc(),
          item
        )

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

        // batch.update(itemRef, { likeCount: FieldValue.increment(1) })
        batch.update(anotherUserRef, { likeItemCount: FieldValue.increment(1) })
      }

      await batch.commit()

      this.dialog = true

      this.initAuthority()

      this.loading = false

      /*
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

      if (addFlag) {
        batch.update(firestore.doc(itemRef.path), {
          // id: anotherUserRef.id,
          updateTime: FieldValue.serverTimestamp(),
          likedUsers: firebase.firestore.FieldValue.arrayUnion(
            anotherUserRef.id
          ),
        })

        batch.set(
          firestore
            .doc(anotherUserRef.path)
            .collection('likedItems')
            .doc(itemRef.id),
          {
            id: itemRef.id,
            itemRef,
            createTime: FieldValue.serverTimestamp(),
            title: this.source._label[0],
            thumbnail: this.source._thumbnail[0],
          }
        )

        // batch.update(itemRef, { likeCount: FieldValue.increment(1) })
        batch.update(anotherUserRef, { likeItemCount: FieldValue.increment(1) })
      } else {
        batch.update(firestore.doc(itemRef.path), {
          // id: anotherUserRef.id,
          updateTime: FieldValue.serverTimestamp(),
          likedUsers: firebase.firestore.FieldValue.arrayRemove(
            anotherUserRef.id
          ),
        })

        batch.delete(
          firestore
            .doc(anotherUserRef.path)
            .collection('likedItems')
            .doc(itemRef.id)
        )

        // batch.update(itemRef, { likeCount: FieldValue.increment(-1) })
        batch.update(anotherUserRef, {
          likeItemCount: FieldValue.increment(-1),
        })
      }

      

      await batch.commit()
      */
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
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
td {
  border-left: 0.5px solid grey;
  border-top: 0.5px solid grey;
}
span[type='proposed'] {
  color: #f44336;
}
span[type='auteur_p'] {
  font-weight: bold;
}
span[type='titre'] {
  color: #2196f3;
  font-weight: bold;
}
i > span[type='proposed'] {
  font-weight: bold;
  color: #f44336;
}
i {
  font-weight: bold;
}
</style>
