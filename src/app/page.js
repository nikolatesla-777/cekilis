import { getActiveDraw } from '@/actions/public-actions'
import LotteryMachine from '@/components/LotteryMachine'

export const dynamic = 'force-dynamic'

export default async function Home() {
    const { draw, participants } = await getActiveDraw()

    return (
        <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>

            {/* Main Content Container */}
            <div className="w-full max-w-4xl px-4 relative z-10">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-400/90 text-xs font-medium tracking-widest uppercase">
                        Resmi Çekiliş Ekranı
                    </div>

                    {draw ? (
                        <>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 tracking-tight">
                                {draw.title}
                            </h1>
                            <p className="text-slate-400 text-lg uppercase tracking-widest font-light">
                                {new Date(draw.draw_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </>
                    ) : (
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                            Aktif Çekiliş Bulunamadı
                        </h1>
                    )}
                </div>

                {/* Lottery Machine Section */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 rounded-2xl blur-lg transition-all duration-1000"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl ring-1 ring-white/5">
                        {draw ? (
                            <LotteryMachine
                                drawId={draw.id}
                                initialParticipants={participants}
                                winningParticipantId={draw.winning_participant_id}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-400 text-lg">Şu anda planlanmış bir çekiliş bulunmamaktadır.</p>
                                <p className="text-slate-500 text-sm mt-3">Lütfen daha sonra tekrar kontrol ediniz.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center">
                    <p className="text-slate-600 text-xs tracking-widest uppercase">© 2024 Çekiliş Sistemi. Tüm hakları saklıdır.</p>
                </footer>
            </div>
        </main>
    )
}
