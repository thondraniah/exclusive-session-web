'use client'
// Dashboard principal — Widgets de billetera, referidos, cuotas, gamificación
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

const NIVEL_COLORS: Record<string, string> = { bronce: '#cd7f32', plata: '#c0c0c0', oro: '#D4AF37' }

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('wallet')
  const [refData, setRefData] = useState<any>(null)
  const [installments, setInstallments] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [spinResult, setSpinResult] = useState<any>(null)
  const [spun, setSpun] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showReferir, setShowReferir] = useState(false)

  // Wallet modal
  const [showCargar, setShowCargar] = useState(false)
  const [showRegalar, setShowRegalar] = useState(false)
  const [showCuota, setShowCuota] = useState(false)
  const [montoCargar, setMontoCargar] = useState('')
  const [montoRegalo, setMontoRegalo] = useState('')
  const [destinatario, setDestinatario] = useState('')
  const [msg, setMsg] = useState<any>(null)

  const loadUser = useCallback(async () => {
    const r = await fetch('/api/auth/me')
    const d = await r.json()
    if (!d.user) { router.replace('/login'); return }
    setUser(d.user)
    if (!d.user.termsAccepted) setShowTerms(true)
    setLoading(false)
  }, [router])

  const loadRef = useCallback(async () => {
    const r = await fetch('/api/referrals/progress')
    const d = await r.json()
    setRefData(d)
  }, [])

  const loadInstallments = useCallback(async () => {
    const r = await fetch('/api/installments')
    const d = await r.json()
    setInstallments(d.cuotas || [])
  }, [])

  const loadAppointments = useCallback(async () => {
    const r = await fetch('/api/appointments')
    const d = await r.json()
    setAppointments(d.citas || [])
  }, [])

  useEffect(() => { loadUser(); loadRef(); loadInstallments(); loadAppointments() }, [loadUser, loadRef, loadInstallments, loadAppointments])

  async function acceptTerms() {
    await fetch('/api/user/terms', { method: 'POST' })
    setShowTerms(false)
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
  }

  async function cargarSaldo(e: React.FormEvent) {
    e.preventDefault()
    const monto = parseFloat(montoCargar)
    if (!monto || monto <= 0) return
    const res = await fetch('/api/wallet/cargar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto, referencia: 'stripe_demo_' + Date.now() })
    })
    const d = await res.json()
    if (d.ok) {
      await loadUser(); setShowCargar(false); setMontoCargar('')
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#D4AF37', '#F5D77A'] })
    } else setMsg({ type: 'error', text: d.error })
  }

  async function regalarSaldo(e: React.FormEvent) {
    e.preventDefault()
    const monto = parseFloat(montoRegalo)
    if (!monto || monto <= 0 || !destinatario) return
    const res = await fetch('/api/wallet/regalar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto, destinatario })
    })
    const d = await res.json()
    if (d.ok) {
      await loadUser(); setShowRegalar(false); setMontoRegalo(''); setDestinatario('')
      setMsg({ type: 'success', text: `Saldo enviado! Nuevo saldo: $${d.nuevoSaldo.toFixed(2)}` })
    } else setMsg({ type: 'error', text: d.error })
  }

  async function girarRuleta() {
    const res = await fetch('/api/gamification/spin')
    const d = await res.json()
    if (d.error && d.usado) { setMsg({ type: 'warning', text: d.error }); return }
    setSpinResult(d)
    setSpun(true)
    if (d.ok) confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ['#0057D9', '#D4AF37', '#6B0F1A'] })
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem' }}>Cargando...</div>
  if (!user) return null

  const nivelColor = NIVEL_COLORS[user.nivel] || '#D4AF37'

  return (
    <>
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">Exclusive<br />Session</div>
        <a href="#wallet" className={tab === 'wallet' ? 'active' : ''} onClick={() => setTab('wallet')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
          Billetera
        </a>
        <a href="#referidos" className={tab === 'referidos' ? 'active' : ''} onClick={() => { setTab('referidos'); loadRef() }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Referidos
        </a>
        <a href="#cuotas" className={tab === 'cuotas' ? 'active' : ''} onClick={() => { setTab('cuotas'); loadInstallments() }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Cuotas
        </a>
        <a href="#citas" className={tab === 'citas' ? 'active' : ''} onClick={() => { setTab('citas'); loadAppointments() }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Mis Citas
        </a>
        <a href="#gamificacion" className={tab === 'gamificacion' ? 'active' : ''} onClick={() => setTab('gamificacion')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          Gamificación
        </a>
        <a href="#" onClick={logout} style={{ marginTop: 'auto', color: '#e74c3c' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar Sesión
        </a>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="page-header">
          <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.3rem' }}>{getGreeting()},</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 className="page-title">{user.nombre}</h1>
            <span className={`badge badge-${user.nivel}`} style={{ background: `${nivelColor}20`, color: nivelColor, border: `1px solid ${nivelColor}60` }}>
              {user.nivel.toUpperCase()} — {user.visitas} visitas
            </span>
          </div>
          <div className="page-sub">Exclusive Session — Tattoo & Barbershop</div>
        </div>

        <div style={{ padding: '2rem 2.5rem' }}>

          {/* ── BILLetera ── */}
          {tab === 'wallet' && (
            <>
              {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
              <div className="grid-2" style={{ marginBottom: '2rem' }}>
                <div className="card stat-widget" style={{ borderColor: 'rgba(212,175,55,0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Saldo Disponible</div>
                  <div className="stat-value" style={{ fontSize: '3rem' }}>${(user.saldo || 0).toFixed(2)}</div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-gold btn-sm" onClick={() => setShowCargar(true)}>💰 Cargar Saldo</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setShowRegalar(true)}>🎁 Regalar</button>
                  </div>
                </div>
                <div className="card stat-widget">
                  <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Saldo Congelado (Cuotas)</div>
                  <div className="stat-value" style={{ fontSize: '3rem', color: '#3498db' }}>${(user.saldoCongelado || 0).toFixed(2)}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Este saldo se libera al completar tu cuota</div>
                </div>
              </div>

              {/* Info legal */}
              <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
                <strong>⚠️ Información importante:</strong> El saldo de tu billetera <strong>no es reembolsable en efectivo</strong>. Es válido exclusivamente para servicios en Exclusive Session. <button onClick={() => setShowTerms(true)} style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}>Ver términos completos</button>
              </div>

              {/* Referidos preview */}
              {refData && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#F0EAD6', letterSpacing: '2px' }}>🎁 Programa de Referidos</h3>
                    <button className="btn btn-outline btn-sm" onClick={() => { setTab('referidos'); loadRef() }}>Ver progreso</button>
                  </div>
                  <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: '#888' }}>Registrados: {refData.totalRegistrados} / Calificados: {refData.totalCalificados} de 10</div>
                  <div className="progress-bar-wrap" style={{ marginBottom: '0.5rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${Math.min(100, (refData.totalCalificados / 10) * 100)}%` }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#D4AF37' }}>🎁 Gana $250 al calificar 10 amigos</div>
                </div>
              )}
            </>
          )}

          {/* ── REFERIDOS ── */}
          {tab === 'referidos' && (
            <>
              {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
              <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', color: '#D4AF37', letterSpacing: '2px' }}>$250</div>
                <div style={{ color: '#888', marginBottom: '1.5rem' }}>Gana $250 en saldo al calificar 10 amigos</div>

                {/* Barra doble */}
                <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                  Registrados: {refData?.totalRegistrados || 0} / Calificados: {refData?.totalCalificados || 0} / Meta: 10
                </div>
                <div className="progress-bar-wrap" style={{ marginBottom: '1.5rem' }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, ((refData?.totalCalificados || 0) / 10) * 100)}%` }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                  <div className="card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Registrados</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'Bebas Neue, sans-serif', color: '#F0EAD6' }}>{refData?.totalRegistrados || 0}</div>
                  </div>
                  <div className="card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Calificados ($150+)</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'Bebas Neue, sans-serif', color: '#D4AF37' }}>{refData?.totalCalificados || 0}</div>
                  </div>
                </div>
              </div>

              {/* Tu código */}
              <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Tu Código de Referido</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem', color: '#D4AF37', letterSpacing: '4px', marginBottom: '1rem' }}>{user.codigo}</div>
                <button className="btn btn-gold" onClick={() => { navigator.clipboard.writeText(user.codigo); setMsg({ type: 'success', text: 'Código copiado!' }) }}>
                  📋 Copiar Código
                </button>
              </div>

              {/* Términos */}
              <div className="alert alert-info">
                <strong>📋 Reglas del programa:</strong><br />
                • Solo cuentan amigos que gasten <strong>$150+</strong> en el local<br />
                • El gasto se valida <strong>30 días después</strong> de la cita (contra reembolsos)<br />
                • Tienes <strong>6 meses</strong> para calificar los 10<br />
                • El bono $250 se acredita automáticamente en tu billetera
              </div>
            </>
          )}

          {/* ── CUOTAS ── */}
          {tab === 'cuotas' && (
            <>
              {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: '#F0EAD6', letterSpacing: '2px' }}>Cuotas — Paga tu tatuaje en semanas</h2>
                <button className="btn btn-gold btn-sm" onClick={() => setShowCuota(true)}>+ Nueva Cuota</button>
              </div>

              {installments.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
                  <div style={{ color: '#888' }}>No tienes cuotas activas. ¡Abre una para tu próximo tatuaje!</div>
                </div>
              ) : installments.map((cuota: any) => {
                const pct = Math.min(100, (cuota.montoAbonado / cuota.montoObjetivo) * 100)
                return (
                  <div key={cuota.id} className="card" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#F0EAD6' }}>{cuota.nombreTatuaje}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Meta: ${cuota.montoObjetivo} en {cuota.semanas} semanas</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="stat-value" style={{ fontSize: '1.8rem', color: pct >= 100 ? '#2ecc71' : '#D4AF37' }}>
                          ${cuota.montoAbonado.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>de ${cuota.montoObjetivo}</div>
                      </div>
                    </div>
                    <div className="progress-bar-wrap" style={{ marginBottom: '1rem' }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct >= 100 ? 'linear-gradient(90deg,#27ae60,#2ecc71)' : '' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: pct >= 100 ? '#2ecc71' : '#888' }}>
                        {pct >= 100 ? '✅ ¡Completado! Puedes agendar tu cita' : `${(cuota.montoObjetivo - cuota.montoAbonado).toFixed(2)} restante`}
                      </span>
                      {!cuota.completada && (
                        <button className="btn btn-gold btn-sm" onClick={async () => {
                          const monto = parseFloat(prompt('¿Cuánto quieres abonar?') || '0')
                          if (!monto || monto <= 0) return
                          const res = await fetch('/api/wallet/abonar', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ installmentId: cuota.id, monto })
                          })
                          const d = await res.json()
                          if (d.ok) {
                            await loadUser(); await loadInstallments()
                            setMsg({ type: 'success', text: d.completada ? '🎉 ¡Cuota completada! Puedes agendar tu cita' : `Abono realizado. Progreso: $${d.montoAbonado}` })
                            if (d.completada) confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
                          } else setMsg({ type: 'error', text: d.error })
                        }}>Abonar</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {/* ── CITAS ── */}
          {tab === 'citas' && (
            <>
              {appointments.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                  <div style={{ color: '#888', marginBottom: '1.5rem' }}>No tienes citas registradas</div>
                  <a href="https://wa.me/16464882233" target="_blank" className="btn btn-gold">Agendar por WhatsApp</a>
                </div>
              ) : appointments.map((cita: any) => (
                <div key={cita.id} className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: '#F0EAD6', textTransform: 'uppercase' }}>{cita.servicio}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(cita.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#D4AF37' }}>${cita.precio}</div>
                      <span className={`badge badge-${cita.estado === 'completado' ? 'oro' : cita.estado === 'pendiente' ? 'bronce' : 'plata'}`}>{cita.estado}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── GAMIFICACIÓN ── */}
          {tab === 'gamificacion' && (
            <>
              {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
              {spinResult && spun && (
                <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', borderColor: 'rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.05)' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem', color: '#D4AF37', letterSpacing: '3px', animation: 'numberUp 0.5s ease' }}>
                    🎉 {spinResult.premio}
                  </div>
                  <div style={{ color: '#888', marginTop: '0.5rem' }}>¡Premio canjeable en tu próxima visita!</div>
                </div>
              )}
              <div className="grid-2">
                {/* Ruleta diaria */}
                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#F0EAD6', marginBottom: '1rem' }}>🎰 Ruleta Diaria</h3>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {spun ? '🎉' : '🎰'}
                  </div>
                  <div style={{ color: '#888', marginBottom: '1rem' }}>1 giro gratis por día<br />Premios: 5% off, 10% off, Producto gratis</div>
                  <button className="btn btn-gold" onClick={girarRuleta} disabled={spun}>
                    {spun ? '¡Ya giraste hoy!' : '¡Girar!'}
                  </button>
                </div>
                {/* Racha */}
                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#F0EAD6', marginBottom: '1rem' }}>⭐ Racha — Estrellas</h3>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
                  <div style={{ color: '#888', marginBottom: '1rem' }}>Agenda con 48h de anticipación<br />5 estrellas = upgrade gratuito</div>
                  <div className="badge badge-oro">5 Estrellas = Tinta a color / Perfilado barba GRATIS</div>
                </div>
              </div>
              {/* Niveles */}
              <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', color: '#F0EAD6', marginBottom: '1.5rem' }}>🏆 Niveles de Membresía</h3>
                <div className="grid-3">
                  {[{ nivel: 'bronce', visitas: '0-3', desc: '5% off en productos', color: '#cd7f32' },
                    { nivel: 'plata', visitas: '4-8', desc: '10% off + Prioridad en lista', color: '#c0c0c0' },
                    { nivel: 'oro', visitas: '+8', desc: '15% off + Cancelación gratis 2h antes', color: '#D4AF37' }].map(n => (
                    <div key={n.nivel} style={{ padding: '1.5rem', borderRadius: '12px', border: `1px solid ${n.color}40`, textAlign: 'center', background: `${n.color}10` }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: n.color, marginBottom: '0.5rem' }}>{n.nivel.toUpperCase()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>{n.visitas} visitas</div>
                      <div style={{ fontSize: '0.8rem', color: '#F0EAD6' }}>{n.desc}</div>
                      {user.nivel === n.nivel && <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: n.color }}>✓ TU NIVEL</div>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODALS */}
      {/* Términos */}
      {showTerms && (
        <div className="modal-overlay" onClick={() => {}}>
          <div className="modal">
            <div className="modal-title">Términos y Condiciones</div>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.8', color: '#ccc', maxHeight: '300px', overflowY: 'auto' }}>
              <p style={{ marginBottom: '1rem' }}><strong>1. Saldo no reembolsable:</strong> El saldo de tu billetera digital es exclusivamente válido para servicios y productos de Exclusive Session Tattoo & Barbershop. No es reembolsable en efectivo, total ni parcial.</p>
              <p style={{ marginBottom: '1rem' }}><strong>2. Programa de Referidos:</strong> Tienes 6 meses para calificar 10 amigos. El gasto del amigo ($150+) se valida 30 días después de la cita para evitar reembolsos fraudulentos. Si hay reembolso en ese plazo, el contador del referidor retrocede.</p>
              <p style={{ marginBottom: '1rem' }}><strong>3. Cuotas (Layaway):</strong> El saldo abonado a cuotas se "congela" y no puede usarse para otros servicios hasta que la cuota esté 100% completa.</p>
              <p style={{ marginBottom: '1rem' }}><strong>4. Gift Cards:</strong> Si compras una Gift Card con saldo de tu billetera, el destinatario recibe un 10% extra. Gift Cards no canjeables por efectivo.</p>
              <p><strong>5. Niveles de membresía:</strong> Se calculan por visitas acumuladas. Pueden cambiar sin previo aviso.</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => { acceptTerms(); setShowTerms(false) }}>Aceptar y continuar</button>
            </div>
          </div>
        </div>
      )}

      {/* Cargar saldo */}
      {showCargar && (
        <div className="modal-overlay" onClick={() => setShowCargar(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">💰 Cargar Saldo</div>
            <form onSubmit={cargarSaldo}>
              <div className="form-group">
                <label>Monto a cargar (USD)</label>
                <input className="input" type="number" step="0.01" min="1" placeholder="Ej: 100.00"
                  value={montoCargar} onChange={e => setMontoCargar(e.target.value)} required />
              </div>
              <div className="alert alert-info">Integración Stripe próximamente. Demo: el saldo se acreditará directamente.</div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowCargar(false)}>Cancelar</button>
                <button type="submit" className="btn btn-gold">Cargar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Regalar saldo */}
      {showRegalar && (
        <div className="modal-overlay" onClick={() => setShowRegalar(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🎁 Regalar Saldo</div>
            <form onSubmit={regalarSaldo}>
              <div className="form-group">
                <label>Email o Teléfono del destinatario</label>
                <input className="input" type="text" placeholder="cliente@email.com o +1 646 000 0000"
                  value={destinatario} onChange={e => setDestinatario(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Monto a transferir (USD)</label>
                <input className="input" type="number" step="0.01" min="1" placeholder="Ej: 50.00"
                  value={montoRegalo} onChange={e => setMontoRegalo(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowRegalar(false)}>Cancelar</button>
                <button type="submit" className="btn btn-gold">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nueva cuota */}
      {showCuota && (
        <div className="modal-overlay" onClick={() => setShowCuota(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🎨 Nueva Cuota — Layaway</div>
            <form onSubmit={async e => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const res = await fetch('/api/installments', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombreTatuaje: formData.get('nombre'), montoObjetivo: parseFloat(formData.get('monto') as string), semanas: parseInt(formData.get('semanas') as string) })
              })
              const d = await res.json()
              if (d.ok) { await loadInstallments(); setShowCuota(false); setMsg({ type: 'success', text: 'Cuota creada! Abona para empezar.' }) }
              else setMsg({ type: 'error', text: d.error })
            }}>
              <div className="form-group">
                <label>Nombre del tatuaje / diseño</label>
                <input className="input" name="nombre" type="text" placeholder="Ej: Dorsal dragón medieval" required />
              </div>
              <div className="form-group">
                <label>Presupuesto total (USD)</label>
                <input className="input" name="monto" type="number" step="1" min="50" placeholder="Ej: 600" required />
              </div>
              <div className="form-group">
                <label>Semanas</label>
                <input className="input" name="semanas" type="number" min="1" max="52" placeholder="Ej: 12" required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowCuota(false)}>Cancelar</button>
                <button type="submit" className="btn btn-gold">Crear Cuota</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
