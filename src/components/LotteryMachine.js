'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { getRandomParticipants } from '@/actions/public-actions'
import { Trophy } from 'lucide-react'
import clsx from 'clsx'

export default function LotteryMachine({ drawId, initialParticipants, winningParticipantId }) {
    const [currentName, setCurrentName] = useState('???')
    const [isSpinning, setIsSpinning] = useState(false)
    const [winner, setWinner] = useState(null)
    const [participants, setParticipants] = useState(initialParticipants)
    const [showModal, setShowModal] = useState(false)
    const animationRef = useRef(null)
    const participantsRef = useRef(initialParticipants)

    // Keep ref in sync
    useEffect(() => {
        participantsRef.current = participants
    }, [participants])

    // Ensure we don't show winner initially
    useEffect(() => {
        // Reset or prepare if needed
    }, [])

    const startDraw = async () => {
        if (isSpinning || winner) return

        setShowModal(true)
        setIsSpinning(true)

        // Ensure we have enough participants for visual variance
        if (participantsRef.current.length < 10) {
            try {
                const randoms = await getRandomParticipants(drawId, 50)
                if (randoms && randoms.length > 0) {
                    setParticipants(randoms) // This triggers the Effect to update ref
                    // But for the IMMEDIATE spin, we need to update ref manually or wait?
                    // Safe hack: Update ref immediately for this cycle
                    participantsRef.current = randoms
                }
            } catch (e) { console.error(e) }
        }

        // Animation Variables
        let counter = 0
        const totalSpins = 300
        let speed = 50

        const spin = () => {
            // Access via Ref to avoid closure staleness
            const pool = participantsRef.current
            if (!pool || pool.length === 0) return

            // Pick random name
            const randomName = pool[Math.floor(Math.random() * pool.length)]?.name || '...'
            setCurrentName(randomName)
            counter++

            if (counter < totalSpins) {
                if (counter > totalSpins - 20) speed *= 1.1
                animationRef.current = setTimeout(spin, speed)
            } else {
                finishDraw()
            }
        }

        spin()
    }

    const finishDraw = async () => {
        // Reveal Visuals
        let finalWinnerData = null
        const pool = participantsRef.current

        if (winningParticipantId) {
            finalWinnerData = pool.find(p => p.id === winningParticipantId)
            if (!finalWinnerData) {
                // If missing from random subset, try to find in initial list passed as prop
                finalWinnerData = initialParticipants.find(p => p.id === winningParticipantId)
            }
            if (!finalWinnerData) {
                // Fallback
                finalWinnerData = { name: 'KAZANAN', user_id: 'ID:' + winningParticipantId }
            }
        } else {
            finalWinnerData = pool[Math.floor(Math.random() * pool.length)]
        }

        setWinner(finalWinnerData)
        setIsSpinning(false)
        triggerConfetti()
    }

    const triggerConfetti = () => {
        const duration = 5 * 1000
        const end = Date.now() + duration
        const colors = ['#D4AF37', '#F5F5F5', '#FFD700']

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors,
                    zIndex: 9999 // Ensure on top of modal
                })
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors,
                    zIndex: 9999
                })

                if (Date.now() < end) {
                    requestAnimationFrame(frame)
                }
            }())
    }

    return (
        <div className="flex flex-col items-center justify-center py-8 text-center min-h-[300px]">

            {/* Main Display - Before & After */}
            <div className="relative mb-12 w-full max-w-2xl mx-auto">
                <div className={clsx(
                    "text-4xl md:text-6xl font-sans font-bold tracking-tight py-12 px-8 rounded-2xl border transition-all duration-500",
                    winner ? "bg-slate-900/80 shadow-2xl border-yellow-500/50 text-yellow-500" : "bg-slate-900/50 border-white/5 text-slate-500"
                )}>
                    {winner ? winner.name : "Çekilişe Hazır"}
                </div>

                {winner && (
                    <div className="absolute -top-10 -right-4 md:-right-10 text-yellow-500 z-20 animate-bounce">
                        <Trophy size={64} className="drop-shadow-xl" strokeWidth={1.5} />
                    </div>
                )}
            </div>

            {/* Start Button (Visible only if no winner picked yet) */}
            {!winner && (
                <button
                    onClick={startDraw}
                    className="group relative px-12 py-6 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-xl rounded-full transition-all shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.5)] active:scale-95"
                >
                    ÇEKİLİŞİ BAŞLAT
                </button>
            )}

            {/* Winner Info underneath */}
            {winner && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-6 border border-yellow-500/20 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-xl w-full max-w-md"
                >
                    <div className="flex flex-col gap-2">
                        <p className="text-yellow-500/60 text-xs font-semibold uppercase tracking-widest">Kazanan Kimliği</p>
                        <p className="text-white font-mono text-xl md:text-2xl tracking-wider">{winner.user_id}</p>
                    </div>
                </motion.div>
            )}

            {/* ANIMATION MODAL */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                    >
                        <div className="w-full max-w-4xl text-center space-y-12 relative">

                            {/* Close button for modal after win */}
                            {!isSpinning && winner && (
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute -top-12 right-0 text-slate-400 hover:text-white uppercase text-xs tracking-widest"
                                >
                                    Kapat ve Özet Gör &times;
                                </button>
                            )}

                            <h2 className="text-yellow-500 font-bold tracking-[0.2em] text-sm animate-pulse">
                                {isSpinning ? 'TALİHLİ SEÇİLİYOR...' : 'TEBRİKLER!'}
                            </h2>

                            <motion.div
                                // key prop removed to prevent unmount/remount on every text change
                                className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight"
                            >
                                {winner ? winner.name : currentName}
                            </motion.div>

                            {winner && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-2xl md:text-3xl font-mono text-slate-400"
                                >
                                    #{winner.user_id}
                                </motion.div>
                            )}

                            {isSpinning && (
                                <div className="w-full max-w-md mx-auto h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-yellow-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 15, ease: "linear" }} // Match totalSpins duration roughly
                                    />
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
