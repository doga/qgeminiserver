import { Response } from './Response.mts'
import { Header } from './Header.mts'
import { StatusCode, StatusCodeFailure } from './StatusCode.mts'

export class ResponseFailure extends Response {
  constructor (
    statusCode: StatusCodeFailure = StatusCode.TemporaryFailure,
    message: string = "Request failed",
  ) {
    super(new Header(statusCode, message))
  }
}
