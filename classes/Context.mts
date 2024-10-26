import { Application, State } from './Application.mts'
import { Request } from './Request.mts'
import { Response } from './Response.mts'

export class Context<S extends State> {
  public app: Application<S>
  public state: S
  public request: Request
  public response: Response

  constructor (application: Application<S>, requestString: string) {
    this.app = application
    this.state = application.state
    this.request = new Request(requestString)
    this.response = new Response()
  }
}
