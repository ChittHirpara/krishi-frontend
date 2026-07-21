import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Leaf, CheckCircle2 } from 'lucide-react';

export function ForgotPassword() {
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
          Reset Password
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
                <h3 className="text-lg font-bold">Check your email</h3>
                <p className="text-sm text-neutral-500">
                  We have sent a password reset link to your email address.
                </p>
                <div className="pt-4">
                  <Link to="/login">
                    <Button variant="secondary" className="w-full">Return to login</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <Input label="Email address" type="email" placeholder="you@example.com" required />
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Send reset link
                </Button>
                <div className="mt-4 text-center text-sm">
                  <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:opacity-80">
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
