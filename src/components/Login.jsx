import { useState } from 'react'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, avatar_url: avatarUrl || undefined })
      })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      const user = { id: data.user_id, name, email, avatar_url: avatarUrl }
      localStorage.setItem('user', JSON.stringify(user))
      onLogin(user)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Vibe Dev Agent</h1>
          <p className="text-slate-300 mt-2">Sign in to create projects and chat with your coding agent</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-200 text-sm mb-1">Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Ada Lovelace" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-slate-200 text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="ada@dev.com" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-slate-200 text-sm mb-1">Avatar URL (optional)</label>
            <input value={avatarUrl} onChange={(e)=>setAvatarUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition">Continue</button>
        </form>
      </div>
    </div>
  )
}
