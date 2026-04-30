import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (if not already initialized)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

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

    // Get team info
    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Get team members
    const membersSnapshot = await db.collection('teams').doc(teamId).collection('members').get();
    const members = await Promise.all(
      membersSnapshot.docs.map(async (doc) => {
        const memberData = doc.data();
        let user = null;
        
        // Try to get user info from users collection
        try {
          const userDoc = await db.collection('users').doc(memberData.userId).get();
          if (userDoc.exists) {
            user = userDoc.data();
          }
        } catch (e) {
          // User info not found
        }

        return {
          id: doc.id,
          team_id: teamId,
          user_id: memberData.userId,
          role: memberData.role || 'editor',
          name: user?.name || memberData.name || 'Unknown',
          email: user?.email || memberData.email || 'No email',
          created_at: memberData.joinedAt || new Date().toISOString(),
        };
      })
    );

    return NextResponse.json({
      team: { id: teamId, ...teamDoc.data() },
      members,
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
    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Create a new user in Firebase Auth (would need Firebase Admin SDK with auth)
    // For now, just add to members collection
    const memberRef = await db.collection('teams').doc(teamId).collection('members').add({
      userId: `invited_${Date.now()}`,
      name,
      email,
      role,
      joinedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id: memberRef.id,
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

    await db.collection('teams').doc(teamId).collection('members').doc(memberId).update({
      role,
    });

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

    await db.collection('teams').doc(teamId).collection('members').doc(memberId).delete();

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
