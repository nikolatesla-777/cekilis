
import { supabase } from '@/lib/supabase'
import LotteryMachine from '@/components/LotteryMachine'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Force dynamic because we need fresh data
export const dynamic = 'force-dynamic'

async function getDrawData(id) {
    // 1. Get Draw Details & Winner
    const { data: draw, error } = await supabase
        .from('draws')
        .select(`
            *,
            winner:participants!fk_winner(id, user_id, name)
        `)
        .eq('id', id)
        .single()

    if (error || !draw) return null

    // 2. Get Random Participants for the "Spin" visuals
    // We don't need ALL 15,000. Just enough to look cool spinning.
    const { data: participants } = await supabase.rpc('get_random_participants', {
        p_draw_id: id,
        p_limit: 150
    })

    return { draw, participants: participants || [] }
}

export default async function DrawPage({ params }) {
    const { id } = await params
    const data = await getDrawData(id)
    if (!data) notFound()

    const { draw, participants } = data

    // If the winner is NOT in the random subset, we MUST add them to ensure they can be shown/selected
    // although LotteryMachine handles a missing object gracefully, it's better to provide it.
    let displayParticipants = [...participants]
    if (draw.winner) {
        // Check if winner is already in list
        const exists = displayParticipants.find(p => p.id === draw.winner.id)
        if (!exists) {
            displayParticipants.push(draw.winner)
            // Shuffle a bit so it's not always last (LotteryMachine picks randomly anyway but good for purity)
        }
    } else {
        // If no winner set yet (shouldn't happen with our new quick-draw logic),
        // we might be in a "manual pick" mode? 
        // For now, assuming quick-draw set it.
    }

    // Ensure we have some data even if database empty (dev safety)
    if (displayParticipants.length === 0) {
        displayParticipants = [{ name: 'Katılımcı 1', user_id: '1' }, { name: 'Katılımcı 2', user_id: '2' }]
    }

    return (
        <main className="min-h-screen bg-[#020617] text-white selection:bg-yellow-500/30 flex flex-col items-center justify-center p-4">

            <div className="w-full max-w-4xl mx-auto space-y-8 text-center">

                <div className="space-y-2">
                    <Link href="/" className="inline-block text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest mb-4">
                        &larr; Ana Sayfaya Dön
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        {draw.title}
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        Çekiliş Sonucu
                    </p>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <LotteryMachine
                        drawId={draw.id}
                        initialParticipants={displayParticipants}
                        winningParticipantId={draw.winning_participant_id}
                    />
                </div>

            </div>
        </main>
    )
}
