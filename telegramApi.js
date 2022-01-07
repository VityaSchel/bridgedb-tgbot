import FormData from 'form-data'
import fetch from 'node-fetch'
import stream from 'stream'
import fs from 'fs'

async function sendPhoto(userID, imageBase64) {
  const body = new FormData()
  body.append('chat_id', userID)
  body.append('photo', Buffer.from(imageBase64, 'base64'), { filename: 'captcha.png' })
  const response = await fetch(`https://api.telegram.org/bot${process.env.TGAPI_TOKEN}/sendPhoto`, {
    method: 'POST',
    body
  })
  if(response.status !== 200) throw 'Photo sending was unsuccessfull'
}

async function sendText(userID, text) {
  const response = await fetch(`https://api.telegram.org/bot${process.env.TGAPI_TOKEN}/sendMessage`, {
    method: 'POST',
    body: new URLSearchParams({
      chat_id: userID,
      text
    })
  })
  if(response.status !== 200) throw 'Text sending was unsuccessfull'
}
