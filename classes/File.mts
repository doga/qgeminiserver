import { extname, contentType } from '../deps.mts'
import { Response } from './Response.mts'
import { ResponseOk } from './ResponseOk.mts'
import { Body } from './Body.mts'

export const MIME_GEMINI = 'text/gemini'
export const MIME_DEFAULT = 'text/plain'

function isGeminiExtension (ext: string): boolean {
  return ext === '.gmi' || ext === '.gemini'
}

export class File {
  private readonly mime: string
  constructor(private readonly systemPath: string) {
    this.mime = MIME_GEMINI;

    const fileExtension = extname(systemPath);
    if (!isGeminiExtension(fileExtension)) {
      this.mime = contentType(fileExtension) || MIME_DEFAULT;
    }
  }

  public async response (): Promise<Response> {
    const contents = await Deno.readFile(this.systemPath)
    return new ResponseOk(new Body(contents), this.mime)
  }
}


