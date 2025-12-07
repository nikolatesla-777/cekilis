'use server'

import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'
import { revalidatePath } from 'next/cache'

export async function uploadParticipants(drawId, formData) {
    const file = formData.get('file')

    if (!file) throw new Error('Dosya yüklenmedi')

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet)

    // Map rows to database format
    // Assumes Excel has columns like "User ID", "Name", etc.
    // We'll try to find a column that looks like an ID, otherwise use row index?
    // User said "User ID list". Let's assume column "id" or "user_id" exists, or just taking the first column.

    const participants = rows.map((row) => ({
        draw_id: drawId,
        user_id: String(row.user_id || row.id || row.ID || row.UserId || Object.values(row)[0]), // Fallback to first column
        name: row.name || row.Name || row.ad_soyad || row.AdSoyad || '',
        extra_data: row
    }))

    // Batch insert to avoid timeouts
    const CHUNK_SIZE = 1000
    for (let i = 0; i < participants.length; i += CHUNK_SIZE) {
        const chunk = participants.slice(i, i + CHUNK_SIZE)
        const { error } = await supabase.from('participants').insert(chunk)
        if (error) {
            console.error('Insert error:', error)
            throw new Error('Yükleme sırasında hata oluştu: ' + error.message)
        }
    }

    revalidatePath(`/admin/draws/${drawId}`)
    return { success: true, count: participants.length }
}

export async function getParticipants(drawId, query = '') {
    let dbQuery = supabase
        .from('participants')
        .select('*')
        .eq('draw_id', drawId)
        .limit(50)

    if (query) {
        dbQuery = dbQuery.or(`user_id.ilike.%${query}%,name.ilike.%${query}%`)
    }

    const { data, error } = await dbQuery
    if (error) throw new Error(error.message)
    return data
}

export async function setWinner(drawId, participantId) {
    const { error } = await supabase
        .from('draws')
        .update({ winning_participant_id: participantId, status: 'completed' })
        .eq('id', drawId)

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/draws/${drawId}`)
}
