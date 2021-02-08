<template>
  <v-data-table :headers="headers" :items="items" :items-per-page="-1">
    <template v-slot:item.Nomenclature="{ item }">
      <span v-html="item.Nomenclature"></span>
    </template>
    <template v-slot:item.Désignant="{ item }">
      <span v-html="item.Désignant"></span>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class grid extends Vue {
  @Prop()
  data!: any[]

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

        if (field === 'Nomenclature') {
          value = value.replace('<sc>', "<sc class='sc'>")
        }

        item[field] = value
      }

      items.push(item)
    }
    return items
  }
}
</script>
<style>
.sc {
  font-variant: small-caps;
}
</style>
