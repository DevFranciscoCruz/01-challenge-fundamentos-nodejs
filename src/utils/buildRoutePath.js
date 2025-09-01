export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const paramsWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-zA-Z0-9\-_]+)')

  const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}