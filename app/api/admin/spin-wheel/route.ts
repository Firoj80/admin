import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch spin wheel configuration
export async function GET() {
  try {
    const { data: slices, error } = await supabaseAdmin
      .from('spin_wheel_config')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase spin_wheel_config fetch error:', error.message);
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: slices || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Save spin wheel configuration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, slices } = body;

    if (action === 'SAVE_CONFIG') {
      if (!Array.isArray(slices) || slices.length === 0) {
        return NextResponse.json({ success: false, error: 'No slices provided' }, { status: 400 });
      }

      // Delete existing config and replace with new
      await supabaseAdmin.from('spin_wheel_config').delete().neq('id', 0);

      const insertData = slices.map((s: any, idx: number) => ({
        id: s.id || idx + 1,
        label: s.label,
        bonus_amount: Number(s.bonusAmount),
        probability_percent: Number(s.probabilityPercent),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabaseAdmin
        .from('spin_wheel_config')
        .insert(insertData);

      if (error) throw error;

      return NextResponse.json({ success: true, message: 'Spin wheel configuration saved successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
