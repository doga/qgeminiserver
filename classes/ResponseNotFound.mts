import { Response } from './Response.mts'
import { Header } from './Header.mts'
import { StatusCode } from './StatusCode.mts'

export class ResponseNotFound extends Response {
  constructor() {
    super(new Header(StatusCode.NotFound, 'Requested resource not found'));
  }
}
