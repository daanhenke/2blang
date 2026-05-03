/**
 * Builds the spec as a PDF.
 *
 * 1. Runs `nuxt generate` with `NUXT_PUBLIC_2BLANG_PDF_MODE=1` so the layer
 *    sets `data-pdf-mode` on `<html>` and components branch to print-friendly
 *    rendering.
 * 2. Serves the resulting `.output/public` directory over a local static
 *    server.
 * 3. Drives Playwright (Chromium) at the `/single` route and prints to
 *    `.output/public/spec.pdf`.
 *
 * The PDF lives alongside the static site, so it deploys automatically and is
 * reachable at `https://2b.team/spec/<version>/spec.pdf`.
 */
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'
import { resolve, join, extname } from 'node:path'
import { chromium } from 'playwright'
import { detectVersion } from '@2blang/nuxt-layer/utils/versioning.node'

const here = resolve(__dirname, '..')
const publicDir = resolve(here, '.output/public')

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
}

async function runGenerate(): Promise<void>
{
  await new Promise<void>((accept, reject) =>
  {
    const child = spawn('pnpm', ['exec', 'nuxt', 'generate'], {
      cwd: here,
      stdio: 'inherit',
      env: {
        ...process.env,
        NUXT_PUBLIC_2BLANG_PDF_MODE: '1'
      },
      shell: process.platform === 'win32'
    })
    child.on('exit', (code) =>
      code === 0 ? accept() : reject(new Error(`nuxt generate exited ${code}`))
    )
  })
}

function startStatic(port: number)
{
  const server = createServer((req, res) =>
  {
    const url = new URL(req.url ?? '/', `http://localhost:${port}`)
    const path = decodeURIComponent(url.pathname)
    let filePath = join(publicDir, path)
    try
    {
      if (statSync(filePath).isDirectory())
      {
        filePath = join(filePath, 'index.html')
      }
    }
    catch
    {
      filePath = join(publicDir, '404.html')
    }
    try
    {
      const ext = extname(filePath)
      res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream' })
      createReadStream(filePath).pipe(res)
    }
    catch
    {
      res.writeHead(404).end('not found')
    }
  })
  return new Promise<{ close: () => void }>((accept) =>
  {
    server.listen(port, () => accept({ close: () => server.close() }))
  })
}

async function renderPdf(port: number): Promise<void>
{
  const v = detectVersion()
  const route = `http://localhost:${port}/spec/${v.segment}/single`
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(route, { waitUntil: 'networkidle' })
  await page.emulateMedia({ media: 'print' })
  await page.pdf({
    path: join(publicDir, 'spec.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' }
  })
  await browser.close()
}

async function main()
{
  await runGenerate()
  const server = await startStatic(4173)
  try
  {
    await renderPdf(4173)
    process.stdout.write(`PDF written to ${join(publicDir, 'spec.pdf')}\n`)
  }
  finally
  {
    server.close()
  }
}

main().catch((err: unknown) =>
{
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
