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
      // 1. Update deposit status
      const { error: depositErr } = await supabaseAdmin
        .from('deposits')
        .update({ 
          status: 'APPROVED', 
          approved_at: new Date().toISOString(),
          utr_number: utr || null 
        })
        .eq('id', depositId);

      if (depositErr) throw depositErr;

      // 2. Fetch current wallet balance
      const { data: wallet } = await supabaseAdmin
        .from('user_wallets')
        .select('deposit_balance')
        .eq('user_id', userId)
        .single();

      const currentBalance = wallet?.deposit_balance || 0;
      const newBalance = currentBalance + Number(amount);

      // 3. Update user_wallets deposit_balance
      const { error: walletErr } = await supabaseAdmin
        .from('user_wallets')
        .upsert({ user_id: userId, deposit_balance: newBalance });

      if (walletErr) throw walletErr;

      // 4. Log wallet transaction
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: userId,
        type: 'DEPOSIT_CREDIT',
        amount: Number(amount),
        bucket: 'deposit_balance',
        reference_id: depositId,
        description: `Manual deposit approval (UTR: ${utr || 'N/A'})`,
        created_at: new Date().toISOString(),
      });

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
