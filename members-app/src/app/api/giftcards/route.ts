// POST /api/giftcards — Crear gift card
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

function generarCodigoGC() {
  return 'GC-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(req: NextRequest) {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { receptorEmail, receptorNombre, monto, diseno, pagadaConSaldo } = await req.json()
  if (!receptorEmail || !receptorNombre || !monto) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })

  const wallet = await prisma.wallet.findUnique({ where: { userId: payload.userId as string } })
  const montoFinal = pagadaConSaldo ? monto : monto * 1.1 // 10% extra si paga con saldo

  if (pagadaConSaldo) {
    if (!wallet || wallet.saldo < monto) return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })
    await prisma.wallet.update({ where: { id: wallet.id }, data: { saldo: { decrement: monto } } })
    await prisma.transaction.create({
      data: { walletId: wallet.id, tipo: 'carga', monto: -monto, descripcion: `Gift card comprada con saldo — ${montoFinal} para ${receptorNombre}` }
    })
  }

  const gc = await prisma.giftCard.create({
    data: {
      compradorId: payload.userId as string,
      receptorEmail, receptorNombre,
      monto: montoFinal, montoBruto: monto,
      diseno: diseno || 'default',
      pagadaConSaldo,
      codigo: generarCodigoGC()
    }
  })
  return NextResponse.json({ ok: true, giftCard: gc })
}
