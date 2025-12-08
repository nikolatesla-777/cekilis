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

        // 2. Parse and Insert Participants
        const lines = participantText.split(/\r?\n/).filter(line => line.trim() !== '')
        const participants = lines.map(line => ({
            draw_id: draw.id,
            user_id: line.trim(), // simple string/ID
            name: line.trim()
        }))

        if (participants.length === 0) throw new Error('En az 1 katılımcı girilmelidir.')

        const { data: insertedParticipants, error: partError } = await supabase
            .from('participants')
            .insert(participants)
            .select()

        if (partError) throw new Error('Katılımcılar eklenemedi: ' + partError.message)

        // Ensure participants were actually inserted before proceeding
        if (!insertedParticipants || insertedParticipants.length === 0) {
            throw new Error('Katılımcılar veritabanına yazılamadı.')
        }

        // 3. Pick a Winner
        const manualWinnerId = formData.get('manualWinner')?.toString().trim()
        let selectedWinner

        // If Manual Winner Specified
        if (manualWinnerId) {
            const targetId = String(manualWinnerId).trim();

            // Find match with robust string comparison
            selectedWinner = insertedParticipants.find(p =>
                String(p.user_id).trim() === targetId ||
                String(p.name).trim() === targetId
            )

            if (!selectedWinner) {
                throw new Error(`Belirtilen kazanan (${manualWinnerId}) listede bulunamadı. Lütfen boşluksuz ve birebir aynı şekilde yazdığınızdan emin olun.`)
            }
        } else {
            // Random Winner
            const winnerIndex = Math.floor(Math.random() * insertedParticipants.length)
            selectedWinner = insertedParticipants[winnerIndex]
        }

        // 4. Update Draw with Winner
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
