// POST /api/wallet/cargar — Cargar saldo a la billetera
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { monto, referencia } = await req.json()
  if (!monto || monto <= 0) return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })

  const wallet = await prisma.wallet.findUnique({ where: { userId: payload.userId as string } })
  if (!wallet) return NextResponse.json({ error: 'Billetera no encontrada' }, { status: 404 })

  await prisma.wallet.update({
    where: { id: wallet.id },
    data: { saldo: { increment: monto } }
  })
  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      tipo: 'carga',
      monto,
      descripcion: `Carga de saldo — Ref: ${referencia || 'N/A'}`,
      referencia
    }
  })
  const updated = await prisma.wallet.findUnique({ where: { id: wallet.id } })
  return NextResponse.json({ ok: true, saldo: updated?.saldo })
}
