'use client'

import { useState, useEffect, useRef } from 'react'
import { getRandomParticipants } from '@/actions/public-actions'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { cn } from '@/lib/utils'

export default function LotteryMachine({ draw }) {
    const [status, setStatus] = useState('idle') // idle, spinning, won
    const [currentName, setCurrentName] = useState('???')
    const [pool, setPool] = useState([])

    // Audio refs (optional, can add sound later)

    useEffect(() => {
        // Pre-fetch random names for the animation effect
        getRandomParticipants(draw.id, 50).then(data => {
            setPool(data)
        })
    }, [draw.id])

    const handleStart = async () => {
        if (status !== 'idle') return
        if (!draw.winner) {
            alert("Çekiliş henüz sonuçlanmadı. Lütfen admin panelinden bir kazanan belirleyin.")
            return
        }

        setStatus('spinning')

        // Animation Logic
        let counter = 0
        const totalSpins = 40 // How many names to flash before stopping
        const winnerName = draw.winner.user_id + (draw.winner.name ? ` (${draw.winner.name})` : '')

        // Create a sequence of names ending with the winner
        // If we don't have enough pool, repeat it
        const displaySequence = []
        for (let i = 0; i < totalSpins; i++) {
            const randomItem = pool[i % pool.length] || { user_id: '...' }
            displaySequence.push(randomItem.user_id)
        }

        // Speed curve simulation
        let delay = 50
        const runAnimation = (index) => {
            if (index >= displaySequence.length) {
                // End
                setCurrentName(winnerName)
                setStatus('won')
                triggerConfetti()
                return
            }

            setCurrentName(displaySequence[index])

            // Slow down at the end
            if (index > totalSpins - 10) delay += 30
            if (index > totalSpins - 5) delay += 50

            setTimeout(() => runAnimation(index + 1), delay)
        }

        runAnimation(0)
    }

    const triggerConfetti = () => {
        const duration = 5 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min, max) => Math.random() * (max - min) + min

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
        }, 250)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-4xl mx-auto p-4">
            {/* Machine Display */}
            <div className="relative w-full aspect-video max-h-[400px] bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center mb-12 group">

                {/* Decorative Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-950 to-slate-950" />

                {/* Text Content */}
                <div className="relative z-10 text-center">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentName}
                            initial={status === 'spinning' ? { y: 20, opacity: 0 } : {}}
                            animate={{ y: 0, opacity: 1 }}
                            exit={status === 'spinning' ? { y: -20, opacity: 0 } : {}}
                            transition={{ duration: 0.05 }}
                            className={cn(
                                "font-black tracking-tighter transition-all duration-300",
                                status === 'won'
                                    ? "text-5xl md:text-7xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent scale-110"
                                    : "text-4xl md:text-6xl text-white"
                            )}
                        >
                            {status === 'idle' ? 'Çekilişi Başlat' : currentName}
                        </motion.div>
                    </AnimatePresence>

                    {status === 'won' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-slate-400 font-medium text-lg"
                        >
                            Tebrikler!
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Controls */}
            {status === 'idle' && (
                <button
                    onClick={handleStart}
                    className="group relative px-8 py-4 bg-white text-slate-950 text-xl font-bold rounded-full overflow-hidden transition-transform active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        KAZANANI BELİRLE
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-color-dodge" />
                </button>
            )}

            {status === 'won' && (
                <div className="text-center animate-pulse">
                    <p className="text-slate-500 text-sm">Çekiliş tamamlandı.</p>
                </div>
            )}
        </div>
    )
}
