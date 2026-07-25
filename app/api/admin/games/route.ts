import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Default fallback categories if DB table is not yet seeded
const defaultCategories = [
  { id: 'ludo_king', name: 'Ludo King', is_active: true, display_order: 1, icon: '🎲', description: 'Classic 1v1 Ludo board matches' },
  { id: 'carrom', name: 'Carrom', is_active: true, display_order: 2, icon: '🎯', description: 'Realtime Carrom board clashes' },
  { id: 'chess', name: 'Chess', is_active: true, display_order: 3, icon: '♟️', description: 'Speed Blitz Chess battles' },
];

// GET: Fetch game categories
export async function GET() {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('game_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase game_categories fetch error:', error.message);
      return NextResponse.json({ success: true, data: defaultCategories });
    }

    return NextResponse.json({ success: true, data: categories.length > 0 ? categories : defaultCategories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
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
        .upsert({
          id: categoryId,
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        message: `Category ${categoryId} is now ${isActive ? 'ENABLED (Visible in App)' : 'DISABLED (Hidden from App)'}`,
        data 
      });
    } else if (action === 'CREATE' || action === 'UPDATE') {
      const { data, error } = await supabaseAdmin
        .from('game_categories')
        .upsert({
          id: categoryData.id,
          name: categoryData.name,
          icon: categoryData.icon || '🎮',
          description: categoryData.description || '',
          is_active: categoryData.isActive ?? true,
          display_order: categoryData.displayOrder || 1,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, message: 'Game category saved successfully', data });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
