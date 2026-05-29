import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../utils/storage'
import { Button, Field, WheatIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon } from '../components/ui'

export default function Login() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('admin')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const ok = usuario === 'admin' && password === (import.meta.env.VITE_ADMIN_PASSWORD || 'tortilleria2024')
    if (ok) { auth.set(true); navigate('/empleados', { replace: true }) }
    else setError('Usuario o contraseña incorrectos')
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 px-6" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div className="flex-1 flex flex-col justify-center gap-8 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-[32%] flex items-center justify-center text-amber-50 shadow-xl shadow-amber-900/40"
            style={{ background: 'linear-gradient(150deg, #C8861F 0%, #7A4A1E 115%)' }}>
            <WheatIcon className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-ink tracking-tight">TortiApp</h1>
            <p className="text-sm text-ink-3 font-medium mt-1">Tortillería y Panadería León</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Field label="Usuario" placeholder="admin" value={usuario}
            onChange={e => { setUsuario(e.target.value); setError('') }}
            autoCapitalize="none" autoComplete="username" />
          <div className="relative">
            <Field label="Contraseña" type={showPw ? 'text' : 'password'} placeholder="••••••••"
              value={password} onChange={e => { setPassword(e.target.value); setError('') }}
              autoComplete="current-password" />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 bottom-3.5 text-ink-3">
              {showPw ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
          <Button type="submit" size="lg" full className="mt-2">Entrar</Button>
        </form>

        <p className="text-center text-xs text-ink-3 leading-relaxed">
          Demo — usuario: <b className="text-ink-2">admin</b>
        </p>
      </div>
    </div>
  )
}
