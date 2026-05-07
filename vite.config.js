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

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: htmlInputs,
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
