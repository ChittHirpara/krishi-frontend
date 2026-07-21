import React, { useState } from 'react';
import { Users as UsersIcon, Search, MoreVertical, Edit2, Ban, Trash2 } from 'lucide-react';
import { useSystem, User } from '../../../context/SystemContext';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../utils';

export function Users() {
  const { users, updateUserRole, toggleUserStatus, deleteUser } = useSystem();
  const [search, setSearch] = useState('');
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0 mt-4 md:mt-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-[var(--color-primary)]" />
            User Management
          </h1>
          <p className="text-sm font-medium text-gray-500">Manage access and roles across the platform.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-neutral-50 dark:bg-neutral-900/50">
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Name</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Role</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Region</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className={cn("hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors", u.status === 'suspended' && "opacity-60")}>
                  <td className="p-4">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select 
                      value={u.role}
                      onChange={e => updateUserRole(u.id, e.target.value as any)}
                      className="bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-sm font-medium capitalize"
                    >
                      <option value="farmer">Farmer</option>
                      <option value="officer">Officer</option>
                      <option value="agronomist">Agronomist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{u.region}</td>
                  <td className="p-4">
                    <Badge variant={u.status === 'active' ? 'green' : 'red'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => toggleUserStatus(u.id)}
                      className="p-1.5 text-gray-400 hover:text-amber-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition-colors"
                      title={u.status === 'active' ? 'Suspend' : 'Activate'}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this user?')) deleteUser(u.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between text-sm text-gray-500 bg-neutral-50 dark:bg-neutral-900/50">
          <span>Showing {filteredUsers.length} users</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-[var(--color-border)] rounded hover:bg-neutral-200 dark:hover:bg-neutral-800">Prev</button>
            <button className="px-3 py-1 border border-[var(--color-border)] rounded hover:bg-neutral-200 dark:hover:bg-neutral-800">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
