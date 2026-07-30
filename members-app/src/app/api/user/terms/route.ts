// POST /api/user/terms — Aceptar términos y condiciones
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST() {
  const payload = await getCurrentUser()
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  await prisma.user.update({
    where: { id: payload.userId as string },
    data: { termsAccepted: true, termsAcceptedAt: new Date() }
  })
  return NextResponse.json({ ok: true })
}
