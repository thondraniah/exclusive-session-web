// POST /api/admin/appointments — Crear / actualizar cita
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_PASS, ADMIN_SECOND_PASS } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
  const pass = req.headers.get('x-admin-pass')
  if (pass !== ADMIN_PASS) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { action, appointmentId, userId, servicio, precio, fecha, estado, pagadaConSaldo } = await req.json()

  if (action === 'crear') {
    const cita = await prisma.appointment.create({
      data: { userId, servicio, precio, fecha: new Date(fecha), pagadaConSaldo: !!pagadaConSaldo }
    })
    return NextResponse.json({ ok: true, cita })
  }

  if (action === 'actualizar_estado') {
    const cita = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { estado }
    })

    // Si se completa la cita, descontar saldo congelado si aplica
    if (estado === 'completado' && cita.pagadaConSaldo) {
      const wallet = await prisma.wallet.findUnique({ where: { userId: cita.userId } })
      if (wallet) {
        const descuento = Math.min(cita.precio, wallet.saldoCongelado)
        if (descuento > 0) {
          await prisma.wallet.update({
            where: { id: wallet.id },
            data: { saldoCongelado: { decrement: descuento } }
          })
          await prisma.transaction.create({
            data: { walletId: wallet.id, tipo: 'descuento_cita', monto: -descuento, descripcion: `Pago cita completada — ${cita.servicio}` }
          })
        }
      }
      // Incrementar visitas y recalcular nivel
      const user = await prisma.user.findUnique({ where: { id: cita.userId } })
      if (user) {
        const nuevasVisitas = user.visitas + 1
        let nuevoNivel = 'bronce'
        if (nuevasVisitas > 8) nuevoNivel = 'oro'
        else if (nuevasVisitas > 3) nuevoNivel = 'plata'
        await prisma.user.update({ where: { id: cita.userId }, data: { visitas: nuevasVisitas, nivel: nuevoNivel } })
      }
      // Validar referidos 30 días después
      const referrals = await prisma.referral.findMany({ where: { referidoId: cita.userId } })
      for (const ref of referrals) {
        if (ref.fechaValidacion) continue
        // Marcar como en_proceso
        await prisma.referral.update({ where: { id: ref.id }, data: { gastoAcumulado: { increment: cita.precio } } })
        if (ref.gastoAcumulado + cita.precio >= 150) {
          // Validar 30 días después
          const fechaValidacion = new Date(); fechaValidacion.setDate(fechaValidacion.getDate() + 30)
          await prisma.referral.update({ where: { id: ref.id }, data: { estado: 'calificado', fechaValidacion } })
          // Creditar $250 al referidor si ya pasaron los 30 días
          if (new Date() >= fechaValidacion) {
            const walletRef = await prisma.wallet.findUnique({ where: { userId: ref.referidorId } })
            if (walletRef) {
              await prisma.wallet.update({ where: { id: walletRef.id }, data: { saldo: { increment: 250 } } })
              await prisma.transaction.create({
                data: { walletId: walletRef.id, tipo: 'referral_bonus', monto: 250, descripcion: 'Bono referido — 10 amigos calificados' }
              })
            }
          }
        }
      }
    }
    return NextResponse.json({ ok: true, cita })
  }

  return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
}
