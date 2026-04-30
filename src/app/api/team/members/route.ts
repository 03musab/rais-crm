import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'teamId is required' },
        { status: 400 }
      );
    }

    // Get team info from teams table
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Get team members from team_members table
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId);

    if (membersError) {
      console.error('Error fetching members:', membersError);
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      team,
      members: members || [],
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, name, email, role = 'editor' } = body;

    if (!teamId || !name || !email) {
      return NextResponse.json(
        { error: 'teamId, name, and email are required' },
        { status: 400 }
      );
    }

    // Check if team exists
    const { data: team } = await supabase
      .from('teams')
      .select('id')
      .eq('id', teamId)
      .single();

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Add member to team_members table
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        name,
        email,
        role,
        joined_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error inviting member:', error);
      return NextResponse.json(
        { error: 'Failed to invite member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      member: data,
      message: 'Member invited successfully',
    });
  } catch (error) {
    console.error('Error inviting member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { teamId, memberId, role } = body;

    if (!teamId || !memberId || !role) {
      return NextResponse.json(
        { error: 'teamId, memberId, and role are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', memberId)
      .eq('team_id', teamId);

    if (error) {
      console.error('Error updating role:', error);
      return NextResponse.json(
        { error: 'Failed to update role' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const memberId = searchParams.get('memberId');

    if (!teamId || !memberId) {
      return NextResponse.json(
        { error: 'teamId and memberId are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId)
      .eq('team_id', teamId);

    if (error) {
      console.error('Error removing member:', error);
      return NextResponse.json(
        { error: 'Failed to remove member' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
