const API_BASE_URL = import.meta.env.VITE_BASE_URL

async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  dftHeaders: boolean = true
) {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    if (dftHeaders) {
      options.headers = { ...defaultHeaders, ...options.headers }
    }

    const endpointUrl = `${API_BASE_URL}${endpoint}`

    const response = await fetch(endpointUrl, {
      ...options,
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong')
    }

    return data
  } catch (error) {
    throw error
  }
}

export default apiRequest
