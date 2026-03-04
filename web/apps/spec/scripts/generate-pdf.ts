import { execSync, spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { mkdirSync } from 'node:fs'

const versionId = process.env.VERSION_ID || 'next'
const appDir = resolve(import.meta.dirname!, '..')
const distDir = resolve(appDir, 'dist')

async function generatePdf() {
  mkdirSync(distDir, { recursive: true })

  // Build the app first
  console.log('Building spec app...')
  execSync('npx nuxt build', { cwd: appDir, stdio: 'inherit' })

  // Start preview server
  console.log('Starting preview server...')
  const server = spawn('npx', ['nuxt', 'preview', '--port', '3210'], {
    cwd: appDir,
    stdio: 'pipe',
    shell: true,
  })

  // Wait for server to be ready
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server start timeout')), 30_000)
    server.stdout?.on('data', (data: Buffer) => {
      if (data.toString().includes('Local:')) {
        clearTimeout(timeout)
        resolve()
      }
    })
    server.stderr?.on('data', (data: Buffer) => {
      console.error(data.toString())
    })
  })

  try {
    // Dynamic import puppeteer to avoid loading if not needed
    const { default: puppeteer } = await import('puppeteer')
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    console.log('Generating PDF...')
    await page.goto('http://localhost:3210/spec/print', {
      waitUntil: 'networkidle0',
      timeout: 60_000,
    })

    const pdfPath = resolve(distDir, `2blang-spec-${versionId}.pdf`)
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '1.5cm', bottom: '1.5cm', left: '2cm', right: '2cm' },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `
        <div style="width:100%;text-align:center;font-size:9px;color:#999;">
          2b Language Specification ${versionId} — Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
    })

    console.log(`PDF generated: ${pdfPath}`)
    await browser.close()
  }
  finally {
    server.kill()
  }
}

generatePdf().catch((err) => {
  console.error('PDF generation failed:', err)
  process.exit(1)
})
