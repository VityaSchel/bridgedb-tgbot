import fetch from 'node-fetch'
import { AbortController } from "node-abort-controller"

export async function getProxy(i) {
  if(i === 4) throw 'Couldn\'t find a working proxy'

  const responseRaw = await fetch('https://public.freeproxyapi.com/api/Proxy/ProxyByType/0/3')
  if(responseRaw.status !== 200) throw 'Couldn\'t find proxy'
  const proxyResponse = await responseRaw.json()

  const controller = new AbortController()
  const signal = controller.signal

  const retryProxy = async () => {
    controller.abort()
    return await getProxy(i+1)
  }

  const proxyTimeout = setTimeout(() => await retryProxy(), 7000)

  try {
    const response = await fetch('https://postman-echo.com/get?foo=bar', {
      signal, agent: new HttpsProxyAgent(`http://${proxyResponse.ip}:${proxyResponse.port}`)
    })
    response.status === 200 && clearTimeout(proxyTimeout)
  } catch(e) {
    await retryProxy()
  }

  return { protocol: 'http', ip: proxyResponse.host, port: proxyResponse.port }
}
