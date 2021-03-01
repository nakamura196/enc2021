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

      <iframe
        class="mt-5"
        width="100%"
        height="900"
        frameborder="no"
        src="https://docs.google.com/document/d/e/2PACX-1vTYC18kUXvQRbFLAE-V_V21jGtpkSQ1MDQ7U-ngieRXd1tTAARVv78xyd3aarNhhv5Qnenn4paEqo03/pub?embedded=true"
      ></iframe>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: this.$t('manual'),
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
          text: this.title,
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
