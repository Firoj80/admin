import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch notification history and audience segment counts
export async function GET() {
  try {
    // Fetch total registered users
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Fetch active today (logged in last 24h)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: activeToday } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login_at', yesterday);

    // Fetch notification history
    const { data: history, error } = await supabaseAdmin
      .from('push_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      success: true,
      data: {
        segments: {
          ALL_USERS: totalUsers || 0,
          ACTIVE_TODAY: activeToday || 0,
        },
        history: error ? [] : (history || [])
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Send push notification (log to DB)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, title, body: msgBody, segment } = body;

    if (action === 'SEND_BROADCAST') {
      if (!title || !msgBody) {
        return NextResponse.json({ success: false, error: 'Title and body are required' }, { status: 400 });
      }

      // Log the notification to push_notifications table
      const { data, error } = await supabaseAdmin
        .from('push_notifications')
        .insert([{
          title,
          body: msgBody,
          segment: segment || 'ALL_USERS',
          status: 'SENT',
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        message: `Push notification broadcast to ${segment || 'ALL_USERS'} segment`,
        data 
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
