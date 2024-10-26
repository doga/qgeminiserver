import { Context } from '../classes/Context.mts'
import { State } from '../classes/Application.mts'
import { Directory } from '../classes/Directory.mts'
import { ResponseFailure } from '../classes/ResponseFailure.mts'
import { ResponseNotFound } from '../classes/ResponseNotFound.mts'

export function serveStatic <S extends State = Record<string, unknown>> (
  fromDirectory: string = './',
  toUrl: string = '/'
): (ctx: Context<S>, next: () => Promise<void>) => Promise<void> {
  return async function (ctx: Context<S>, next: () => Promise<void>) {
    if (ctx.request.path.startsWith(toUrl)) {
      try {
        ctx.response = await new Directory(
          fromDirectory,
          ctx.request.path,
          toUrl,
        ).response()
      } catch (e) {
        switch ((e as {name: string}).name) {
        // switch (e.name) {
          case 'NotFound':
          case 'PermissionDenied':
            ctx.response = new ResponseNotFound()
            break
          default:
            ctx.response = new ResponseFailure()
            break
        }
      }
    } else {
      await next()
    }
  }
}
