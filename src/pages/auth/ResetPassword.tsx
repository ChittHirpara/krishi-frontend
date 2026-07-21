import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Leaf, CheckCircle2 } from 'lucide-react';

export function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="bg-[var(--color-primary)]/10 dark:bg-green-900/30 p-3 rounded-2xl text-[var(--color-primary)] dark:text-green-400 mb-4">
          <Leaf className="w-8 h-8" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Create new password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card>
          <CardBody>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-lg font-bold">Password Reset</h3>
                <p className="text-sm text-neutral-500">
                  Your password has been successfully reset.
                </p>
                <div className="pt-4">
                  <Link to="/login">
                    <Button variant="primary" className="w-full">Log in now</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Input label="New Password" type="password" required />
                <Input label="Confirm New Password" type="password" required />
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Reset Password
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
