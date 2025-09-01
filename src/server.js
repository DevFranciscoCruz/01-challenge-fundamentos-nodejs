import http from 'node:http'
import { csv } from './middlewares/csv.js'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extractQueryParams.js'

const middlewares = {
  'application/json': json,
  'text/csv': csv
}

const server = http.createServer(async (request, response) => {
  const { method, url, headers } = request
  console.log(`Method: ${method} | URL: ${url} | Content-Type: ${headers['content-type'] ?? 'None'}`)
  const contentType = headers['content-type']?.toLowerCase() || null;

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    if (route.requiredContentType.length) {
      if (!contentType || !route.requiredContentType.some(type => contentType.includes(type))) {
        return response.writeHead(415).end('Unsupported Media Type');
      }

      await middlewares[contentType](request, response)
    }

    const routeParams = request.url.match(route.path)

    const { query, ...params } = routeParams.groups

    request.params = params
    request.query = query ? extractQueryParams(query) : {}

    return await route.handler(request, response)
  }

  return response.writeHead(404).end()
})

server.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
