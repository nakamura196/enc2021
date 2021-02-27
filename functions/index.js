const functions = require('firebase-functions')
const Twitter = require('twitter')
const admin = require('firebase-admin')
const axios = require('axios')
admin.initializeApp(functions.config().firebase)

// データベースの参照を作成
const fireStore = admin.firestore()

/*
const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

*/

function formatDate(dt) {
  const y = dt.getFullYear()
  const m = ('00' + (dt.getMonth() + 1)).slice(-2)
  const d = ('00' + dt.getDate()).slice(-2)
  return y + '-' + m + '-' + d
}

exports.helloWorld = functions.https.onRequest(async (response) => {
  const snapShot = await fireStore.collection('users').get()

  const snapShot2 = await fireStore.collection('items').get()

  const date1 = new Date('2021/2/23')
  const date2 = new Date()
  const termDay = Math.ceil((date2 - date1) / 86400000)

  const now = date2
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  )

  const previous = await fireStore
    .collection('progress')
    .doc(formatDate(yesterday))
    .get()

  const previousSize = previous.data().sizeDouble

  const toc = await axios.get('https://enc2021-2807d.web.app/data/toc.json')
  const total = Object.keys(toc.data['2']).length

  client.post(
    'statuses/update',
    {
      status: `#百科全書 アプリ公開${termDay}日目の進捗報告。\n${
        snapShot.docs.length
      }人の参加者により${total.toLocaleString()}項目中${
        snapShot2.docs.length
      }項目の作業が進行しています。進行中の項目数は昨日から${
        snapShot2.docs.length - previousSize
      }件増加しました。\n\nhttps://enc2021-2807d.web.app/`,
    },
    function (error, tweet, response) {
      if (error) throw error
      console.log(tweet) // Tweet body.
      console.log(response) // Raw response object.
    }
  )
  const citiesRef = fireStore.collection('progress')
  citiesRef.doc(formatDate(now)).set({
    sizeDouble: snapShot2.docs.length,
  })

  response.send(`test`)
})

const config = require('./config.json')

const client = new Twitter(config)

/*
exports.doTweet = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    const snapShot = await fireStore.collection('users').get()

    const snapShot2 = await fireStore.collection('items').get()

    const date1 = new Date('2021/2/23')
    const date2 = new Date()
    const termDay = Math.ceil((date2 - date1) / 86400000)

    const now = date2
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    )

    const previous = await fireStore
      .collection('progress')
      .doc(formatDate(yesterday))
      .get()

    const previousSize = previous.data().sizeDouble

    const toc = await axios.get('https://enc2021-2807d.web.app/data/toc.json')
    const total = Object.keys(toc.data['2']).length

    client.post(
      'statuses/update',
      {
        status: `#百科全書 アプリ公開${termDay}日目の進捗報告。\n${
          snapShot.docs.length
        }人の参加者により${total.toLocaleString()}項目中${
          snapShot2.docs.length
        }項目の作業が進行しています。進行中の項目数は昨日から${
          snapShot2.docs.length - previousSize
        }件増加しました。`,
      },
      function (error, tweet, response) {
        if (error) throw error
        console.log(tweet) // Tweet body.
        console.log(response) // Raw response object.
      }
    )
    const citiesRef = fireStore.collection('progress')
    citiesRef.doc(formatDate(now)).set({
      sizeDouble: snapShot2.docs.length,
    })
  })
  */

exports.doTweetCrontab = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    const snapShot = await fireStore.collection('users').get()

    const snapShot2 = await fireStore.collection('items').get()

    const date1 = new Date('2021/2/23')
    const date2 = new Date()
    const termDay = Math.ceil((date2 - date1) / 86400000)

    const now = date2
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    )

    const previous = await fireStore
      .collection('progress')
      .doc(formatDate(yesterday))
      .get()

    const previousSize = previous.data().sizeDouble

    const toc = await axios.get('https://enc2021-2807d.web.app/data/toc.json')
    const total = Object.keys(toc.data['2']).length

    client.post(
      'statuses/update',
      {
        status: `#百科全書 アプリ公開${termDay}日目の進捗報告。\n${
          snapShot.docs.length
        }人の参加者により${total.toLocaleString()}項目中${
          snapShot2.docs.length
        }項目の作業が進行しています。進行中の項目数は昨日から${
          snapShot2.docs.length - previousSize
        }件増加しました。\n\nhttps://enc2021-2807d.web.app/`,
      },
      function (error, tweet, response) {
        if (error) throw error
        console.log(tweet) // Tweet body.
        console.log(response) // Raw response object.
      }
    )
    const citiesRef = fireStore.collection('progress')
    citiesRef.doc(formatDate(now)).set({
      sizeDouble: snapShot2.docs.length,
    })
  })
