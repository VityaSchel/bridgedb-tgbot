import fss from 'fs'
import fs from 'fs/promises'
import { sendPhoto, sendText } from './telegramApi.js'
import { getBridges, requestBridges } from './bridgesDB.js'
import HttpsProxyAgent from 'https-proxy-agent'
import getProxy from './proxy.js'

export default async function main() {
  const stdinBuffer = fss.readFileSync(process.stdin.fd)
  const stdin = stdinBuffer.toString()
  const body = JSON.parse(stdin)
  if(body.message.chat.type !== 'private') return
  const text = body.message.text
  if(!text) return

  const userID = body.message.chat.id
  const filePath = `./.db/${userID}`
  const captcha = text === '/start' ? false : await isItCaptchaSolution(userID)
  if(captcha) {
    await sendText(userID, 'Checking captcha, please wait.\nПроверка капчи, пожалуйста подождите.')
    const { captchaID, proxy } = captcha
    global.proxyAgent = new HttpsProxyAgent(proxy)
    let bridges
    try {
      bridges = await getBridges(captchaID, body.message.text)
    } catch(e) {
      if(e === 'Error') {
        return await sendText(userID, 'Incorrect captcha. Try again or use /start\nНеправильный ответ. Попробуйте еще раз или отправьте /start')
      } else if(e === 'Timeout') {
        return await sendText(userID, 'Proxy error. Please try one more time and then reload captcha with /start\nОшибка прокси. Пожалуйста, попробуйте второй раз и затем перезагрузите капчу через /start')
      } throw e
    }
    await fs.unlink(filePath)
    await sendText(userID, bridges)
  } else {
    await sendText(userID, 'Trying to find proxy, please wait.\nИдет поиск прокси, пожалуйста подождите.')
    let proxy
    try {
      proxy = await getProxy()
    } catch(e) {
      await sendText(userID, 'Proxy error. Please try again\nОшибка прокси. Пожалуйста, попробуйте еще раз')
      throw e
    }
    const proxyInfo = `${proxy.protocol}://${proxy.ip}:${proxy.port}`
    global.proxyAgent = new HttpsProxyAgent(proxyInfo)
    const { captchaImage, captchaChallengeID } = await requestBridges()
    await fs.writeFile(filePath, JSON.stringify({ captchaID: captchaChallengeID, proxy: proxyInfo }))
    await sendPhoto(userID, captchaImage)
  }
}

async function isItCaptchaSolution(userID) {
  if(!/^\d+$/.test(userID)) throw 'UserID is incorrect'
  try {
    const captcha = await fs.readFile(`./.db/${userID}`)
    return JSON.parse(captcha)
  } catch(e) {
    if(e?.code === 'ENOENT') {
      return false
    } else throw e
  }
}
