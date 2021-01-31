<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="-1"
  ></v-data-table>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class grid extends Vue {
  @Prop()
  data!: any[]

  fields: any[] = [
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
  ]

  metadata: any[] = [
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

    headers.push({
      text: 'Nomenclature',
      value: 'Nomenclature',
    })

    const fields = this.fields.concat(this.metadata)
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      headers.push({
        text: field.label,
        value: field.label,
      })
    }

    return headers
  }

  get items() {
    const authorities = this.data
    const items = []
    for (let i = 0; i < authorities.length; i++) {
      const authority = authorities[i]
      const item: any = {}

      console.log(authority)

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
}
</script>
