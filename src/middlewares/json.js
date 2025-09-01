export async function json(request, response) {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  if (!buffers.length) {
    request.body = null
  }

  try {
    request.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch (error) {
    request.body = null
  }
}