import { useEffect, useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Chat from './components/Chat'

function App() {
  const [user, setUser] = useState(null)
  const [openProject, setOpenProject] = useState(null)

  useEffect(()=>{
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setOpenProject(null)
  }

  if (!user) return <Login onLogin={setUser} />

  if (openProject) return <Chat user={user} project={openProject} onBack={()=>setOpenProject(null)} />

  return <Dashboard user={user} onLogout={logout} onOpenProject={setOpenProject} />
}

export default App
