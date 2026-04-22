import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import analyzeHandler from './api/analyze.js'
import healthHandler from './api/health.js'

function createMockRequest(req, body) {
  return {
    method: req.method,
    headers: req.headers,
    body,
    query: {},
    url: req.url,
  }
}

function createMockResponse(res) {
  return {
    statusCode: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value
      res.setHeader(key, value)
    },
    status(code) {
      this.statusCode = code
      res.statusCode = code
      return this
    },
    json(payload) {
      if (!res.writableEnded) {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(payload))
      }
      return this
    },
    end(payload) {
      if (!res.writableEnded) {
        res.end(payload)
      }
      return this
    },
  }
}

async function readJsonBody(req) {
  const chunks = []

  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) return {}

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return {}
  }
}

function localApiPlugin() {
  return {
    name: 'ghostnet-local-api',
    configureServer(server) {
      server.middlewares.use('/api/health', async (req, res) => {
        const mockRes = createMockResponse(res)
        await healthHandler(createMockRequest(req, {}), mockRes)
      })

      server.middlewares.use('/api/analyze', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        const body = req.method === 'POST' ? await readJsonBody(req) : {}
        const mockReq = createMockRequest(req, body)
        const mockRes = createMockResponse(res)

        await analyzeHandler(mockReq, mockRes)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }

  return {
    logLevel: 'info',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [react(), localApiPlugin()],
  }
})
