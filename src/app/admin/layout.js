import Link from 'next/link'
import { LayoutDashboard, PlusCircle, LogOut, Settings } from 'lucide-react'

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#020617] flex font-sans text-slate-100">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="h-20 flex items-center gap-3 px-8 border-b border-white/5">
                    <div className="h-8 w-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-yellow-500/20">
                        C
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">
                        Çekiliş<span className="text-yellow-500">Panel</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Menü</p>

                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-yellow-400 border border-yellow-500/20 hover:bg-white/10 transition-all font-medium"
                    >
                        <LayoutDashboard size={20} />
                        <span>Genel Bakış</span>
                    </Link>

                    <Link
                        href="/admin/new"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-medium"
                    >
                        <PlusCircle size={20} />
                        <span>Yeni Çekiliş</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <LogOut size={20} />
                        <span>Çıkış Yap</span>
                    </button>
                    <div className="mt-4 px-4 text-xs text-slate-600 text-center">
                        v1.0.0 Premium
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pl-72">
                <div className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-end px-8">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <Settings size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-300">Admin</span>
                    </div>
                </div>
                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
