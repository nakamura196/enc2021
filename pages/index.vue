<template>
  <div>
    <section class="mb-5">
      <v-parallax height="300" :src="baseUrl + '/img/ogp/home.jpg'">
        <v-layout column align-center justify-center class="white--text">
          <h1 class="mb-2 display-1">
            <b>{{ $t(title) }} </b>
          </h1>
          <v-btn
            large
            class="mt-5"
            :to="
              localePath({
                name: 'toc',
              })
            "
            color="primary"
            >{{ $t('try_out') }}</v-btn
          >
        </v-layout>
      </v-parallax>
    </section>
    <section class="mb-5">
      <v-img
        v-if="false"
        height="300px"
        contain
        :src="baseUrl + '/img/ogp/home.jpg'"
      >
        <v-row align="center" class="white--text pa-2 fill-height text-center">
          <v-col>
            <h1 class="display-1">
              <b>{{ $t(title) }} </b>
            </h1>
            <v-btn
              large
              class="mt-5"
              :to="
                localePath({
                  name: 'toc',
                })
              "
              color="primary"
              >{{ $t('try_out') }}</v-btn
            >
          </v-col>
        </v-row>
      </v-img>
    </section>

    <v-container>
      <v-card class="my-5" flat>
        <v-card-title>
          <h2>{{ $t('about_') }}</h2>
        </v-card-title>
        <v-card-text>
          <div class="text--primary">
            <p>
              {{ title }}
            </p>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="my-5" flat>
        <v-card-title>
          <h2>{{ $t('updates') }}</h2>
        </v-card-title>
        <v-card-text>
          <ul class="text--primary">
            <li>2021年XX月XX日: プロトタイプシステムを公開しました。</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      title: process.env.siteName,
    }
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
