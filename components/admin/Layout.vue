<template>
  <div>
    <v-sheet
      v-if="breadcrumbs && breadcrumbs.length > 0"
      color="grey lighten-2"
    >
      <v-container fluid class="py-4">
        <v-breadcrumbs class="py-0" :items="breadcrumbs">
          <template #divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-container>
    </v-sheet>
    <v-container class="my-5">
      <template v-if="userRole == 'global_admin'"><slot /></template>
      <template v-else>{{ $t('権限がありません。') }}</template>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'

@Component
export default class grid extends Vue {
  @Prop()
  breadcrumbs!: any[]

  get userRole(): any {
    return this.$store.getters.getUserRole
  }

  set userRole(value: any) {
    this.$store.commit('setUserRole', value)
  }
}
</script>
