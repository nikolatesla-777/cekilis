'use server'

import { supabase } from '@/lib/supabase'

export async function getDraws() {
    const { data, error } = await supabase
        .from('draws')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}

export async function createDraw(formData) {
    const title = formData.get('title')
    const date = formData.get('date')

    const { data, error } = await supabase
        .from('draws')
        .insert([{ title, draw_date: date }])
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin')
    redirect(`/admin/draws/${data.id}`)
}
