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
              <td>{{ '2021-03-26' }}</td>
              <td class="py-2">
                <ul>
                  <li>ヘッダー画像とロゴを更新しました。</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>{{ '2021-03-09' }}</td>
              <td class="py-2">
                <ul>
                  <li>
                    ユーザ権限の不具合の改修、および権限の内容を更新しました。
                  </li>
                  <li>マニュアルを追加しました。</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>{{ '2021-03-01' }}</td>
              <td class="py-2">
                <ul>
                  <li>編集ページにENCCREへのリンクを追加しました。</li>
                  <li>Schwabの欄に巻数を自動表示するように修正しました。</li>
                  <li>目次ページの表記の一部を修正しました。</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>{{ '2021-02-28' }}</td>
              <td class="py-2">
                <ul>
                  <li>上部メニューにTwitter シェアボタンを設置しました。</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>{{ '2021-02-25' }}</td>
              <td class="py-2">
                <ul>
                  <li>
                    グローバル管理者以外も管理ダッシュボードを閲覧できるようにしました。
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>{{ '2021-02-24' }}</td>
              <td class="py-2">
                <ul>
                  <li>
                    完了ボタンが押された後、グローバル権限を持つ人以外はその項目の編集をできない設定にしました。
                  </li>
                </ul>
              </td>
            </tr>
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
                  <li>典拠のコピー（引き継ぎ）ボタンを追加しました。</li>
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
