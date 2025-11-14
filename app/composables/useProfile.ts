import { jwtDecode } from 'jwt-decode'

export const useProfile = () => {
  const config = useRuntimeConfig()
  const saraTokenName = config.public.saraTokenName

  if (import.meta.server) {
    return null
  }

  const saraToken = localStorage.getItem(saraTokenName)
  if (!saraToken) {
    return null
  }

  try {
    const data = jwtDecode(saraToken)
    if (Date.now() >= data.exp * 1000) {
      throw new Error('sara token expired')
    }
    return data?.user
  }
  catch (e) {
    console.warn(e)
    localStorage.removeItem(saraTokenName)
    if (import.meta.client) {
      location.reload()
    }
    return null
  }
}
