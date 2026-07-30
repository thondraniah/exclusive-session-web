// GET /api/admin/stats — Estadísticas generales
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_PASS } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  const pass = req.headers.get('x-admin-pass')
  if (pass !== ADMIN_PASS) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const [totalUsuarios, usuariosActivos, totalSaldo, totalTx, citasPendientes] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { activo: true } }),
    prisma.wallet.aggregate({ _sum: { saldo: true } }),
    prisma.transaction.count(),
    prisma.appointment.count({ where: { estado: 'pendiente' } }),
  ])

  return NextResponse.json({
    totalUsuarios, usuariosActivos,
    totalSaldo: totalSaldo._sum.saldo || 0,
    totalTx, citasPendientes
  })
}
