'use client'
// Página de Login / Registro
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [modo, setModo] = useState<'login' | 'registro'>('login')
  const [form, setForm] = useState({ email: '', password: '', nombre: '', telefono: '', codigoReferido: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) {
        if (d.user.rol === 'admin') router.replace('/admin')
        else router.replace('/dashboard')
      }
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = modo === 'login' ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      const meRes = await fetch('/api/auth/me')
      const meData = await meRes.json()
      if (meData.user?.rol === 'admin') router.replace('/admin')
      else router.replace('/dashboard')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box card">
        <div className="login-logo">EXCLUSIVE SESSION</div>

        <div className="tabs" style={{ marginBottom: '1.5rem' }}>
          <button className={`tab-btn ${modo === 'login' ? 'active' : ''}`} onClick={() => setModo('login')}>Iniciar Sesión</button>
          <button className={`tab-btn ${modo === 'registro' ? 'active' : ''}`} onClick={() => setModo('registro')}>Registrarse</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {modo === 'registro' && (
            <>
              <div className="form-group">
                <label>Nombre completo</label>
                <input className="input" type="text" placeholder="Tu nombre" required
                  value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input className="input" type="tel" placeholder="+1 (646) 000-0000" required
                  value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Código de referido (opcional)</label>
                <input className="input" type="text" placeholder="ABC123"
                  value={form.codigoReferido} onChange={e => setForm({ ...form, codigoReferido: e.target.value })} />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" placeholder="tu@email.com" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input className="input" type="password" placeholder="••••••••" required
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Cargando...' : modo === 'login' ? 'Entrar' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
