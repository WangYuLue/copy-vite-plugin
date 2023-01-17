import { ViteDevServer, PluginOption, ResolvedConfig } from 'vite'
import path from 'node:path'
import fs from 'node:fs'
import mimeTypes from 'mime-types'
import { cleanUrl, normalizePath } from './utils'

export interface ICopyOptions {
  pattern?: {
    from: string
    to: string
  }[]
}

const copyServePlugin = (options: ICopyOptions): PluginOption => {
  const { pattern = [] } = options

  let rootPath = process.cwd()

  const patternMap: Record<
    string,
    {
      from: string
      to: string
      type: 'file' | 'dir' | 'unknown'
    }
  > = {}

  const copyToRootPathDirs: string[] = []

  pattern.forEach((item) => {
    if (item.to) {
      // 如果有 to 字段，表示需要 copy 到指定目录
      const absFromPath = path.posix.join(rootPath, item.from)
      const absToPath = path.posix.join(rootPath, item.to)

      if (!fs.existsSync(absFromPath)) {
        console.warn(`[copy-vite-plugin]: ${absFromPath} is not exist`)
        return
      }

      const stat = fs.statSync(absFromPath)
      let type: 'file' | 'dir' | 'unknown' = 'unknown'
      if (stat.isFile()) {
        type = 'file'
      }
      if (stat.isDirectory()) {
        type = 'dir'
      }
      patternMap[absToPath] = {
        from: absFromPath,
        to: absToPath,
        type
      }
    } else {
      // 如果没有 to 字段，表示需要 copy 到根目录
      copyToRootPathDirs.push(item.from)
    }
  })

  return {
    name: 'copy-vite-plugin',
    apply: 'serve',
    configureServer: (server: ViteDevServer) => {
      server.middlewares.use('/', async (req, res, next) => {
        if (!pattern || !req.url) {
          next()
          return
        }
        const absReqPath = path.posix.join(rootPath, cleanUrl(req.url))
        // 精确匹配 file
        if (patternMap[absReqPath]) {
          const { from: fromPath, type } = patternMap[absReqPath]
          if (type === 'file') {
            await sendContentByFilePath(fromPath)
            return
          }
        }
        // 前缀匹配 dir
        const matched = Object.keys(patternMap).find((item) => {
          return absReqPath.startsWith(item)
        })
        if (matched) {
          const { from: fromDir, to: toDir, type } = patternMap[matched]
          if (type === 'dir') {
            const fromPath = fromDir + absReqPath.slice(toDir.length)
            await sendContentByFilePath(fromPath)
            return
          }
        }
        // 如果本地没有该路径，检测 copy 到根目录的 dir 中有没有该路径
        if (!fs.existsSync(absReqPath)) {
          for (let i = 0; i < copyToRootPathDirs.length; i++) {
            const fromPath = path.posix.join(
              rootPath,
              copyToRootPathDirs[i],
              cleanUrl(req.url)
            )
            if (fs.existsSync(fromPath)) {
              await sendContentByFilePath(fromPath)
              return
            }
          }
        }

        next()

        async function sendContentByFilePath(filePath: string) {
          const handledPath = normalizePath(filePath)
          if (!fs.existsSync(handledPath)) {
            console.warn(
              `[copy-vite-plugin]: request file error, ${filePath} is not exist`
            )
            next()
            return
          }
          if (!fs.statSync(handledPath).isFile()) {
            console.warn(
              `[copy-vite-plugin]: request file error, ${filePath} is not a file`
            )
            next()
            return
          }
          const content = await fs.promises.readFile(handledPath)
          res.writeHead(200, {
            'Content-Type': mimeTypes.lookup(filePath) as string
          })
          res.end(content)
        }
      })
    }
  }
}

const copyBuildPlugin = (options: ICopyOptions): PluginOption => {
  const { pattern = [] } = options

  let resolvedConfig: ResolvedConfig

  return {
    name: 'copy-vite-plugin',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config
    },
    async closeBundle() {
      const outDir = path.posix.join(
        resolvedConfig.root,
        resolvedConfig.build.outDir
      )
      await Promise.all(
        pattern.map(async (item) => {
          const absFromPath = path.posix.join(resolvedConfig.root, item.from)
          const absToPath = path.posix.join(outDir, item.to)

          if (!fs.existsSync(absFromPath)) {
            console.warn(`[copy-vite-plugin]: ${absFromPath} is not exist`)
            return
          }

          if (!fs.existsSync(path.dirname(absToPath))) {
            fs.mkdirSync(path.dirname(absToPath), { recursive: true })
          }

          const stat = await fs.promises.lstat(absFromPath)

          if (stat.isDirectory()) {
            await fs.promises.cp(absFromPath, absToPath, {
              recursive: true,
              force: true
            })
          }

          if (stat.isFile()) {
            await fs.promises.copyFile(absFromPath, absToPath)
          }
        })
      )
    }
  }
}

const copy = (options: ICopyOptions): PluginOption[] => {
  return [copyServePlugin(options), copyBuildPlugin(options)]
}

export { copy }
