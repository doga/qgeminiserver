import { Application, serveStatic } from '../mod.mts'

const 
keyPath  = Deno.env.get('KEY_PATH')  || '../cert/key.pem',
certPath = Deno.env.get('CERT_PATH') || '../cert/cert.pem',
key      = await Deno.readTextFile(keyPath),
cert     = await Deno.readTextFile(certPath),
app      = new Application({key, cert});

app.use(serveStatic('./public/no_index_file/', '/log/'))
app.use(serveStatic('./public/'))

await app.start()
