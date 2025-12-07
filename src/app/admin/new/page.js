import { createDraw } from '@/actions/draw-actions'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewDrawPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                Panele Dön
            </Link>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                <h1 className="text-2xl font-bold text-white mb-6">Yeni Çekiliş Oluştur</h1>

                <form action={createDraw} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-2">
                            Çekiliş Başlığı
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            placeholder="Örn: 10 Kişiye iPhone 15 Çekilişi"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-400 mb-2">
                            Çekiliş Tarihi
                        </label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            required
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all [color-scheme:dark]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        <Save size={20} />
                        Çekilişi Oluştur
                    </button>
                </form>
            </div>
        </div>
    )
}
