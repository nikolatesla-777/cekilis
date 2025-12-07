'use client'

import { createAndRunDraw } from '@/actions/quick-draw'
import { useState } from 'react'

export default function AdminPage() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData) {
        setLoading(true)
        // Action handles redirect, but if it returns error we show it
        const res = await createAndRunDraw(formData)
        if (res?.error) {
            alert(res.error)
            setLoading(false)
        }
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-2xl">
            <h1 className="text-xl font-bold text-white mb-6 text-center">Hızlı Çekiliş Aracı</h1>

            <form action={handleSubmit} className="space-y-5">
                {/* Draw Name */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Çekiliş Adı</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Örn: Instagram Çekilişi"
                        required
                        className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                    />
                </div>

                {/* Winner Count */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Talihli Sayısı</label>
                    <input
                        type="number"
                        name="winnerCount"
                        defaultValue="1"
                        min="1"
                        className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                    />
                </div>

                {/* Participants */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                        Katılımcı Listesi
                        <span className="text-xs text-zinc-500 ml-2 font-normal">(Her satıra bir isim)</span>
                    </label>
                    <textarea
                        name="participants"
                        rows="8"
                        placeholder="Ahmet Yılmaz&#10;Ayşe Demir&#10;Mehmet..."
                        required
                        className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                    {loading ? 'İşleniyor...' : 'Çekilişi Yap'}
                </button>
            </form>
        </div>
    )
}
