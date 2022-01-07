import fss from 'fs'
import fs from 'fs/promises'
import { sendPhoto, sendText } from './telegramApi.js'
import { getBridges, requestBridges } from './bridgesDB.js'

export default async function main() {
  const stdinBuffer = fss.readFileSync(process.stdin.fd)
  const stdin = stdinBuffer.toString()
  const body = JSON.parse(stdin)
  if(body.message.chat.type !== 'private') return
  const text = body.message.text
  if(!text) return

  const userID = body.message.chat.id
  const filePath = `./.db/${userID}`
  const captchaID = await isItCaptchaSolution(userID)
  if(captchaID) {
    const bridges = await getBridges(captchaID, body.message.text)
    await fs.unlink(filePath)
    await sendText(userID, bridges)
  } else {
    const { captchaImage, captchaChallengeID } = await requestBridges()
    await fs.writeFile(filePath, captchaChallengeID)
    await sendPhoto(userID, captchaImage)
  }
}

async function isItCaptchaSolution(userID) {
  if(!/^\d+$/.test(userID)) throw 'UserID is incorrect'
  try {
    const captchaID = await fs.readFile(`./.db/${userID}`)
    return captchaID
  } catch(e) {
    if(e?.code === 'ENOENT') {
      return false
    } else {
      throw e
    }
  }
}
