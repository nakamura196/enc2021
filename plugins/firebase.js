import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBAelaBKeZxx43X-rzKQDaXrCQErHSdCRE',
    authDomain: 'enc2021-2807d.firebaseapp.com',
    projectId: 'enc2021-2807d',
    storageBucket: 'enc2021-2807d.appspot.com',
    messagingSenderId: '469458581461',
    appId: '1:469458581461:web:9c5444c88a839e1b7aef5c',
  })
}

export default firebase
