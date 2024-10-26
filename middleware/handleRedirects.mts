import { State } from '../classes/Application.mts'
import { Context } from '../classes/Context.mts'
import { Redirect } from '../classes/Redirect.mts'

export function handleRedirects <S extends State = Record<string, any>> (
  ...redirects: Array<Redirect>
): (ctx: Context<S>, next: () => Promise<void>) => Promise<void> {
  return async function (ctx: Context<S>, next: () => Promise<void>) {
    const match = redirects.find(redirect => redirect.matches(ctx.request.path))
    if (match) {
      ctx.response = match.response
    } else {
      await next()
    }
  }
}
