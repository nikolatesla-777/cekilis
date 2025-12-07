'use client'

import { useState, useRef } from 'react'
import { uploadParticipants, getParticipants, setWinner } from '@/actions/participant-actions'
import { Search, Upload, Trophy, Loader2 } from 'lucide-react'
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
            // Optional: Refresh or show success
        } catch (err) {
            alert('Hata: ' + err.message)
        } finally {
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
            setUploadStatus(`Tamamlandı! ${res.count} kişi eklendi.`)
            fileInputRef.current.value = ''
        } catch (err) {
            setUploadStatus('Hata: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    if (mode === 'upload') {
        return (
            <form onSubmit={handleUpload} className="space-y-4">
                <div className="border border-dashed border-slate-700 rounded-lg p-6 hover:bg-slate-800/50 transition-colors bg-slate-950 text-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                        id="file-upload"
                        onChange={() => setUploadStatus(null)}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                        <Upload className="mx-auto text-slate-500 mb-2" />
                        <span className="text-slate-300 font-medium">Dosya Seçin</span>
                        <p className="text-xs text-slate-500 mt-1">.xlsx veya .csv</p>
                    </label>
                    {fileInputRef.current?.files?.[0] && (
                        <p className="text-xs text-purple-400 mt-2">{fileInputRef.current.files[0].name}</p>
                    )}
                </div>

                {uploadStatus && (
                    <div className={cn("text-sm p-3 rounded-lg", uploadStatus.includes('Hata') ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400")}>
                        {uploadStatus}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                    Yüklemeyi Başlat
                </button>
            </form>
        )
    }

    return (
        <div>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="ID veya İsim ile ara..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    Ara
                </button>
            </form>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {participants.length === 0 && !loading && (
                    <p className="text-center text-slate-500 py-8 text-sm">Katılımcı aramak için yukarıdaki formu kullanın.</p>
                )}

                {participants.map((p) => (
                    <div key={p.id} className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        initialWinnerId === p.id
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                    )}>
                        <div>
                            <p className="text-white font-mono font-medium">{p.user_id}</p>
                            {p.name && <p className="text-sm text-slate-400">{p.name}</p>}
                        </div>

                        {initialWinnerId === p.id ? (
                            <span className="flex items-center gap-1 text-green-500 text-sm font-medium">
                                <CheckCircle size={16} />
                                Kazanan
                            </span>
                        ) : (
                            <button
                                onClick={() => handleSetWinner(p.id)}
                                disabled={loading}
                                className="text-slate-500 hover:text-green-400 p-2 rounded-full hover:bg-green-500/10 transition-colors"
                                title="Kazanan Olarak Seç"
                            >
                                <Trophy size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
