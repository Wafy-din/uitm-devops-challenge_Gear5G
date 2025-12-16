import crypto from 'crypto'

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, expected: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(expected)
  )
}

export function hashPassword(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex')
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex')
}

export function generateDeviceFingerprint(data: string): string {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
}
