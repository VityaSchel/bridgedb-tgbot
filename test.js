import fs from 'fs/promises'

try {
  await fs.readFile('./test')
} catch(e) {
  console.log(JSON.stringify(e, Object.getOwnPropertyNames(e)))
}
