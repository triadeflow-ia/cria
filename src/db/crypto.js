import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = process.env.ENCRYPTION_KEY || randomBytes(32).toString('hex')

function getKey() {
  const key = process.env.ENCRYPTION_KEY
  if (!key) throw new Error('ENCRYPTION_KEY env var is required')
  return Buffer.from(key, 'hex')
}

export function encrypt(data) {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const jsonStr = typeof data === 'string' ? data : JSON.stringify(data)
  let encrypted = cipher.update(jsonStr, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag().toString('hex')
  return { encryptedData: encrypted, iv: iv.toString('hex'), authTag }
}

export function decrypt(encryptedData, iv, authTag) {
  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(iv, 'hex'))
  decipher.setAuthTag(Buffer.from(authTag, 'hex'))
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  try { return JSON.parse(decrypted) } catch { return decrypted }
}
