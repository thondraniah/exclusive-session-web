// Utilidades de autenticación JWT
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')

// Generar token JWT (expira en 7 días)
export async function createToken(userId: string, rol: string) {
  return await new SignJWT({ userId, rol })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

// Verificar token y obtener payload
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

// Obtener usuario logueado desde cookies
export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  return await verifyToken(token)
}

// Contraseñas del admin
export const ADMIN_PASS = process.env.ADMIN_PASS || 'P4lant1R'
export const ADMIN_SECOND_PASS = process.env.ADMIN_SECOND_PASS || 'Mordor777'
