import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Leaf } from 'lucide-react';

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsLoading(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="bg-[var(--color-primary)]/10 dark:bg-green-900/30 p-3 rounded-2xl text-[var(--color-primary)] dark:text-green-400 mb-4">
          <Leaf className="w-8 h-8" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Create an account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card>
          <CardBody>
            <form className="space-y-5" onSubmit={handleRegister}>
              <Input label="Full Name" placeholder="Your name" required />
              <Input label="Email address" type="email" placeholder="you@example.com" required />
              <Select
                label="Region / District"
                options={[
                  { label: 'Select District...', value: '' },
                  { label: 'Ahmedabad', value: 'ahmedabad' },
                  { label: 'Surat', value: 'surat' },
                  { label: 'Rajkot', value: 'rajkot' },
                  { label: 'Kutch', value: 'kutch' },
                  { label: 'Amreli', value: 'amreli' },
                ]}
                required
              />
              <div className="relative group">
                <Select
                  label="Role"
                  defaultValue="farmer"
                  options={[
                    { label: 'Farmer', value: 'farmer' },
                    { label: 'Extension Officer', value: 'officer' },
                    { label: 'Agronomist', value: 'agronomist' },
                    { label: 'Admin', value: 'admin' },
                  ]}
                  disabled
                />
                <div className="absolute hidden group-hover:block -top-8 right-0 bg-neutral-800 text-white text-[10px] py-1 px-2 rounded font-medium z-10 pointer-events-none">
                  Assigned by admin
                </div>
              </div>
              <Input label="Password" type="password" required />
              <Input label="Confirm Password" type="password" required />
              
              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Register
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-neutral-500">Already have an account? </span>
              <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:opacity-80">
                Sign in
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
