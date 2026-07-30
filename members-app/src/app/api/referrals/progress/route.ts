// GET /api/referrals/progress — Progreso de referidos del usuario
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const referrals = await prisma.referral.findMany({
    where: { referidorId: payload.userId as string },
    include: { referido: { select: { nombre: true, email: true } }, codigo: true }
  })

  const totalRegistrados = referrals.length
  const totalCalificados = referrals.filter(r => r.estado === 'calificado').length
  const plazoActivo = referrals.find(r => r.estado !== 'fraude_detectado')
  const plazoValido = plazoActivo ? plazoActivo.plazoValido : null

  // Calcular quién está cerca de calificar
  const enProceso = referrals.filter(r => r.estado === 'en_proceso' || r.estado === 'registrado')
    .map(r => ({ ...r, referido: r.referido }))

  return NextResponse.json({
    totalRegistrados, totalCalificados,
    meta: 10, recompensa: 250,
    plazoValido,
    referrals: enProceso.map(r => ({
      id: r.id, nombre: r.referido.nombre, email: r.referido.email,
      gastoAcumulado: r.gastoAcumulado, estado: r.estado,
      requiere: 150 - r.gastoAcumulado
    }))
  })
}
