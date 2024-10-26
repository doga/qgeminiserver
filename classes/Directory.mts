import { Response } from './Response.mts'
import { File } from './File.mts'
import { ResponseOk } from './ResponseOk.mts'
import { Gemtext } from './Gemtext.mts'
import { LineLink } from './LineLink.mts'
import { LineHeading } from './LineHeading.mts'
import { LineText } from './LineText.mts'

function isGeminiIndexFile (name: string): boolean {
  return name === 'index.gmi' || name === 'index.gemini'
}

function joinPath(...parts: Array<string>): string {
  return parts.join('/').replaceAll('//', '/')
}

function decorateDirname(entry: Deno.DirEntry): string {
  return entry.name + (entry.isDirectory ? '/' : '')
}

export class Directory {
  private entries: Array<string> = []

  constructor(
    private readonly dir: string,
    private path: string,
    private readonly prefix: string
  ) {}

  private get systemPath (): string {
    return [this.dir, this.path.replace(this.prefix, '')].join('')
  }

  private get links (): Array<LineLink> {
    return this.entries.sort().map<LineLink>(entryPath =>
      new LineLink(joinPath(this.path, entryPath), entryPath)
    )
  }

  private get isRootDir (): boolean {
    return this.path === this.prefix
  }

  public async response (): Promise<Response> {
    const info = await Deno.stat(this.systemPath)
    if (info.isFile) {
      return await new File(this.systemPath).response()
    } else if (!this.path.endsWith('/')) {
      this.path += '/'
    }
    if (!this.isRootDir) this.entries.push('..')
    for await (const entry of Deno.readDir(this.systemPath)) {
      if (entry.isFile && isGeminiIndexFile(entry.name)) {
        return await new File(joinPath(this.systemPath, entry.name)).response()
      }
      this.entries.push(decorateDirname(entry))
    }
    return new ResponseOk(new Gemtext(
      new LineHeading(`Listing of ${this.path}`, 1),
      new LineText(),
      ...this.links,
    ))
  }
}
