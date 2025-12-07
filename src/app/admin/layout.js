import Link from 'next/link'
import { LayoutDashboard, PlusCircle, LogOut, Settings, Sparkles } from 'lucide-react'

export default function AdminLayout({ children }) {
    return (
        // Root Container: Simple Flex Row
        <div className="flex min-h-screen w-full bg-[#020617] font-sans text-slate-100">

            {/* Sidebar: Fixed Width, Bordered */}
            <aside className="w-72 shrink-0 border-r border-white/5 bg-slate-900 flex flex-col">
                <div className="h-20 flex items-center px-8 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 p-1.5 rounded-lg text-slate-900">
                            <Sparkles size={20} fill="currentColor" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            Çekiliş<span className="text-yellow-500">Pro</span>
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-6 py-8 space-y-2">
                    <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Ana Menü</p>

                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 text-yellow-500 border border-yellow-500/10 hover:bg-yellow-500/10 transition-all font-medium"
                    >
                        <LayoutDashboard size={20} />
                        <span>Panel</span>
                    </Link>

                    <Link
                        href="/admin/new"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-medium"
                    >
                        <PlusCircle size={20} />
                        <span>Yeni Çekiliş</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium bg-[#020617]/50">
                        <LogOut size={18} />
                        <span>Çıkış Yap</span>
                    </button>
                    <p className="mt-4 text-center text-[10px] text-slate-600 font-mono opacity-50">Sürüm 2.5 (Gold)</p>
                </div>
            </aside>

            {/* Main Content: Fills remaining space */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-[#020617] flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-sm font-medium text-slate-400">Sistem Aktif ve Çalışıyor</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                            <Settings size={20} />
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

