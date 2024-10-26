import { Application } from '../mod.mts'

const 
keyPath  = Deno.env.get('KEY_PATH')  || '../cert/key.pem',
certPath = Deno.env.get('CERT_PATH') || '../cert/cert.pem',
key      = await Deno.readTextFile(keyPath),
cert     = await Deno.readTextFile(certPath),
app      = new Application({key, cert});

app.use(async (ctx, next) => {
  console.log('Received', ctx.request)
  console.time('Response sent in')
  await next()
  console.timeEnd('Response sent in')
})

app.use(async (ctx) => {
  await new Promise(r => setTimeout(r, 100))
  ctx.response.body = '# Hello World!'
})

await app.start()

