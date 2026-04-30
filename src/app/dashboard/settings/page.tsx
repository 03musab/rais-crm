'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';

interface TeamSettings {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [teamSettings, setTeamSettings] = useState<TeamSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const teamId = user?.uid ? `team_${user.uid}` : null;

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.displayName || '',
        email: user.email || '',
      });
      loadTeamSettings();
    }
  }, [user]);

  const loadTeamSettings = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/team/settings?teamId=${teamId}`);
      const data = await res.json();
      if (data.team) {
        setTeamSettings(data.team);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !teamSettings) return;

    setSaving(true);
    setSuccess('');
    try {
      const res = await fetch('/api/team/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          name: teamSettings.name,
        }),
      });

      if (res.ok) {
        setSuccess('Team name updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error saving team:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account and team settings</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Profile information is managed through Firebase Authentication
          </p>
        </CardContent>
      </Card>

      {/* Team Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-500" />
            <div>
              <CardTitle>Team Settings</CardTitle>
              <CardDescription>Manage your team information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveTeam} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={teamSettings?.name || ''}
                onChange={(e) => setTeamSettings(teamSettings ? {
                  ...teamSettings,
                  name: e.target.value,
                } : null)}
                placeholder="Enter team name"
                required
              />
            </div>

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                {success}
              </div>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-500" />
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Password</p>
            <p className="text-sm text-gray-500 mt-1">
              Change your password through Firebase Authentication
            </p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => {
                import('@/lib/firebase').then(({ auth }) => {
                  if (auth) {
                    import('firebase/auth').then(({ sendPasswordResetEmail }) => {
                      if (user?.email) {
                        sendPasswordResetEmail(auth, user.email).then(() => {
                          alert('Password reset email sent!');
                        });
                      }
                    });
                  }
                });
              }}
            >
              Send Password Reset Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
