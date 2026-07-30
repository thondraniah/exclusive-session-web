// GET/POST /api/installments — Cuotas (Layaway)
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const cuotas = await prisma.installment.findMany({
    where: { userId: payload.userId as string }, orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json({ cuotas })
}

export async function POST(req: NextRequest) {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { nombreTatuaje, montoObjetivo, semanas } = await req.json()
  if (!nombreTatuaje || !montoObjetivo || !semanas) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  const cuota = await prisma.installment.create({
    data: { userId: payload.userId as string, nombreTatuaje, montoObjetivo, semanas }
  })
  return NextResponse.json({ ok: true, cuota })
}
