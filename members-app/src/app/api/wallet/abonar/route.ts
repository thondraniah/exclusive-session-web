// POST /api/wallet/abonar — Abonar a cuota (layaway)
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { installmentId, monto } = await req.json()
  if (!installmentId || !monto || monto <= 0) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

  const wallet = await prisma.wallet.findUnique({ where: { userId: payload.userId as string } })
  if (!wallet || wallet.saldo < monto) return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })

  const installment = await prisma.installment.findFirst({
    where: { id: installmentId, userId: payload.userId as string }
  })
  if (!installment) return NextResponse.json({ error: 'Cuota no encontrada' }, { status: 404 })

  const nuevoAbonado = installment.montoAbonado + monto
  const nuevaCongelado = wallet.saldoCongelado + monto

  // Descontar del saldo disponible y añadir a saldo congelado
  await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      saldo: { decrement: monto },
      saldoCongelado: { increment: monto }
    }
  })

  const completada = nuevoAbonado >= installment.montoObjetivo
  await prisma.installment.update({
    where: { id: installmentId },
    data: {
      montoAbonado: nuevoAbonado,
      completada,
      estado: completada ? 'completada' : 'activa'
    }
  })

  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      tipo: 'abono_cuota',
      monto: -monto,
      descripcion: `Abono a cuota "${installment.nombreTatuaje}" — $${monto} congelados`
    }
  })

  return NextResponse.json({
    ok: true, completada, montoAbonado: nuevoAbonado,
    montoObjetivo: installment.montoObjetivo,
    saldo: (wallet.saldo - monto),
    saldoCongelado: nuevaCongelado
  })
}
