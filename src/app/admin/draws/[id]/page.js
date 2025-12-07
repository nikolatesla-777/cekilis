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
            <div className="mb-8">
                <Link href="/admin" className="text-slate-400 hover:text-white mb-2 inline-block">&larr; Geri Dön</Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{draw.title}</h1>
                        <p className="text-slate-400 mt-1">
                            {new Date(draw.draw_date).toLocaleDateString('tr-TR')} • {participantCount} Katılımcı
                        </p>
                    </div>
                    {draw.winning_participant_id && (
                        <div className="bg-green-500/10 border border-green-500/20 px-6 py-4 rounded-xl flex items-center gap-4">
                            <div className="bg-green-500/20 p-3 rounded-full text-green-500">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <p className="text-green-500 text-sm font-bold uppercase tracking-wider">Kazanan Belirlendi</p>
                                <p className="text-white font-bold text-lg">
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
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Upload size={20} className="text-purple-400" />
                            Katılımcı Yükle
                        </h2>
                        <p className="text-sm text-slate-400 mb-4">
                            Excel dosyası (.xlsx) yükleyerek katılımcıları ekleyin. Dosyada "user_id" sütunu olması önerilir.
                        </p>
                        {/* Upload Component will go here */}
                        <ParticipantManager drawId={draw.id} mode="upload" />
                    </div>
                </div>

                {/* Right Column: List & Search & Pick Winner */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Users size={20} className="text-purple-400" />
                            Katılımcı Yönetimi
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
