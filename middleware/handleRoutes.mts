import { State } from '../classes/Application.mts'
import { Context } from '../classes/Context.mts'
import { Route, RouteContext } from '../classes/Route.mts'

export function handleRoutes <S extends State = Record<string, any>> (
  ...routes: Array<Route>
): (ctx: Context<S>, next: () => Promise<void>) => Promise<void> {
  return async function (ctx: Context<S>, next: () => Promise<void>) {
    const [path, query] = ctx.request.path.split('?', 2)
    const match = routes.find(route => route.matches(path))
    if (match) {
      await match.handle(path, query, ctx as RouteContext, next)
    } else {
      await next()
    }
  }
}
