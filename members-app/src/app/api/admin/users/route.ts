// GET /api/admin/users — Listar usuarios (con verificación de admin)
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_PASS, ADMIN_SECOND_PASS } from '@/lib/auth'
import prisma from '@/lib/db'

function checkAdmin(req: NextRequest) {
  const pass = req.headers.get('x-admin-pass')
  return pass === ADMIN_PASS
}

function checkSecondPass(req: NextRequest) {
  const pass = req.headers.get('x-second-pass')
  return pass === ADMIN_SECOND_PASS
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { wallet: true, referralCode: true, _count: { select: { appointments: true } } }
  })
  return NextResponse.json({ usuarios })
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { action, userId } = await req.json()
  if (!action) return NextResponse.json({ error: 'Acción requerida' }, { status: 400 })

  if (action === 'toggle_activo') {
    if (!checkSecondPass(req)) return NextResponse.json({ error: 'Segunda contraseña requerida para esta acción' }, { status: 403 })
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    await prisma.user.update({ where: { id: userId }, data: { activo: !user.activo } })
    return NextResponse.json({ ok: true, activo: !user.activo })
  }

  if (action === 'delete') {
    if (!checkSecondPass(req)) return NextResponse.json({ error: 'Segunda contraseña requerida para eliminar' }, { status: 403 })
    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
}
