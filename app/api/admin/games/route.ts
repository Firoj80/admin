import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch game categories from Supabase (no hardcoded fallback)
export async function GET() {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('game_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase game_categories fetch error:', error.message);
      return NextResponse.json({ success: false, error: error.message, data: [] }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: categories || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
  }
}

// POST: Toggle Active / Edit / Add Category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, categoryId, isActive, categoryData } = body;

    if (action === 'TOGGLE_ACTIVE') {
      const { data, error } = await supabaseAdmin
        .from('game_categories')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', categoryId)
        .select()
        .single();

      if (error) {
        console.error('Toggle active error:', error.message);
        throw error;
      }

      return NextResponse.json({ 
        success: true, 
        message: `Category ${categoryId} is now ${isActive ? 'ENABLED' : 'DISABLED'}`,
        data 
      });
    } else if (action === 'CREATE') {
      const { data, error } = await supabaseAdmin
        .from('game_categories')
        .insert([{
          id: categoryData.id,
          name: categoryData.name,
          icon: categoryData.icon || '🎮',
          description: categoryData.description || '',
          is_active: categoryData.isActive ?? true,
          display_order: categoryData.displayOrder || 1,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, message: 'Game category created successfully', data });
    } else if (action === 'UPDATE') {
      const { data, error } = await supabaseAdmin
        .from('game_categories')
        .update({
          name: categoryData.name,
          icon: categoryData.icon || '🎮',
          description: categoryData.description || '',
          is_active: categoryData.isActive ?? true,
          display_order: categoryData.displayOrder || 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', categoryData.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, message: 'Game category updated successfully', data });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Games API POST error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
