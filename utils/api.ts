export async function fetchSWR<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
  if (response.ok) {
    return response.json()
  } else {
    throw new Error(`HTTP ${response.status}`)
  }
}
