// GET /api/admin/transactions — Todas las transacciones
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_PASS } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  const pass = req.headers.get('x-admin-pass')
  if (pass !== ADMIN_PASS) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const txs = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' }, take: 200,
    include: { wallet: { include: { user: { select: { nombre: true, email: true } } } } }
  })
  return NextResponse.json({ transactions: txs })
}
