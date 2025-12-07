import { supabase } from '@/lib/supabase'
import { Upload, Users, Trophy, Search, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import ParticipantManager from '@/components/admin/ParticipantManager'

export const dynamic = 'force-dynamic'

async function getDraw(id) {
    const { data, error } = await supabase
        .from('draws')
        .select(`
      *,
      winner:participants!fk_winner(*)
    `)
        .eq('id', id)
        .single()

    if (error) throw new Error(error.message)
    return data
}

async function getParticipantCount(id) {
    const { count, error } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('draw_id', id)

    return count || 0
}

export default async function DrawDetailPage({ params }) {
    const draw = await getDraw(params.id)
    const participantCount = await getParticipantCount(params.id)

    return (
        <div>
            <div className="mb-10">
                <Link href="/admin" className="text-slate-400 hover:text-white mb-4 inline-flex items-center gap-2 text-sm font-medium transition-colors">
                    &larr; Kontrol Paneline Dön
                </Link>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-white tracking-tight">{draw.title}</h1>
                        <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm">
                            <span className="bg-white/5 px-2 py-1 rounded text-slate-300 font-mono">
                                {new Date(draw.draw_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-yellow-500 font-bold">{participantCount}</span> Katılımcı
                        </p>
                    </div>
                    {draw.winning_participant_id && (
                        <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 px-8 py-4 rounded-2xl flex items-center gap-5 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            <div className="bg-green-500/20 p-3 rounded-xl text-green-400 shadow-inner">
                                <Trophy size={28} strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-green-500 text-xs font-bold uppercase tracking-widest mb-1">Kazanan Belirlendi</p>
                                <p className="text-white font-mono font-bold text-xl">
                                    {draw.winner?.user_id}
                                    {draw.winner?.name && <span className="text-slate-400 font-normal"> ({draw.winner?.name})</span>}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upload */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm sticky top-28">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                                <Upload size={18} />
                            </div>
                            Katılımcı Yükle
                        </h2>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Excel dosyası (.xlsx) yükleyerek katılımcıları toplu olarak ekleyebilirsiniz. Dosyada "user_id" ve opsiyonel "name" sütunu bulunmalıdır.
                        </p>
                        {/* Upload Component will go here */}
                        <ParticipantManager drawId={draw.id} mode="upload" />
                    </div>
                </div>

                {/* Right Column: List & Search & Pick Winner */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 min-h-[500px] backdrop-blur-sm">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <Users size={18} />
                            </div>
                            Katılımcı Listesi ve İşlemler
                        </h2>

                        {/* Search & List Component */}
                        <ParticipantManager
                            drawId={draw.id}
                            mode="list"
                            initialWinnerId={draw.winning_participant_id}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
