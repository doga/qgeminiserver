import {
  Application,
  handleRedirects,
  handleRoutes,
  Redirect,
  Route,
} from '../mod.mts'

const 
keyPath  = Deno.env.get('KEY_PATH')  || '../cert/key.pem',
certPath = Deno.env.get('CERT_PATH') || '../cert/cert.pem',
key      = await Deno.readTextFile(keyPath),
cert     = await Deno.readTextFile(certPath),
app      = new Application({key, cert});

app.use(handleRedirects(
  new Redirect('/short', '/long-very-long-url', true),
  new Redirect('/home', 'https://tymo.name'),
))

app.use(handleRoutes(
  new Route('/long-very-long-url', async (ctx) => {
    ctx.response.body = '# Redirect target page'
  }),
))

await app.start()
