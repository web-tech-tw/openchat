import ky from 'ky'
import { nanoid } from 'nanoid'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.ocjiHost
  const saraTokenName = config.public.saraTokenName
  const zebraTokenName = config.public.zebraTokenName

  if (import.meta.server) {
    return null
  }

  // Get or create zebra token
  let zebraToken = localStorage.getItem(zebraTokenName)
  if (!zebraToken) {
    zebraToken = nanoid()
    localStorage.setItem(zebraTokenName, zebraToken)
  }

  // Get sara token if exists
  const saraToken = localStorage.getItem(saraTokenName)

  // Create ky instance with interceptors
  const api = ky.create({
    prefixUrl: baseURL,
    timeout: 60000,
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set('X-Zebra-Code', zebraToken)
          if (saraToken) {
            request.headers.set('Authorization', `SARA ${saraToken}`)
          }
        },
      ],
      afterResponse: [
        async (_request, _options, response) => {
          if (response.status === 401) {
            localStorage.removeItem(saraTokenName)
            setTimeout(() => {
              location.reload()
            }, 3000)
          }
        },
      ],
    },
  })

  return api
}
