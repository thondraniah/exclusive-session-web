// POST /api/auth/register — Registrar nuevo usuario
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { createToken } from '@/lib/auth'

function generarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(req: NextRequest) {
  try {
    const { email, telefono, nombre, password, codigoReferido } = await req.json()

    if (!email || !telefono || !nombre || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    // Verificar si el email ya existe
    const existente = await prisma.user.findFirst({
      where: { OR: [{ email }, { telefono }] }
    })
    if (existente) {
      return NextResponse.json({ error: 'El email o teléfono ya están registrados' }, { status: 400 })
    }

    // Crear usuario
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email, telefono, nombre, password: passwordHash,
      }
    })

    // Crear billetera
    await prisma.wallet.create({ data: { userId: user.id } })

    // Crear código de referido único
    const codigoUnico = generarCodigo()
    await prisma.referralCode.create({ data: { userId: user.id, codigo: codigoUnico } })

    // Crear streak inicial
    await prisma.streak.create({ data: { userId: user.id } })

    // Procesar referido si existe
    if (codigoReferido) {
      const refCode = await prisma.referralCode.findUnique({ where: { codigo: codigoReferido } })
      if (refCode) {
        const plazoValido = new Date()
        plazoValido.setMonth(plazoValido.getMonth() + 6)
        await prisma.referral.create({
          data: {
            codigoId: refCode.id,
            referidoId: user.id,
            referidorId: refCode.userId,
            plazoValido,
          }
        })
      }
    }

    const token = await createToken(user.id, user.rol)
    const res = NextResponse.json({ ok: true, userId: user.id, nombre: user.nombre })
    res.cookies.set('session', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
