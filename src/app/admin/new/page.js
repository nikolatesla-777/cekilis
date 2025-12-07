import { createDraw } from '@/actions/draw-actions'
import { ArrowLeft, Save, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function NewDrawPage() {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-medium"
            >
                <ArrowLeft size={16} />
                Kontrol Paneline Dön
            </Link>

            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Yeni Çekiliş Oluştur</h1>
                        <p className="text-slate-400 text-sm">Katılımcıların heyecanla bekleyeceği yeni bir çekiliş başlatın.</p>
                    </div>
                </div>

                <form action={createDraw} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                            Çekiliş Başlığı
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            placeholder="Örn: 10 Kişiye iPhone 15 Çekilişi"
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                            Çekiliş Tarihi
                        </label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            required
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all [color-scheme:dark]"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center gap-2 transform active:scale-[0.99]"
                        >
                            <Save size={20} strokeWidth={2.5} />
                            ÇEKLİŞİ OLUŞTUR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
