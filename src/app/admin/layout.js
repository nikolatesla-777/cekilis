import Link from 'next/link'
import { LayoutDashboard, PlusCircle, LogOut } from 'lucide-react'

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 flex font-sans text-slate-100">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col">
                <div className="mb-10 flex items-center gap-2">
                    <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">C</div>
                    <span className="text-xl font-bold tracking-tight">Çekiliş<span className="text-purple-400">Panel</span></span>
                </div>

                <nav className="flex-1 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 text-white hover:bg-slate-800 transition-colors"
                    >
                        <LayoutDashboard size={20} className="text-purple-400" />
                        <span>Panel</span>
                    </Link>
                    <Link
                        href="/admin/new"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                    >
                        <PlusCircle size={20} />
                        <span>Yeni Çekiliş</span>
                    </Link>
                </nav>

                <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors mt-auto">
                    <LogOut size={20} />
                    <span>Çıkış Yap</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
