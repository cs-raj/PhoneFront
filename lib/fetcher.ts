export const fetcher = async <T = any>(url: string): Promise<T> => {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

// Convenience typed hooks (optional usage)
export const buildQuery = (base: string, params?: Record<string, any>) => {
  const url = new URL(base, typeof window !== "undefined" ? window.location.origin : "http://localhost")
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v))
    })
  }
  return params ? `${base}?${url.searchParams.toString()}` : base
}

export const jsonFetcher = async <T = any>(url: string): Promise<T> => {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}
