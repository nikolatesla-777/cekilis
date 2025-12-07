'use server'

import { supabase } from '@/lib/supabase'

// Combine draw and participants fetching for the page
export async function getActiveDraw() {
    try {
        const { data: draw, error } = await supabase
            .from('draws')
            .select(`
                *,
                winner:participants!fk_winner(*)
            `)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching draw:', error)
            return { draw: null, participants: [] }
        }

        if (!draw) {
            return { draw: null, participants: [] }
        }

        // Check if we have participants for the animation
        const { data: participants } = await supabase.rpc('get_random_participants', { draw_id_input: draw.id, count_input: 50 })

        // Fallback if RPC fails or empty
        let finalParticipants = participants
        if (!participants || participants.length === 0) {
            const { data: fallback } = await supabase
                .from('participants')
                .select('id, user_id, name')
                .eq('draw_id', draw.id)
                .limit(50)
            finalParticipants = fallback || []
        }

        return { draw, participants: finalParticipants || [] }

    } catch (err) {
        console.error("Unexpected error:", err)
        return { draw: null, participants: [] }
    }
}

// Separate action to get random participants for the "Spin" effect
export async function getRandomParticipants(drawId, count = 50) {
    const { data } = await supabase.rpc('get_random_participants', { draw_id_input: drawId, count_input: count })

    // Fallback if RPC doesn't exist (we haven't created it yet)
    // We'll just fetch first N rows.
    if (!data) {
        const { data: fallbackData } = await supabase
            .from('participants')
            .select('user_id, name')
            .eq('draw_id', drawId)
            .limit(count)
        return fallbackData || []
    }
    return data
}
