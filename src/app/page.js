'use client'

import { createAndRunDraw } from '@/actions/quick-draw'
import { useState, useEffect } from 'react'
import { Trophy, Users, Trash2, Shuffle, AlertCircle, Play, Sparkles } from 'lucide-react'

export default function Home() {
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
        <main className="min-h-screen bg-[#020617] text-white selection:bg-yellow-500/30 py-12 px-4">

            <div className="w-full max-w-2xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-yellow-500 text-sm font-medium">
                        <Sparkles size={16} fill="currentColor" />
                        <span>Resmi Çekiliş Aracı</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Çekiliş<span className="text-yellow-500">Pro</span></h1>
                    <p className="text-slate-400 text-lg">Hızlı, Şeffaf ve Güvenilir Çekiliş Yapın</p>
                </div>

                <form action={handleSubmit} className="space-y-8">

                    {/* SECTION 1: SETTINGS */}
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                        <div className="flex flex-col items-center gap-3 mb-6 pb-4 border-b border-white/5">
                            <div className="bg-yellow-500 p-2 rounded-lg text-slate-900">
                                <Trophy size={24} fill="currentColor" />
                            </div>
                            <h2 className="text-xl font-bold text-white text-center">1. Çekiliş Ayarları</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2 text-center">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Başlık
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Örn: 10.000 TL Ödül"
                                    required
                                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-500 transition-all font-medium placeholder:text-slate-700 text-center"
                                />
                            </div>

                            <div className="space-y-2 text-center">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Kazanan Sayısı
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="winnerCount"
                                        defaultValue="1"
                                        min="1"
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-500 transition-all font-bold text-xl text-center"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none font-bold">
                                        KİŞİ
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: PARTICIPANTS */}
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                        <div className="flex flex-col items-center justify-between mb-6 pb-4 border-b border-white/5 gap-4">
                            <div className="flex flex-col items-center gap-3">
                                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                                    <Users size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-white text-center">2. Katılımcılar</h2>
                            </div>
                            <div className="text-sm font-mono bg-white/5 px-3 py-1 rounded-lg text-slate-400">
                                {lineCount} Kişi
                            </div>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                name="participants"
                                value={participantText}
                                onChange={(e) => setParticipantText(e.target.value)}
                                placeholder="İsimleri buraya yapıştırın (Her satıra bir isim)..."
                                required
                                className="w-full h-64 bg-[#020617] border border-white/10 rounded-xl p-5 text-base text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all resize-y font-mono leading-relaxed text-center"
                                spellCheck={false}
                            ></textarea>

                            <div className="flex gap-3 justify-center">
                                <button
                                    type="button"
                                    onClick={addSampleData}
                                    className="text-xs font-bold flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                >
                                    <Shuffle size={14} />
                                    Örnek Liste
                                </button>
                                <button
                                    type="button"
                                    onClick={clearList}
                                    className="text-xs font-bold flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Temizle
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: ACTION */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || lineCount === 0}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-extrabold text-xl py-6 rounded-2xl transition-all shadow-xl hover:shadow-yellow-500/20 flex items-center justify-center gap-4 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Sparkles className="animate-spin" size={24} />
                                    <span>ÇEKİLİŞ HAZIRLANIYOR...</span>
                                </>
                            ) : (
                                <>
                                    <Play size={28} fill="currentColor" />
                                    <span>ÇEKİLİŞİ BAŞLAT</span>
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-slate-600 mt-4">
                            Butona bastığınızda sonuçlar şeffaf bir şekilde belirlenecektir.
                        </p>
                    </div>

                </form>
            </div>
        </main>
    )
}
