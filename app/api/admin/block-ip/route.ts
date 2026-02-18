
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { ip_address, reason } = await req.json();
    const supabase = createClient();

    // 1. Verify Admin
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // 2. Insert into blocked_ips
    const { error } = await supabase
      .from('blocked_ips')
      .insert({
        ip_address,
        reason: reason || 'Manual block by admin',
        blocked_by: user?.id
      });

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
