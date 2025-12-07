import Link from 'next/link'
import { getDraws } from '@/actions/draw-actions'
import { Calendar, Users, Trophy, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const draws = await getDraws()

    return (
        <div>
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Kontrol Paneli</h1>
                    <p className="text-slate-400 text-sm">Çekilişlerinizi ve katılımcılarınızı buradan yönetin.</p>
                </div>
                <Link
                    href="/admin/new"
                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] flex items-center gap-2"
                >
                    <Trophy size={18} strokeWidth={2.5} />
                    Yeni Çekiliş Oluştur
                </Link>
            </header>

            {draws.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center bg-white/[0.02]">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700 ring-1 ring-white/10 shadow-xl">
                        <Trophy size={40} />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Henüz Çekiliş Yok</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Sistemde kayıtlı bir çekiliş bulunamadı. İlk heyecanı başlatmak için hemen yeni bir tane oluşturun.</p>
                    <Link
                        href="/admin/new"
                        className="text-yellow-500 hover:text-yellow-400 font-bold text-sm tracking-wide uppercase border-b border-yellow-500/30 hover:border-yellow-500 pb-0.5 transition-all"
                    >
                        Çekiliş Oluştur &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {draws.map((draw) => (
                        <Link
                            key={draw.id}
                            href={`/admin/draws/${draw.id}`}
                            className="group bg-slate-900/40 border border-white/5 hover:border-yellow-500/50 hover:bg-slate-900/80 p-6 rounded-2xl transition-all flex items-center justify-between backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold transition-colors ${draw.status === 'completed'
                                    ? 'bg-green-500/10 text-green-500 ring-1 ring-green-500/20'
                                    : 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20'
                                    }`}>
                                    {draw.status === 'completed' ? '✓' : '#'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                                        {draw.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-2 uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {new Date(draw.draw_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Users size={14} />
                                            Katılımcılar
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {draw.status === 'completed' && (
                                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 uppercase tracking-wide">
                                        Tamamlandı
                                    </span>
                                )}
                                {draw.status === 'pending' && (
                                    <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20 uppercase tracking-wide">
                                        Aktif
                                    </span>
                                )}
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-all">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
