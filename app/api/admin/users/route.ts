import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch / Search users from live Supabase DB
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

    const { data: users, error } = await supabaseQuery.order('created_at', { ascending: false }).limit(100);

    if (error) {
      console.warn('Supabase users fetch error:', error.message);
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: users || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Create User, Toggle Freeze, or Adjust Wallet Balance
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, targetBucket, amount, adjustAction, reason, userData } = body;

    if (action === 'CREATE_USER') {
      if (!userData || !userData.phone || !userData.fullName) {
        return NextResponse.json({ success: false, error: 'Missing required user details (Full Name & Phone Number)' }, { status: 400 });
      }

      // 1. Insert into users table
      const username = userData.username?.trim() || `gamer_${Date.now()}`;
      const { data: newUser, error: userErr } = await supabaseAdmin
        .from('users')
        .insert([{
          full_name: userData.fullName,
          username: username,
          phone: userData.phone,
          account_status: userData.status || 'ACTIVE',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (userErr) throw userErr;

      // 2. Initialize and credit initial wallet balances if provided
      const depositBal = Number(userData.initialDeposit || 0);
      const bonusBal = Number(userData.initialBonus || 0);

      if (depositBal > 0 || bonusBal > 0) {
        await supabaseAdmin
          .from('user_wallets')
          .upsert({
            user_id: newUser.id,
            deposit_balance: depositBal,
            bonus_balance: bonusBal,
            winnings_balance: 0,
            locked_balance: 0,
            updated_at: new Date().toISOString()
          });

        // Audit transaction
        if (depositBal > 0) {
          await supabaseAdmin.from('wallet_transactions').insert({
            user_id: newUser.id,
            type: 'INITIAL_ADMIN_DEPOSIT',
            amount: depositBal,
            bucket: 'deposit_balance',
            description: 'Initial deposit credit on admin account creation',
            created_at: new Date().toISOString()
          });
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: `User ${userData.fullName} created successfully`, 
        data: newUser 
      });
    } else if (action === 'TOGGLE_FREEZE') {
      if (!userId) return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });

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
      if (!userId || !targetBucket || !amount || !adjustAction || !reason) {
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
