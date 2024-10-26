# qgeminiserver

A Deno+TypeScript framework for building [Geminispace](https://geminiquickst.art/) servers. This is a [Kaksik](https://github.com/sergetymo/kaksik) fork that brings bug-fixes and keeps away bit-rot.

## Usage

### Prerequisites

1. [Install Deno](https://deno.com/)
1. Obtain SSL certificates. You can generate self-signed ones using `openssl` command:

    ```bash
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
    ```

### Your first app

Create minimal application in `app.ts`:

```typescript
import { Application } from 'jsr:@arma/qgeminiserver@2.0.3';

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
```

Then run it:

```bash
deno run --allow-net --allow-read app.ts
```

### Gemtext usage

`Gemtext` class represents a `text/gemini` media type that is native to Gemini protocol
(see chapter 5 of [spec](https://gemini.circumlunar.space/docs/specification.html)).
It's a line-based text format, so essentially `Gemtext` is just an `Array<Line>` with helpers.
All six line types are implemented:

- [x] `LineText`
- [x] `LineLink`
- [x] `LinePreformattedToggle`
- [x] `LineHeading`
- [x] `LineQuote`
- [x] `LineListItem`

`Response.body` setter accepts Gemtext for convenience.

```typescript
import { Application } from 'jsr:@arma/qgeminiserver@2.0.3';

const 
keyPath  = Deno.env.get('KEY_PATH')  || '../cert/key.pem',
certPath = Deno.env.get('CERT_PATH') || '../cert/cert.pem',
key      = await Deno.readTextFile(keyPath),
cert     = await Deno.readTextFile(certPath),
app      = new Application({key, cert});

app.use(ctx => {
  ctx.response.body = new Gemtext(
    new LineHeading('Gemtext demo', 1),
    new LineText(),
    new LineLink('gemini://s.tymo.name', 'stymo'),
    new LineText(),
    new LineText('There will be wrapped text. Elit eius magnam quae dolor ipsa eveniet aut? Facilis natus eum reiciendis reprehenderit odio. Sed et consectetur fuga quod illum ex minus. Iste quia dolor minus saepe in! Recusandae eligendi iusto blanditiis nostrum ipsum! Consequuntur tempora eaque dolore reiciendis sit. At exercitationem repudiandae doloremque quasi non. Nesciunt veritatis aliquid magnam unde pariatur'),
    new LineText(),
    new LineQuote('To be or not to be?'),
    new LinePreformattingToggle(),
    new LineText('There will be unwrapped text. Put some ASCII-art!'),
    new LinePreformattingToggle(),
  )
})

await app.start()
```

Appending new lines and other `Gemtext` instances:

```typescript
const content = new Gemtext(
  new LineHeading('Second page', 1),
  new LineText(),
)

// do some calculation
const prevPageId = 1
const nextPageId = 3

// append more lines
content.append(
  new LineHeading('Navigation'),
  new LineText(),
)

// create anoter Gemtext instance
const nav = new Gemtext(
  new LineLink(`/pages/${prevPageId}`, 'Previous page'),
  new LineLink(`/pages/${nextPageId}`, 'Next page'),
  // Gemtext constructor accepts other Gemtext instances
  new Gemtext(
    new LineText('~~~~~~~~~'),
    new LineText('2020 A.D.'),
  ),
)

// appending mixed lines and Gemtext instances works too
content.append(
  new LineText('----'),
  nav,
  new LineText('----'),
)
```

### Other examples

See `examples` folder.

## Available middleware

### serveStatic

Serves static files from a directory to specified URL

```typescript
import { Application, serveStatic } from 'jsr:@arma/qgeminiserver@2.0.3';

const 
keyPath  = Deno.env.get('KEY_PATH')  || '../cert/key.pem',
certPath = Deno.env.get('CERT_PATH') || '../cert/cert.pem',
key      = await Deno.readTextFile(keyPath),
cert     = await Deno.readTextFile(certPath),
app      = new Application({key, cert});

app.use(serveStatic('./log/', '/gemlog/'))
app.use(serveStatic('./public/'))

await app.start()
```

Beware of ordering of `serveStatic` middleware usages: more generic URLs should occur
later that more specific, e.g., `/path/subpath/` must be before `/path/`.

### handleRoutes

Runs specified async function when request path matches configured route.

```typescript
import {
  Application,
  handleRoutes,
  Route,
} from 'jsr:@arma/qgeminiserver@2.0.3'

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
```

### handleRedirects

Sends either temporary or permanent redirect response when path matches configuration.

```typescript
import {
  Application,
  handleRedirects,
  handleRoutes,
  Redirect,
  Route,
} from 'jsr:@arma/qgeminiserver@2.0.3'

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
```

## Feature roadmap

- [x] Serve gemtext (out of the box, see [Gemtext usage](#gemtext-usage))
- [x] Serve static files at configured URLs (via middleware, see [serveStatic](#servestatic))
- [x] Serve programmable resources at configured URLs (via middleware, see [handleRoutes](#handleroutes))
- [x] Serve redirect responses at configured URLs (via middleware, see [handleRedirects](#handleredirects))
- [x] Document `Gemtext` usage
- [ ] Serve gone responses at configured URLs (via middleware)
- [ ] Improve `Response` class
- [ ] -- 'Good enough' point --
- [ ] *Propose yours by [filing an issue](https://github.com/sergetymo/kaksik/issues/new)*

∎
