import { useEffect, useState } from 'react'
import { Plus, Folder, MessageSquare } from 'lucide-react'

export default function Dashboard({ user, onLogout, onOpenProject }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    const res = await fetch(`${baseUrl}/projects?user_id=${user.id}`)
    const data = await res.json()
    setProjects(data.projects || [])
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  const create = async () => {
    if(!name) return
    const res = await fetch(`${baseUrl}/projects?user_id=${user.id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, description: desc }) })
    const data = await res.json()
    setShowNew(false); setName(''); setDesc('');
    await load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {user.avatar_url ? (<img src={user.avatar_url} className="w-10 h-10 rounded-full" />) : (<div className="w-10 h-10 rounded-full bg-white/10" />)}
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-slate-300">{user.email}</div>
            </div>
          </div>
          <button onClick={onLogout} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">Logout</button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Folder className="w-5 h-5"/> Your Projects</h2>
          <button onClick={()=>setShowNew(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600"><Plus className="w-4 h-4"/>New</button>
        </div>

        {loading ? (
          <div className="text-slate-300">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-slate-300">No projects yet. Create your first project.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <button key={p._id} onClick={()=>onOpenProject(p)} className="text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-slate-300 line-clamp-2">{p.description}</div>
              </button>
            ))}
          </div>
        )}

        {showNew && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Create Project</h3>
              <div className="space-y-3">
                <input className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
                <textarea className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
                <div className="flex justify-end gap-2">
                  <button onClick={()=>setShowNew(false)} className="px-3 py-1.5 rounded-lg bg-white/10">Cancel</button>
                  <button onClick={create} className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600">Create</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
