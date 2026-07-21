import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Leaf } from 'lucide-react';
import { UserRole } from '../../types';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (role: UserRole) => {
    setLoadingRole(role);
    await login(role);
    setLoadingRole(null);
    navigate('/');
  };

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Fake login
    await login('farmer');
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="bg-[var(--color-primary)]/10 dark:bg-green-900/30 p-3 rounded-2xl text-[var(--color-primary)] dark:text-green-400 mb-4">
          <Leaf className="w-8 h-8" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card>
          <CardBody>
            <form className="space-y-6" onSubmit={handleRealLogin}>
              <Input label="Email address" type="email" placeholder="you@example.com" required />
              <div>
                <Input label="Password" type="password" required />
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-semibold text-[var(--color-primary)] hover:opacity-80">
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Log in
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-neutral-500">Don't have an account? </span>
              <Link to="/register" className="font-semibold text-[var(--color-primary)] hover:opacity-80">
                Register here
              </Link>
            </div>
          </CardBody>
        </Card>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)] dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[var(--color-bg-light)] dark:bg-neutral-950 px-4 font-medium text-neutral-500">
                Quick Demo Access
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              variant="secondary"
              isLoading={loadingRole === 'farmer'}
              onClick={() => handleDemoLogin('farmer')}
            >
              Continue as Farmer
            </Button>
            <Button
              variant="secondary"
              isLoading={loadingRole === 'officer'}
              onClick={() => handleDemoLogin('officer')}
            >
              Continue as Officer
            </Button>
            <Button
              variant="secondary"
              isLoading={loadingRole === 'agronomist'}
              onClick={() => handleDemoLogin('agronomist')}
            >
              Continue as Agronomist
            </Button>
            <Button
              variant="secondary"
              isLoading={loadingRole === 'admin'}
              onClick={() => handleDemoLogin('admin')}
            >
              Continue as Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
