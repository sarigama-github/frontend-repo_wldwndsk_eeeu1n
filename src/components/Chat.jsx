import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'

export default function Chat({ user, project, onBack }) {
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const bottomRef = useRef(null)

  const loadChats = async () => {
    const res = await fetch(`${baseUrl}/chats?project_id=${project._id}&user_id=${user.id}`)
    const data = await res.json()
    setChats(data.chats || [])
    if (!activeChat && (data.chats || []).length) {
      setActiveChat(data.chats[0])
    }
  }

  const ensureChat = async () => {
    await loadChats()
    if (!activeChat) {
      const res = await fetch(`${baseUrl}/chats?user_id=${user.id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ project_id: project._id, title: 'New Chat' }) })
      const data = await res.json()
      await loadChats()
      setActiveChat({ _id: data.chat_id, title: 'New Chat', project_id: project._id })
    }
  }

  const loadMessages = async (chatId) => {
    const res = await fetch(`${baseUrl}/messages?chat_id=${chatId}&user_id=${user.id}`)
    const data = await res.json()
    setMessages(data.messages || [])
  }

  useEffect(()=>{ ensureChat() }, [])
  useEffect(()=>{ if(activeChat){ loadMessages(activeChat._id) } }, [activeChat])
  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if(!input.trim() || !activeChat) return
    const prompt = input
    setInput('')
    setLoading(true)
    // optimistic update
    setMessages(prev => [...prev, { role:'user', content: prompt }])
    const res = await fetch(`${baseUrl}/assistant/complete?user_id=${user.id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: activeChat._id, prompt }) })
    const data = await res.json()
    setLoading(false)
    setMessages(prev => [...prev, { role:'assistant', content: data.reply }])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><ArrowLeft/></button>
          <h2 className="text-xl font-semibold">{project.name}</h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 hidden md:block">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm text-slate-300 mb-2">Chats</div>
              <div className="space-y-2">
                {chats.map(c => (
                  <button key={c._id} onClick={()=>setActiveChat(c)} className={`w-full text-left px-3 py-2 rounded-lg ${activeChat && activeChat._id===c._id ? 'bg-indigo-600' : 'bg-white/5 hover:bg-white/10'}`}>{c.title}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-9">
            <div className="h-[70vh] overflow-y-auto p-4 rounded-xl bg-white/5 border border-white/10">
              {messages.map((m, i) => (
                <div key={i} className={`mb-3 flex ${m.role==='user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${m.role==='user' ? 'bg-indigo-600' : 'bg-white/10'}`}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div className="text-slate-300">Thinking...</div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="mt-3 flex gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && send()} placeholder="Ask the agent to write code..." className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10" />
              <button onClick={send} className="px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 inline-flex items-center gap-2"><Send className="w-4 h-4"/> Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
