'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSession, getUserProfile, signOut } from '@/lib/auth'
import type { User } from '@/lib/supabase'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const session = await getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }
      const profile = await getUserProfile(session.user.id)
      setUser(profile)
    } catch (error) {
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        Yükleniyor...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '250px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '2rem 1rem'
      }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
          Kuzyaka Takip
        </h1>
        
        <nav>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/dashboard" style={{ 
                display: 'block', 
                padding: '0.75rem', 
                borderRadius: '4px',
                color: 'white'
              }}>
                🏠 Ana Sayfa
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/dashboard/worksites" style={{ 
                display: 'block', 
                padding: '0.75rem', 
                borderRadius: '4px',
                color: 'white'
              }}>
                🏗️ Şantiyeler
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/dashboard/schedules" style={{ 
                display: 'block', 
                padding: '0.75rem', 
                borderRadius: '4px',
                color: 'white'
              }}>
                📅 İş Programı
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/dashboard/costs" style={{ 
                display: 'block', 
                padding: '0.75rem', 
                borderRadius: '4px',
                color: 'white'
              }}>
                💰 Maliyetler
              </Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link href="/dashboard/progress" style={{ 
                display: 'block', 
                padding: '0.75rem', 
                borderRadius: '4px',
                color: 'white'
              }}>
                📊 İlerleme
              </Link>
            </li>
          </ul>
        </nav>

        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #444' 
        }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            {user?.full_name || user?.email}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '1rem' }}>
            Rol: {user?.role === 'admin' ? 'Yönetici' : user?.role === 'moderator' ? 'Moderatör' : 'İşveren'}
          </p>
          <button
            onClick={handleSignOut}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f5f5f5' }}>
        {children}
      </main>
    </div>
  )
}
