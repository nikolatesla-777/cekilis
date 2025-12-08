'use client'

import { createAndRunDraw } from '@/actions/quick-draw'
import { useState, useEffect, useRef, useMemo, useDeferredValue } from 'react'
import { Trophy, Users, Trash2, Shuffle, AlertCircle, Play, Sparkles, Eye, Pencil, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'

import { useRouter } from 'next/navigation'

export default function Home() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [participantText, setParticipantText] = useState('')
    const [lineCount, setLineCount] = useState(0)
    const [isEditing, setIsEditing] = useState(true)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [previewList, setPreviewList] = useState([])
    const fileInputRef = useRef(null)

    // Defer the heavy text processing to keep UI responsive
    const deferredText = useDeferredValue(participantText)

    // Update count and preview when text changes (deferred)
    useEffect(() => {
        // Run heavy parsing in effect to avoid blocking render
        try {
            const lines = deferredText.split(/\r?\n/).filter(line => line.trim() !== '')
            setLineCount(lines.length)

            // Only store a small subset for preview to save memory/DOM
            setPreviewList(lines.slice(0, 100))

            // Auto-switch to view mode if line count is high (> 20)
            if (lines.length > 20) setIsEditing(false)
        } catch (e) {
            console.error("Error parsing participants:", e)
        }
    }, [deferredText])

    async function handleSubmit(formData) {
        // 1. Open new tab IMMEDIATELY to bypass popup blockers
        const newTab = window.open('', '_blank')

        if (!newTab) {
            alert('Lütfen tarayıcınızın "Pop-up" engelleyicisini kapatın ve tekrar deneyin.')
            return
        }

        // 2. Show beautiful loading state in new tab
        newTab.document.write(`
            <html>
                <head>
                    <title>Çekiliş Hazırlanıyor | ÇekilişPro</title>
                    <meta charset="utf-8">
                </head>
                <body style="background-color: #020617; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, sans-serif; margin: 0; text-align: center;">
                    <div style="width: 60px; height: 60px; border: 4px solid #1e293b; border-top-color: #eab308; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <h1 style="margin-top: 30px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Çekiliş Hazırlanıyor</h1>
                    <p style="margin-top: 10px; color: #94a3b8; font-size: 14px;">Katılımcılar aktarılıyor, lütfen bekleyiniz...</p>
                    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
                </body>
            </html>
        `)

        // 3. Optimization: Manually append participants
        if (!formData.get('participants') && participantText) {
            formData.set('participants', participantText)
        }

        setLoading(true)

        try {
            const res = await createAndRunDraw(formData)

            if (res?.error) {
                newTab.close()
                alert(res.error)
                setLoading(false)
            } else if (res?.success) {
                // 4. Redirect the new tab
                newTab.location.href = `/draw/${res.drawId}`

                // 5. Reset loading state on main page
                setLoading(false)
                // Optional: Show success toast on main page?
            }
        } catch (error) {
            newTab.close()
            console.error(error)
            alert('Beklenmedik bir hata oluştu.')
            setLoading(false)
        }
    }

    const clearList = () => {
        if (confirm('Listeyi temizlemek istediğinize emin misiniz?')) {
            setParticipantText('')
            setIsEditing(true)
        }
    }

    const addSampleData = () => {
        // Generate more data to demonstrate columns
        const baseSamples = ["Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya", "Fatma Çelik", "Ali Veli", "Zeynep Şahin", "Mustafa Öztürk", "Elif Arslan", "Burak Yılmaz", "Ceren Karaca"]
        const samples = Array(5).fill(baseSamples).flat().join('\n')
        setParticipantText(prev => prev ? prev + '\n' + samples : samples)
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setIsProcessing(true)

        // Allow UI to update before freezing
        setTimeout(() => {
            const reader = new FileReader()
            reader.onload = (evt) => {
                try {
                    const bstr = evt.target.result
                    const wb = XLSX.read(bstr, { type: 'binary' })
                    const wsname = wb.SheetNames[0]
                    const ws = wb.Sheets[wsname]
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

                    // Process in chunks if needed, but for <50k rows, just optimizing the map/filter is usually enough
                    const newParticipants = data
                        .flat()
                        .map(item => item ? item.toString().trim() : '')
                        .filter(item => item !== '')

                    if (newParticipants.length > 0) {
                        setParticipantText(prev => {
                            const current = prev ? prev + '\n' : ''
                            return current + newParticipants.join('\n')
                        })
                        setIsEditing(false) // Switch to view to show the result
                        alert(`${newParticipants.length} katılımcı başarıyla eklendi.\nListe aşağıda güncellendi.`)
                    } else {
                        alert('Dosyada uygun veri bulunamadı. Lütfen A sütununda verilerin olduğundan emin olun.')
                    }
                } catch (error) {
                    console.error("Excel okuma hatası:", error)
                    alert('Dosya çok büyük veya formatı bozuk. Lütfen verileri kontrol edip tekrar deneyin.')
                } finally {
                    setIsProcessing(false)
                }
            }
            reader.readAsBinaryString(file)

            // Reset input
            e.target.value = null
        }, 100)
    }

    return (
        <main className="min-h-screen bg-[#020617] text-white selection:bg-yellow-500/30 py-8 px-4 md:px-8">

            <div className="w-full max-w-[95%] mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-yellow-500 text-sm font-medium">
                        <Sparkles size={16} fill="currentColor" />
                        <span>Resmi Çekiliş Aracı</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Çekiliş<span className="text-yellow-500">Pro</span></h1>
                </div>

                <form action={handleSubmit} className="space-y-12">

                    {/* SECTION 1: SETTINGS (Centered & Compact) */}
                    <div className="w-full max-w-3xl mx-auto bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="flex flex-col items-center gap-3 mb-8 pb-6 border-b border-white/5">
                            <div className="bg-yellow-500 p-2.5 rounded-xl text-slate-900 shadow-lg shadow-yellow-500/20">
                                <Trophy size={28} fill="currentColor" />
                            </div>
                            <h2 className="text-2xl font-bold text-white text-center">Çekiliş Ayarları</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3 text-center">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Başlık
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Örn: 10.000 TL Ödül"
                                    required
                                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-500 transition-all font-bold text-lg placeholder:text-slate-700 text-center shadow-inner"
                                />
                            </div>

                            <div className="space-y-3 text-center">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Kazanan Sayısı
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="winnerCount"
                                        defaultValue="1"
                                        min="1"
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-500 transition-all font-black text-2xl text-center shadow-inner"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none font-bold tracking-wider">
                                        KİŞİ
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: PARTICIPANTS (Full Width) */}
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-6 pb-4 border-b border-white/5 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Katılımcı Listesi</h2>
                                    <p className="text-xs text-slate-400 mt-1">ID Listesini yönetin</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#020617]/50 p-1.5 rounded-lg border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${isEditing ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Pencil size={14} />
                                    Düzenle
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${!isEditing ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Eye size={14} />
                                    Önizle (Kolonlu)
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-sm font-mono bg-white/5 border border-white/5 px-4 py-2 rounded-lg text-slate-300 min-w-[100px] text-center">
                                    <span className="font-bold text-white">{lineCount}</span> Kişi
                                </div>

                                {/* Excel Upload Input */}
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                />

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isProcessing}
                                        className="p-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors border border-green-500/10 disabled:opacity-50 disabled:cursor-wait"
                                        title="Excel Yükle"
                                    >
                                        {isProcessing ? <Sparkles className="animate-spin" size={18} /> : <FileSpreadsheet size={18} />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addSampleData}
                                        className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/5"
                                        title="Örnek Veri Ekle"
                                    >
                                        <Shuffle size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearList}
                                        className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/10"
                                        title="Listeyi Temizle"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="w-full h-[600px] bg-[#020617] border border-white/10 rounded-xl overflow-hidden relative group">

                            {/* EDIT MODE: Textarea (Unmounted when not editing for performance) */}
                            {isEditing && (
                                <textarea
                                    name="participants"
                                    value={participantText}
                                    onChange={(e) => setParticipantText(e.target.value)}
                                    placeholder="Her satıra bir ID/İsim gelecek şekilde yapıştırın veya Excel yükleyin..."
                                    className="w-full h-full bg-transparent p-6 text-base text-slate-300 placeholder:text-slate-700 focus:outline-none resize-none font-mono leading-relaxed block"
                                    spellCheck={false}
                                />
                            )}

                            {/* VIEW MODE: Columns (Always in DOM, hidden when editing) */}
                            <div className={`w-full h-full p-6 overflow-y-auto custom-scrollbar ${!isEditing ? 'block' : 'hidden'}`}>
                                {participantText ? (
                                    <div className="h-full">
                                        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-8 space-y-1 pb-8">
                                            {/* Optimization: Render pre-calculated preview list */}
                                            {previewList.map((line, i) => (
                                                <div key={i} className="break-inside-avoid text-xs font-mono text-slate-400 hover:text-white py-0.5 border-b border-white/5 truncate px-2 rounded hover:bg-white/5 transition-colors">
                                                    <span className="text-slate-600 mr-2 select-none">{i + 1}.</span>
                                                    {line}
                                                </div>
                                            ))}

                                            {(lineCount - previewList.length) > 0 && (
                                                <div className="break-inside-avoid p-4 text-center bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 font-bold text-xs mt-4">
                                                    ... ve {(lineCount - previewList.length).toLocaleString()} kişi daha
                                                    <br />
                                                    <span className="text-[10px] font-normal opacity-70">(Listenin kalanı hafızada güvende)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
                                        <FileText size={48} className="opacity-20" />
                                        <p>Henüz katılımcı eklenmedi.</p>
                                    </div>
                                )}
                            </div>

                            {/* Mode Indicator Toast */}
                            <div className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-[#020617] border border-white/10 px-3 py-1.5 rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                                {isEditing ? 'Düzenleme Modu' : 'İzleme Modu'}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2.5: ADVANCED SETTINGS */}
                    <div className="w-full max-w-3xl mx-auto">
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-xs font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors mb-4"
                            >
                                {showAdvanced ? 'Gelişmiş Ayarları Gizle' : 'Gelişmiş Ayarlar'}
                            </button>
                        </div>

                        <div className={`bg-slate-900/50 border border-dashed border-slate-700/50 rounded-xl p-6 mb-8 transition-all ${showAdvanced ? 'block animate-in fade-in slide-in-from-top-4' : 'hidden'}`}>
                            <div className="space-y-2 text-center">
                                <label className="text-xs font-bold text-yellow-500/80 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <AlertCircle size={14} />
                                    Manuel Kazanan Belirle (Opsiyonel)
                                </label>
                                <p className="text-[10px] text-slate-500 max-w-md mx-auto">
                                    Eğer buraya bir ID yazarsanız, çekiliş sonucu otomatik olarak bu kişi çıkacaktır.
                                    Yazdığınız ID listede *birebir* aynı şekilde bulunmalıdır.
                                </p>
                                <input
                                    type="text"
                                    name="manualWinner"
                                    placeholder="Örn: 10542 veya Ahmet Yılmaz"
                                    className="w-full max-w-md mx-auto bg-[#020617] border border-yellow-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-all font-mono text-center text-sm placeholder:text-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: ACTION */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading || (!participantText && !fileInputRef.current?.value)}
                            className="group relative w-full max-w-xl mx-auto h-16 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-xl uppercase tracking-wider rounded-2xl shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_-10px_rgba(234,179,8,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-y-12"></div>
                            <span className="relative flex items-center justify-center gap-3">
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>İşleniyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play size={24} fill="currentColor" />
                                        <span>Çekilişi Başlat</span>
                                    </>
                                )}
                            </span>
                        </button>
                        {participantText && (
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                                {lineCount.toLocaleString()} katılımcı ile çekiliş başlatılacak.
                            </p>
                        )}
                    </div>

                    {/* Full Screen Loading Overlay */}
                    {loading && (
                        <div className="fixed inset-0 z-50 bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex flex-col items-center gap-6 max-w-sm text-center p-6 animate-in fade-in zoom-in duration-300">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
                                    <Loader2 className="w-16 h-16 text-yellow-500 animate-spin relative z-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Son Ayarlar Yapılıyor</h3>
                                    <p className="text-slate-400 text-sm animate-pulse">
                                        Çekiliş hazırlanıyor, lütfen bekleyiniz...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </main>
    )
}
