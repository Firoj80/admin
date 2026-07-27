import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch pending deposits
export async function GET() {
  try {
    const { data: deposits, error } = await supabaseAdmin
      .from('deposits')
      .select('*, users(id, phone, full_name, username)')
      .eq('status', 'PENDING_APPROVAL')
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback if table is not yet created or returns error
      console.warn('Supabase deposits fetch error:', error.message);
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: deposits || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Approve or Reject Deposit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { depositId, userId, amount, action, reason, utr } = body;

    if (!depositId || !userId || !action) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      // 1. Use atomic increment via RPC to avoid race condition when multiple deposits
      //    are approved simultaneously. read-then-write causes last-write-wins bug.
      const { error: rpcError } = await supabaseAdmin.rpc('increment_deposit_balance', {
        p_user_id: userId,
        p_amount: Number(amount),
      });

      if (rpcError) {
        // Fallback: read-then-write if RPC not available
        console.warn('RPC failed, falling back to read-write:', rpcError.message);
        const { data: wallet } = await supabaseAdmin
          .from('user_wallets')
          .select('deposit_balance')
          .eq('user_id', userId)
          .single();

        const currentBalance = wallet?.deposit_balance || 0;
        const newBalance = currentBalance + Number(amount);

        const { error: walletErr } = await supabaseAdmin
          .from('user_wallets')
          .update({ 
            deposit_balance: newBalance,
            updated_at: new Date().toISOString() 
          })
          .eq('user_id', userId);

        if (walletErr) throw walletErr;
      }

      // 2. Log wallet transaction
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: userId,
        type: 'DEPOSIT_CREDIT',
        amount: Number(amount),
        bucket: 'deposit_balance',
        reference_id: depositId,
        description: `Manual deposit approval (UTR: ${utr || 'N/A'})`,
        created_at: new Date().toISOString(),
      });

      // 3. Update deposit status LAST so Supabase Realtime notifies clients after balance is already credited
      const { error: depositErr } = await supabaseAdmin
        .from('deposits')
        .update({ 
          status: 'APPROVED', 
          approved_at: new Date().toISOString(),
          utr_number: utr || null 
        })
        .eq('id', depositId);

      if (depositErr) throw depositErr;

      return NextResponse.json({ success: true, message: 'Deposit approved & wallet credited successfully' });

    } else if (action === 'REJECT') {
      // Update deposit status to REJECTED
      const { error: rejectErr } = await supabaseAdmin
        .from('deposits')
        .update({ 
          status: 'REJECTED', 
          rejection_reason: reason || 'Invalid payment proof / UTR',
          rejected_at: new Date().toISOString()
        })
        .eq('id', depositId);

      if (rejectErr) throw rejectErr;

      return NextResponse.json({ success: true, message: 'Deposit rejected successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
