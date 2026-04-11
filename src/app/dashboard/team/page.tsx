'use client';

import { Plus, MoreHorizontal, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const teamMembers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'manager', status: 'active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'editor', status: 'active' },
  { id: '4', name: 'Emily Brown', email: 'emily@example.com', role: 'editor', status: 'pending' },
];

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  manager: 'bg-blue-100 text-blue-800',
  editor: 'bg-gray-100 text-gray-800',
};

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-gray-500">Manage team members and roles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
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
                    {member.name.split(' ').map(n => n[0]).join('')}
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
                      <DropdownMenuItem>Edit Role</DropdownMenuItem>
                      <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
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
    </div>
  );
}
