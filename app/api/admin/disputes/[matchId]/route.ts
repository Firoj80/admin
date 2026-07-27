import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request, { params }: { params: { matchId: string } }) {
  try {
    const { matchId } = params;

    const { data: match, error } = await supabaseAdmin
      .from('matches')
      .select('*, player_a:users!player_a_id(*), player_b:users!player_b_id(*)')
      .eq('id', matchId)
      .single();

    if (error || !match) {
      return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 });
    }

    let matchMoves = [];
    if (match.game_mode === 'LUDO_INTERNAL') {
      const { data: moves, error: movesError } = await supabaseAdmin
        .from('match_moves')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });
        
      if (!movesError && moves) {
        matchMoves = moves;
      }
    }

    return NextResponse.json({ success: true, data: { ...match, match_moves: matchMoves } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
