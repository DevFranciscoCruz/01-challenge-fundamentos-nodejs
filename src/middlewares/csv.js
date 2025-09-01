export async function csv(request, response) {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  if (!buffers.length) {
    return request.body = null
  }

  request.body = Buffer.concat(buffers).toString()
}