'use client'

import { useState, useRef } from 'react'
import { uploadParticipants, getParticipants, setWinner } from '@/actions/participant-actions'
import { Search, Upload, Trophy, Loader2, CheckCircle, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ParticipantManager({ drawId, mode, initialWinnerId }) {
    const [loading, setLoading] = useState(false)
    const [participants, setParticipants] = useState([])
    const [query, setQuery] = useState('')
    const [uploadStatus, setUploadStatus] = useState(null)

    // Search
    const handleSearch = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = await getParticipants(drawId, query)
            setParticipants(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Set Winner
    const handleSetWinner = async (participantId) => {
        if (!confirm('Bu kişiyi KAZANAN olarak ayarlamak istediğinize emin misiniz?')) return

        setLoading(true)
        try {
            await setWinner(drawId, participantId)
            // Ideally we should update the UI optimistically or reload page
            window.location.reload()
        } catch (err) {
            alert('Hata: ' + err.message)
            setLoading(false)
        }
    }

    // Upload
    const fileInputRef = useRef(null)
    const handleUpload = async (e) => {
        e.preventDefault()
        const file = fileInputRef.current?.files?.[0]
        if (!file) return

        setLoading(true)
        setUploadStatus('Yükleniyor...')

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await uploadParticipants(drawId, formData)
            setUploadStatus(`Tamamlandı! ${res.count} kişi sisteme eklendi.`)
            fileInputRef.current.value = ''
            setTimeout(() => window.location.reload(), 1500)
        } catch (err) {
            setUploadStatus('Hata: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    if (mode === 'upload') {
        return (
            <form onSubmit={handleUpload} className="space-y-5">
                <div className="group relative border-2 border-dashed border-white/10 rounded-xl p-8 hover:bg-slate-800/50 hover:border-yellow-500/30 transition-all bg-slate-950/30 text-center cursor-pointer">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".xlsx, .xls, .csv"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="file-upload"
                        onChange={() => setUploadStatus(null)}
                    />
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-slate-800 group-hover:bg-yellow-500/10 group-hover:text-yellow-500 transition-colors text-slate-500">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">Dosya Seçin veya Sürükleyin</span>
                            <p className="text-xs text-slate-500 mt-1">.xlsx veya .csv formatında (Max 5MB)</p>
                        </div>
                    </div>
                </div>

                {fileInputRef.current?.files?.[0] && (
                    <div className="bg-slate-800/50 px-4 py-3 rounded-lg flex items-center gap-3 text-sm text-slate-300 border border-white/5">
                        <FileSpreadsheet size={16} className="text-green-500" />
                        {fileInputRef.current.files[0].name}
                    </div>
                )}

                {uploadStatus && (
                    <div className={cn("text-sm p-4 rounded-xl font-medium border",
                        uploadStatus.includes('Hata')
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-green-500/10 text-green-400 border-green-500/20"
                    )}>
                        {uploadStatus}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !fileInputRef.current?.files?.[0]}
                    className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} strokeWidth={2.5} />}
                    Yüklemeyi Başlat
                </button>
            </form>
        )
    }

    return (
        <div>
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Katılımcı ID veya İsim ile ara..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 shadow-lg shadow-yellow-500/10"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "ARA"}
                </button>
            </form>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {participants.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-white/5 rounded-xl bg-slate-900/20">
                        <Search size={32} className="mb-3 opacity-20" />
                        <p className="text-sm">Katılımcı bulmak için arama yapın.</p>
                    </div>
                )}

                {participants.map((p) => (
                    <div key={p.id} className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                        initialWinnerId === p.id
                            ? "bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                            : "bg-slate-900/60 border-white/5 hover:border-yellow-500/30 hover:bg-slate-800/80"
                    )}>
                        <div className="flex items-center gap-4">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold",
                                initialWinnerId === p.id ? "bg-green-500 text-slate-900" : "bg-slate-800 text-slate-400"
                            )}>
                                {p.name ? p.name.charAt(0).toUpperCase() : '#'}
                            </div>
                            <div>
                                <p className="text-white font-mono font-medium tracking-wide">{p.user_id}</p>
                                {p.name && <p className="text-xs text-slate-400 font-medium">{p.name}</p>}
                            </div>
                        </div>

                        {initialWinnerId === p.id ? (
                            <span className="flex items-center gap-2 bg-green-500 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-green-500/20">
                                <CheckCircle size={14} strokeWidth={3} />
                                KAZANAN
                            </span>
                        ) : (
                            <button
                                onClick={() => handleSetWinner(p.id)}
                                disabled={loading}
                                className="group/btn flex items-center gap-2 text-slate-500 hover:text-yellow-500 px-3 py-1.5 rounded-lg hover:bg-yellow-500/10 transition-all"
                                title="Kazanan Olarak Seç"
                            >
                                <span className="text-xs font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity uppercase tracking-wider">Seç</span>
                                <Trophy size={18} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
