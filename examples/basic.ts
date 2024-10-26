import { Application } from '../mod.mts';

const 
keyPath  = Deno.env.get('KEY_PATH')  || '../cert/key.pem',
certPath = Deno.env.get('CERT_PATH') || '../cert/cert.pem',
key      = await Deno.readTextFile(keyPath),
cert     = await Deno.readTextFile(certPath),
app      = new Application({key, cert});

app.use(ctx => {
  ctx.response.body = '# Hello World!'
});

await app.start();

