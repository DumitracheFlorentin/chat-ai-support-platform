export interface ApiKey {
  owner: string | null
  name: string
  id: number
  key: string
  createdAt: Date
  expiresAt: Date
  active: boolean
}
