// GET /api/gamification/spin — Girar la ruleta diaria
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const userId = payload.userId as string

  // Verificar si ya giró hoy
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const manana = new Date(hoy); manana.setDate(manana.getDate() + 1)

  const yaGiro = await prisma.spin.findFirst({
    where: { userId, createdAt: { gte: hoy, lt: manana } }
  })
  if (yaGiro) return NextResponse.json({ error: 'Ya giraste hoy. Vuelve mañana!', usado: true }, { status: 400 })

  // Premios
  const premios = ['5% off', '10% off', 'Producto gratis']
  const probabilidades = [0.6, 0.35, 0.05] // 60%, 35%, 5%
  const rand = Math.random()
  let premio = ''
  let cumulative = 0
  for (let i = 0; i < probabilidades.length; i++) {
    cumulative += probabilidades[i]
    if (rand < cumulative) { premio = premios[i]; break }
  }

  const spin = await prisma.spin.create({ data: { userId, premio } })
  return NextResponse.json({ ok: true, premio, spinId: spin.id })
}
