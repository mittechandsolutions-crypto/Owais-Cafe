import { copyFileSync, mkdirSync } from 'node:fs'

const indexFile = new URL('../dist/index.html', import.meta.url)

for (const route of ['account', 'admin']) {
  const routeDirectory = new URL(`../dist/${route}/`, import.meta.url)
  mkdirSync(routeDirectory, { recursive: true })
  copyFileSync(indexFile, new URL('index.html', routeDirectory))
}
