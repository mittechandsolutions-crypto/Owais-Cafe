import { copyFileSync, mkdirSync } from 'node:fs'

const accountDirectory = new URL('../dist/account/', import.meta.url)
const indexFile = new URL('../dist/index.html', import.meta.url)

mkdirSync(accountDirectory, { recursive: true })
copyFileSync(indexFile, new URL('index.html', accountDirectory))
