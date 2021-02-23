<template>
  <div>
    <v-data-table :headers="headers" :items="items" :items-per-page="-1">
      <template v-slot:item.Nomenclature="{ item }">
        <span v-html="handleSc(item.Nomenclature)"></span>
      </template>
      <template v-slot:item.Désignant="{ item }">
        <span v-html="item.Désignant"></span>
      </template>
      <template v-slot:item.Signature="{ item }">
        <span v-html="item.Signature"></span>
      </template>
    </v-data-table>

    <v-btn color="primary" class="mt-5" @click="downloadExcelFile()"
      >エクセルファイルをダウンロード</v-btn
    >
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import XLSX from 'xlsx'

@Component
export default class grid extends Vue {
  @Prop()
  data!: any[]

  @Prop()
  id!: string

  fields: any[] = [
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
        {
          label: '備考',
          value: '',
          changed: true,
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
  ]

  get headers() {
    const headers = []

    headers.push({
      text: 'geel_id',
      value: 'geel_id',
    })

    headers.push({
      text: 'editors',
      value: 'editors',
    })

    headers.push({
      text: 'createTime',
      value: 'createTime',
    })

    headers.push({
      text: 'updateTime',
      value: 'updateTime',
    })

    headers.push({
      text: 'doubleChecked',
      value: 'doubleChecked',
    })

    const fields = this.fields
    for (let k = 0; k < fields.length; k++) {
      const children = fields[k].children

      for (let j = 0; j < children.length; j++) {
        const obj = children[j]
        headers.push({
          text: obj.label,
          value: obj.label,
        })
      }
    }

    return headers
  }

  get items() {
    const authorities = this.data
    const items = []
    for (let i = 0; i < authorities.length; i++) {
      const authority = authorities[i]
      const item: any = {}

      const fields = this.headers
      for (let j = 0; j < fields.length; j++) {
        const field = fields[j].value

        let value = authority[field] || ''

        if (['createTime', 'updateTime'].includes(field)) {
          value = this.$utils.timestampToTime(value)
        }

        item[field] = value
      }

      items.push(item)
    }
    return items
  }

  handleSc(value: string) {
    return value.split('<sc>').join("<sc class='sc'>")
  }

  downloadExcelFile() {
    const exportBook = XLSX.utils.book_new()
    const sexportSheet = XLSX.utils.json_to_sheet(this.items)
    XLSX.utils.book_append_sheet(exportBook, sexportSheet, 'sheetName')
    XLSX.writeFile(exportBook, this.id + '.xlsx')
  }
}
</script>
<style>
.sc {
  font-variant: small-caps;
}
</style>
