import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'

function collectHtmlInputs(dir, rootDir, inputs = {}) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(rootDir, fullPath)

    if (entry.isDirectory()) {
      if (['dist', 'node_modules', '.git'].includes(entry.name)) return
      collectHtmlInputs(fullPath, rootDir, inputs)
      return
    }

    if (!entry.name.endsWith('.html')) return

    const inputName = relativePath.replace(/\.html$/, '')
    inputs[inputName] = fullPath
  })

  return inputs
}

const rootDir = path.resolve('.')
const htmlInputs = collectHtmlInputs(rootDir, rootDir)

function copyStaticAssetsPlugin() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const sourceDir = path.join(rootDir, 'js')
      const targetDir = path.join(rootDir, 'dist', 'js')

      if (!fs.existsSync(sourceDir)) return

      fs.mkdirSync(targetDir, { recursive: true })
      fs.copyFileSync(
        path.join(sourceDir, 'webflow.js'),
        path.join(targetDir, 'webflow.js')
      )

      ;['robots.txt', 'sitemap.xml'].forEach((filename) => {
        const sourceFile = path.join(rootDir, filename)
        const targetFile = path.join(rootDir, 'dist', filename)

        if (fs.existsSync(sourceFile)) {
          fs.copyFileSync(sourceFile, targetFile)
        }
      })
    },
  }
}

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: htmlInputs,
    },
  },
  plugins: [copyStaticAssetsPlugin()],
  server: {
    port: 3000,
    open: true,
  },
})
