'use client'

import { createAndRunDraw } from '@/actions/quick-draw'
import { useState, useEffect } from 'react'
import { Trophy, Users, Trash2, Shuffle, AlertCircle, Play, Sparkles } from 'lucide-react'

export default function AdminPage() {
    const [loading, setLoading] = useState(false)
    const [participantText, setParticipantText] = useState('')
    const [lineCount, setLineCount] = useState(0)

    // Update count when text changes
    useEffect(() => {
        const lines = participantText.split(/\r?\n/).filter(line => line.trim() !== '')
        setLineCount(lines.length)
    }, [participantText])

    async function handleSubmit(formData) {
        setLoading(true)
        const res = await createAndRunDraw(formData)
        if (res?.error) {
            alert(res.error)
            setLoading(false)
        }
    }

    const clearList = () => {
        if (confirm('Listeyi temizlemek istediğinize emin misiniz?')) {
            setParticipantText('')
        }
    }

    const addSampleData = () => {
        const samples = "Ahmet Yılmaz\nAyşe Demir\nMehmet Kaya\nFatma Çelik\nAli Veli\nZeynep Şahin\nMustafa Öztürk\nElif Arslan"
        setParticipantText(prev => prev ? prev + '\n' + samples : samples)
    }

    return (
        <div className="animate-in fade-in duration-500">
            <form action={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Participants List (8 cols) */}
                    <div className="lg:col-span-8 order-2 lg:order-1">
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
                            {/* Toolbar */}
                            <div className="bg-slate-900 border-b border-white/5 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-300 font-medium">
                                    <Users size={18} className="text-yellow-500" />
                                    <span>Katılımcı Listesi</span>
                                    <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                                        {lineCount}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={addSampleData}
                                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <Shuffle size={14} />
                                        Örnek Ekle
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearList}
                                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Temizle
                                    </button>
                                </div>
                            </div>

                            {/* Textarea */}
                            <div className="flex-1 relative">
                                <textarea
                                    name="participants"
                                    value={participantText}
                                    onChange={(e) => setParticipantText(e.target.value)}
                                    placeholder="Her satıra bir isim gelecek şekilde katılımcıları buraya yapıştırın..."
                                    required
                                    className="w-full h-full bg-[#020617]/50 p-6 text-slate-300 placeholder:text-slate-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                                    spellCheck={false}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Controls (4 cols) */}
                    <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">

                        {/* Title & Settings Card */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 shadow-2xl">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="bg-yellow-500/10 p-2.5 rounded-xl text-yellow-500">
                                    <Trophy size={24} />
                                </div>
                                <h2 className="text-lg font-bold text-white">Çekiliş Ayarları</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Çekiliş Başlığı
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Örn: iPhone 15 Çekilişi"
                                        required
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-slate-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Kazanan Sayısı
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="winnerCount"
                                            defaultValue="1"
                                            min="1"
                                            className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all font-mono text-lg"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-medium pointer-events-none">
                                            KİŞİ
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Card */}
                        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-6">
                            <div className="flex items-start gap-3 mb-6">
                                <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-200/70 leading-relaxed">
                                    Çekilişi başlattığınızda sistem katılımcıları otomatik olarak karıştıracak ve belirlenen sayıda kazananı seçecektir.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || lineCount === 0}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-lg py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] flex items-center justify-center gap-3 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <>
                                        <Sparkles className="animate-spin" size={24} />
                                        HAZIRLANIYOR...
                                    </>
                                ) : (
                                    <>
                                        <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                                        ÇEKİLİŞİ BAŞLAT
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    )
}
