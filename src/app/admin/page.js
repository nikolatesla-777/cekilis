import Link from 'next/link'
import { getDraws } from '@/actions/draw-actions'
import { Calendar, Users, Trophy, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const draws = await getDraws()

    return (
        <div>
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Kontrol Paneli</h1>
                    <p className="text-slate-400">Çekilişlerinizi buradan yönetin.</p>
                </div>
                <Link
                    href="/admin/new"
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Trophy size={18} />
                    Yeni Çekiliş Oluştur
                </Link>
            </header>

            {draws.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center bg-slate-900/30">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <Trophy size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">Henüz Çekiliş Yok</h3>
                    <p className="text-slate-500 mb-6">İlk çekilişini oluşturarak başla.</p>
                    <Link
                        href="/admin/new"
                        className="text-purple-400 hover:text-purple-300 font-medium"
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
                            className="group bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 p-6 rounded-xl transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${draw.status === 'completed'
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-purple-500/10 text-purple-500'
                                    }`}>
                                    {draw.status === 'completed' ? '✓' : '#'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                        {draw.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(draw.draw_date).toLocaleDateString('tr-TR')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users size={14} />
                                            {/* Placeholder for participant count, we can add a count query later */}
                                            Katılımcılar
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {draw.status === 'completed' && (
                                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20">
                                        Tamamlandı
                                    </span>
                                )}
                                {draw.status === 'pending' && (
                                    <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/20">
                                        Bekliyor
                                    </span>
                                )}
                                <ChevronRight className="text-slate-600 group-hover:text-purple-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
