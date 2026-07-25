import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch contest pools
export async function GET() {
  try {
    const { data: pools, error } = await supabaseAdmin
      .from('contest_pools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase contest pools fetch error:', error.message);
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: pools || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Create or Update Contest Pool
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, poolData, poolId, isFeatured, isActive } = body;

    if (action === 'CREATE') {
      const { data: newPool, error } = await supabaseAdmin
        .from('contest_pools')
        .insert([{
          game_type: poolData.game,
          match_format: poolData.type,
          entry_fee: poolData.entryFee,
          prize_pool: poolData.prizePool,
          rake_percent: poolData.rakePercent,
          max_slots: poolData.maxSlots,
          is_featured: poolData.isFeatured,
          is_active: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, message: 'Contest pool created successfully', data: newPool });
    } else if (action === 'TOGGLE_FEATURED') {
      await supabaseAdmin
        .from('contest_pools')
        .update({ is_featured: isFeatured })
        .eq('id', poolId);

      return NextResponse.json({ success: true, message: 'Featured status updated' });
    } else if (action === 'TOGGLE_ACTIVE') {
      await supabaseAdmin
        .from('contest_pools')
        .update({ is_active: isActive })
        .eq('id', poolId);

      return NextResponse.json({ success: true, message: 'Active status updated' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
