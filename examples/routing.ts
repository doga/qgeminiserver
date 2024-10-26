import {
  Application,
  handleRoutes,
  Route,
} from '../mod.mts'

const 
keyPath  = Deno.env.get('KEY_PATH')  || '../cert/key.pem',
certPath = Deno.env.get('CERT_PATH') || '../cert/cert.pem',
key      = await Deno.readTextFile(keyPath),
cert     = await Deno.readTextFile(certPath),
app      = new Application({key, cert});

app.use(handleRoutes(
  new Route('/test', async (ctx) => {
    ctx.response.body = '# Test page'
  }),
  new Route<{id?: string}>('/param/:id', async (ctx) => {
    ctx.response.body = '# Parametrized page\r\n' +
      'id = ' + ctx.pathParams.id
  }),
  new Route('/', async (ctx) => {
    ctx.response.body = '# HOME page\r\n' +
      '=> /test Test page served by other route\r\n' +
      '=> /param/7 Parametrized page, where id=7\r\n' +
      '=> /404 No routes matched'
  }),
))

app.use(async (ctx) => {
  ctx.response.body = '# No routes matched\r\n' +
    'Running fallback middleware'
})

await app.start()
