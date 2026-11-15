import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { fixtures } from './fixtures.mjs'
import { openStore, StoreError } from './store.mjs'

const store = openStore(process.env.MP2_DB ?? fileURLToPath(new URL('demo.sqlite', import.meta.url)))
const page = readFileSync(new URL('index.html', import.meta.url))
const port = Number(process.env.MP2_PORT ?? 4174)
const host = '127.0.0.1'

function json(response, data, status = 200) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(data))
}

// The local UI shows proof of the handoff while keeping the contact server-side.
function receipt({ handoff, ...result }) {
  return {
    ...result,
    handoff: handoff && { lead_id: handoff.lead_id, stored_at: handoff.stored_at },
  }
}

const server = createServer((request, response) => {
  try {
    const url = new URL(request.url, `http://${host}`)
    if (request.method === 'GET' && url.pathname === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return response.end(page)
    }
    if (request.method === 'GET' && url.pathname === '/views') {
      return json(response, store.views())
    }
    if (request.method === 'POST' && url.pathname === '/fixtures') {
      const kind = url.searchParams.get('kind')
      if (!Object.hasOwn(fixtures, kind)) throw new StoreError(400, 'Unknown demo fixture.')
      return json(response, receipt(store.store(fixtures[kind])))
    }
    if (request.method === 'POST' && url.pathname === '/approve') {
      return json(response, receipt(store.approve(url.searchParams.get('id') ?? '', url.searchParams.get('reviewer'))))
    }
    json(response, { error: 'Not found.' }, 404)
  } catch (error) {
    if (error instanceof StoreError) return json(response, { error: error.message }, error.status)
    console.error(error)
    json(response, { error: 'The write failed. No handoff was returned.' }, 500)
  }
})
server.listen(port, host, () => console.log(`Store demo at http://${host}:${server.address().port}`))
