<template>
  <div>
    <v-container class="my-5">
      <h2>いいねしたアイテム</h2>
      <v-card v-for="(item, key) in items" :key="key" class="mt-4 pa-4">
        <v-row>
          <v-col cols="12" sm="3" class="mb-4">
            <nuxt-link
              :to="
                localePath({
                  name: 'edit',
                  query: { id: item.id },
                })
              "
            >
              <v-img
                :src="item.thumbnail"
                contain
                style="height: 100px"
                width="100%"
                class="grey lighten-2"
              ></v-img>
            </nuxt-link>
          </v-col>
          <v-col cols="12" sm="9">
            <h3 class="mb-4">
              <nuxt-link
                :to="
                  localePath({
                    name: 'edit',
                    query: { id: item.id },
                  })
                "
              >
                {{ item.id }}
              </nuxt-link>
            </h3>

            {{ $moment(item.createTime.toDate()).fromNow() }}
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'

export default {
  data() {
    return {
      items: [],
    }
  },
  computed: {
    isSignedIn() {
      return this.$store.getters.getIsSignedIn
    },
    userUid() {
      return this.$store.getters.getUserUid
    },
  },

  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection('users')
          .doc(this.userUid)
          .collection('likedItems')
          .orderBy('createTime', 'desc')
          .onSnapshot(
            (res) => {
              const items = []

              res.forEach(function (doc) {
                items.push(doc.data())
              })

              this.items = items
            },
            (error) => {
              console.error('GET_REALTIME_LIST', error)
            }
          )
      }
    })
  },
}
</script>
