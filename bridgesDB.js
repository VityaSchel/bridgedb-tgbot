import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

const bridgesDBAPIURL = 'https://bridges.torproject.org/bridges?transport=obfs4'

async function getBridges(captchaID, captchaResponse) {
  const responseRaw = await fetch(bridgesDBAPIURL, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        captcha_challenge_field: captchaID,
        captcha_response_field: captchaResponse,
        submit: 'submit'
      }),
      method: 'POST'
  })
  if(responseRaw.status !== 200) throw 'Error'

  const response = await responseRaw.text()
  const root = parse(response)
  const bridges = root.querySelector('#bridgelines')?.innerText
  if(!bridges) throw 'Error'

  return bridges
}

async function requestBridges() {
  const responseRaw = await fetch(bridgesDBAPIURL)
  const response = await responseRaw.text()
  const root = parse(response)
  const captchaImage = root.querySelector('#captcha-box > img').src.split('data:image/png;base64,', 2)[1]
  const captchaChallengeID = document.querySelector('#captcha_challenge_field').value
  return { captchaImage, captchaChallengeID }
}
