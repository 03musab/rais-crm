'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/modal';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  manager: 'bg-blue-100 text-blue-800',
  editor: 'bg-gray-100 text-gray-800',
};

export default function TeamPage() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'editor' });

  const teamId = user?.uid ? `team_${user.uid}` : null;

  useEffect(() => {
    if (teamId) {
      loadTeamMembers();
    }
  }, [teamId]);

  const loadTeamMembers = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/team/members?teamId=${teamId}`);
      const data = await res.json();
      if (data.members) {
        setTeamMembers(data.members.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
          status: 'active',
        })));
      }
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) return;

    try {
      const res = await fetch('/api/team/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, ...inviteData }),
      });

      if (res.ok) {
        setShowInviteModal(false);
        setInviteData({ name: '', email: '', role: 'editor' });
        loadTeamMembers();
      }
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!teamId) return;

    try {
      await fetch('/api/team/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, memberId, role: newRole }),
      });
      loadTeamMembers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    if (!teamId) return;

    try {
      await fetch(`/api/team/members?teamId=${teamId}&memberId=${memberId}`, {
        method: 'DELETE',
      });
      loadTeamMembers();
    } catch (error) {
      console.error('Error removing member:', error);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-gray-500">Manage team members and roles</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-500" />
            <CardTitle>Team Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600">
                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={roleColors[member.role]}>
                    {member.role}
                  </Badge>
                  <Badge variant={member.status === 'active' ? 'success' : 'secondary'}>
                    {member.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'manager')}>
                        Make Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'editor')}>
                        Make Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleRemove(member.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Admin</p>
                  <p className="text-sm text-gray-500">Full access to all features</p>
                </div>
                <Badge className={roleColors.admin}>Admin</Badge>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>Can manage: Team, Products, Sections, Categories, Settings</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Manager</p>
                  <p className="text-sm text-gray-500">Manage products and sections</p>
                </div>
                <Badge className={roleColors.manager}>Manager</Badge>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>Can manage: Products, Sections, Categories, Inventory</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Editor</p>
                  <p className="text-sm text-gray-500">Basic product management</p>
                </div>
                <Badge className={roleColors.editor}>Editor</Badge>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>Can manage: Products (limited), View Analytics</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteData({ name: '', email: '', role: 'editor' });
        }}
        title="Invite Team Member"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={inviteData.name}
              onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={inviteData.email}
              onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={inviteData.role}
              onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            >
              <option value="editor">Editor</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowInviteModal(false);
                setInviteData({ name: '', email: '', role: 'editor' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Invite</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
