<template>
  <div>
    <v-container class="my-5">
      <v-row>
        <v-col cols="12" sm="6">
          <v-sheet class="pa-3" dark color="primary">
            {{ $t('項目名') }}[{{ source.title }}], {{ $t('著者') }}[{{
              source.authors.join(', ')
            }}],
            {{
              lang == 'ja' ? source.publish_year + '年' : source.publish_year
            }}, {{ getVolAndPage }}
          </v-sheet>

          <v-card outlined flat class="pa-4 mt-5">
            <div
              style="height: 600px; overflow-y: auto"
              v-html="source.texthtml_re"
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
          <v-tabs background-color="primary" dark>
            <v-tab v-for="n in tabN" :key="n">{{ $t('典拠') }}{{ n }}</v-tab>
            <v-tab @click="tabN += 1"><v-icon>mdi-plus</v-icon></v-tab>
          </v-tabs>

          <v-card outlined flat class="pa-4 mt-5">
            <div style="height: 600px; overflow-y: auto" class="pa-5">
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
                    <tr v-for="(obj, key) in fields" :key="key">
                      <td>{{ $t(obj.label) }}</td>
                      <td>
                        <v-text-field
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
                      <th class="text-left pt-10 pb-3">{{ $t('書誌情報') }}</th>
                      <th class="text-left pt-10 pb-3">{{ $t('入力欄') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(obj, key) in metadata" :key="key">
                      <td>{{ $t(obj.label) }}</td>
                      <td>
                        <v-text-field
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
                :to="localePath({ name: 'edit' })"
                >{{ $t('送信') }}</v-btn
              >
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import firebase from '@/plugins/firebase'

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

      return { source }
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
      tabN: 1,
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
    getVolAndPage() {
      const pages = this.source.pages
      const es = pages.split('-')
      return this.lang === 'ja'
        ? es[0] + '巻, p.' + es[1]
        : 'Vol.' + es[0] + ', p.' + es[1]
    },
  },
  mounted() {
    console.log(this.source)
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
i > span[type='proposed'] {
  font-weight: bold;
  color: #f44336;
}
i {
  font-weight: bold;
}
</style>
