'use client'
// Página principal — Landing / Redirección
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (data.user) {
        if (data.user.rol === 'admin') router.replace('/admin')
        else router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
      setLoading(false)
    })
  }, [router])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: '#D4AF37', letterSpacing: '3px' }}>
        Exclusive Session...
      </div>
    </div>
  )
  return null
}
