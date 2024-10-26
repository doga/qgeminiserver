import { Response } from './Response.mts'
import { Body } from './Body.mts'
import { Header } from './Header.mts'
import { StatusCode } from './StatusCode.mts'
import { MIME_GEMINI } from './File.mts'
import { Gemtext } from './Gemtext.mts'

export class ResponseOk extends Response {
  constructor(body: Body | Gemtext, mime: string = MIME_GEMINI) {
    const header = new Header(StatusCode.Success, mime)
    super(header, body)
  }
}
