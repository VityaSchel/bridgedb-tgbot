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
  global.isRussianLanguage = body.message.from.language_code === 'ru'
  const whitelist = [270882543]
  if(!whitelist.includes(body.message.from.id)) {
    return await sendText(userID, [
      'Sorry, this bot is limited to author. You can\'t use it, however you can setup your own: https://github.com/VityaSchel/bridgedb-tgbot',
      'Извините, но этот бот работает только на автора. Вы не можете его использовать, но можете установить свой: https://github.com/VityaSchel/bridgedb-tgbot'
    ])
  }

  const userID = body.message.chat.id
  const filePath = `./.db/${userID}`
  const captcha = text === '/start' ? false : await isItCaptchaSolution(userID)
  if(captcha) {
    await sendText(userID, ['Checking captcha, please wait.', 'Проверка капчи, пожалуйста подождите.'])
    const { captchaID, proxy } = captcha
    global.proxyAgent = new HttpsProxyAgent(proxy)
    let bridges
    try {
      bridges = await getBridges(captchaID, body.message.text)
    } catch(e) {
      if(e === 'Error') {
        return await sendText(userID, ['Incorrect captcha. Try again or use /start', 'Неправильный ответ. Попробуйте еще раз или отправьте /start'])
      } else if(e === 'Timeout') {
        return await sendText(userID, ['Proxy error. Please try one more time and then reload captcha with /start', 'Ошибка прокси. Пожалуйста, попробуйте второй раз и затем перезагрузите капчу через /start'])
      } throw e
    }
    await fs.unlink(filePath)
    await sendText(userID, bridges)
  } else {
    let proxy, proxyInfo
    if(global.USE_PROXY)
      await sendText(userID, ['Trying to find proxy, please wait. It may take up to 50 seconds.', 'Идет поиск прокси, пожалуйста подождите. Это может занять до 50 секунд.'])
      try {
        proxy = await getProxy()
      } catch(e) {
        await sendText(userID, ['Proxy error. Please try again', 'Ошибка прокси. Пожалуйста, попробуйте еще раз'])
        throw e
      }
      proxyInfo = `${proxy.protocol}://${proxy.ip}:${proxy.port}`
      global.proxyAgent = new HttpsProxyAgent(proxyInfo)
    }
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
