import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const index = formData.get('index') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure extension is clean
    const ext = file.name.split('.').pop() || 'png';
    const filename = `qr_code_${index || 0}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('qr_codes')
      .upload(filename, buffer, {
        contentType: file.type || 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('qr_codes')
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: 'QR Code uploaded to Supabase Storage successfully!'
    });
  } catch (err: any) {
    console.warn('POST /api/admin/upload-qr exception:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
