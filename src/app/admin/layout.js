```javascript
import Link from 'next/link'
import { LayoutDashboard, PlusCircle, LogOut, Settings, Sparkles } from 'lucide-react'

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#020617] flex font-sans text-slate-100 overflow-hidden">
            {/* Sidebar - Static Flex Item */}
            <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-white/5 flex flex-col h-screen sticky top-0">
                <div className="h-16 flex items-center px-6 border-b border-white/5 bg-[#020617]/50">
                    <div className="flex items-center gap-2">
                         <div className="bg-gradient-to-tr from-yellow-600 to-yellow-400 p-1.5 rounded-lg text-slate-900">
                            <Sparkles size={18} fill="currentColor" />
                         </div>
                        <span className="text-lg font-bold tracking-tight text-white">
                            Çekiliş<span className="text-yellow-500">Pro</span>
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Yönetim</p>
                    
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 text-yellow-500 border border-yellow-500/10 hover:bg-yellow-500/10 transition-all font-medium group"
                    >
                        <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
                        <span>Panel</span>
                    </Link>
                    
                    <Link
                        href="/admin/new"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all font-medium group"
                    >
                        <PlusCircle size={18} className="group-hover:text-yellow-500 transition-colors" />
                        <span>Yeni Çekiliş</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5 bg-[#020617]/30">
                    <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
                        <LogOut size={16} />
                        <span>Çıkış Yap</span>
                    </button>
                    <div className="mt-3 text-[10px] text-slate-700 text-center font-mono">
                        v2.4.0 Stable
                    </div>
                </div>
            </aside>

            {/* Main Content - Scrollable Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                 {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md z-10 shrink-0">
                     <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Sistem Aktif
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-xs text-slate-400">Admin Kullanıcısı</p>
                            <p className="text-xs font-bold text-white">Yönetici</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400">
                             <Settings size={16} />
                        </div>
                     </div>
                </header>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
                    <div className="max-w-6xl mx-auto pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
```
