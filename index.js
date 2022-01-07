#!/root/.nvm/versions/node/v16.13.0/bin/node
import 'dotenv/config'
import fetch from 'node-fetch'
import fs from 'fs/promises'
import main from './main.js'

console.log('Content-type:text/plain')
console.log('')
console.log('OK')

try {
  await main()
} catch(e) {
  const __dirname = new URL('.', import.meta.url).pathname
  fs.appendFile(`${__dirname}error.log`, `${JSON.stringify(e, Object.getOwnPropertyNames(e))}\n`)
}
