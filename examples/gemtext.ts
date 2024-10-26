import {
  Application,
  Gemtext,
  LineHeading,
  LineLink,
  LineText,
} from '../mod.mts'

const 
keyPath  = Deno.env.get('KEY_PATH')  || '../cert/key.pem',
certPath = Deno.env.get('CERT_PATH') || '../cert/cert.pem',
key      = await Deno.readTextFile(keyPath),
cert     = await Deno.readTextFile(certPath),
app      = new Application({key, cert});

app.use(ctx => {
  const content = new Gemtext(
    new LineHeading('Second page', 1),
    new LineText(),
  )

// ... do some calculation
  const prevPageId = 1
  const nextPageId = 3

  content.append(
    new LineHeading('Navigation'),
    new LineText(),
  )

  const nav = new Gemtext(
    new LineLink(`/pages/${prevPageId}`, 'Previous page'),
    new LineLink(`/pages/${nextPageId}`, 'Next page'),
    // Grouping: Gemtext constructor accepts instances of Gemtext
    new Gemtext(
      new LineText('~~~~~~~~~'),
      new LineText('2021 A.D.'),
    ),
  )

  content.append(
    new LineText('----'),
    nav,
    new LineText('----'),
  )

  ctx.response.body = content
})

await app.start()
