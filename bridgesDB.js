import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import { AbortController } from 'node-abort-controller'

const bridgesDBAPIURL = 'https://bridges.torproject.org/bridges?transport=obfs4'

export async function getBridges(captchaID, captchaResponse) {
  const controller = new AbortController()
  const signal = controller.signal

  const proxyTimeout = setTimeout(() => controller.abort(), 15000)

  try {
    const responseRaw = await fetch(bridgesDBAPIURL, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        captcha_challenge_field: captchaID,
        captcha_response_field: captchaResponse,
        submit: 'submit'
      }),
      method: 'POST',
      ...(global.USE_PROXY && { agent: global.proxyAgent }),
      signal
    })
  } catch(e) {
    if(e?.message === 'The operation was aborted.') throw 'Timeout'
    else throw e
  }
  if(responseRaw.status !== 200) throw 'Error'
  clearTimeout(proxyTimeout)

  const response = await responseRaw.text()
  const root = parse(response)
  const bridges = root.querySelector('#bridgelines')?.innerText
  if(!bridges) throw 'Error'

  return bridges
}

export async function requestBridges() {
  const responseRaw = await fetch(bridgesDBAPIURL, global.USE_PROXY && { agent: global.proxyAgent })
  const response = await responseRaw.text()
  const root = parse(response)
  try {
    const captchaImage = root.querySelector('#captcha-box > img').getAttribute('src').split('data:image/jpeg;base64,', 2)[1]
    const captchaChallengeID = root.querySelector('#captcha_challenge_field').getAttribute('value')
    return { captchaImage, captchaChallengeID }
  } catch(e) {
    if(e?.message === 'Cannot read properties of undefined (reading \'split\')') {
      throw `Cannot get captcha box. HTTP-Status: ${responseRaw.status}, HTML: ${response}`
    } else {
      throw e
    }
  }
}
