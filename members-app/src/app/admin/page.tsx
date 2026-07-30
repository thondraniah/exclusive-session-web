'use client'
// Panel de Administración — Solo accesible con Gandalf / P4lant1R
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [authStep, setAuthStep] = useState<1 | 2>(1)
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState('stats')
  const [secondPassRequired, setSecondPassRequired] = useState(false)
  const [pendingAction, setPendingAction] = useState<any>(null)

  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [showNewUser, setShowNewUser] = useState(false)
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', telefono: '', nombre: '', password: '' })
  const [newAppt, setNewAppt] = useState({ userId: '', servicio: 'tattoo', precio: '', fecha: '' })
  const [msg, setMsg] = useState<any>(null)
  const [secondPassInput, setSecondPassInput] = useState('')

  const ADMIN_PASS = 'P4lant1R'
  const ADMIN_SECOND_PASS = 'Mordor777'

  async function loadStats() {
    const res = await fetch('/api/admin/stats', { headers: { 'x-admin-pass': ADMIN_PASS } })
    const d = await res.json()
    if (d.error) { setMsg({ type: 'error', text: d.error }); return }
    setStats(d)
  }

  async function loadUsers() {
    const res = await fetch('/api/admin/users', { headers: { 'x-admin-pass': ADMIN_PASS } })
    const d = await res.json()
    if (d.error) return
    setUsers(d.usuarios)
  }

  async function loadTransactions() {
    const res = await fetch('/api/admin/transactions', { headers: { 'x-admin-pass': ADMIN_PASS } })
    const d = await res.json()
    if (d.error) return
    setTransactions(d.transactions)
  }

  function handleAction(action: string, data: any, needsSecond = false) {
    if (needsSecond) {
      setPendingAction({ action, data })
      setSecondPassRequired(true)
      setSecondPassInput('')
    } else {
      executeAction(action, data)
    }
  }

  async function executeAction(action: string, data: any, secondPassOverride?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'x-admin-pass': ADMIN_PASS }
    if (secondPassOverride) headers['x-second-pass'] = secondPassOverride
    const res = await fetch('/api/admin/users', {
      method: 'POST', headers,
      body: JSON.stringify({ action, ...data })
    })
    const d = await res.json()
    if (d.error) { setMsg({ type: 'error', text: d.error }); return }
    setMsg({ type: 'success', text: `Acción completada: ${action}` })
    setSecondPassRequired(false)
    setPendingAction(null)
    loadUsers()
  }

  function handleSecondPassSubmit() {
    if (secondPassInput !== ADMIN_SECOND_PASS) {
      setMsg({ type: 'error', text: 'Segunda contraseña incorrecta' })
      return
    }
    executeAction(pendingAction.action, pendingAction.data, ADMIN_SECOND_PASS)
  }

  async function crearUsuario(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newUser })
    })
    const d = await res.json()
    if (d.ok) { setMsg({ type: 'success', text: 'Usuario creado!' }); setShowNewUser(false); loadUsers() }
    else setMsg({ type: 'error', text: d.error })
  }

  async function crearCita(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/appointments', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-pass': ADMIN_PASS },
      body: JSON.stringify({ action: 'crear', ...newAppt })
    })
    const d = await res.json()
    if (d.ok) { setMsg({ type: 'success', text: 'Cita creada!' }); setShowNewAppointment(false) }
    else setMsg({ type: 'error', text: d.error })
  }

  if (authStep === 1) {
    return (
      <div className="login-page">
        <div className="login-box card" style={{ border: '2px solid #c0392b' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem' }}>🛡️</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: '#e74c3c', letterSpacing: '3px', marginTop: '0.5rem' }}>ACCESO ADMIN</div>
          </div>
          {authError && <div className="alert alert-error">{authError}</div>}
          <form onSubmit={e => {
            e.preventDefault()
            if (pass1 === ADMIN_PASS) { setAuthStep(2); setAuthError('') }
            else { setAuthError('Contraseña incorrecta'); setPass1('') }
          }}>
            <div className="form-group">
              <label>🔐 Contraseña de acceso</label>
              <input className="input" type="password" placeholder="••••••••" value={pass1} onChange={e => setPass1(e.target.value)} required autoFocus />
            </div>
            <button type="submit" className="btn btn-danger" style={{ width: '100%' }}>Verificar</button>
          </form>
        </div>
      </div>
    )
  }

  if (authStep === 2) {
    return (
      <div className="login-page">
        <div className="login-box card" style={{ border: '2px solid #e67e22' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem' }}>⚠️</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: '#e67e22', letterSpacing: '3px', marginTop: '0.5rem' }}>SEGUNDA CONTRASEÑA</div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Acceso restringido — requiere doble verificación</div>
          </div>
          {authError && <div className="alert alert-error">{authError}</div>}
          <form onSubmit={e => {
            e.preventDefault()
            if (pass2 === ADMIN_SECOND_PASS) { setAuthStep(3); setAuthError('') }
            else { setAuthError('Contraseña incorrecta'); setPass2('') }
          }}>
            <div className="form-group">
              <label>🔑 Segunda contraseña</label>
              <input className="input" type="password" placeholder="••••••••" value={pass2} onChange={e => setPass2(e.target.value)} required autoFocus />
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>Acceder al Panel</button>
          </form>
        </div>
      </div>
    )
  }

  // Ya autenticado — Panel Admin
  return (
    <>
      {/* Top bar */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(212,175,55,0.15)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: '#D4AF37', letterSpacing: '3px' }}>
          🛡️ ADMIN PANEL — Exclusive Session
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>Gandalf · Modo Admin</span>
          <button className="btn btn-outline btn-sm" onClick={() => router.replace('/dashboard')}>Dashboard</button>
          <button className="btn btn-outline btn-sm" onClick={() => { fetch('/api/auth/logout', { method: 'POST' }); router.replace('/login') }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '2rem' }}>
        {msg && <div className={`alert alert-${msg.type}`} style={{ marginBottom: '1.5rem' }}>{msg.text}</div>}

        {/* Second pass modal */}
        {secondPassRequired && (
          <div className="modal-overlay">
            <div className="modal" style={{ border: '2px solid #c0392b' }}>
              <div className="modal-title">⚠️ Confirmar Acción Sensible</div>
              <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Esta acción requiere la segunda contraseña de administrador (Mordor777).
              </p>
              <div className="form-group">
                <label>🔑 Segunda contraseña</label>
                <input className="input" type="password" placeholder="••••••••" value={secondPassInput} onChange={e => setSecondPassInput(e.target.value)} autoFocus />
              </div>
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={() => { setSecondPassRequired(false); setPendingAction(null) }}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleSecondPassSubmit}>Confirmar</button>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="tabs">
          {['stats', 'usuarios', 'transacciones', 'citas', 'nuevo'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); if (t === 'stats') loadStats(); if (t === 'usuarios') loadUsers(); if (t === 'transacciones') loadTransactions() }}>
              {{ stats: '📊 Estadísticas', usuarios: '👥 Usuarios', transacciones: '💳 Transacciones', citas: '📅 Citas', nuevo: '➕ Crear' }[t]}
            </button>
          ))}
        </div>

        {/* STATS */}
        {tab === 'stats' && (
          <>
            {!stats && loadStats()}
            {stats && (
              <div className="grid-4">
                <div className="card stat-widget">
                  <div className="stat-value">{stats.totalUsuarios}</div>
                  <div className="stat-label">Total Usuarios</div>
                </div>
                <div className="card stat-widget">
                  <div className="stat-value" style={{ color: '#2ecc71' }}>{stats.usuariosActivos}</div>
                  <div className="stat-label">Activos</div>
                </div>
                <div className="card stat-widget">
                  <div className="stat-value" style={{ color: '#3498db' }}>${stats.totalSaldo.toFixed(2)}</div>
                  <div className="stat-label">Saldo Total en Sistema</div>
                </div>
                <div className="card stat-widget">
                  <div className="stat-value" style={{ color: '#e67e22' }}>{stats.citasPendientes}</div>
                  <div className="stat-label">Citas Pendientes</div>
                </div>
              </div>
            )}
          </>
        )}

        {/* USUARIOS */}
        {tab === 'usuarios' && (
          <>
            {!users.length && loadUsers()}
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th><th>Email</th><th>Teléfono</th><th>Nivel</th><th>Visitas</th><th>Saldo</th><th>Activo</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td style={{ color: '#ccc' }}>{u.email}</td>
                      <td style={{ color: '#ccc' }}>{u.telefono}</td>
                      <td><span className={`badge badge-${u.nivel}`}>{u.nivel}</span></td>
                      <td>{u.visitas}</td>
                      <td style={{ color: '#D4AF37' }}>${u.wallet?.saldo?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span style={{ color: u.activo ? '#2ecc71' : '#e74c3c', fontSize: '1.2rem' }}>
                          {u.activo ? '●' : '○'}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-outline btn-sm" onClick={() => handleAction('toggle_activo', { userId: u.id }, true)}
                            style={{ color: u.activo ? '#e74c3c' : '#2ecc71', borderColor: u.activo ? '#e74c3c' : '#2ecc71' }}>
                            {u.activo ? 'Desactivar' : 'Activar'}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleAction('delete', { userId: u.id }, true)}
                            style={{ fontSize: '0.7rem' }}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* TRANSACCIONES */}
        {tab === 'transacciones' && (
          <>
            {!transactions.length && loadTransactions()}
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Fecha</th><th>Usuario</th><th>Tipo</th><th>Monto</th><th>Descripción</th></tr>
                </thead>
                <tbody>
                  {transactions.map((t: any) => (
                    <tr key={t.id}>
                      <td style={{ color: '#888' }}>{new Date(t.createdAt).toLocaleDateString('es-ES')}</td>
                      <td>{t.wallet?.user?.nombre || '—'}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px',
                          background: t.tipo === 'carga' || t.tipo === 'referral_bonus' ? 'rgba(46,204,113,0.2)' :
                            t.tipo === 'refund' ? 'rgba(231,76,60,0.2)' : 'rgba(52,152,219,0.2)',
                          color: t.tipo === 'carga' || t.tipo === 'referral_bonus' ? '#2ecc71' :
                            t.tipo === 'refund' ? '#e74c3c' : '#3498db'
                        }}>
                          {t.tipo}
                        </span>
                      </td>
                      <td style={{ color: t.monto > 0 ? '#2ecc71' : '#e74c3c', fontWeight: 700 }}>
                        {t.monto > 0 ? '+' : ''}{t.monto.toFixed(2)}
                      </td>
                      <td style={{ color: '#888', fontSize: '0.8rem' }}>{t.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* CITAS */}
        {tab === 'citas' && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <div style={{ color: '#888', marginBottom: '1.5rem' }}>Gestión de citas — usa la pestaña "Crear" para agendar</div>
          </div>
        )}

        {/* NUEVO */}
        {tab === 'nuevo' && (
          <div className="grid-2">
            <div className="card">
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#F0EAD6', marginBottom: '1.5rem' }}>👤 Crear Usuario</h3>
              <form onSubmit={crearUsuario}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input className="input" value={newUser.nombre} onChange={e => setNewUser({ ...newUser, nombre: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="input" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input className="input" value={newUser.telefono} onChange={e => setNewUser({ ...newUser, telefono: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Contraseña</label>
                  <input className="input" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>Crear Usuario</button>
              </form>
            </div>
            <div className="card">
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#F0EAD6', marginBottom: '1.5rem' }}>📅 Crear Cita</h3>
              <form onSubmit={crearCita}>
                <div className="form-group">
                  <label>ID de Usuario</label>
                  <input className="input" value={newAppt.userId} onChange={e => setNewAppt({ ...newAppt, userId: e.target.value })} placeholder="ID del usuario (del listado)" required />
                </div>
                <div className="form-group">
                  <label>Servicio</label>
                  <select className="input" value={newAppt.servicio} onChange={e => setNewAppt({ ...newAppt, servicio: e.target.value })}>
                    <option value="tattoo">Tattoo</option>
                    <option value="barber">Barbería</option>
                    <option value="manicure">Manicure</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Precio (USD)</label>
                  <input className="input" type="number" step="0.01" value={newAppt.precio} onChange={e => setNewAppt({ ...newAppt, precio: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input className="input" type="datetime-local" value={newAppt.fecha} onChange={e => setNewAppt({ ...newAppt, fecha: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>Crear Cita</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
