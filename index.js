#!/root/.nvm/versions/node/v16.13.0/bin/node
import 'dotenv/config'
import fetch from 'node-fetch'
import fs from 'fs/promises'
import main from './main.js'

global.USE_PROXY = false

console.log('Content-type:text/plain')
console.log('')
console.log('OK')

const killTimeout = setTimeout(() => {
  log('Process terminated after 60 seconds')
  process.exit(0)
}, 60*1000)

try {
  await main()
} catch(e) {
  const __dirname = new URL('.', import.meta.url).pathname
  log(JSON.stringify(e, Object.getOwnPropertyNames(e)))
} finally {
  clearTimeout(killTimeout)
}

function log(text) {
  fs.appendFile(`${__dirname}error.log`, `${text}\n`)
}
