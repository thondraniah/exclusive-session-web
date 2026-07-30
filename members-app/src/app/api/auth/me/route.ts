// GET /api/auth/me — Obtener usuario logueado
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ user: null }, { status: 401 })
  const user = await prisma.user.findUnique({
    where: { id: payload.userId as string },
    include: { wallet: true, referralCode: true }
  })
  if (!user) return NextResponse.json({ user: null }, { status: 401 })
  return NextResponse.json({
    user: {
      id: user.id, nombre: user.nombre, email: user.email, telefono: user.telefono,
      rol: user.rol, nivel: user.nivel, visitas: user.visitas, termsAccepted: user.termsAccepted,
      saldo: user.wallet?.saldo || 0,
      saldoCongelado: user.wallet?.saldoCongelado || 0,
      codigo: user.referralCode?.codigo || ''
    }
  })
}
