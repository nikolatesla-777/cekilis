import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {/* Simple Navbar for Admin */}
            <nav className="border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <span className="font-bold text-xl tracking-tight flex items-center gap-2">
                        <Sparkles size={18} className="text-yellow-500" />
                        Çekiliş<span className="text-yellow-500">Pro</span>
                    </span>
                    <div className="text-xs text-slate-500 font-mono">v3.0</div>
                </div>
            </nav>

            <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
                {children}
            </div>
        </div>
    )
}
