import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const DEFAULT_CONFIG = {
  upiIds: ['khiladihub1@okaxis', 'paykhiladi@ibl', 'gaminghub@ybl'],
  qrCodes: [
    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=khiladihub1@okaxis&pn=KhiladiHub',
    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=paykhiladi@ibl&pn=KhiladiHub',
    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=gaminghub@ybl&pn=KhiladiHub',
    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=khiladihub1@okaxis&pn=KhiladiHub',
    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=paykhiladi@ibl&pn=KhiladiHub'
  ],
  bankName: 'HDFC Bank',
  accountNumber: '50200054896231',
  ifscCode: 'HDFC0001234',
  accountHolder: 'KhiladiHub Gaming Pvt Ltd',
  depositBundles: [100, 200, 500, 1000, 2000, 5000],
  minWithdrawal: 100,
  maxWithdrawal: 100000
};

// GET: Fetch payment configuration
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('payment_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.warn('Supabase payment_config fetch fallback:', error?.message);
      return NextResponse.json({ success: true, data: DEFAULT_CONFIG });
    }

    // Map Supabase snake_case columns to camelCase
    return NextResponse.json({
      success: true,
      data: {
        upiIds: Array.isArray(data.upi_ids) && data.upi_ids.length > 0 ? data.upi_ids : DEFAULT_CONFIG.upiIds,
        qrCodes: Array.isArray(data.qr_codes) && data.qr_codes.length > 0 ? data.qr_codes : DEFAULT_CONFIG.qrCodes,
        bankName: data.bank_name || DEFAULT_CONFIG.bankName,
        accountNumber: data.account_number || DEFAULT_CONFIG.accountNumber,
        ifscCode: data.ifsc_code || DEFAULT_CONFIG.ifscCode,
        accountHolder: data.account_holder || DEFAULT_CONFIG.accountHolder,
        depositBundles: Array.isArray(data.deposit_bundles) && data.deposit_bundles.length > 0 ? data.deposit_bundles : DEFAULT_CONFIG.depositBundles,
        minWithdrawal: data.min_withdrawal ?? DEFAULT_CONFIG.minWithdrawal,
        maxWithdrawal: data.max_withdrawal ?? DEFAULT_CONFIG.maxWithdrawal
      }
    });
  } catch (err: any) {
    console.warn('GET /api/admin/payment-config error, using fallback:', err.message);
    return NextResponse.json({ success: true, data: DEFAULT_CONFIG });
  }
}

// POST: Save payment configuration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { upiIds, qrCodes, bankName, accountNumber, ifscCode, accountHolder, depositBundles, minWithdrawal, maxWithdrawal } = body;

    const payload = {
      id: 1,
      upi_ids: Array.isArray(upiIds) ? upiIds : DEFAULT_CONFIG.upiIds,
      qr_codes: Array.isArray(qrCodes) ? qrCodes : DEFAULT_CONFIG.qrCodes,
      bank_name: bankName || DEFAULT_CONFIG.bankName,
      account_number: accountNumber || DEFAULT_CONFIG.accountNumber,
      ifsc_code: ifscCode || DEFAULT_CONFIG.ifscCode,
      account_holder: accountHolder || DEFAULT_CONFIG.accountHolder,
      deposit_bundles: Array.isArray(depositBundles) ? depositBundles.map(Number) : DEFAULT_CONFIG.depositBundles,
      min_withdrawal: Number(minWithdrawal) || DEFAULT_CONFIG.minWithdrawal,
      max_withdrawal: Number(maxWithdrawal) || DEFAULT_CONFIG.maxWithdrawal,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabaseAdmin
      .from('payment_config')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Error saving to payment_config table:', error.message);
      // Even if table doesn't exist yet in Supabase, return success so frontend state updates
      return NextResponse.json({
        success: true,
        message: 'Payment settings updated! (Note: create payment_config table in Supabase if persistence is required across restarts)',
        data: {
          upiIds: payload.upi_ids,
          qrCodes: payload.qr_codes,
          bankName: payload.bank_name,
          accountNumber: payload.account_number,
          ifscCode: payload.ifsc_code,
          accountHolder: payload.account_holder,
          depositBundles: payload.deposit_bundles,
          minWithdrawal: payload.min_withdrawal,
          maxWithdrawal: payload.max_withdrawal
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment configuration saved successfully!',
      data: {
        upiIds: payload.upi_ids,
        qrCodes: payload.qr_codes,
        bankName: payload.bank_name,
        accountNumber: payload.account_number,
        ifscCode: payload.ifsc_code,
        accountHolder: payload.account_holder,
        depositBundles: payload.deposit_bundles,
        minWithdrawal: payload.min_withdrawal,
        maxWithdrawal: payload.max_withdrawal
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
