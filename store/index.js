import firebase from '~/plugins/firebase'

export const state = () => ({
  userUid: '',
  userName: '',
  userRole: '',
  userPic: '',
  items: [],
  isSignedIn: false,
})

export const mutations = {
  setUserUid(state, userUid) {
    state.userUid = userUid
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  setUserRole(state, userRole) {
    state.userRole = userRole
  },
  setSignedIn(state, value) {
    state.isSignedIn = value
  },
  setUserPic(state, value) {
    state.userPic = value
  },
}

export const actions = {
  login({ commit }) {
    console.log('login action')
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        const user = result.user
        console.log('success : ' + user.uid + ' : ' + user.displayName)

        commit('setUserUid', user.uid)
        commit('setUserName', user.displayName)
        commit('setUserPic', user.photoURL)
      })
      .catch(function (error) {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
  },
}

export const getters = {
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  },
  getUserRole(state) {
    return state.userRole
  },
  getItems(state) {
    return state.items
  },
  getIsSignedIn(state) {
    return state.isSignedIn
  },
  getUserPic(state) {
    return state.userPic
  },
}
