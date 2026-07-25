import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch / Search users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    let supabaseQuery = supabaseAdmin
      .from('users')
      .select('*, user_wallets(*)');

    if (query.trim()) {
      supabaseQuery = supabaseQuery.or(`full_name.ilike.%${query}%,username.ilike.%${query}%,phone.ilike.%${query}%`);
    }

    const { data: users, error } = await supabaseQuery.limit(50);

    if (error) {
      console.warn('Supabase users fetch error:', error.message);
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: users || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Toggle Freeze or Adjust Wallet Balance
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, action, targetBucket, amount, adjustAction, reason } = body;

    if (!userId || !action) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    if (action === 'TOGGLE_FREEZE') {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('account_status')
        .eq('id', userId)
        .single();

      const newStatus = user?.account_status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';

      await supabaseAdmin
        .from('users')
        .update({ account_status: newStatus })
        .eq('id', userId);

      return NextResponse.json({ success: true, message: `User status changed to ${newStatus}` });
    } else if (action === 'ADJUST_WALLET') {
      if (!targetBucket || !amount || !adjustAction || !reason) {
        return NextResponse.json({ success: false, error: 'Missing wallet adjustment details' }, { status: 400 });
      }

      // Fetch current wallet
      const { data: wallet } = await supabaseAdmin
        .from('user_wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      const currentBalance = wallet ? wallet[targetBucket] || 0 : 0;
      const delta = adjustAction === 'CREDIT' ? Number(amount) : -Number(amount);
      const newBalance = Math.max(0, currentBalance + delta);

      // Update balance
      await supabaseAdmin
        .from('user_wallets')
        .upsert({
          user_id: userId,
          [targetBucket]: newBalance
        });

      // Audit Log
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: userId,
        type: `ADMIN_${adjustAction}`,
        amount: Number(amount),
        bucket: targetBucket,
        description: `Admin manual adjustment: ${reason}`,
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, message: `Successfully ${adjustAction}ed ₹${amount} to ${targetBucket}` });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
