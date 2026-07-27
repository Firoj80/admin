import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  try {
    // 1. Fetch pending deposits count & total pending value
    const { count: pendingDepCount, data: pendingDeps } = await supabaseAdmin
      .from('deposits')
      .select('id, amount, created_at, users(full_name, phone)', { count: 'exact' })
      .eq('status', 'PENDING_APPROVAL')
      .order('created_at', { ascending: false })
      .limit(5);

    // 2. Fetch pending withdrawals count
    const { count: pendingWthCount } = await supabaseAdmin
      .from('withdrawals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING_APPROVAL');

    // 3. Fetch open disputes count
    const { count: disputesCount } = await supabaseAdmin
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'DISPUTED');

    // 4. Fetch active contest pools count
    const { count: activeContestsCount } = await supabaseAdmin
      .from('contest_pools')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // 5. Compute total completed deposit volume
    const { data: approvedDeposits } = await supabaseAdmin
      .from('deposits')
      .select('amount')
      .eq('status', 'APPROVED');

    const totalDepositVolume = approvedDeposits
      ? approvedDeposits.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
      : 0;

    // 5b. Compute total approved withdrawal volume
    const { data: approvedWithdrawals } = await supabaseAdmin
      .from('withdrawals')
      .select('amount')
      .in('status', ['APPROVED', 'COMPLETED', 'PAID']);

    const totalWithdrawalVolume = approvedWithdrawals
      ? approvedWithdrawals.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
      : 0;

    // 6. Compute total platform revenue from matches (SETTLED or COMPLETED)
    const { data: settledMatches } = await supabaseAdmin
      .from('matches')
      .select('entry_fee, prize_pool')
      .in('status', ['SETTLED', 'COMPLETED', 'FINISHED']);

    const platformRevenue = settledMatches
      ? settledMatches.reduce((acc, curr) => {
          const collected = Number(curr.entry_fee || 0) * 2;
          const distributed = Number(curr.prize_pool || 0);
          return acc + Math.max(0, collected - distributed);
        }, 0)
      : 0;

    // 7. Compute total bonuses distributed
    const { data: bonusTransactions } = await supabaseAdmin
      .from('wallet_transactions')
      .select('amount')
      .eq('bucket', 'bonus_balance');
      
    const totalBonusGiven = bonusTransactions
      ? bonusTransactions.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
      : 0;

    const totalProfit = platformRevenue - totalBonusGiven;

    // 8. Fetch total users & total matches counts
    const { count: totalUsersCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: totalMatchesCount } = await supabaseAdmin
      .from('matches')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      data: {
        totalDepositVolume,
        totalWithdrawalVolume,
        netCashflow: totalDepositVolume - totalWithdrawalVolume,
        platformRevenue,
        totalProfit,
        totalUsersCount: totalUsersCount || 0,
        totalMatchesCount: totalMatchesCount || 0,
        pendingDepositsCount: pendingDepCount || 0,
        pendingWithdrawalsCount: pendingWthCount || 0,
        openDisputesCount: disputesCount || 0,
        activeContestsCount: activeContestsCount || 0,
        actionRequiredItems: pendingDeps || []
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
