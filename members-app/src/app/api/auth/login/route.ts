// POST /api/auth/login — Iniciar sesión
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    if (!user.activo) return NextResponse.json({ error: 'Cuenta desactivada' }, { status: 403 })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    const token = await createToken(user.id, user.rol)
    const res = NextResponse.json({ ok: true, userId: user.id, nombre: user.nombre, rol: user.rol })
    res.cookies.set('session', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
