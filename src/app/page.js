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
        <main className="min-h-screen bg-[#020617] text-white selection:bg-yellow-500/30">
            {/* Simple Navbar */}
            <nav className="border-b border-white/10 bg-[#020617] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <span className="font-bold text-xl tracking-tight flex items-center gap-2">
                        <div className="bg-yellow-500 p-1 rounded-md text-black">
                            <Sparkles size={16} fill="currentColor" />
                        </div>
                        <span className="text-white">Çekiliş<span className="text-yellow-500">Pro</span></span>
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-white/10 px-2 py-1 rounded">
                        <span>v3.1</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    </div>
                </div>
            </nav>

            <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
                <form action={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                        {/* LEFT COLUMN: Participants List (8 cols) */}
                        <div className="lg:col-span-8 order-2 lg:order-1 flex flex-col gap-4">

                            {/* Header for list */}
                            <div className="flex items-center justify-between bg-slate-900 border border-white/10 p-4 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white">Katılımcı Listesi</h3>
                                        <p className="text-xs text-slate-400">Toplam {lineCount} kişi</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={addSampleData}
                                        className="text-xs font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
                                    >
                                        <Shuffle size={14} />
                                        Örnek Ekle
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearList}
                                        className="text-xs font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors border border-red-500/10"
                                    >
                                        <Trash2 size={14} />
                                        Temizle
                                    </button>
                                </div>
                            </div>

                            {/* Textarea Container - SOLID COLOR */}
                            <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-sm h-[600px]">
                                <textarea
                                    name="participants"
                                    value={participantText}
                                    onChange={(e) => setParticipantText(e.target.value)}
                                    placeholder="Her satıra bir isim gelecek şekilde katılımcıları buraya yapıştırın..."
                                    required
                                    className="w-full h-full bg-slate-900 p-6 text-base text-slate-300 placeholder:text-slate-600 focus:outline-none resize-none font-mono leading-relaxed selection:bg-blue-500/30"
                                    spellCheck={false}
                                ></textarea>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Controls (4 cols) */}
                        <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">

                            {/* Settings Card - SOLID COLOR */}
                            <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                                    <div className="bg-yellow-500 p-2 rounded-lg text-slate-900">
                                        <Trophy size={20} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-white">Çekiliş Ayarları</h2>
                                        <p className="text-xs text-slate-400">Detayları belirleyin</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                            Çekiliş Başlığı
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Örn: 10.000 TL Ödüllü Çekiliş"
                                            required
                                            className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-medium placeholder:text-slate-700"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                            Kazanan Sayısı
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="winnerCount"
                                                defaultValue="1"
                                                min="1"
                                                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-mono text-xl font-bold"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/5 px-2 py-1 rounded text-xs text-slate-400 pointer-events-none">
                                                KİŞİ
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Card - SOLID COLOR */}
                            <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl">
                                <div className="bg-[#020617] rounded-lg p-4 border border-white/5 mb-6">
                                    <div className="flex gap-3">
                                        <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Listeyi kontrol ettikten sonra butona basın. Sistem otomatik olarak kazananları belirleyecektir.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || lineCount === 0}
                                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-lg py-5 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-3 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <>
                                            <Sparkles className="animate-spin" size={20} />
                                            <span>HAZIRLANIYOR...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play size={22} fill="currentColor" />
                                            <span>ÇEKİLİŞİ BAŞLAT</span>
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}
