import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch pending withdrawals
export async function GET() {
  try {
    const { data: withdrawals, error } = await supabaseAdmin
      .from('withdrawals')
      .select('*, users(id, phone, full_name, username)')
      .eq('status', 'PENDING_APPROVAL')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase withdrawals fetch error:', error.message);
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: withdrawals || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Approve Payout or Reject & Refund
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { withdrawalId, userId, amount, action, reason, utr } = body;

    if (!withdrawalId || !userId || !action) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      // 1. Mark withdrawal as COMPLETED
      const { error: wthErr } = await supabaseAdmin
        .from('withdrawals')
        .update({ 
          status: 'COMPLETED', 
          completed_at: new Date().toISOString(),
          payout_utr: utr || null 
        })
        .eq('id', withdrawalId);

      if (wthErr) throw wthErr;

      // 2. Clear locked_balance in user_wallets
      const { data: wallet } = await supabaseAdmin
        .from('user_wallets')
        .select('locked_balance')
        .eq('user_id', userId)
        .single();

      const currentLocked = wallet?.locked_balance || 0;
      const newLocked = Math.max(0, currentLocked - Number(amount));

      await supabaseAdmin
        .from('user_wallets')
        .update({ locked_balance: newLocked })
        .eq('user_id', userId);

      // 3. Log transaction
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: userId,
        type: 'WITHDRAWAL_PAYOUT',
        amount: Number(amount),
        bucket: 'winnings_balance',
        reference_id: withdrawalId,
        description: `Withdrawal payout released (UTR: ${utr || 'IMPS'})`,
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, message: 'Withdrawal payout released successfully' });
    } else if (action === 'REJECT') {
      // 1. Update status to REJECTED
      const { error: rejectErr } = await supabaseAdmin
        .from('withdrawals')
        .update({ 
          status: 'REJECTED', 
          rejection_reason: reason || 'Invalid payment details / Security check failed',
          rejected_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (rejectErr) throw rejectErr;

      // 2. Unlock & Refund back to winnings_balance
      const { data: wallet } = await supabaseAdmin
        .from('user_wallets')
        .select('winnings_balance, locked_balance')
        .eq('user_id', userId)
        .single();

      const currentWinnings = wallet?.winnings_balance || 0;
      const currentLocked = wallet?.locked_balance || 0;

      const newWinnings = currentWinnings + Number(amount);
      const newLocked = Math.max(0, currentLocked - Number(amount));

      await supabaseAdmin
        .from('user_wallets')
        .update({ 
          winnings_balance: newWinnings,
          locked_balance: newLocked
        })
        .eq('user_id', userId);

      // 3. Log refund transaction
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: userId,
        type: 'WITHDRAWAL_REFUND',
        amount: Number(amount),
        bucket: 'winnings_balance',
        reference_id: withdrawalId,
        description: `Withdrawal rejected & refunded. Reason: ${reason || 'N/A'}`,
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, message: 'Withdrawal rejected & wallet refunded successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
