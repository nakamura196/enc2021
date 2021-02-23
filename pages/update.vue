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
    <v-container class="my-5">
      <h2>{{ title }}</h2>
      <v-simple-table class="mt-5">
        <template v-slot:default>
          <tbody>
            <tr>
              <td>{{ '2021-02-23' }}</td>
              <td class="py-2">
                <ul>
                  <li>
                    抽出要素の入力欄の末尾（Titre
                    mentionnéの下）に備考欄を追加しました。
                  </li>
                  <li>
                    抽出要素のSignatureとContributeurの入力をアシストする機能を追加しました。
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>{{ '2021-02-21' }}</td>
              <td class="py-2">
                <ul>
                  <li>更新履歴ページを追加しました。</li>
                  <li>英語ページの表示改善を行いました。</li>
                  <li>「nb de réf」を入力不可項目に設定しました。</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>{{ '2021-02-19' }}</td>
              <td class="py-2">
                <ul>
                  <li>システムを公開しました。</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: this.$t('更新履歴'),
    }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: this.$t('HOME'),
          disabled: false,
          to: this.localePath({ name: 'index' }),
          exact: true,
        },
        {
          text: this.$t('更新履歴'),
          exact: true,
        },
      ]
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
