import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch live 1v1 match disputes
export async function GET() {
  try {
    const { data: disputes, error } = await supabaseAdmin
      .from('matches')
      .select('*, player_a:users!player_a_id(*), player_b:users!player_b_id(*)')
      .eq('status', 'DISPUTED')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase disputes fetch error:', error.message);
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: disputes || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Resolve Dispute (Declare Winner or Cancel & Refund)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, action, winnerUserId } = body;

    if (!matchId || !action) {
      return NextResponse.json({ success: false, error: 'Missing matchId or action' }, { status: 400 });
    }

    // Fetch match details
    const { data: match, error: matchFetchErr } = await supabaseAdmin
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchFetchErr || !match) {
      return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 });
    }

    if (action === 'DECLARE_WINNER') {
      if (!winnerUserId) {
        return NextResponse.json({ success: false, error: 'Missing winnerUserId' }, { status: 400 });
      }

      const netPrizePool = match.prize_pool || (match.entry_fee * 2 * 0.9);

      // 1. Mark match as SETTLED
      await supabaseAdmin
        .from('matches')
        .update({ 
          status: 'SETTLED', 
          winner_id: winnerUserId,
          settled_at: new Date().toISOString(),
          settled_by: 'ADMIN'
        })
        .eq('id', matchId);

      // 2. Fetch winner's wallet
      const { data: winnerWallet } = await supabaseAdmin
        .from('user_wallets')
        .select('winnings_balance')
        .eq('user_id', winnerUserId)
        .single();

      const currentWinnings = winnerWallet?.winnings_balance || 0;
      const newWinnings = currentWinnings + Number(netPrizePool);

      // 3. Credit winner winnings_balance
      await supabaseAdmin
        .from('user_wallets')
        .upsert({ user_id: winnerUserId, winnings_balance: newWinnings });

      // 4. Log transaction
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: winnerUserId,
        type: 'MATCH_WIN_CREDIT',
        amount: Number(netPrizePool),
        bucket: 'winnings_balance',
        reference_id: matchId,
        description: `Admin dispute resolution win credit for match #${matchId}`,
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, message: `Match #${matchId} settled. Winner credited ₹${netPrizePool}.` });
    } else if (action === 'CANCEL_AND_REFUND') {
      // 1. Mark match as CANCELLED
      await supabaseAdmin
        .from('matches')
        .update({ 
          status: 'CANCELLED', 
          settled_at: new Date().toISOString(),
          settled_by: 'ADMIN'
        })
        .eq('id', matchId);

      // Helper for proportional refund
      const refundPlayer = async (userId: string, mainCashPaid: number, bonusCashPaid: number) => {
        if (!userId) return;

        const { data: wallet } = await supabaseAdmin
          .from('user_wallets')
          .select('deposit_balance, bonus_balance')
          .eq('user_id', userId)
          .single();

        const currentDeposit = wallet?.deposit_balance || 0;
        const currentBonus = wallet?.bonus_balance || 0;

        await supabaseAdmin
          .from('user_wallets')
          .upsert({
            user_id: userId,
            deposit_balance: currentDeposit + Number(mainCashPaid || 0),
            bonus_balance: currentBonus + Number(bonusCashPaid || 0)
          });

        await supabaseAdmin.from('wallet_transactions').insert({
          user_id: userId,
          type: 'MATCH_CANCEL_REFUND',
          amount: Number(mainCashPaid + bonusCashPaid),
          bucket: 'deposit_balance',
          reference_id: matchId,
          description: `Proportional match refund (Cash: ₹${mainCashPaid}, Bonus: ₹${bonusCashPaid}) for match #${matchId}`,
          created_at: new Date().toISOString(),
        });
      };

      // 2. Refund Player A
      if (match.player_a_id) {
        await refundPlayer(match.player_a_id, match.player_a_cash_paid || match.entry_fee, match.player_a_bonus_paid || 0);
      }

      // 3. Refund Player B
      if (match.player_b_id) {
        await refundPlayer(match.player_b_id, match.player_b_cash_paid || match.entry_fee, match.player_b_bonus_paid || 0);
      }

      return NextResponse.json({ success: true, message: `Match #${matchId} cancelled and entry fees refunded proportionally.` });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
