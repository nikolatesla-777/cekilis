'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAndRunDraw(formData) {
    const title = formData.get('title')
    const winnerCount = parseInt(formData.get('winnerCount') || '1')
    const participantText = formData.get('participants') // Newline separated

    if (!title || !participantText) {
        return { error: 'Başlık ve Katılımcı listesi zorunludur.' }
    }

    try {
        // 1. Create Draw
        const { data: draw, error: drawError } = await supabase
            .from('draws')
            .insert([{
                title,
                draw_date: new Date().toISOString()
            }])
            .select()
            .single()

        if (drawError) throw new Error('Çekiliş oluşturulamadı: ' + drawError.message)

        // 3. Pick a Winner IMMEDIATELY for the Quick Draw
        const winnerIndex = Math.floor(Math.random() * participants.length)
        const winner = participants[winnerIndex]

        // 4. Update Draw with Winner
        // We first need to get the participant ID. Since we just inserted them, 
        // we can query by draw_id and user_id (assuming user_id is unique per draw logic we built)
        // OR better: insert returns data.

        const { data: insertedParticipants, error: fetchError } = await supabase
            .from('participants')
            .select('id')
            .eq('draw_id', draw.id)
            .eq('user_id', winner.user_id) // This might be risky if duplicates exist (though we filtered duplicates in client? No, client just split lines.)
        // Actually, best to fetch ALL inserted for this draw to be safe and pick random one by index from DB results.

        // Let's re-fetch all for this draw to be safe and truly random from DB perspective
        const { data: allParticipants, error: allError } = await supabase
            .from('participants')
            .select('id')
            .eq('draw_id', draw.id)

        if (allError || !allParticipants?.length) throw new Error('Kazanan belirlenemedi (Veritabanı hatası)')

        const selectedWinner = allParticipants[Math.floor(Math.random() * allParticipants.length)]

        const { error: updateError } = await supabase
            .from('draws')
            .update({ winning_participant_id: selectedWinner.id })
            .eq('id', draw.id)

        if (updateError) throw new Error('Kazanan kaydedilemedi.')

        revalidatePath('/')
        // Success!
        return { success: true, drawId: draw.id }

    } catch (error) {
        console.error('Quick Draw Error:', error)
        return { error: error.message }
    }
}
