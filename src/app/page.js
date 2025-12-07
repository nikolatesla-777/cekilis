import { getActiveDraw } from '@/actions/public-actions'
import LotteryMachine from '@/components/LotteryMachine'

export const dynamic = 'force-dynamic'

export default async function Home() {
    const draw = await getActiveDraw()

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10"></div>

            <div className="z-10 w-full max-w-5xl mx-auto text-center">
                {draw ? (
                    <>
                        <div className="mb-8 space-y-2">
                            <span className="inline-block py-1 px-3 rounded-full bg-slate-800 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
                                Günün Çekilişi
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-2">
                                {draw.title}
                            </h1>
                            <p className="text-slate-400 text-lg">
                                {new Date(draw.draw_date).toLocaleDateString('tr-TR', { dateStyle: 'long' })}
                            </p>
                        </div>

                        <LotteryMachine draw={draw} />
                    </>
                ) : (
                    <div className="text-center py-20">
                        <h1 className="text-3xl font-bold text-white mb-4">Aktif Çekiliş Yok</h1>
                        <p className="text-slate-400">Şu anda aktif veya planlanmış bir çekiliş bulunmuyor.</p>
                    </div>
                )}
            </div>

            <footer className="absolute bottom-4 text-center w-full text-slate-600 text-xs">
                &copy; 2024 Çekiliş Sistemi. Tüm hakları saklıdır.
            </footer>
        </main>
    )
}
