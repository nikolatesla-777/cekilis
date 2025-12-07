'use server'

import { supabase } from '@/lib/supabase'

export async function getActiveDraw() {
    // Get the most recent draw
    // We want to show even 'completed' draws if they are recent (e.g. today's)
    // so users can see the result.
    const { data, error } = await supabase
        .from('draws')
        .select(`
      *,
      winner:participants!fk_winner(*)
    `)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error('Error fetching draw:', error)
    }

    return data
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
