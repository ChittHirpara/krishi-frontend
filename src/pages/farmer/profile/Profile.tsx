import React, { useState } from 'react';
import { User, Bell, Shield, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardBody } from '../../../components/ui/Card';
import { cn } from '../../../utils';

export function Profile() {
  const { user, logout } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="mt-4 md:mt-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-[var(--color-primary)]" />
          Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-6">
        {/* Profile Card */}
        <Card>
          <CardBody className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{user?.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </CardBody>
        </Card>

        {/* Notifications Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Notifications</h3>
          <Card>
            <CardBody className="p-0 divide-y divide-[var(--color-border)]">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Push Notifications</h4>
                    <p className="text-sm text-gray-500">Enable outbreak alerts on this device</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPushEnabled(!pushEnabled)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
                    pushEnabled ? "bg-[var(--color-primary)]" : "bg-gray-200 dark:bg-gray-700"
                  )}
                  role="switch"
                  aria-checked={pushEnabled}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      pushEnabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Account Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Account</h3>
          <Card>
            <CardBody className="p-0 divide-y divide-[var(--color-border)]">
              <button className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Privacy & Security</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </CardBody>
          </Card>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-4 text-red-600 dark:text-red-500 font-bold bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
