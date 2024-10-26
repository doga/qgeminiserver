import { Response } from './Response.mts'
import { Header } from './Header.mts'
import { StatusCode } from './StatusCode.mts'

export class ResponseRedirect extends Response {
  constructor (path: string, isPermanent: boolean = false) {
    super(new Header(
      isPermanent
        ? StatusCode.PermanentRedirect
        : StatusCode.TemporaryRedirect
      ,
      path,
    ))
  }
}
