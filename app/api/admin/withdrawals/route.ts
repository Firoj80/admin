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
      // 1. Fetch full wallet to properly deduct balance
      const { data: wallet } = await supabaseAdmin
        .from('user_wallets')
        .select('deposit_balance, winnings_balance, locked_balance')
        .eq('user_id', userId)
        .single();

      const amt = Number(amount);
      const currentDeposit = wallet?.deposit_balance || 0;
      const currentWinnings = wallet?.winnings_balance || 0;
      const currentLocked = wallet?.locked_balance || 0;

      // Deduct from winnings_balance first, then deposit_balance for the remainder
      let deductFromWinnings = Math.min(currentWinnings, amt);
      let deductFromDeposit = amt - deductFromWinnings;

      const newWinnings = Math.max(0, currentWinnings - deductFromWinnings);
      const newDeposit = Math.max(0, currentDeposit - deductFromDeposit);
      const newLocked = Math.max(0, currentLocked - amt);

      await supabaseAdmin
        .from('user_wallets')
        .update({ 
          deposit_balance: newDeposit,
          winnings_balance: newWinnings,
          locked_balance: newLocked,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      // 2. Log transaction with negative amount so app shows it as debit (money out)
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: userId,
        type: 'WITHDRAWAL_PAYOUT',
        amount: -amt,
        bucket: 'winnings_balance',
        reference_id: withdrawalId,
        description: `Withdrawal payout released (UTR: ${utr || 'IMPS'})`,
        created_at: new Date().toISOString(),
      });

      // 3. Mark withdrawal as COMPLETED LAST so Supabase Realtime notifies clients after balance is already deducted
      const { error: wthErr } = await supabaseAdmin
        .from('withdrawals')
        .update({ 
          status: 'COMPLETED', 
          completed_at: new Date().toISOString(),
          payout_utr: utr || null 
        })
        .eq('id', withdrawalId);

      if (wthErr) throw wthErr;

      return NextResponse.json({ success: true, message: 'Withdrawal payout released successfully' });

    } else if (action === 'REJECT') {
      // 1. Unlock & Refund back to winnings_balance first
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
          locked_balance: newLocked,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      // 2. Log refund transaction
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: userId,
        type: 'WITHDRAWAL_REFUND',
        amount: Number(amount),
        bucket: 'winnings_balance',
        reference_id: withdrawalId,
        description: `Withdrawal rejected & refunded: ${reason || 'Security check failed'}`,
        created_at: new Date().toISOString(),
      });

      // 3. Update status to REJECTED LAST so Supabase Realtime notifies clients after refund is credited
      const { error: rejectErr } = await supabaseAdmin
        .from('withdrawals')
        .update({ 
          status: 'REJECTED', 
          rejection_reason: reason || 'Invalid payment details / Security check failed',
          rejected_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (rejectErr) throw rejectErr;

      return NextResponse.json({ success: true, message: 'Withdrawal rejected & refunded successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
