// POST /api/wallet/regalar — Transferir saldo a otro usuario
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { destinatario, monto } = await req.json()
  if (!destinatario || !monto || monto <= 0) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

  const miWallet = await prisma.wallet.findUnique({ where: { userId: payload.userId as string } })
  if (!miWallet || miWallet.saldo < monto) return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })

  // Buscar al destinatario por email o teléfono
  const destinatarioUser = await prisma.user.findFirst({
    where: { OR: [{ email: destinatario }, { telefono: destinatario }] }
  })
  if (!destinatarioUser) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  if (destinatarioUser.id === payload.userId) return NextResponse.json({ error: 'No puedes enviarte a ti mismo' }, { status: 400 })

  const walletDest = await prisma.wallet.findUnique({ where: { userId: destinatarioUser.id } })
  if (!walletDest) return NextResponse.json({ error: 'Billetera del destinatario no encontrada' }, { status: 404 })

  // Descontar del emisor
  await prisma.wallet.update({ where: { id: miWallet.id }, data: { saldo: { decrement: monto } } })
  // Añadir al receptor
  await prisma.wallet.update({ where: { id: walletDest.id }, data: { saldo: { increment: monto } } })

  await prisma.transaction.create({
    data: { walletId: miWallet.id, tipo: 'regalo_enviado', monto: -monto, descripcion: `Regalo enviado a ${destinatarioUser.nombre}` }
  })
  await prisma.transaction.create({
    data: { walletId: walletDest.id, tipo: 'regalo_recibido', monto, descripcion: `Regalo recibido de ${miWallet.id}` }
  })

  return NextResponse.json({ ok: true, nuevoSaldo: miWallet.saldo - monto })
}
