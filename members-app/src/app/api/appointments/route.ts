// GET/POST /api/appointments — Citas del usuario
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET() {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const citas = await prisma.appointment.findMany({
    where: { userId: payload.userId as string }, orderBy: { fecha: 'desc' }
  })
  return NextResponse.json({ citas })
}

export async function POST() {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  // La creación de citas se maneja desde el frontend / admin
  return NextResponse.json({ error: 'Crear cita desde el admin o calendario' }, { status: 400 })
}
